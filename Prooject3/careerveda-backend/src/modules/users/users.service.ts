import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    const hashedPassword = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: hashedPassword,
        role: dto.role || 'STUDENT',
      },
      include: { student: true, mentor: true, recruiter: true },
    });

    if (user.role === 'STUDENT') {
      await this.prisma.student.create({ data: { userId: user.id } });
    } else if (user.role === 'MENTOR') {
      await this.prisma.mentor.create({
        data: { userId: user.id, company: '', designation: '', experience: 0 },
      });
    }

    return UserResponseDto.fromUser(user);
  }

  async findAll(page = 1, limit = 20): Promise<{ data: UserResponseDto[]; total: number; page: number }> {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        include: { student: true, mentor: true, recruiter: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);
    return { data: users.map(UserResponseDto.fromUser), total, page };
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { student: true, mentor: true, recruiter: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return UserResponseDto.fromUser(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    const updated = await this.prisma.user.update({
      where: { id },
      data: dto,
      include: { student: true, mentor: true, recruiter: true },
    });
    return UserResponseDto.fromUser(updated);
  }

  async remove(id: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    await this.prisma.user.delete({ where: { id } });
  }
}
