import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role, Status } from '@prisma/client';
import { Student, Mentor, Recruiter } from '@prisma/client';

class StudentInfo {
  @ApiProperty() id: string;
  @ApiProperty() xp: number;
  @ApiProperty() level: number;
  @ApiProperty() streak: number;
  @ApiProperty() careerScore: number;
  @ApiProperty() placementStatus: string;
}

class MentorInfo {
  @ApiProperty() id: string;
  @ApiProperty() company: string;
  @ApiProperty() designation: string;
  @ApiProperty() experience: number;
  @ApiProperty() rating: number;
  @ApiProperty() totalSessions: number;
}

class RecruiterInfo {
  @ApiProperty() id: string;
  @ApiProperty() companyId: string;
}

export class UserResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() email: string;
  @ApiProperty() name: string;
  @ApiPropertyOptional() avatar?: string;
  @ApiProperty({ enum: Role }) role: Role;
  @ApiProperty({ enum: Status }) status: Status;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
  @ApiPropertyOptional({ type: StudentInfo }) student?: StudentInfo;
  @ApiPropertyOptional({ type: MentorInfo }) mentor?: MentorInfo;
  @ApiPropertyOptional({ type: RecruiterInfo }) recruiter?: RecruiterInfo;

  static fromUser(user: any): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      student: user.student ? {
        id: user.student.id,
        xp: user.student.xp,
        level: user.student.level,
        streak: user.student.streak,
        careerScore: user.student.careerScore,
        placementStatus: user.student.placementStatus,
      } : undefined,
      mentor: user.mentor ? {
        id: user.mentor.id,
        company: user.mentor.company,
        designation: user.mentor.designation,
        experience: user.mentor.experience,
        rating: user.mentor.rating,
        totalSessions: user.mentor.totalSessions,
      } : undefined,
      recruiter: user.recruiter ? {
        id: user.recruiter.id,
        companyId: user.recruiter.companyId,
      } : undefined,
    };
  }
}
