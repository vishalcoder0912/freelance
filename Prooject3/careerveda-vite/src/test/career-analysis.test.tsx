import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CareerAnalysisPage from '../pages/CareerAnalysisPage'

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({ currentUser: { uid: 'test-user' } })),
  onAuthStateChanged: vi.fn(callback => {
    callback({ uid: 'test-user' })
    return vi.fn()
  })
}))

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  collection: vi.fn(() => ({
    doc: vi.fn(() => ({
      get: vi.fn().mockResolvedValueOnce({
        exists: true,
        data: () => ({
          name: 'Test User',
          skills: ['Python', 'Machine Learning', 'React'],
          experience: '2 years',
          interests: ['AI', 'Web Development']
        })
      })
    })),
    add: vi.fn().mockResolvedValueOnce({ id: 'new-analysis' })
  }))
}))

vi.mock('@/lib/firebase', () => ({
  auth: vi.fn(() => ({ currentUser: { uid: 'test-user' } })),
  db: vi.fn(() => ({ collection: vi.fn() }))
}))

describe('Career Analysis Page Testing', () => {
  const renderWithRouter = (ui: React.ReactElement) => {
    return render(ui, { wrapper: MemoryRouter })
  }

  it('renders career analysis form', async () => {
    renderWithRouter(<CareerAnalysisPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Career Analysis')).toBeInTheDocument()
      expect(screen.getByText('Analyze Your Career Potential')).toBeInTheDocument()
    })
  })

  it('renders skill assessment section', async () => {
    renderWithRouter(<CareerAnalysisPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Skill Assessment')).toBeInTheDocument()
      expect(screen.getByText('Python')).toBeInTheDocument()
      expect(screen.getByText('Machine Learning')).toBeInTheDocument()
      expect(screen.getByText('React')).toBeInTheDocument()
    })
  })

  it('renders experience section', async () => {
    renderWithRouter(<CareerAnalysisPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Experience')).toBeInTheDocument()
      expect(screen.getByText('2 years')).toBeInTheDocument()
    })
  })

  it('renders interests section', async () => {
    renderWithRouter(<CareerAnalysisPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Interests')).toBeInTheDocument()
      expect(screen.getByText('AI')).toBeInTheDocument()
      expect(screen.getByText('Web Development')).toBeInTheDocument()
    })
  })

  it('renders resume upload section', async () => {
    renderWithRouter(<CareerAnalysisPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Upload Resume')).toBeInTheDocument()
      expect(screen.getByText('Drag and drop your resume here')).toBeInTheDocument()
    })
  })

  it('renders analyze button', async () => {
    renderWithRouter(<CareerAnalysisPage />)
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Analyze Career/i })).toBeInTheDocument()
    })
  })

  it('handles resume file upload', async () => {
    renderWithRouter(<CareerAnalysisPage />)
    
    const file = new File(['test resume content'], 'test-resume.pdf', { type: 'application/pdf' })
    const input = screen.getByLabelText(/upload resume/i)
    
    await waitFor(() => {
      fireEvent.change(input, { target: { files: [file] } })
    })
    
    expect(input.files?.[0]).toBe(file)
  })

  it('shows loading state during analysis', async () => {
    renderWithRouter(<CareerAnalysisPage />)
    
    const analyzeButton = screen.getByRole('button', { name: /Analyze Career/i })
    fireEvent.click(analyzeButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Analyzing your career/i)).toBeInTheDocument()
    })
  })

  it('renders analysis results after submission', async () => {
    renderWithRouter(<CareerAnalysisPage />)
    
    const analyzeButton = screen.getByRole('button', { name: /Analyze Career/i })
    fireEvent.click(analyzeButton)
    
    await waitFor(() => {
      expect(screen.getByText('Analysis Complete!')).toBeInTheDocument()
      expect(screen.getByText('AI Engineer')).toBeInTheDocument()
      expect(screen.getByText('₹24 LPA')).toBeInTheDocument()
      expect(screen.getByText('92% Match')).toBeInTheDocument()
    })
  })

  it('renders skill gaps section', async () => {
    renderWithRouter(<CareerAnalysisPage />)
    
    const analyzeButton = screen.getByRole('button', { name: /Analyze Career/i })
    fireEvent.click(analyzeButton)
    
    await waitFor(() => {
      expect(screen.getByText('Skill Gaps')).toBeInTheDocument()
      expect(screen.getByText('Cloud Architecture')).toBeInTheDocument()
      expect(screen.getByText('Distributed Systems')).toBeInTheDocument()
      expect(screen.getByText('LLM Integration')).toBeInTheDocument()
    })
  })

  it('renders roadmap section', async () => {
    renderWithRouter(<CareerAnalysisPage />)
    
    const analyzeButton = screen.getByRole('button', { name: /Analyze Career/i })
    fireEvent.click(analyzeButton)
    
    await waitFor(() => {
      expect(screen.getByText('Recommended Roadmap')).toBeInTheDocument()
      expect(screen.getByText('Linux & Shell fundamentals')).toBeInTheDocument()
      expect(screen.getByText('Docker containers')).toBeInTheDocument()
      expect(screen.getByText('Kubernetes & AWS Deployments')).toBeInTheDocument()
    })
  })

  it('navigates to program when enroll button is clicked', async () => {
    const mockNavigate = vi.mocked(require('react-router-dom').useNavigate)
    renderWithRouter(<CareerAnalysisPage />)
    
    const analyzeButton = screen.getByRole('button', { name: /Analyze Career/i })
    fireEvent.click(analyzeButton)
    
    await waitFor(() => {
      const enrollButton = screen.getByRole('button', { name: /Enroll Now/i })
      fireEvent.click(enrollButton)
    })
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/program/ai-engineering')
    })
  })

  it('handles analysis error', async () => {
    vi.mocked(require('firebase/firestore').collection).mockReturnValueOnce({
      add: vi.fn().mockRejectedValueOnce(new Error('Analysis failed'))
    })
    
    renderWithRouter(<CareerAnalysisPage />)
    
    const analyzeButton = screen.getByRole('button', { name: /Analyze Career/i })
    fireEvent.click(analyzeButton)
    
    await waitFor(() => {
      expect(screen.getByText(/analysis failed/i)).toBeInTheDocument()
    })
  })

  it('renders career score gauge', async () => {
    renderWithRouter(<CareerAnalysisPage />)
    
    const analyzeButton = screen.getByRole('button', { name: /Analyze Career/i })
    fireEvent.click(analyzeButton)
    
    await waitFor(() => {
      expect(screen.getByText('Career Score')).toBeInTheDocument()
      expect(screen.getByText('84/100')).toBeInTheDocument()
    })
  })

  it('renders match percentage', async () => {
    renderWithRouter(<CareerAnalysisPage />)
    
    const analyzeButton = screen.getByRole('button', { name: /Analyze Career/i })
    fireEvent.click(analyzeButton)
    
    await waitFor(() => {
      expect(screen.getByText('91% Match')).toBeInTheDocument()
    })
  })

  it('renders salary potential', async () => {
    renderWithRouter(<CareerAnalysisPage />)
    
    const analyzeButton = screen.getByRole('button', { name: /Analyze Career/i })
    fireEvent.click(analyzeButton)
    
    await waitFor(() => {
      expect(screen.getByText('₹14–22 LPA')).toBeInTheDocument()
    })
  })

  it('handles form validation', async () => {
    renderWithRouter(<CareerAnalysisPage />)
    
    const analyzeButton = screen.getByRole('button', { name: /Analyze Career/i })
    fireEvent.click(analyzeButton)
    
    await waitFor(() => {
      expect(screen.getByText(/please fill all required fields/i)).toBeInTheDocument()
    })
  })

  it('shows success message after analysis', async () => {
    renderWithRouter(<CareerAnalysisPage />)
    
    const analyzeButton = screen.getByRole('button', { name: /Analyze Career/i })
    fireEvent.click(analyzeButton)
    
    await waitFor(() => {
      expect(screen.getByText('Analysis completed successfully!')).toBeInTheDocument()
    })
  })
})
