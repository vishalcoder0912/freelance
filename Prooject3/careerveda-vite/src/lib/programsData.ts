export interface Program {
  title: string;
  duration: string;
  price: string;
  color: string;
  desc: string;
  slug: string;
  tag: string;
  bullets: string[];
  modules: string[];
  placementRate: string;
  avgPackage: string;
  isPopular?: boolean;
  mode?: string;
  students?: string;
  highlights?: { label: string; value: string }[];
  whatYouGain?: string[];
  curriculumNote?: string;
}

export const PROGRAMS_DATA: Record<string, Program> = {
  'data-science-with-gen-ai': {
    title: 'PG Program in Data Science with Gen AI',
    duration: '12 Months',
    price: '₹1,50,000',
    color: 'from-pink-500 to-rose-600',
    tag: 'Data Science',
    slug: 'data-science-with-gen-ai',
    desc: 'The ultimate data science bootcamp teaching classical machine learning, PyTorch neural networks, and modern LLMs. Deep dive into NLP, Computer Vision, and MLOps pipelines.',
    bullets: ['AI & ML, Deep Learning, NLP', '15+ Real-World Projects', 'Placement Support'],
    placementRate: '92%',
    avgPackage: '₹12.8 LPA',
    modules: [
      'Python Programming & Math Foundations',
      'Classical Machine Learning with Scikit-Learn',
      'Neural Networks & Deep Learning Core (PyTorch)',
      'Natural Language Processing & Computer Vision',
      'Large Language Models (RAG, Fine-Tuning & Prompting)',
      'MLOps, Docker & Containerized deployments',
      'Capstone: Predict Real-time Churn for 10M Users'
    ]
  },
  'product-management': {
    title: 'PG Program in Product Management',
    duration: '6 Months',
    price: '₹1,20,000',
    color: 'from-violet-500 to-purple-600',
    tag: 'Product',
    slug: 'product-management',
    desc: 'Transition into product leadership by building a robust capstone product and presenting to top industry coaches. Learn product strategy, user research, agile product development, and analytics.',
    bullets: ['Product Strategy & Roadmap', 'Agile, User Research, Analytics', 'Placement Support'],
    placementRate: '90%',
    avgPackage: '₹16.5 LPA',
    modules: [
      'Product Mindset & Core Competencies',
      'User Research, Personas & Journey Mapping',
      'Product Strategy, Roadmapping & Prioritization',
      'Agile Methodologies & Stakeholder Management',
      'Product Metrics, Growth & Cohort Analytics',
      'Capstone Product Pitch to Silicon Valley VCs'
    ]
  },
  'ai-engineering': {
    title: 'PG Program in AI Engineering',
    duration: '12 Months',
    price: '₹1,60,000',
    color: 'from-blue-500 to-indigo-600',
    tag: 'Popular',
    slug: 'ai-engineering',
    isPopular: true,
    desc: 'Equip yourself to build production-grade agentic systems and large-scale deep learning models. Learn RAG architectures, model fine-tuning, and scalable inference deployment.',
    bullets: ['LLMs, Gen AI, MLOps', 'Build AI Products', '100% Placement Support'],
    placementRate: '95%',
    avgPackage: '₹24.7 LPA',
    modules: [
      'Foundational LLM APIs & Vector Databases',
      'Agentic Workflows & Multi-Agent Orchestration',
      'Model Fine-Tuning & Quantization strategies',
      'MLOps, Scalable Inference & Cloud Scaling',
      'Interactive AI Voice Assistants & Mocks',
      'Capstone Project: Complete Agent System'
    ]
  },
  'data-analytics-with-gen-ai': {
    title: 'PG Program in Data Analytics with Gen AI',
    duration: '6 Months',
    price: '₹85,000',
    color: 'from-cyan-500 to-blue-600',
    tag: 'Data Analytics',
    slug: 'data-analytics-with-gen-ai',
    desc: 'Learn to extract actionable business insights from massive datasets using Python, SQL, and data pipelines. Designed in collaboration with global recruitment partners.',
    bullets: ['Python, SQL, Power BI', 'Statistics & Predictive Analytics', 'Placement Support'],
    placementRate: '85%',
    avgPackage: '₹9.8 LPA',
    modules: [
      'Structured Databases & Advanced SQL querying',
      'Data Wrangling & Pipelines with Python',
      'Descriptive & Inferential Statistical modeling',
      'Dashboarding & Visualizations (PowerBI)',
      'Generative AI Prompting for Analytics',
      'Analytics Capstone Case Studies'
    ]
  },
  'investment-banking': {
    title: 'PG Program in Investment Banking',
    duration: '6 Months',
    price: '₹1,40,000',
    color: 'from-amber-500 to-orange-600',
    tag: 'Finance',
    slug: 'investment-banking',
    desc: 'Equip yourself for investment banking, asset management, and equity research roles with certified financial mentors. Learn financial modeling, M&A, and corporate finance.',
    bullets: ['Financial Modeling', 'Valuation, M&A, IPO', 'Placement Support'],
    placementRate: '93%',
    avgPackage: '₹14.6 LPA',
    modules: [
      'Financial Accounting & Statements analysis',
      'Corporate Finance & Capital Structuring',
      'Financial Modeling & DCF Valuations',
      'Mergers & Acquisitions (M&A) dynamics',
      'IPO execution & Equity Capital Markets',
      'Capstone Valuation Project'
    ]
  },
  'business-analytics-with-gen-ai': {
    title: 'PG Program in Business Analytics with GEN AI',
    duration: '6 Months',
    price: '₹1,25,000',
    color: 'from-emerald-500 to-teal-600',
    tag: 'Business Analytics',
    slug: 'business-analytics-with-gen-ai',
    desc: 'Master business analytics with industry-leading tools. Learn to transform data into actionable insights using cutting-edge technologies for strategic decision-making.',
    bullets: ['Business Analytics', 'Python & SQL', 'Placement Support'],
    placementRate: '92%',
    avgPackage: '₹12.8 LPA',
    mode: 'Live Online',
    students: '10,000+',
    isPopular: true,
    modules: [
      'Excel & Data Visualization Fundamentals',
      'SQL for Data Analysis & Business Intelligence',
      'Python Programming for Analytics',
      'Statistical Analysis & Hypothesis Testing',
      'Power BI & Tableau Dashboarding',
      'Machine Learning for Business Applications',
      'Generative AI for Business Analytics',
      'Capstone: Real-World Business Analytics Project'
    ]
  }
};

