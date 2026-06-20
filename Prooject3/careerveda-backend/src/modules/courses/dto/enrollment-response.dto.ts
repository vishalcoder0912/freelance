import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EnrollmentResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() studentId: string;
  @ApiProperty() courseId: string;
  @ApiProperty() progress: number;
  @ApiPropertyOptional() completedAt?: Date;
  @ApiProperty() createdAt: Date;
  @ApiPropertyOptional() course?: any;

  static fromEnrollment(enrollment: any): EnrollmentResponseDto {
    return {
      id: enrollment.id,
      studentId: enrollment.studentId,
      courseId: enrollment.courseId,
      progress: enrollment.progress,
      completedAt: enrollment.completedAt,
      createdAt: enrollment.createdAt,
      course: enrollment.course,
    };
  }
}
