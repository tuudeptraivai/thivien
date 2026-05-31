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