export const ALL_HIGHLIGHTS = {
  'One-on-One Doubt Resolution': 'Personalized doubt-clearing sessions with expert instructors',
  'Data Analytics Competitions': 'Participate in live competitions to sharpen your skills',
  'Career Guidance & Mentorship': 'Dedicated mentors guide your career journey',
  'Expert-Led Masterclasses': 'Learn from seasoned industry professionals',
  'Live Market Case Studies': 'Solve real-world business challenges',
  '200+ Hrs On-Demand Content': 'Learn at your own pace with recorded sessions',
  '300+ Hrs Interactive Sessions': 'Live online classes for collaborative learning',
  'End-to-End Job Support': 'Complete placement assistance until you get hired',
  'Round-the-Clock Assistance': '24/7 support for all your queries',
  'Customized Curriculum Track': 'Personalized learning paths based on your goals',
  'Skill Evaluation Tests': 'Regular assessments to track your progress',
  'Real-Time Performance Analytics': 'Monitor your learning metrics live',
  'Professional Community Access': 'Join a network of peers and alumni',
  'Self-Paced Learning Options': 'Flexible schedules to balance work and study',
  'Global Alumni Community': 'Connect with alumni worldwide',
  'Mock Interview Training': 'Practice with real interview simulations',
  'Industry-Recognized Certificates': 'Earn certificates valued by employers',
  'Advanced LMS Platform': 'State-of-the-art learning management system'
} as const;

