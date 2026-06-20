import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EnrollDto {
  @ApiProperty({ description: 'Course ID to enroll in' })
  @IsString()
  courseId: string;
}

export class UpdateProgressDto {
  @ApiProperty({ description: 'Progress percentage (0-100)' })
  progress: number;

  @ApiPropertyOptional()
  completedLessonIds?: string[];
}
