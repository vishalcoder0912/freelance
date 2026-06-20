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
  }
};

export const PROGRAMS_LIST = Object.values(PROGRAMS_DATA);