export const COMPANIES = [
  'Google', 'Microsoft', 'Amazon', 'Adobe', 'TCS', 'Infosys',
  'Deloitte', 'Flipkart', 'Razorpay', 'Swiggy', 'Zomato', 'IBM',
  'Cognizant', 'Accenture', 'Wipro', 'Tech Mahindra', 'Paytm',
  'Byju\'s', 'Unacademy', 'Zerodha', 'CRED', 'PhonePe', 'Ola',
  'Uber', 'LinkedIn', 'Salesforce', 'Oracle', 'Intel', 'Cisco',
  'Netflix', 'Spotify'
];

export const REVIEWS = [
  {
    name: 'Anjali Singh',
    role: 'Data Analyst',
    company: 'Deloitte',
    rating: 5,
    text: 'The Data Analytics program with Python and R was fantastic. The statistical modeling and predictive analytics modules were top-notch. Got placed at Deloitte with a great package! Thank you, CareerVeda! Highly recommended!',
    program: 'Data Analytics with GEN AI',
    time: '2 months ago'
  },
  {
    name: 'Arjun Mehta',
    role: 'Associate Product Manager',
    company: 'Finbox',
    rating: 5,
    text: 'CareerVeda\'s Product Management program truly changed my career. After completing the course, I secured a job in Product Management. The program helped me learn problem-solving, user research, feature prioritization, and product planning through practical projects and real-world exposure.',
    program: 'Product Management',
    time: '1 month ago'
  },
  {
    name: 'Kavya Iyer',
    role: 'Senior Analyst',
    company: 'Deloitte',
    rating: 5,
    text: 'The Business Analytics program\'s focus on data visualization and dashboard creation was phenomenal. The IBM and Microsoft certifications added great value to my profile. Thank you CareerVeda!',
    program: 'Business Analytics',
    time: '3 months ago'
  },
  {
    name: 'Vikram Reddy',
    role: 'Analyst',
    company: 'BlackRock',
    rating: 5,
    text: 'CareerVeda\'s Business Analyst program played a key role in shaping my career. After completing the course, I successfully secured a job in the Business Analyst domain. The program strengthened my skills in data analysis, requirement gathering, stakeholder communication.',
    program: 'Business Analyst & GEN AI',
    time: '1 month ago'
  },
  {
    name: 'Devansh Nair',
    role: 'Associate Product Manager',
    company: '',
    rating: 5,
    text: 'My journey with Careerveda has been truly life-changing. After completing their Product Management program, I successfully secured a job in the field. Throughout the course, I learned how to identify the right problems, conduct meaningful user research, design seamless user journeys.',
    program: 'PG Program In Product Management',
    time: '1 month ago'
  },
  {
    name: 'Amit Kumar',
    role: 'Product Manager',
    company: 'Zomato',
    rating: 5,
    text: 'CareerVeda\'s Product Management program transformed my career. The focus on product strategy, user research, and agile methodologies was exactly what I needed. The placement support was excellent!',
    program: 'Product Management',
    time: '4 months ago'
  },
  {
    name: 'Sneha Patel',
    role: 'Senior Business Analyst',
    company: '',
    rating: 5,
    text: 'Completing the Business Analyst program at CareerVeda was a turning point for me. Soon after finishing the course, I was able to land a job in the Business Analyst field. The training helped me master data analysis, documentation, SQL.',
    program: 'Business Analytics with GEN AI',
    time: '1 month ago'
  },
  {
    name: 'Rahul Verma',
    role: 'AI Engineer',
    company: 'Zomato',
    rating: 5,
    text: 'The GEN AI program exceeded all expectations. Working with GPT models and LLMs was incredible. The mentorship from industry experts helped me understand complex AI concepts easily. Now working at Zomato!',
    program: 'GEN AI',
    time: '3 months ago'
  },
  {
    name: 'Priya Sharma',
    role: 'Business Analyst',
    company: 'Deloitte',
    rating: 5,
    text: 'The Business Analytics program was a game-changer! The curriculum covered everything from Excel to Python, and the real-world case studies prepared me perfectly for my role. Landed a job at Deloitte within 2 months!',
    program: 'Business Analytics',
    time: '2 months ago'
  }
];

