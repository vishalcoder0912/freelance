import { IsString, IsOptional, IsEnum, IsNumber, IsBoolean, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Difficulty } from '@prisma/client';

export class CreateCourseDto {
  @ApiProperty({ example: 'Full-Stack Web Development' })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @ApiProperty({ example: 'full-stack-web-development' })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  slug: string;

  @ApiProperty({ example: 'Learn modern web development from scratch...' })
  @IsString()
  @MinLength(10)
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiProperty({ enum: Difficulty, default: Difficulty.BEGINNER })
  @IsEnum(Difficulty)
  difficulty: Difficulty;

  @ApiProperty({ example: 4800 })
  @IsNumber()
  duration: number;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isPremium?: boolean;
}
