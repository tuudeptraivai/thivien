import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Hệ thống phân quyền (RBAC): bảng `permissions`, `roles` và bảng nối
 * `role_permissions`. Kèm seed dữ liệu mẫu (quyền theo các endpoint hiện có +
 * hai vai trò admin/user) để trang quản trị có dữ liệu sẵn.
 */
export class AddRbac1780400000000 implements MigrationInterface {
  name = 'AddRbac1780400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ─── permissions ───────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`permissions\` (
        \`id\`            INT          NOT NULL AUTO_INCREMENT,
        \`name\`          VARCHAR(150) NOT NULL,
        \`api_path\`      VARCHAR(191) NOT NULL,
        \`method\`        VARCHAR(10)  NOT NULL DEFAULT 'GET',
        \`module\`        VARCHAR(100) NOT NULL,
        \`system_module\` VARCHAR(30)  NOT NULL DEFAULT 'BUSINESS',
        \`created_at\`    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\`    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE INDEX \`UQ_permissions_method_path\` (\`method\`, \`api_path\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // ─── roles ─────────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`roles\` (
        \`id\`          INT          NOT NULL AUTO_INCREMENT,
        \`name\`        VARCHAR(50)  NOT NULL,
        \`description\` VARCHAR(255) NULL,
        \`created_by\`  VARCHAR(100) NULL,
        \`updated_by\`  VARCHAR(100) NULL,
        \`created_at\`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE INDEX \`UQ_roles_name\` (\`name\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // ─── role_permissions (join) ───────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`role_permissions\` (
        \`role_id\`       INT NOT NULL,
        \`permission_id\` INT NOT NULL,
        INDEX \`IDX_role_permissions_role\` (\`role_id\`),
        INDEX \`IDX_role_permissions_permission\` (\`permission_id\`),
        PRIMARY KEY (\`role_id\`, \`permission_id\`),
        CONSTRAINT \`FK_role_permissions_role\` FOREIGN KEY (\`role_id\`)
          REFERENCES \`roles\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT \`FK_role_permissions_permission\` FOREIGN KEY (\`permission_id\`)
          REFERENCES \`permissions\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // ─── seed permissions ──────────────────────────────────────────────────
    const perms: [string, string, string, string, string][] = [
      // Quản lý người dùng
      ['Xem danh sách người dùng', '/users', 'GET', 'Quản lý người dùng', 'BUSINESS'],
      ['Xem chi tiết người dùng', '/users/:id', 'GET', 'Quản lý người dùng', 'BUSINESS'],
      ['Tạo người dùng', '/users', 'POST', 'Quản lý người dùng', 'BUSINESS'],
      ['Cập nhật người dùng', '/users/:id', 'PUT', 'Quản lý người dùng', 'BUSINESS'],
      ['Xóa người dùng', '/users/:id', 'DELETE', 'Quản lý người dùng', 'BUSINESS'],
      // Quản lý thơ
      ['Xem danh sách thơ', '/poems', 'GET', 'Quản lý thơ', 'BUSINESS'],
      ['Xem chi tiết thơ', '/poems/:id', 'GET', 'Quản lý thơ', 'BUSINESS'],
      ['Tạo bài thơ', '/poems', 'POST', 'Quản lý thơ', 'BUSINESS'],
      ['Cập nhật bài thơ', '/poems/:id', 'PUT', 'Quản lý thơ', 'BUSINESS'],
      ['Xóa bài thơ', '/poems/:id', 'DELETE', 'Quản lý thơ', 'BUSINESS'],
      // Quản lý tác giả
      ['Xem danh sách tác giả', '/authors', 'GET', 'Quản lý tác giả', 'BUSINESS'],
      ['Tạo tác giả', '/authors', 'POST', 'Quản lý tác giả', 'BUSINESS'],
      ['Cập nhật tác giả', '/authors/:id', 'PUT', 'Quản lý tác giả', 'BUSINESS'],
      ['Xóa tác giả', '/authors/:id', 'DELETE', 'Quản lý tác giả', 'BUSINESS'],
      // Quản lý bản dịch
      ['Xem bản dịch thành viên', '/translations/member', 'GET', 'Quản lý bản dịch', 'BUSINESS'],
      ['Cập nhật bản dịch', '/translations/:id', 'PUT', 'Quản lý bản dịch', 'BUSINESS'],
      ['Xóa bản dịch', '/translations/:id', 'DELETE', 'Quản lý bản dịch', 'BUSINESS'],
      // Quản lý bình luận
      ['Xem danh sách bình luận', '/comments/admin', 'GET', 'Quản lý bình luận', 'BUSINESS'],
      ['Cập nhật bình luận', '/comments/:id', 'PUT', 'Quản lý bình luận', 'BUSINESS'],
      ['Xóa bình luận', '/comments/:id', 'DELETE', 'Quản lý bình luận', 'BUSINESS'],
      // Diễn đàn
      ['Xem chủ đề diễn đàn', '/forum/topics', 'GET', 'Diễn đàn', 'BUSINESS'],
      ['Tạo chủ đề diễn đàn', '/forum/topics', 'POST', 'Diễn đàn', 'BUSINESS'],
      ['Ghim chủ đề', '/forum/topics/:id/pin', 'PUT', 'Diễn đàn', 'BUSINESS'],
      ['Khóa chủ đề', '/forum/topics/:id/lock', 'PUT', 'Diễn đàn', 'BUSINESS'],
      ['Xóa chủ đề', '/forum/topics/:id', 'DELETE', 'Diễn đàn', 'BUSINESS'],
      ['Xem bài đăng diễn đàn', '/forum/posts', 'GET', 'Diễn đàn', 'BUSINESS'],
      ['Xóa bài đăng diễn đàn', '/forum/posts/:id', 'DELETE', 'Diễn đàn', 'BUSINESS'],
      // Chú giải
      ['Xem chú giải', '/annotations', 'GET', 'Chú giải / Điển tích', 'BUSINESS'],
      ['Tạo chú giải', '/annotations', 'POST', 'Chú giải / Điển tích', 'BUSINESS'],
      ['Cập nhật chú giải', '/annotations/:id', 'PUT', 'Chú giải / Điển tích', 'BUSINESS'],
      ['Xóa chú giải', '/annotations/:id', 'DELETE', 'Chú giải / Điển tích', 'BUSINESS'],
      // Danh mục
      ['Xem quốc gia', '/countries', 'GET', 'Danh mục', 'BUSINESS'],
      ['Tạo quốc gia', '/countries', 'POST', 'Danh mục', 'BUSINESS'],
      ['Xem thời kỳ', '/eras', 'GET', 'Danh mục', 'BUSINESS'],
      ['Tạo thời kỳ', '/eras', 'POST', 'Danh mục', 'BUSINESS'],
      ['Xem thể loại thơ', '/poem-categories', 'GET', 'Danh mục', 'BUSINESS'],
      ['Tạo thể loại thơ', '/poem-categories', 'POST', 'Danh mục', 'BUSINESS'],
      // Thống kê
      ['Xem thống kê tổng quan', '/statistics', 'GET', 'Thống kê', 'BUSINESS'],
      // Quản lý quyền API
      ['Tạo quyền hạn mới', '/rbac/permissions', 'POST', 'Quản lý quyền API', 'SYSTEM_MANAGEMENT'],
      ['Xem danh sách quyền hạn', '/rbac/permissions', 'GET', 'Quản lý quyền API', 'SYSTEM_MANAGEMENT'],
      ['Xem chi tiết quyền hạn', '/rbac/permissions/:id', 'GET', 'Quản lý quyền API', 'SYSTEM_MANAGEMENT'],
      ['Cập nhật quyền hạn', '/rbac/permissions/:id', 'PUT', 'Quản lý quyền API', 'SYSTEM_MANAGEMENT'],
      ['Xóa quyền hạn', '/rbac/permissions/:id', 'DELETE', 'Quản lý quyền API', 'SYSTEM_MANAGEMENT'],
      // Quản lý vai trò
      ['Tạo vai trò mới', '/rbac/roles', 'POST', 'Quản lý vai trò', 'SYSTEM_MANAGEMENT'],
      ['Xem danh sách vai trò', '/rbac/roles', 'GET', 'Quản lý vai trò', 'SYSTEM_MANAGEMENT'],
      ['Xem chi tiết vai trò', '/rbac/roles/:id', 'GET', 'Quản lý vai trò', 'SYSTEM_MANAGEMENT'],
      ['Cập nhật vai trò', '/rbac/roles/:id', 'PUT', 'Quản lý vai trò', 'SYSTEM_MANAGEMENT'],
      ['Xóa vai trò', '/rbac/roles/:id', 'DELETE', 'Quản lý vai trò', 'SYSTEM_MANAGEMENT'],
    ];

    const esc = (s: string) => s.replace(/'/g, "''");
    const values = perms
      .map(
        ([name, path, method, module, sm]) =>
          `('${esc(name)}', '${esc(path)}', '${method}', '${esc(module)}', '${sm}')`,
      )
      .join(',\n        ');

    await queryRunner.query(`
      INSERT IGNORE INTO \`permissions\`
        (\`name\`, \`api_path\`, \`method\`, \`module\`, \`system_module\`)
      VALUES
        ${values}
    `);

    // ─── seed roles ────────────────────────────────────────────────────────
    await queryRunner.query(`
      INSERT IGNORE INTO \`roles\` (\`name\`, \`description\`, \`created_by\`, \`updated_by\`)
      VALUES
        ('admin', 'Quản trị viên — toàn quyền', 'System', NULL),
        ('member', 'Thành viên — quyền xem cơ bản', 'admin', NULL)
    `);

    // admin: tất cả quyền
    await queryRunner.query(`
      INSERT IGNORE INTO \`role_permissions\` (\`role_id\`, \`permission_id\`)
      SELECT r.\`id\`, p.\`id\`
      FROM \`roles\` r CROSS JOIN \`permissions\` p
      WHERE r.\`name\` = 'admin'
    `);

    // member: các quyền GET nghiệp vụ (chỉ xem)
    await queryRunner.query(`
      INSERT IGNORE INTO \`role_permissions\` (\`role_id\`, \`permission_id\`)
      SELECT r.\`id\`, p.\`id\`
      FROM \`roles\` r CROSS JOIN \`permissions\` p
      WHERE r.\`name\` = 'member'
        AND p.\`system_module\` = 'BUSINESS'
        AND p.\`method\` = 'GET'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS `role_permissions`');
    await queryRunner.query('DROP TABLE IF EXISTS `roles`');
    await queryRunner.query('DROP TABLE IF EXISTS `permissions`');
  }
}
