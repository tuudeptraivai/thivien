import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  RequestMethod,
} from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { PATH_METADATA, METHOD_METADATA } from '@nestjs/common/constants';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission, SystemModule } from '../../entities/permission.entity';
import { Role } from '../../entities/role.entity';
import { HTTP_METHODS } from './dto/create-permission.dto';

interface DiscoveredRoute {
  method: string;
  apiPath: string;
}

/** Ánh xạ base path của controller → nhãn module + nhóm hệ thống. */
const MODULE_MAP: Record<string, { module: string; system: SystemModule }> = {
  users: { module: 'Quản lý người dùng', system: SystemModule.BUSINESS },
  poems: { module: 'Quản lý thơ', system: SystemModule.BUSINESS },
  authors: { module: 'Quản lý tác giả', system: SystemModule.BUSINESS },
  translations: { module: 'Quản lý bản dịch', system: SystemModule.BUSINESS },
  comments: { module: 'Quản lý bình luận', system: SystemModule.BUSINESS },
  forum: { module: 'Diễn đàn', system: SystemModule.BUSINESS },
  annotations: {
    module: 'Chú giải / Điển tích',
    system: SystemModule.BUSINESS,
  },
  bookmarks: { module: 'Đánh dấu', system: SystemModule.BUSINESS },
  countries: { module: 'Danh mục', system: SystemModule.BUSINESS },
  eras: { module: 'Danh mục', system: SystemModule.BUSINESS },
  'poem-categories': { module: 'Danh mục', system: SystemModule.BUSINESS },
  statistics: { module: 'Thống kê', system: SystemModule.BUSINESS },
  dictionary: { module: 'Từ điển', system: SystemModule.BUSINESS },
  auth: { module: 'Xác thực', system: SystemModule.OTHER },
  'rbac/permissions': {
    module: 'Quản lý quyền API',
    system: SystemModule.SYSTEM_MANAGEMENT,
  },
  'rbac/roles': {
    module: 'Quản lý vai trò',
    system: SystemModule.SYSTEM_MANAGEMENT,
  },
};

const VERB_LABEL: Record<string, string> = {
  GET: 'Xem',
  POST: 'Tạo',
  PUT: 'Cập nhật',
  PATCH: 'Cập nhật',
  DELETE: 'Xóa',
};

@Injectable()
export class RbacSyncService implements OnApplicationBootstrap {
  private readonly logger = new Logger('RbacSync');

  constructor(
    private readonly discovery: DiscoveryService,
    private readonly scanner: MetadataScanner,
    private readonly reflector: Reflector,
    @InjectRepository(Permission)
    private readonly permRepo: Repository<Permission>,
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
  ) {}

  async onApplicationBootstrap() {
    if (process.env.RBAC_AUTO_SYNC === 'false') {
      this.logger.log('Bỏ qua đồng bộ quyền (RBAC_AUTO_SYNC=false)');
      return;
    }
    try {
      await this.sync();
    } catch (err) {
      // Không chặn quá trình khởi động nếu đồng bộ lỗi
      this.logger.error('Đồng bộ quyền thất bại', (err as Error)?.stack);
    }
  }

  private async sync() {
    const routes = this.collectRoutes();

    const existing = await this.permRepo.find({
      select: { id: true, method: true, apiPath: true },
    });
    const existingKeys = new Set(
      existing.map((p) => `${p.method} ${p.apiPath}`),
    );

    const toCreate: Permission[] = [];
    for (const route of routes) {
      const key = `${route.method} ${route.apiPath}`;
      if (existingKeys.has(key)) continue;
      existingKeys.add(key); // tránh trùng trong cùng lượt quét
      const { module, system } = this.resolveModule(route.apiPath);
      toCreate.push(
        this.permRepo.create({
          name: `${VERB_LABEL[route.method] ?? route.method} ${module} (${route.method} ${route.apiPath})`,
          apiPath: route.apiPath,
          method: route.method,
          module,
          systemModule: system,
        }),
      );
    }

    if (toCreate.length > 0) {
      await this.permRepo.save(toCreate);
    }

    await this.grantAllToAdmin();

    this.logger.log(
      `Đồng bộ quyền: ${routes.length} route, thêm mới ${toCreate.length} quyền.`,
    );
  }

  /** Quét toàn bộ controller → route (method + path đầy đủ, không gồm global prefix). */
  private collectRoutes(): DiscoveredRoute[] {
    const seen = new Set<string>();
    const routes: DiscoveredRoute[] = [];

    for (const wrapper of this.discovery.getControllers()) {
      const { instance, metatype } = wrapper;
      if (!instance || !metatype) continue;

      const controllerPath = this.reflector.get<string | string[]>(
        PATH_METADATA,
        metatype,
      );
      const basePath = Array.isArray(controllerPath)
        ? controllerPath[0]
        : controllerPath;
      if (basePath === undefined) continue;

      const prototype = Object.getPrototypeOf(instance);
      const methodNames = this.scanner.getAllMethodNames(prototype);

      for (const name of methodNames) {
        const handler = prototype[name];
        if (typeof handler !== 'function') continue;

        const routePath = this.reflector.get<string | string[]>(
          PATH_METADATA,
          handler,
        );
        const methodIdx = this.reflector.get<number>(METHOD_METADATA, handler);
        if (routePath === undefined || methodIdx === undefined) continue;

        const httpMethod = RequestMethod[methodIdx];
        if (!HTTP_METHODS.includes(httpMethod as any)) continue;

        const subPath = Array.isArray(routePath) ? routePath[0] : routePath;
        const apiPath = this.joinPaths(basePath, subPath);
        const key = `${httpMethod} ${apiPath}`;
        if (seen.has(key)) continue;
        seen.add(key);
        routes.push({ method: httpMethod, apiPath });
      }
    }

    return routes;
  }

  private joinPaths(base: string, sub: string): string {
    const raw = [base, sub]
      .map((s) => String(s ?? '').trim())
      .filter(Boolean)
      .join('/');
    const normalized = ('/' + raw)
      .replace(/\/{2,}/g, '/')
      .replace(/\/+$/, '');
    return normalized || '/';
  }

  private resolveModule(apiPath: string): {
    module: string;
    system: SystemModule;
  } {
    const segs = apiPath.split('/').filter(Boolean);
    const two = segs.slice(0, 2).join('/');
    const base = segs[0] ?? '';
    if (MODULE_MAP[two]) return MODULE_MAP[two];
    if (MODULE_MAP[base]) return MODULE_MAP[base];
    const label = base ? base.charAt(0).toUpperCase() + base.slice(1) : 'Khác';
    return { module: label, system: SystemModule.BUSINESS };
  }

  /** Đảm bảo vai trò admin luôn có toàn bộ quyền. */
  private async grantAllToAdmin() {
    const admin = await this.roleRepo.findOne({
      where: { name: 'admin' },
      relations: ['permissions'],
    });
    if (!admin) return;

    const all = await this.permRepo.find({ select: { id: true } });
    if (admin.permissions.length === all.length) return; // đã đủ
    admin.permissions = all.map((p) => ({ id: p.id }) as Permission);
    await this.roleRepo.save(admin);
  }
}
