import { http, HttpResponse } from 'msw'

// Mock API responses
export const handlers = [
  // Auth endpoints
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json()
    
    if (email === 'test@example.com' && password === 'password123') {
      return HttpResponse.json({
        user: {
          uid: 'test-user-id',
          email: 'test@example.com',
          displayName: 'Test User'
        },
        token: 'mock-jwt-token'
      })
    }
    
    return HttpResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )
  }),
  
  http.post('/api/auth/register', async ({ request }) => {
    const { email, password, name } = await request.json()
    
    if (!email || !password || !name) {
      return HttpResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }
    
    return HttpResponse.json({
      user: {
        uid: 'new-user-id',
        email,
        displayName: name
      },
      token: 'mock-jwt-token'
    })
  }),
  
  http.post('/api/auth/logout', () => {
    return new HttpResponse(null, { status: 200 })
  }),
  
  // Programs endpoints
  http.get('/api/programs', () => {
    return HttpResponse.json([
      {
        id: 'ai-engineering',
        title: 'AI Engineering',
        slug: 'ai-engineering',
        duration: '12 Months',
        description: 'Master AI Engineering with hands-on projects',
        placementRate: '95%',
        avgPackage: '₹24 LPA',
        color: 'from-[#5B3DF5] to-[#7C6CFD]',
        isPopular: true,
        tag: 'Premium'
      },
      {
        id: 'product-management',
        title: 'Product Management',
        slug: 'product-management',
        duration: '6 Months',
        description: 'Become a product management expert',
        placementRate: '90%',
        avgPackage: '₹26 LPA',
        color: 'from-emerald-500 to-emerald-600',
        isPopular: false,
        tag: 'Fast Track'
      }
    ])
  }),
  
  http.get('/api/programs/:slug', ({ params }) => {
    const { slug } = params
    
    const programs = {
      'ai-engineering': {
        id: 'ai-engineering',
        title: 'AI Engineering',
        slug: 'ai-engineering',
        duration: '12 Months',
        description: 'Master AI Engineering with hands-on projects',
        placementRate: '95%',
        avgPackage: '₹24 LPA',
        color: 'from-[#5B3DF5] to-[#7C6CFD]',
        isPopular: true,
        tag: 'Premium',
        fullDescription: 'Comprehensive AI Engineering program covering machine learning, deep learning, and LLM integration',
        syllabus: ['Python', 'Machine Learning', 'Deep Learning', 'LLMs', 'MLOps'],
        projects: ['Resume AI', 'Chatbot', 'Agent System'],
        companies: ['Google', 'Microsoft', 'Amazon']
      },
      'product-management': {
        id: 'product-management',
        title: 'Product Management',
        slug: 'product-management',
        duration: '6 Months',
        description: 'Become a product management expert',
        placementRate: '90%',
        avgPackage: '₹26 LPA',
        color: 'from-emerald-500 to-emerald-600',
        isPopular: false,
        tag: 'Fast Track',
        fullDescription: 'Fast-track product management program for rapid career transition',
        syllabus: ['Product Strategy', 'Roadmapping', 'User Research', 'A/B Testing'],
        projects: ['Fintech PRD Spec', 'Zepto Funnel Optimizer'],
        companies: ['Razorpay', 'Swiggy', 'Zepto']
      }
    }
    
    const program = programs[slug as keyof typeof programs]
    
    if (!program) {
      return HttpResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      )
    }
    
    return HttpResponse.json(program)
  }),
  
  // Dashboard endpoints
  http.get('/api/dashboard/stats', () => {
    return HttpResponse.json({
      careerReadiness: 87,
      interviewReady: 74,
      aiMatchScore: 92,
      salaryPotential: 18,
      readinessTrend: '+12%',
      interviewTrend: '+9%',
      matchTrend: '+5%',
      salaryTrend: '+32%'
    })
  }),
  
  http.get('/api/dashboard/recentActivities', () => {
    return HttpResponse.json([
      {
        id: '1',
        type: 'course_completed',
        title: 'Completed: Python Fundamentals',
        time: '2 hours ago',
        icon: 'BookOpen'
      },
      {
        id: '2',
        type: 'skill_assessed',
        title: 'AI Skills Assessment Completed',
        time: '1 day ago',
        icon: 'Brain'
      },
      {
        id: '3',
        type: 'interview_prepared',
        title: 'Interview prep for AI Engineer role',
        time: '2 days ago',
        icon: 'Users'
      }
    ])
  }),
  
  // Career Analysis endpoints
  http.post('/api/career-analysis/analyze', async ({ request }) => {
    const formData = await request.formData()
    const resume = formData.get('resume')
    
    if (!resume) {
      return HttpResponse.json(
        { error: 'Resume file is required' },
        { status: 400 }
      )
    }
    
    return HttpResponse.json({
      score: 84,
      gaps: ['Cloud Architecture (AWS/GCP)', 'Distributed Caching (Redis)', 'LLM Orchestration'],
      match: 91,
      salary: '₹14–22 LPA',
      roadmap: ['Linux & Shell fundamentals', 'Docker containers', 'Kubernetes & AWS Deployments', 'LLM Wrappers & Prompt API integration']
    })
  }),
  
  // Resume Analyzer endpoints
  http.post('/api/resume-analyzer/analyze', async ({ request }) => {
    const formData = await request.formData()
    const resume = formData.get('resume')
    
    if (!resume) {
      return HttpResponse.json(
        { error: 'Resume file is required' },
        { status: 400 }
      )
    }
    
    return HttpResponse.json({
      atsScore: 84,
      missingKeywords: ['Cloud Architecture', 'Distributed Systems', 'LLM Integration'],
      suggestions: [
        'Add cloud certification projects',
        'Include distributed systems experience',
        'Showcase LLM API integration work'
      ],
      strengths: ['Strong Python foundation', 'Machine Learning projects', 'Full-stack development']
    })
  }),
  
  // Interview Coach endpoints
  http.get('/api/interview-coach/questions', () => {
    return HttpResponse.json([
      {
        id: '1',
        question: 'Tell me about yourself and why you want to work in AI',
        category: 'behavioral',
        difficulty: 'medium',
        time: 60
      },
      {
        id: '2',
        question: 'Explain the difference between supervised and unsupervised learning',
        category: 'technical',
        difficulty: 'hard',
        time: 90
      }
    ])
  }),
  
  // Blog endpoints
  http.get('/api/blog/posts', () => {
    return HttpResponse.json([
      {
        id: '1',
        title: 'The Future of AI in Career Development',
        slug: 'future-of-ai-in-career-development',
        excerpt: 'How AI is revolutionizing career guidance and job matching',
        content: 'Full blog content here...',
        author: 'Dr. Sarah Chen',
        publishedAt: '2024-01-15',
        readTime: 5,
        image: '/images/blog-1.jpg'
      }
    ])
  })
]
