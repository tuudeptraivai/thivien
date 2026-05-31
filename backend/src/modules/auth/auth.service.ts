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
import { User } from '../../entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

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
