import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import slugify from 'slugify';
import { User, UserRole } from '../../entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

export interface FacebookProfilePayload {
  facebookId: string;
  email: string | null;
  displayName: string;
  avatarUrl: string | null;
}

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
      role: UserRole.MEMBER,
    });

    const saved = await this.userRepo.save(user);
    const access_token = this.signToken(saved);

    return {
      success: true,
      message: 'Đăng ký tài khoản thành công',
      data: {
        user: this.formatUser(saved),
        access_token,
      },
    };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('Email chưa được đăng ký');
    }

    if (!user.isActive) {
      throw new ForbiddenException('Tài khoản đã bị khoá. Vui lòng liên hệ quản trị viên');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Mật khẩu không đúng');
    }

    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password);
    const access_token = this.signToken(user);

    return {
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        user: {
          ...this.formatUser(user),
          preferences: {
            vn_typing_mode: user.vnTypingMode,
            theme: user.themePreference,
            font: user.fontPreference,
          },
        },
        access_token,
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
      role: UserRole.MEMBER,
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

  async loginWithFacebookAccessToken(accessToken: string) {
    const url = `https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${encodeURIComponent(accessToken)}`;
    const res = await fetch(url);
    if (!res.ok) throw new UnauthorizedException('Facebook access token không hợp lệ');

    const data = await res.json() as {
      id: string;
      name: string;
      email?: string;
      picture?: { data: { url: string } };
    };

    const profile: FacebookProfilePayload = {
      facebookId: data.id,
      email: data.email ?? null,
      displayName: data.name,
      avatarUrl: data.picture?.data?.url ?? null,
    };

    const user = await this.findOrCreateFacebookUser(profile);
    if (!user.isActive) throw new UnauthorizedException('Tài khoản đã bị vô hiệu hoá');

    return {
      success: true,
      message: 'Đăng nhập Facebook thành công',
      data: {
        user: this.formatUser(user),
        access_token: this.signToken(user),
      },
    };
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
