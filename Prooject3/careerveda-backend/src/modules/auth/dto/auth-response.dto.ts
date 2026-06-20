import { ApiProperty } from '@nestjs/swagger';
import { User, Role } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  avatar: string | null;

  @ApiProperty({ enum: Role })
  role: Role;

  @ApiProperty()
  createdAt: Date;

  static fromUser(user: User): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.email = user.email;
    dto.name = user.name;
    dto.avatar = user.avatar;
    dto.role = user.role;
    dto.createdAt = user.createdAt;
    return dto;
  }
}

export class AuthResponseDto {
  @ApiProperty()
  user: UserResponseDto;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}

export class RefreshTokenDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}