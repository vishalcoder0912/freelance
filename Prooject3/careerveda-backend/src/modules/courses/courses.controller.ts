import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { CourseResponseDto } from './dto/course-response.dto';
import { EnrollDto } from './dto/enroll.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  // ─── COURSES ───

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.MENTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new course' })
  async create(@Body() dto: CreateCourseDto): Promise<CourseResponseDto> {
    return this.coursesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List published courses' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('all') all?: string,
  ) {
    return this.coursesService.findAll(page || 1, limit || 20, all === 'true');
  }

  @Get('analytics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get course analytics (admin)' })
  async getAnalytics() {
    return this.coursesService.getCourseAnalytics();
  }

  @Get(':idOrSlug')
  @ApiOperation({ summary: 'Get course by ID or slug' })
  async findOne(@Param('idOrSlug') idOrSlug: string): Promise<CourseResponseDto> {
    return this.coursesService.findOne(idOrSlug);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.MENTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a course' })
  async update(@Param('id') id: string, @Body() dto: UpdateCourseDto): Promise<CourseResponseDto> {
    return this.coursesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a course' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.coursesService.remove(id);
  }

  // ─── MODULES ───

  @Post(':courseId/modules')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.MENTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a module to a course' })
  async addModule(@Param('courseId') courseId: string, @Body() dto: CreateModuleDto) {
    return this.coursesService.addModule(courseId, dto);
  }

  @Put('modules/:moduleId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.MENTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a module' })
  async updateModule(@Param('moduleId') moduleId: string, @Body() dto: UpdateModuleDto) {
    return this.coursesService.updateModule(moduleId, dto);
  }

  @Delete('modules/:moduleId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a module' })
  async removeModule(@Param('moduleId') moduleId: string): Promise<void> {
    return this.coursesService.removeModule(moduleId);
  }

  // ─── LESSONS ───

  @Post('modules/:moduleId/lessons')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.MENTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a lesson to a module' })
  async addLesson(@Param('moduleId') moduleId: string, @Body() dto: CreateLessonDto) {
    return this.coursesService.addLesson(moduleId, dto);
  }

  @Put('lessons/:lessonId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.MENTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a lesson' })
  async updateLesson(@Param('lessonId') lessonId: string, @Body() dto: UpdateLessonDto) {
    return this.coursesService.updateLesson(lessonId, dto);
  }

  @Delete('lessons/:lessonId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a lesson' })
  async removeLesson(@Param('lessonId') lessonId: string): Promise<void> {
    return this.coursesService.removeLesson(lessonId);
  }

  // ─── ENROLLMENTS ───

  @Post('enroll')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enroll in a course' })
  async enroll(
    @CurrentUser('studentId') studentId: string,
    @Body() dto: EnrollDto,
  ) {
    return this.coursesService.enroll(studentId, dto.courseId);
  }

  @Get('enrollments/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my enrolled courses' })
  async myEnrollments(@CurrentUser('studentId') studentId: string) {
    return this.coursesService.getStudentEnrollments(studentId);
  }

  @Put('enrollments/:enrollmentId/progress')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update enrollment progress' })
  async updateProgress(
    @Param('enrollmentId') enrollmentId: string,
    @Body('progress') progress: number,
  ) {
    return this.coursesService.updateProgress(enrollmentId, progress);
  }
}