export const DIFFERENTIATORS = [
  {
    title: 'Industry-Aligned Curriculum',
    desc: 'Our comprehensive curriculum is meticulously crafted in collaboration with industry giants and leading tech companies. Stay ahead with continuously updated content that reflects the latest industry trends, technologies, and best practices.',
    stat: 'Continuously Updated',
    proof: 'Co-created with 40+ Tech leads'
  },
  {
    title: 'Expert Mentorship',
    desc: 'Get personalized guidance from 200+ seasoned industry professionals with 10+ years of experience at top tech companies. Benefit from one-on-one mentoring sessions, weekly doubt-clearing workshops, and personalized feedback.',
    stat: '1-on-1 Access Weekly',
    proof: '200+ FAANG/Industry coaches'
  },
  {
    title: 'Hands-On Learning',
    desc: 'Apply your knowledge through 15+ capstone projects, real-world assignments, and industry simulations. Build an impressive professional portfolio with live projects that demonstrate your practical expertise.',
    stat: '15+ Live Deployments',
    proof: 'GCP & AWS container setups'
  },
  {
    title: '100% Placement Assurance',
    desc: 'Unlock unlimited opportunities with our extensive network of 900+ hiring partners including Fortune 500 companies. Get comprehensive career services including resume building, LinkedIn optimization, mock interviews, and direct referrals.',
    stat: '94% Hiring Success',
    proof: '900+ recruitment channels'
  },
  {
    title: 'High Salary Growth',
    desc: 'Our graduates achieve an impressive average salary increase of 67%, with many securing packages ranging from ₹8 LPA to ₹40 LPA. Experience phenomenal ROI on your investment as you transition into high-paying roles.',
    stat: '67% Avg Hike',
    proof: 'Verified hike parameters'
  },
  {
    title: 'Global Recognized Certification',
    desc: 'Earn prestigious, globally recognized certifications from leading technology companies that add tremendous value to your resume. These industry-validated credentials are respected worldwide and significantly enhance your credibility.',
    stat: 'ISO & Partner Audited',
    proof: 'Secure blockchain verified credentials'
  },
  {
    title: 'Lifetime Career Support',
    desc: 'Your success is our commitment beyond graduation. Access lifetime career guidance, job opportunity alerts, skill upgrade workshops, and alumni networking events. Our support team and mentor network remain available to you forever.',
    stat: '24/7 Portal Access',
    proof: 'Active community channels'
  },
  {
    title: 'Flexible Learning Schedule',
    desc: 'Balance your professional commitments with learning through flexible scheduling options. Choose from weekday or weekend batches, access on-demand video lectures anytime, and learn at your own pace.',
    stat: 'Self-Paced Core',
    proof: '20+ hours theory archives'
  },
  {
    title: 'Industry Case Studies',
    desc: 'Solve real business challenges through comprehensive case studies from Fortune 500 companies across diverse industries. Develop critical thinking, problem-solving, and decision-making skills by tackling actual scenarios.',
    stat: 'Real-World Scenarios',
    proof: 'Fortune 500 case studies'
  }
];

export const CAREER_SUPPORT = [
  {
    title: 'Skill Enhancement Workshops',
    items: [
      'Hands-on workshops focused on in-demand industry skills',
      'Communication and presentation skills training sessions',
      'Leadership development and team collaboration workshops',
      'Real-world project simulations and case study analysis',
      'Soft skills training including time management and productivity'
    ]
  },
  {
    title: 'Bespoke Tutoring Sessions',
    items: [
      'Interactive live classes with industry experts and instructors',
      'On-demand doubt clearing sessions available throughout the week',
      'Subject matter experts for specialized technical assistance',
      'Screen sharing and collaborative problem-solving approach',
      'Recorded sessions available for revision and future reference'
    ]
  },
  {
    title: 'Career aligned Mentorship',
    items: [
      'Personal mentor assigned based on your learning goals',
      'Weekly one-on-one video sessions for personalized guidance',
      'Career strategy planning and professional development roadmap',
      'Regular progress tracking and performance feedback sessions',
      '24/7 mentor access through dedicated communication channels'
    ]
  }
];

