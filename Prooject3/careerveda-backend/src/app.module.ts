import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CoursesModule } from './modules/courses/courses.module';
import { AssessmentsModule } from './modules/assessments/assessments.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { MentorsModule } from './modules/mentors/mentors.module';
import { PlacementModule } from './modules/placement/placement.module';
import { AiModule } from './modules/ai/ai.module';
import { ResumeModule } from './modules/resume/resume.module';
import { GamificationModule } from './modules/gamification/gamification.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import jwtConfig from './config/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig],
      envFilePath: ['.env.local', '.env'],
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CoursesModule,
    AssessmentsModule,
    JobsModule,
    MentorsModule,
    PlacementModule,
    AiModule,
    ResumeModule,
    GamificationModule,
    NotificationsModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}