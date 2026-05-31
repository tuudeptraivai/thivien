import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { User, UserRole } from '../../entities/user.entity';

describe('AuthService.login()', () => {
  let service: AuthService;
  let userRepo: jest.Mocked<Pick<Repository<User>, 'findOne'>>;
  let jwtService: jest.Mocked<Pick<JwtService, 'sign'>>;

  const buildUser = (overrides: Partial<User> = {}): User => ({
    id: 1,
    username: 'admin',
    email: 'admin@gmail.com',
    passwordHash: 'hashed-pw',
    displayName: 'Quản trị',
    avatarUrl: null as unknown as string,
    facebookId: null,
    role: UserRole.ADMIN,
    vnTypingMode: 3,
    themePreference: 'system',
    fontPreference: 'Lora',
    isActive: true,
    createdAt: new Date('2025-01-01T00:00:00Z'),
    updatedAt: new Date('2025-01-01T00:00:00Z'),
    comments: [],
    bookmarks: [],
    forumTopics: [],
    forumPosts: [],
    ...overrides,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: { findOne: jest.fn() },
        },
        {
          provide: JwtService,
          useValue: { sign: jest.fn().mockReturnValue('signed-jwt') },
        },
      ],
    }).compile();

    service = module.get(AuthService);
    userRepo = module.get(getRepositoryToken(User));
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('trả về access_token và user khi email + mật khẩu hợp lệ', async () => {
    const user = buildUser();
    userRepo.findOne.mockResolvedValue(user);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

    const result = await service.login({
      email: 'admin@gmail.com',
      password: 'admin@123',
    });

    expect(userRepo.findOne).toHaveBeenCalledWith({
      where: { email: 'admin@gmail.com' },
    });
    expect(jwtService.sign).toHaveBeenCalledWith({
      sub: user.id,
      username: user.username,
    });
    expect(result.success).toBe(true);
    expect(result.data.access_token).toBe('signed-jwt');
    expect(result.data.user.email).toBe('admin@gmail.com');
    expect(result.data.user.preferences).toEqual({
      vn_typing_mode: 3,
      theme: 'system',
      font: 'Lora',
    });
    expect(result.data.user).not.toHaveProperty('passwordHash');
  });

  it('throw NotFoundException (404) khi email chưa được đăng ký', async () => {
    userRepo.findOne.mockResolvedValue(null);

    await expect(
      service.login({ email: 'noone@gmail.com', password: 'whatever' }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(jwtService.sign).not.toHaveBeenCalled();
  });

  it('throw ForbiddenException (403) khi tài khoản bị khoá', async () => {
    userRepo.findOne.mockResolvedValue(buildUser({ isActive: false }));
    const compareSpy = jest.spyOn(bcrypt, 'compare');

    await expect(
      service.login({ email: 'admin@gmail.com', password: 'admin@123' }),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(compareSpy).not.toHaveBeenCalled();
    expect(jwtService.sign).not.toHaveBeenCalled();
  });

  it('throw UnauthorizedException (401) khi mật khẩu sai', async () => {
    userRepo.findOne.mockResolvedValue(buildUser());
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

    await expect(
      service.login({ email: 'admin@gmail.com', password: 'sai-mat-khau' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(jwtService.sign).not.toHaveBeenCalled();
  });
});
