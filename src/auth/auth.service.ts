import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  Inject,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';

import { USERS_REPOSITORY } from '../users/repositories/users.repository.interface';
import type { IUsersRepository } from '../users/repositories/users.repository.interface';
import type { LoginDto } from './dto/login.dto';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { generateToken } from 'src/common/utils/generate-token';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<UserResponseDto> {
    const existingUser = await this.usersRepository.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const user = await this.usersRepository.create({
      fullName: dto.fullName,
      email: dto.email,
      password: dto.password,
      phone: dto.phone,
    });

    const token = generateToken(user._id.toString(), this.jwtService);

    return UserResponseDto.fromEntity(user, token);
  }

  async login(dto: LoginDto): Promise<UserResponseDto> {
    const user = await this.usersRepository.findByEmailWithPassword(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        'Your account has been deactivated. Please contact support.',
      );
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 4. JWT GENERATION
    const token = generateToken(user._id.toString(), this.jwtService);

    return UserResponseDto.fromEntity(user, token);
  }

  // ── Forgot Password ────────────────────────────────────────

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) throw new NotFoundException('No user found with this email');

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashed = crypto.createHash('sha256').update(resetCode).digest('hex');

    user.passwordResetCode = hashed;
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    user.passwordResetVerified = false;

    await this.usersRepository.save(user);

    // TODO: call email service here with resetCode

    return { message: 'Reset code sent' };
  }

  // ── Logout ─────────────────────────────────────────────────

  async logout(userId: string): Promise<{ message: string }> {
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    user.refreshToken = undefined;
    await this.usersRepository.save(user);

    return { message: 'Logged out successfully' };
  }
}
