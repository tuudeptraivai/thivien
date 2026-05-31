import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import slugify from 'slugify';
import { User } from '../../entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { FacebookProfilePayload } from './facebook.strategy';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.userRepo.findOne({
      where: [{ username: dto.username }, { email: dto.email }],
    });
    if (exists) {
      throw new ConflictException('Tên đăng nhập hoặc email đã được sử dụng');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = this.userRepo.create({
      username: dto.username,
      email: dto.email,
      passwordHash,
      displayName: dto.display_name,
    });

    const saved = await this.userRepo.save(user);
    const token = this.signToken(saved);

    return {
      success: true,
      message: 'Đăng ký tài khoản thành công',
      data: {
        user: this.formatUser(saved),
        token,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: [{ username: dto.username_or_email }, { email: dto.username_or_email }],
    });

    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Tên đăng nhập hoặc mật khẩu không đúng');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Tài khoản đã bị vô hiệu hoá');
    }

    const token = this.signToken(user);

    return {
      success: true,
      data: {
        user: {
          ...this.formatUser(user),
          preferences: {
            vn_typing_mode: user.vnTypingMode,
            theme: user.themePreference,
            font: user.fontPreference,
          },
        },
        token,
      },
    };
  }

  async getMe(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('Người dùng không tồn tại');
    return {
      success: true,
      data: {
        ...this.formatUser(user),
        preferences: {
          vn_typing_mode: user.vnTypingMode,
          theme: user.themePreference,
          font: user.fontPreference,
        },
      },
    };
  }

  async findOrCreateFacebookUser(profile: FacebookProfilePayload): Promise<User> {
    let user = await this.userRepo.findOne({
      where: { facebookId: profile.facebookId },
    });
    if (user) return user;

    if (profile.email) {
      user = await this.userRepo.findOne({ where: { email: profile.email } });
      if (user) {
        user.facebookId = profile.facebookId;
        if (!user.avatarUrl && profile.avatarUrl) {
          user.avatarUrl = profile.avatarUrl;
        }
        return this.userRepo.save(user);
      }
    }

    const email = profile.email ?? `fb_${profile.facebookId}@facebook.local`;
    const username = await this.generateUniqueUsername(profile.displayName, profile.facebookId);
    const randomPassword = crypto.randomBytes(32).toString('hex');
    const passwordHash = await bcrypt.hash(randomPassword, 12);

    const created = this.userRepo.create({
      username,
      email,
      passwordHash,
      displayName: profile.displayName,
      avatarUrl: profile.avatarUrl ?? undefined,
      facebookId: profile.facebookId,
    });
    return this.userRepo.save(created);
  }

  async loginWithFacebook(profile: FacebookProfilePayload) {
    const user = await this.findOrCreateFacebookUser(profile);
    if (!user.isActive) {
      throw new UnauthorizedException('Tài khoản đã bị vô hiệu hoá');
    }
    return { user, token: this.signToken(user) };
  }

  private async generateUniqueUsername(displayName: string, facebookId: string): Promise<string> {
    const base = slugify(displayName || `fb-${facebookId}`, {
      lower: true,
      strict: true,
      locale: 'vi',
    }).slice(0, 40) || `fb-${facebookId}`;

    let candidate = base;
    let suffix = 0;
    while (await this.userRepo.findOne({ where: { username: candidate } })) {
      suffix += 1;
      candidate = `${base}-${suffix}`;
    }
    return candidate;
  }

  private signToken(user: User) {
    return this.jwtService.sign({ sub: user.id, username: user.username });
  }

  private formatUser(user: User) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      display_name: user.displayName,
      role: user.role,
      avatar_url: user.avatarUrl,
      created_at: user.createdAt,
    };
  }
}