export const PROGRAM_DETAILS: Record<string, Partial<Program & {
  mode: string;
  students: string;
  highlights: { label: string; value: string }[];
  whatYouGain: string[];
  curriculumNote: string;
}>> = {
  'business-analytics-with-gen-ai': {
    mode: 'Live Online',
    students: '10,000+',
    whatYouGain: [
      'One-on-One Doubt Resolution Sessions',
      'Data Analytics Competitions',
      'Career Guidance & Mentorship',
      'Expert-Led Masterclasses',
      'Live Market Case Study',
      '200+ Hrs On-Demand Content',
      '300+ Hrs Interactive Sessions',
      'Seasoned Industry Professionals',
      'End-to-End Job Support',
      'Round-the-Clock Assistance',
      'Customized Curriculum Track',
      'Skill Evaluation Tests',
      'Real-Time Performance Analytics',
      'Professional Community Access',
      'Self-Paced Learning Options',
      'Global Alumni Community',
      'Mock Interview Training',
      'Industry-Recognized Certificates',
      'Advanced LMS Platform'
    ],
    highlights: [
      { label: 'Next Batch', value: 'June 21, 2026' },
      { label: 'Duration', value: '6 Months . Live Online' },
      { label: 'Industry Projects', value: '20+' },
      { label: 'Eligibility', value: 'Freshers, Graduates, Experienced' }
    ],
    curriculumNote: 'A carefully crafted curriculum designed by industry experts to make you job-ready.'
  },
  'data-science-with-gen-ai': {
    mode: 'Live Online',
    students: '8,500+',
    whatYouGain: [
      'One-on-One Doubt Resolution Sessions',
      'AI & ML Hackathons',
      'Career Guidance & Mentorship',
      'Expert-Led Masterclasses',
      'Live Industry Case Studies',
      '300+ Hrs On-Demand Content',
      '400+ Hrs Interactive Sessions',
      'Research Paper Publication Support',
      'End-to-End Job Support',
      'Round-the-Clock Assistance',
      'Customized Learning Track',
      'Model Evaluation & Benchmarking Tests',
      'Real-Time Performance Analytics',
      'AI Research Community Access',
      'Self-Paced Learning Options',
      'Global Alumni Community',
      'Mock Interview Training',
      'Industry-Recognized Certificates',
      'Advanced LMS Platform'
    ],
    highlights: [
      { label: 'Next Batch', value: 'June 21, 2026' },
      { label: 'Duration', value: '12 Months . Live Online' },
      { label: 'Industry Projects', value: '15+' },
      { label: 'Eligibility', value: 'Graduates, Working Professionals' }
    ],
    curriculumNote: 'Master the complete AI lifecycle from data preprocessing to model deployment with hands-on projects.'
  },
  'product-management': {
    mode: 'Live Online',
    students: '6,200+',
    whatYouGain: [
      'One-on-One Doubt Resolution Sessions',
      'Product Sprint Competitions',
      'Career Guidance & Mentorship',
      'Expert-Led Masterclasses by CPOs',
      'Live Product Case Studies',
      '200+ Hrs On-Demand Content',
      '200+ Hrs Interactive Sessions',
      'Product Portfolio Building',
      'End-to-End Job Support',
      'Round-the-Clock Assistance',
      'Customized Curriculum Track',
      'Product Sense Evaluation Tests',
      'Real-Time Performance Analytics',
      'Product Manager Community Access',
      'Self-Paced Learning Options',
      'Global Alumni Community',
      'Mock Interview & Whiteboarding Training',
      'Industry-Recognized Certificates',
      'Advanced LMS Platform'
    ],
    highlights: [
      { label: 'Next Batch', value: 'June 21, 2026' },
      { label: 'Duration', value: '6 Months . Live Online' },
      { label: 'Industry Projects', value: '12+' },
      { label: 'Eligibility', value: 'Freshers, Graduates, Experienced' }
    ],
    curriculumNote: 'Learn end-to-end product management from ideation to launch with guidance from industry leaders.'
  },
  'ai-engineering': {
    mode: 'Live Online',
    students: '4,800+',
    whatYouGain: [
      'One-on-One Doubt Resolution Sessions',
      'AI Agent Hackathons',
      'Career Guidance & Mentorship',
      'Expert-Led Masterclasses',
      'Live Industry AI Case Studies',
      '300+ Hrs On-Demand Content',
      '400+ Hrs Interactive Sessions',
      'Production System Design Skills',
      'End-to-End Job Support',
      'Round-the-Clock Assistance',
      'Customized Curriculum Track',
      'Model Performance Evaluation Tests',
      'Real-Time Performance Analytics',
      'AI Engineering Community Access',
      'Self-Paced Learning Options',
      'Global Alumni Community',
      'Mock Interview Training',
      'Industry-Recognized Certificates',
      'Advanced LMS Platform'
    ],
    highlights: [
      { label: 'Next Batch', value: 'June 21, 2026' },
      { label: 'Duration', value: '12 Months . Live Online' },
      { label: 'Industry Projects', value: '18+' },
      { label: 'Eligibility', value: 'Graduates, Working Professionals' }
    ],
    curriculumNote: 'Build production-grade AI systems with hands-on experience in LLMs, RAG, and agentic workflows.'
  },
  'data-analytics-with-gen-ai': {
    mode: 'Live Online',
    students: '12,000+',
    whatYouGain: [
      'One-on-One Doubt Resolution Sessions',
      'Data Analytics Competitions',
      'Career Guidance & Mentorship',
      'Expert-Led Masterclasses',
      'Live Market Case Studies',
      '200+ Hrs On-Demand Content',
      '300+ Hrs Interactive Sessions',
      'Real-World Dashboard Building',
      'End-to-End Job Support',
      'Round-the-Clock Assistance',
      'Customized Curriculum Track',
      'Skill Evaluation Tests',
      'Real-Time Performance Analytics',
      'Professional Community Access',
      'Self-Paced Learning Options',
      'Global Alumni Community',
      'Mock Interview Training',
      'Industry-Recognized Certificates',
      'Advanced LMS Platform'
    ],
    highlights: [
      { label: 'Next Batch', value: 'June 21, 2026' },
      { label: 'Duration', value: '6 Months . Live Online' },
      { label: 'Industry Projects', value: '10+' },
      { label: 'Eligibility', value: 'Freshers, Graduates, Experienced' }
    ],
    curriculumNote: 'Transform raw data into actionable business insights with hands-on analytics projects.'
  },
  'cloud-engineering': {
    mode: 'Live Online',
    students: '4,200+',
    whatYouGain: [
      'One-on-One Doubt Resolution Sessions',
      'Cloud Architecture Competitions',
      'Career Guidance & Mentorship',
      'Expert-Led Masterclasses',
      'Live Cloud Case Studies',
      '200+ Hrs On-Demand Content',
      '300+ Hrs Interactive Sessions',
      'Multi-Cloud Portfolio Building',
      'End-to-End Job Support',
      'Round-the-Clock Assistance',
      'Customized Curriculum Track',
      'Cloud Certification Prep Tests',
      'Real-Time Performance Analytics',
      'Cloud Professional Community Access',
      'Self-Paced Learning Options',
      'Global Alumni Community',
      'Mock Interview Training',
      'Industry-Recognized Certificates',
      'Advanced LMS Platform'
    ],
    highlights: [
      { label: 'Next Batch', value: 'June 21, 2026' },
      { label: 'Duration', value: '6 Months . Live Online' },
      { label: 'Industry Projects', value: '12+' },
      { label: 'Eligibility', value: 'Freshers, Graduates, Working Professionals' }
    ],
    curriculumNote: 'Build enterprise-grade cloud infrastructure with hands-on multi-cloud deployments.'
  },
  'cyber-security': {
    mode: 'Live Online',
    students: '3,800+',
    whatYouGain: [
      'One-on-One Doubt Resolution Sessions',
      'CTF & Security Hackathons',
      'Career Guidance & Mentorship',
      'Expert-Led Masterclasses',
      'Live Security Case Studies',
      '200+ Hrs On-Demand Content',
      '300+ Hrs Interactive Sessions',
      'Security Lab Portfolio Building',
      'End-to-End Job Support',
      'Round-the-Clock Assistance',
      'Customized Curriculum Track',
      'Security Skills Assessment Tests',
      'Real-Time Performance Analytics',
      'Security Professional Community Access',
      'Self-Paced Learning Options',
      'Global Alumni Community',
      'Mock Interview Training',
      'Industry-Recognized Certificates',
      'Advanced LMS Platform'
    ],
    highlights: [
      { label: 'Next Batch', value: 'June 21, 2026' },
      { label: 'Duration', value: '12 Months . Live Online' },
      { label: 'Industry Projects', value: '15+' },
      { label: 'Eligibility', value: 'Graduates, Working Professionals' }
    ],
    curriculumNote: 'Master enterprise security with hands-on penetration testing and incident response training.'
  },
  'investment-banking': {
    mode: 'Live Online',
    students: '3,500+',
    whatYouGain: [
      'One-on-One Doubt Resolution Sessions',
      'Finance & Valuation Competitions',
      'Career Guidance & Mentorship',
      'Expert-Led Masterclasses by Bankers',
      'Live M&A Case Studies',
      '200+ Hrs On-Demand Content',
      '250+ Hrs Interactive Sessions',
      'Financial Modeling Portfolio',
      'End-to-End Job Support',
      'Round-the-Clock Assistance',
      'Customized Curriculum Track',
      'Financial Modeling Evaluation Tests',
      'Real-Time Performance Analytics',
      'Finance Professional Community Access',
      'Self-Paced Learning Options',
      'Global Alumni Community',
      'Mock Interview & Deal Teaser Training',
      'Industry-Recognized Certificates',
      'Advanced LMS Platform'
    ],
    highlights: [
      { label: 'Next Batch', value: 'June 21, 2026' },
      { label: 'Duration', value: '6 Months . Live Online' },
      { label: 'Industry Projects', value: '10+' },
      { label: 'Eligibility', value: 'Graduates, Finance Professionals' }
    ],
    curriculumNote: 'Master financial modeling, valuation, and M&A with real-world deal simulations.'
  },
  'cloud-engineering': {
    title: 'PG Program in Cloud Engineering',
    duration: '6 Months',
    price: '₹1,10,000',
    color: 'from-green-500 to-teal-600',
    tag: 'Cloud',
    slug: 'cloud-engineering',
    desc: 'Master cloud infrastructure, DevOps practices, and enterprise-grade cloud solutions with hands-on experience.',
    bullets: ['AWS & Azure cloud mastery', 'DevOps & containerization', 'Real-world cloud projects'],
    placementRate: '88%',
    avgPackage: '₹11.2 LPA',
    modules: [
      'Cloud Fundamentals & Architecture Design',
      'AWS Solutions Architecture',
      'Microsoft Azure Administration',
      'DevOps & CI/CD Pipeline Automation',
      'Containerization with Docker & Kubernetes',
      'Infrastructure as Code with Terraform',
      'Cloud Security & Compliance',
      'Capstone: Multi-Cloud Enterprise Deployment'
    ]
  },
  'cyber-security': {
    title: 'PG Program in Cyber Security',
    duration: '12 Months',
    price: '₹1,30,000',
    color: 'from-red-500 to-rose-600',
    tag: 'Security',
    slug: 'cyber-security',
    desc: 'Comprehensive cybersecurity program covering threat analysis, vulnerability assessment, and security architecture.',
    bullets: ['Network security & ethical hacking', 'Cloud security & compliance', 'Incident response & forensics'],
    placementRate: '91%',
    avgPackage: '₹15.8 LPA',
    modules: [
      'Network Security Fundamentals',
      'Ethical Hacking & Penetration Testing',
      'Cloud Security Architecture',
      'Incident Response & Digital Forensics',
      'Security Compliance & Governance',
      'Cryptography & Identity Management',
      'SIEM & Security Operations',
      'Capstone: Enterprise Security Audit & Remediation'
    ]
  }
};

export const PROGRAMS_LIST = Object.values(PROGRAMS_DATA);
