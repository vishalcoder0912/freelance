import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('roadmap')
  @HttpCode(HttpStatus.OK)
  async getRoadmap(
    @Body('targetRole') targetRole: string,
    @Body('currentLevel') currentLevel: string,
  ) {
    const defaultRole = targetRole || 'Full Stack Engineer';
    const defaultLevel = currentLevel || 'Beginner';
    return this.aiService.generateRoadmap(defaultRole, defaultLevel);
  }

  @Post('resume')
  @HttpCode(HttpStatus.OK)
  async analyzeResume(@Body('resumeText') resumeText: string) {
    const text = resumeText || '';
    return this.aiService.analyzeResume(text);
  }

  @Post('interview')
  @HttpCode(HttpStatus.OK)
  async evaluateInterview(
    @Body('question') question: string,
    @Body('answer') answer: string,
    @Body('role') role: string,
  ) {
    const q = question || 'Tell me about yourself.';
    const a = answer || '';
    const r = role || 'Software Developer';
    return this.aiService.mockInterviewFeedback(q, a, r);
  }
}
