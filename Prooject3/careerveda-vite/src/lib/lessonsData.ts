export interface LessonResource {
  title: string;
  url: string;
  type: 'pdf' | 'link' | 'video' | 'code';
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  videoUrl: string;
  content: string;
  resources: LessonResource[];
}

export interface ModuleLessons {
  id: string;
  title: string;
  lessons: Lesson[];
}

const DEMO_VIDEOS = [
  '3sIk0ErHGjE', '7R52wi9z0w', 'aircAruvnKk', '_Z9Qgal_ekc',
  'jZTg2K6LDko', '6J8Uw0tPp7M', 'GZs2CJMnGj8', 'KNAWfVdrt7s',
  '8TQoELeXZr8', '9LYM3MqF9cc', 'N6TqV8pFR6M', 'Q9E1YJ6k3Gg',
];

function pickVideos(count: number): string[] {
  const shuffled = [...DEMO_VIDEOS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function generateLessonContent(moduleTitle: string, lessonTitle: string, lessonNum: number): string {
  return `<div class="space-y-4">
    <h2 class="text-xl font-bold text-slate-900">${lessonTitle}</h2>
    <p class="text-slate-600 leading-relaxed">
      Welcome to <strong>${lessonTitle}</strong>, part of the <strong>${moduleTitle}</strong> module.
      In this lesson, we'll explore the core concepts and practical applications that form the foundation
      of this topic.
    </p>
    <h3 class="text-lg font-semibold text-slate-800 mt-6">Learning Objectives</h3>
    <ul class="list-disc pl-5 space-y-1 text-slate-600">
      <li>Understand the fundamental principles and key terminology</li>
      <li>Explore real-world applications and industry use cases</li>
      <li>Build hands-on skills through practical examples</li>
      <li>Learn best practices and common pitfalls to avoid</li>
    </ul>
    <h3 class="text-lg font-semibold text-slate-800 mt-6">Key Concepts</h3>
    <p class="text-slate-600 leading-relaxed">
      This section covers the essential theoretical foundations you need to understand before diving into
      implementation. We'll build from first principles, ensuring you have a solid grasp of the
      underlying concepts that drive practical applications in this domain.
    </p>
    <div class="bg-blue-50 border border-blue-100 rounded-xl p-4 mt-4">
      <p class="text-sm font-semibold text-blue-800">Pro Tip</p>
      <p class="text-sm text-blue-600 mt-1">
        Take notes as you go through this lesson. Active recall significantly improves knowledge retention.
        Use the notes panel on the right to jot down key insights.
      </p>
    </div>
    <h3 class="text-lg font-semibold text-slate-800 mt-6">Practical Application</h3>
    <p class="text-slate-600 leading-relaxed">
      Theory is important, but true mastery comes from applying what you've learned. In this section,
      we'll walk through a step-by-step example that demonstrates how to implement these concepts
      in a real-world scenario.
    </p>
    <div class="bg-slate-900 text-green-400 rounded-xl p-4 font-mono text-sm mt-4 overflow-x-auto">
      <pre># Example code snippet
import numpy as np

def analyze_data(dataset):
    """Process and analyze the input dataset."""
    mean = np.mean(dataset)
    std = np.std(dataset)
    return { 'mean': mean, 'std': std, 'samples': len(dataset) }

# Run the analysis
result = analyze_data([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
print(f"Mean: {result['mean']}, Std: {result['std']}")</pre>
    </div>
    <h3 class="text-lg font-semibold text-slate-800 mt-6">Summary</h3>
    <p class="text-slate-600 leading-relaxed">
      In this lesson, we covered the core concepts of ${lessonTitle}. You learned about the
      fundamental principles, explored practical applications, and saw a working example. In the next
      lesson, we'll build on these foundations and dive deeper into advanced topics.
    </p>
  </div>`;
}

function generateLessonResources(): LessonResource[] {
  return [
    { title: 'Lesson Notes PDF', url: '#', type: 'pdf' as const },
    { title: 'Practice Exercises', url: '#', type: 'link' as const },
    { title: 'Supplementary Video', url: '#', type: 'video' as const },
    { title: 'Source Code Examples', url: '#', type: 'code' as const },
  ];
}

const MODULE_LESSON_TEMPLATES: Record<string, string[]> = {
  'Python Programming & Math Foundations': [
    'Introduction to Python for Data Science',
    'NumPy Arrays & Vectorized Operations',
    'Pandas: DataFrames & Series',
    'Linear Algebra Fundamentals',
    'Calculus & Optimization Basics',
  ],
  'Classical Machine Learning with Scikit-Learn': [
    'Supervised Learning: Regression',
    'Supervised Learning: Classification',
    'Decision Trees & Random Forests',
    'Model Evaluation & Cross-Validation',
  ],
  'Neural Networks & Deep Learning Core (PyTorch)': [
    'Neural Network Fundamentals',
    'Building Networks with PyTorch',
    'Training Loops & Backpropagation',
    'CNNs for Image Recognition',
  ],
  'Natural Language Processing & Computer Vision': [
    'Text Preprocessing & Tokenization',
    'Word Embeddings & Transformers',
    'Image Classification with CNNs',
    'Object Detection & Segmentation',
  ],
  'Large Language Models (RAG, Fine-Tuning & Prompting)': [
    'Introduction to Transformer Architecture',
    'Prompt Engineering Fundamentals',
    'Retrieval-Augmented Generation (RAG)',
    'Fine-Tuning LLMs with LoRA',
  ],
  'MLOps, Docker & Containerized deployments': [
    'Introduction to MLOps',
    'Docker for Data Science',
    'CI/CD for ML Pipelines',
    'Model Monitoring & Logging',
  ],
  'Capstone: Predict Real-time Churn for 10M Users': [
    'Project Planning & Data Exploration',
    'Feature Engineering Pipeline',
    'Model Selection & Training',
    'Deployment & Presentation',
  ],
  'Product Mindset & Core Competencies': [
    'What Makes a Great Product Manager',
    'Product Lifecycle & Stakeholder Mapping',
    'Design Thinking & Problem Discovery',
    'Writing PRDs & User Stories',
  ],
  'User Research, Personas & Journey Mapping': [
    'Qualitative & Quantitative Research',
    'Creating Data-Driven Personas',
    'Journey Mapping & Pain Points',
    'Research Synthesis & Presentation',
  ],
  'Product Strategy, Roadmapping & Prioritization': [
    'Vision, Strategy & OKRs',
    'Prioritization Frameworks (RICE, MoSCoW)',
    'Building & Communicating Roadmaps',
    'Competitive Analysis & Positioning',
  ],
  'Agile Methodologies & Stakeholder Management': [
    'Agile & Scrum Fundamentals',
    'Sprint Planning & Execution',
    'Stakeholder Communication',
    'Managing Cross-Functional Teams',
  ],
  'Product Metrics, Growth & Cohort Analytics': [
    'North Star Metrics & KPIs',
    'A/B Testing & Experimentation',
    'Cohort & Retention Analysis',
    'Data-Driven Decision Making',
  ],
  'Capstone Product Pitch to Silicon Valley VCs': [
    'Defining Your Product Vision',
    'Building the MVP & Prototype',
    'Go-to-Market Strategy',
    'Pitch Deck & Investor Presentation',
  ],
  'Foundational LLM APIs & Vector Databases': [
    'Introduction to LLM APIs (OpenAI, Claude)',
    'Prompt Engineering Best Practices',
    'Vector Databases & Embeddings',
    'Building a RAG Pipeline',
  ],
  'Agentic Workflows & Multi-Agent Orchestration': [
    'Understanding AI Agents',
    'Building Multi-Agent Systems',
    'Tool Use & Function Calling',
    'Memory & Context Management',
  ],
  'Model Fine-Tuning & Quantization strategies': [
    'Transfer Learning Fundamentals',
    'Fine-Tuning with LoRA & QLoRA',
    'Model Quantization Techniques',
    'Evaluating Fine-Tuned Models',
  ],
  'MLOps, Scalable Inference & Cloud Scaling': [
    'ML Pipeline Orchestration',
    'Model Serving & Scaling',
    'Cloud Deployment (AWS, GCP, Azure)',
    'Cost Optimization & Monitoring',
  ],
  'Interactive AI Voice Assistants & Mocks': [
    'Speech Recognition & TTS',
    'Building Voice Interfaces',
    'Testing & Improving Voice UX',
    'Deploying Voice Assistants',
  ],
  'Capstone Project: Complete Agent System': [
    'System Design & Architecture',
    'Agent Implementation & Integration',
    'Testing & Performance Optimization',
    'Production Deployment & Documentation',
  ],
};

const GENERIC_LESSONS = [
  'Introduction & Core Concepts',
  'Hands-On Practice & Examples',
  'Advanced Techniques',
  'Real-World Applications & Case Study',
];

function buildModuleLessons(programSlug: string, moduleIndex: number, moduleTitle: string): ModuleLessons {
  const lessonTitles = MODULE_LESSON_TEMPLATES[moduleTitle] || GENERIC_LESSONS;
  const videos = pickVideos(lessonTitles.length);
  return {
    id: `m${moduleIndex}`,
    title: moduleTitle,
    lessons: lessonTitles.map((title, i) => ({
      id: `l${i}`,
      title,
      description: `Lesson ${i + 1} of ${moduleTitle}`,
      duration: `${10 + Math.floor(Math.random() * 20)} min`,
      videoUrl: `https://www.youtube.com/embed/${videos[i]}`,
      content: generateLessonContent(moduleTitle, title, i),
      resources: generateLessonResources(),
    })),
  };
}

function buildAllModuleLessons(programSlug: string, moduleTitles: string[]): ModuleLessons[] {
  return moduleTitles.map((title, i) => buildModuleLessons(programSlug, i, title));
}

import { PROGRAMS_DATA } from './programsData';

export const PROGRAM_LESSONS: Record<string, ModuleLessons[]> = Object.fromEntries(
  Object.entries(PROGRAMS_DATA).map(([slug, prog]) => [slug, buildAllModuleLessons(slug, prog.modules)])
);

export function getProgramLessons(programSlug: string): ModuleLessons[] {
  return PROGRAM_LESSONS[programSlug] || [];
}

export function getModuleLessons(programSlug: string, moduleId: string): ModuleLessons | undefined {
  return getProgramLessons(programSlug).find(m => m.id === moduleId);
}

export function getLesson(programSlug: string, moduleId: string, lessonId: string): Lesson | undefined {
  const mod = getModuleLessons(programSlug, moduleId);
  return mod?.lessons.find(l => l.id === lessonId);
}

export function getLessonKey(moduleId: string, lessonId: string): string {
  return `${moduleId}-${lessonId}`;
}

export function getPrevNextLesson(programSlug: string, moduleId: string, lessonId: string): { prev: { moduleId: string; lessonId: string } | null; next: { moduleId: string; lessonId: string } | null } {
  const modules = getProgramLessons(programSlug);
  const modIdx = modules.findIndex(m => m.id === moduleId);
  if (modIdx === -1) return { prev: null, next: null };
  const mod = modules[modIdx];
  const lesIdx = mod.lessons.findIndex(l => l.id === lessonId);
  if (lesIdx === -1) return { prev: null, next: null };

  let prev: { moduleId: string; lessonId: string } | null = null;
  let next: { moduleId: string; lessonId: string } | null = null;

  if (lesIdx > 0) {
    prev = { moduleId, lessonId: mod.lessons[lesIdx - 1].id };
  } else if (modIdx > 0) {
    const prevMod = modules[modIdx - 1];
    prev = { moduleId: prevMod.id, lessonId: prevMod.lessons[prevMod.lessons.length - 1].id };
  }

  if (lesIdx < mod.lessons.length - 1) {
    next = { moduleId, lessonId: mod.lessons[lesIdx + 1].id };
  } else if (modIdx < modules.length - 1) {
    const nextMod = modules[modIdx + 1];
    next = { moduleId: nextMod.id, lessonId: nextMod.lessons[0].id };
  }

  return { prev, next };
}
