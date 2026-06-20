import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Difficulty } from '@prisma/client';

class LessonResponse {
  @ApiProperty() id: string;
  @ApiProperty() title: string;
  @ApiPropertyOptional() content?: string;
  @ApiPropertyOptional() videoUrl?: string;
  @ApiPropertyOptional() duration?: number;
  @ApiProperty() order: number;
  @ApiProperty() isPreview: boolean;
}

class ModuleResponse {
  @ApiProperty() id: string;
  @ApiProperty() title: string;
  @ApiPropertyOptional() description?: string;
  @ApiProperty() order: number;
  @ApiPropertyOptional({ type: [LessonResponse] }) lessons?: LessonResponse[];
}

export class CourseResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() title: string;
  @ApiProperty() slug: string;
  @ApiProperty() description: string;
  @ApiPropertyOptional() thumbnail?: string;
  @ApiProperty({ enum: Difficulty }) difficulty: Difficulty;
  @ApiProperty() duration: number;
  @ApiProperty() price: number;
  @ApiProperty() isPremium: boolean;
  @ApiProperty() isPublished: boolean;
  @ApiProperty() createdAt: Date;
  @ApiPropertyOptional({ type: [ModuleResponse] }) modules?: ModuleResponse[];

  static fromCourse(course: any): CourseResponseDto {
    return {
      id: course.id,
      title: course.title,
      slug: course.slug,
      description: course.description,
      thumbnail: course.thumbnail,
      difficulty: course.difficulty,
      duration: course.duration,
      price: course.price,
      isPremium: course.isPremium,
      isPublished: course.isPublished,
      createdAt: course.createdAt,
      modules: course.modules?.map((m: any) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        order: m.order,
        lessons: m.lessons?.map((l: any) => ({
          id: l.id,
          title: l.title,
          content: l.content,
          videoUrl: l.videoUrl,
          duration: l.duration,
          order: l.order,
          isPreview: l.isPreview,
        })),
      })),
    };
  }
}
