import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Tag, ArrowRight, Send } from 'lucide-react';

const POSTS_DETAIL = {
  'how-to-pivot-into-ai-engineering': {
    title: 'How to Pivot into AI Engineering in 2026: A Step-by-Step Guide',
    desc: 'The demand for AI Engineers has skyrocketed. Here is a comprehensive 6-month roadmap detailing math foundations, deep learning frameworks, and how to build a portfolio that passes recruiter reviews.',
    content: `The AI Engineering field is growing at an unprecedented rate. With companies across every sector investing heavily in artificial intelligence, the demand for skilled AI engineers has never been higher.

## Why AI Engineering?

AI Engineers are responsible for designing, developing, and deploying machine learning models and AI systems. Unlike data scientists who focus on analysis, AI engineers build production-ready systems.

## The 6-Month Roadmap

### Month 1-2: Foundations
- Mathematics (Linear Algebra, Calculus, Statistics)
- Python Programming
- Git and Version Control

### Month 3-4: Core ML
- Classical Machine Learning
- Deep Learning with PyTorch
- Computer Vision & NLP

### Month 5-6: Production
- MLOps & Deployment
- LLMs & RAG Pipelines
- Portfolio Building`,
    author: 'Dr. Arindam Sen',
    date: 'June 18, 2026',
    category: 'Career Guide',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
    tags: ['AI', 'Engineering', 'Career Switch', 'Machine Learning']
  },
  'demystifying-ats': {
    title: 'Demystifying ATS: How Recruiters Use AI to Filter Resumes',
    desc: 'Most resumes are rejected by applicant tracking algorithms before a human ever sees them. Learn the common keyword formatting mistakes.',
    content: `Applicant Tracking Systems (ATS) are used by 98% of Fortune 500 companies to screen resumes. Understanding how they work is crucial for job seekers.

## What is ATS?

An ATS is software that automates the hiring process by parsing, storing, and ranking resumes based on predefined criteria.

## Common ATS Mistakes

### 1. Complex Formatting
Tables, columns, and graphics confuse ATS parsers.

### 2. Missing Keywords
Without the right keywords, your resume won't rank high.

### 3. File Format Issues
PDFs can sometimes cause parsing errors.`,
    author: 'Megha Gupta',
    date: 'June 12, 2026',
    category: 'Resume Tips',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800',
    tags: ['ATS', 'Resume', 'Job Search', 'Recruitment']
  },
  'top-5-interview-questions-mlops': {
    title: 'Top 5 Interview Questions for MLOps Engineers at Tier-1 Giants',
    desc: 'We analyzed mock interview responses from Goldman Sachs, Razorpay, and Swiggy recruiters to identify the exact system design questions.',
    content: `MLOps is one of the fastest-growing roles in tech. Here are the top questions asked by top companies.

## 1. Design a Model Deployment Pipeline
Explain how you would automate the deployment of ML models from development to production.

## 2. Monitoring & Observability
How do you monitor model drift and data quality in production?

## 3. Scaling Inference
Describe strategies for serving models at scale with low latency.

## 4. CI/CD for ML
How is ML CI/CD different from traditional CI/CD?

## 5. Infrastructure as Code
Explain your experience with Terraform, Kubernetes, and Docker for ML workloads.`,
    author: 'Sneha Rao',
    date: 'June 05, 2026',
    category: 'Interview Prep',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
    tags: ['MLOps', 'Interview', 'System Design', 'AI']
  }
};

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = slug ? POSTS_DETAIL[slug] : null;

  if (!post) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#FAFAFC] gap-4">
        <h2 className="text-xl font-bold text-slate-800">Article Not Found</h2>
        <button onClick={() => navigate('/blog')} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold">View All Articles</button>
      </div>
    );
  }

  const relatedPosts = Object.values(POSTS_DETAIL).filter(p => p.category === post.category && p.title !== post.title).slice(0, 2);

  return (
    <div className="py-16 px-6 max-w-4xl mx-auto bg-[#FAFAFC] grid-bg-light">
      <button onClick={() => navigate('/blog')} className="mb-8 p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1.5 text-xs font-bold shadow-sm">
        <ArrowLeft size={14} /> Back to Blog
      </button>

      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
        <img src={post.image} className="w-full h-64 md:h-96 object-cover" alt={post.title} />
        <div className="p-8 space-y-6">
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-400">
            <span className="flex items-center gap-1"><User size={12} /> {post.author}</span>
            <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
            <span className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px]">{post.category}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">{post.title}</h1>
          <p className="text-slate-500 text-sm leading-relaxed">{post.desc}</p>

          <div className="prose prose-sm max-w-none text-slate-600">
            {post.content.split('\n').map((line, i) => {
              if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-bold text-slate-800 mt-6 mb-2">{line.replace('## ', '')}</h2>;
              if (line.startsWith('### ')) return <h3 key={i} className="text-base font-bold text-slate-800 mt-4 mb-1">{line.replace('### ', '')}</h3>;
              if (line.startsWith('- ')) return <li key={i} className="text-sm text-slate-600 ml-4">{line.replace('- ', '')}</li>;
              if (line.trim() === '') return <br key={i} />;
              return <p key={i} className="text-sm text-slate-600 leading-relaxed">{line}</p>;
            })}
          </div>

          <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
            {post.tags.map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-medium text-slate-500">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="mt-12 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-8 text-white text-center space-y-4">
        <h3 className="text-xl font-bold">Get Weekly Career Insights</h3>
        <p className="text-sm text-indigo-100">Subscribe to our newsletter for career tips, roadmap advice, and job opportunities.</p>
        <div className="flex max-w-md mx-auto">
          <input type="email" placeholder="your@email.com" className="flex-1 px-4 py-2.5 rounded-l-xl border-none focus:outline-none text-slate-800 text-sm" />
          <button className="px-5 py-2.5 bg-slate-900 text-white rounded-r-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800">
            Subscribe <Send size={14} />
          </button>
        </div>
      </div>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <div className="mt-12 space-y-6">
          <h3 className="text-lg font-bold text-slate-800">Related Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedPosts.map((rp, i) => (
              <button key={i} onClick={() => navigate(`/blog/${Object.keys(POSTS_DETAIL).find(k => POSTS_DETAIL[k].title === rp.title)}`)}
                className="bg-white border border-slate-100 rounded-2xl p-6 text-left hover:border-indigo-200 transition-all space-y-2">
                <h4 className="text-sm font-bold text-slate-800">{rp.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-2">{rp.desc}</p>
                <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1">Read More <ArrowRight size={12} /></span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}