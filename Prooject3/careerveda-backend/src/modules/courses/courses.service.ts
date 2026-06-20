import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { CourseResponseDto } from './dto/course-response.dto';
import { EnrollmentResponseDto } from './dto/enrollment-response.dto';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  // ──────────────────────────────
  // COURSES
  // ──────────────────────────────

  async create(dto: CreateCourseDto): Promise<CourseResponseDto> {
    const existing = await this.prisma.course.findUnique({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException('Course with this slug already exists');

    const course = await this.prisma.course.create({
      data: dto,
      include: { modules: { include: { lessons: true }, orderBy: { order: 'asc' } } },
    });
    return CourseResponseDto.fromCourse(course);
  }

  async findAll(page = 1, limit = 20, includeUnpublished = false) {
    const skip = (page - 1) * limit;
    const where = includeUnpublished ? {} : { isPublished: true };
    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        skip,
        take: limit,
        include: { modules: { include: { lessons: true }, orderBy: { order: 'asc' } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.course.count({ where }),
    ]);
    return { data: courses.map(CourseResponseDto.fromCourse), total, page };
  }

  async findOne(idOrSlug: string): Promise<CourseResponseDto> {
    const course = await this.prisma.course.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: { modules: { include: { lessons: true }, orderBy: { order: 'asc' } } },
    });
    if (!course) throw new NotFoundException('Course not found');
    return CourseResponseDto.fromCourse(course);
  }

  async update(id: string, dto: UpdateCourseDto): Promise<CourseResponseDto> {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) throw new NotFoundException('Course not found');
    const updated = await this.prisma.course.update({
      where: { id },
      data: dto,
      include: { modules: { include: { lessons: true }, orderBy: { order: 'asc' } } },
    });
    return CourseResponseDto.fromCourse(updated);
  }

  async remove(id: string): Promise<void> {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) throw new NotFoundException('Course not found');
    await this.prisma.course.delete({ where: { id } });
  }

  // ──────────────────────────────
  // MODULES
  // ──────────────────────────────

  async addModule(courseId: string, dto: CreateModuleDto) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Course not found');

    return this.prisma.module.create({
      data: { ...dto, courseId },
      include: { lessons: { orderBy: { order: 'asc' } } },
    });
  }

  async updateModule(moduleId: string, dto: UpdateModuleDto) {
    const module = await this.prisma.module.findUnique({ where: { id: moduleId } });
    if (!module) throw new NotFoundException('Module not found');
    return this.prisma.module.update({
      where: { id: moduleId },
      data: dto,
      include: { lessons: { orderBy: { order: 'asc' } } },
    });
  }

  async removeModule(moduleId: string): Promise<void> {
    const module = await this.prisma.module.findUnique({ where: { id: moduleId } });
    if (!module) throw new NotFoundException('Module not found');
    await this.prisma.module.delete({ where: { id: moduleId } });
  }

  // ──────────────────────────────
  // LESSONS
  // ──────────────────────────────

  async addLesson(moduleId: string, dto: CreateLessonDto) {
    const module = await this.prisma.module.findUnique({ where: { id: moduleId } });
    if (!module) throw new NotFoundException('Module not found');
    return this.prisma.lesson.create({ data: { ...dto, moduleId } });
  }

  async updateLesson(lessonId: string, dto: UpdateLessonDto) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) throw new NotFoundException('Lesson not found');
    return this.prisma.lesson.update({ where: { id: lessonId }, data: dto });
  }

  async removeLesson(lessonId: string): Promise<void> {
    const lesson = await this.prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) throw new NotFoundException('Lesson not found');
    await this.prisma.lesson.delete({ where: { id: lessonId } });
  }

  // ──────────────────────────────
  // ENROLLMENTS
  // ──────────────────────────────

  async enroll(studentId: string, courseId: string) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Course not found');

    const existing = await this.prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId, courseId } },
    });
    if (existing) throw new ConflictException('Already enrolled in this course');

    const enrollment = await this.prisma.enrollment.create({
      data: { studentId, courseId },
      include: { course: true },
    });
    return EnrollmentResponseDto.fromEnrollment(enrollment);
  }

  async getStudentEnrollments(studentId: string) {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { studentId },
      include: { course: true },
      orderBy: { createdAt: 'desc' },
    });
    return enrollments.map(EnrollmentResponseDto.fromEnrollment);
  }

  async updateProgress(enrollmentId: string, progress: number) {
    if (progress < 0 || progress > 100) {
      throw new BadRequestException('Progress must be between 0 and 100');
    }
    const enrollment = await this.prisma.enrollment.findUnique({ where: { id: enrollmentId } });
    if (!enrollment) throw new NotFoundException('Enrollment not found');

    const completedAt = progress >= 100 ? new Date() : null;
    return this.prisma.enrollment.update({
      where: { id: enrollmentId },
      data: { progress, completedAt },
      include: { course: true },
    });
  }

  async getCourseAnalytics() {
    const [totalCourses, totalEnrollments, completedCourses] = await Promise.all([
      this.prisma.course.count(),
      this.prisma.enrollment.count(),
      this.prisma.enrollment.count({ where: { progress: { gte: 100 } } }),
    ]);
    return { totalCourses, totalEnrollments, completedCourses, completionRate: totalEnrollments > 0 ? (completedCourses / totalEnrollments) * 100 : 0 };
  }
}
