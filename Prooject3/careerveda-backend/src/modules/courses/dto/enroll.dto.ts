import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EnrollDto {
  @ApiProperty({ description: 'Course ID to enroll in' })
  @IsString()
  courseId: string;
}

export class UpdateProgressDto {
  @ApiProperty({ description: 'Progress percentage (0-100)' })
  @IsNumber()
  progress: number;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  completedLessonIds?: string[];
}
