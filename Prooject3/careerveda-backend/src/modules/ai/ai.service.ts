import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly openRouterUrl = 'https://openrouter.ai/api/v1/chat/completions';

  // Helper method to make OpenRouter API requests
  private async callOpenRouter(model: string, systemPrompt: string, userPrompt: string): Promise<string> {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      this.logger.warn(`OPENROUTER_API_KEY is not set. Falling back to simulated response.`);
      return '';
    }

    try {
      const response = await fetch(this.openRouterUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://careerveda.ai',
          'X-Title': 'CareerVeda AI OS',
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
      }

      const data: any = await response.json();
      return data?.choices?.[0]?.message?.content || '';
    } catch (error) {
      this.logger.error(`Error calling OpenRouter: ${error.message}`);
      return '';
    }
  }

  /**
   * Career Planner Agent: Generates a 6-month roadmap for a specific career path.
   */
  async generateRoadmap(targetRole: string, currentLevel: string): Promise<any> {
    const systemPrompt = `You are the CareerVeda AI Career Planner Agent. 
Generate a detailed 6-month career roadmap for a user aiming to become a ${targetRole} starting from ${currentLevel} level.
Respond ONLY with a valid JSON array of monthly milestones. Do not include any markdown format or additional text.
Example format:
[
  { "month": "Month 1", "topic": "Foundations of X", "description": "Learn basic concepts.", "color": "#6C63FF" },
  { "month": "Month 2", "topic": "Intermediate X", "description": "Deep dive into APIs.", "color": "#00D4FF" }
]`;

    const userPrompt = `Generate a 6-month roadmap for: ${targetRole} (${currentLevel} level)`;
    
    // We use a free model like Qwen 2.5 72B or DeepSeek R1 if available, otherwise fallback
    const result = await this.callOpenRouter(
      'qwen/qwen-2.5-72b-instruct:free',
      systemPrompt,
      userPrompt
    );

    if (result) {
      try {
        // Strip markdown code block wrappers if any are returned
        const cleaned = result.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleaned);
      } catch (e) {
        this.logger.error('Failed to parse AI response as JSON, using mock data.');
      }
    }

    // Mock Data Fallback
    return this.getMockRoadmap(targetRole, currentLevel);
  }

  /**
   * Resume Analyst Agent: Analyzes resume text for ATS scoring and keywords.
   */
  async analyzeResume(resumeText: string): Promise<any> {
    const systemPrompt = `You are the CareerVeda AI Resume Analyst Agent. 
Analyze the provided resume text. Calculate an ATS score (0 to 100), identify key strengths, skill gaps, and hidden opportunities.
Respond ONLY with a valid JSON object in this format:
{
  "score": 78,
  "strengths": ["React.js", "System Design"],
  "gaps": ["Cloud Infrastructure", "CI/CD Pipelines"],
  "opportunities": ["AI Engineer", "MLOps Engineer"],
  "feedback": "Your resume has great frontend foundations, but needs more cloud and DevOps coverage."
}`;

    const userPrompt = `Analyze this resume: \n\n${resumeText}`;
    const result = await this.callOpenRouter(
      'qwen/qwen-2.5-72b-instruct:free',
      systemPrompt,
      userPrompt
    );

    if (result) {
      try {
        const cleaned = result.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleaned);
      } catch (e) {
        this.logger.error('Failed to parse AI resume feedback, using mock data.');
      }
    }

    return {
      score: 75,
      strengths: ['JavaScript', 'React', 'Problem Solving'],
      gaps: ['Docker', 'AWS', 'Kubernetes'],
      opportunities: ['Full Stack Developer', 'Cloud Associate'],
      feedback: 'Good frontend foundations. Focus on adding cloud deployment and containerization skills to match top tier vacancies.'
    };
  }

  /**
   * Interview Coach Agent: Conducts Q&A and scores answers.
   */
  async mockInterviewFeedback(question: string, answer: string, role: string): Promise<any> {
    const systemPrompt = `You are the CareerVeda AI Interview Coach Agent.
Evaluate the candidate's answer for the following question for a ${role} position.
Provide a score (0 to 100) and specific feedback on how to improve.
Respond ONLY with a valid JSON object in this format:
{
  "score": 82,
  "feedback": "Good description of state management, but you should mention the performance implications of context versus Zustand.",
  "idealAnswer": "An ideal answer would cover..."
}`;

    const userPrompt = `Role: ${role}\nQuestion: ${question}\nCandidate Answer: ${answer}`;
    const result = await this.callOpenRouter(
      'google/gemma-2-9b-it:free',
      systemPrompt,
      userPrompt
    );

    if (result) {
      try {
        const cleaned = result.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleaned);
      } catch (e) {
        this.logger.error('Failed to parse AI interview feedback, using mock.');
      }
    }

    return {
      score: 80,
      feedback: 'Solid response. You demonstrated good problem-solving logic. To elevate your answer, structure it using the STAR method (Situation, Task, Action, Result) and quantify your impact.',
      idealAnswer: 'To answer this effectively, you should state the challenge, explain the specific architectural choices you made (e.g., database selection, scalability concerns), the actions you took to resolve it, and the final latency or cost reductions achieved.'
    };
  }

  private getMockRoadmap(role: string, level: string) {
    return [
      { month: 'Month 1', topic: 'Core Foundations', description: `Master the essential building blocks for ${role} at a ${level} level.`, color: '#6C63FF' },
      { month: 'Month 2', topic: 'Advanced Architecture & Logic', description: 'Deep dive into performance, state management, and design patterns.', color: '#00D4FF' },
      { month: 'Month 3', topic: 'Database & Persistent Storage', description: 'Learn data modeling, optimization, and integrations.', color: '#7CFFB2' },
      { month: 'Month 4', topic: 'Testing & Quality Assurance', description: 'Write unit tests, integration tests, and automate testing pipelines.', color: '#F59E0B' },
      { month: 'Month 5', topic: 'Cloud, Containerization & CI/CD', description: 'Deploy your applications, configure Docker, and build robust workflows.', color: '#6C63FF' },
      { month: 'Month 6', topic: 'Capstone Project & Placements', description: 'Build an industry-grade project, prepare mock interviews, and begin applications.', color: '#00D4FF' }
    ];
  }
}
