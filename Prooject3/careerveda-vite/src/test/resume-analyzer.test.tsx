import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ResumeAnalyzerPage from '../pages/ResumeAnalyzerPage'

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
          email: 'test@example.com'
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

describe('Resume Analyzer Page Testing', () => {
  const renderWithRouter = (ui: React.ReactElement) => {
    return render(ui, { wrapper: MemoryRouter })
  }

  it('renders resume analyzer form', async () => {
    renderWithRouter(<ResumeAnalyzerPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Resume Analyzer')).toBeInTheDocument()
      expect(screen.getByText('Upload and Analyze Your Resume')).toBeInTheDocument()
    })
  })

  it('renders file upload section', async () => {
    renderWithRouter(<ResumeAnalyzerPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Upload Resume')).toBeInTheDocument()
      expect(screen.getByText('Drag and drop or click to upload')).toBeInTheDocument()
    })
  })

  it('renders ATS score section', async () => {
    renderWithRouter(<ResumeAnalyzerPage />)
    
    await waitFor(() => {
      expect(screen.getByText('ATS Score')).toBeInTheDocument()
      expect(screen.getByText('84%')).toBeInTheDocument()
      expect(screen.getByText('Good Match')).toBeInTheDocument()
    })
  })

  it('renders missing keywords section', async () => {
    renderWithRouter(<ResumeAnalyzerPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Missing Keywords')).toBeInTheDocument()
      expect(screen.getByText('Cloud Architecture')).toBeInTheDocument()
      expect(screen.getByText('Distributed Systems')).toBeInTheDocument()
      expect(screen.getByText('LLM Integration')).toBeInTheDocument()
    })
  })

  it('renders suggestions section', async () => {
    renderWithRouter(<ResumeAnalyzerPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Improvement Suggestions')).toBeInTheDocument()
      expect(screen.getByText('Add cloud certification projects')).toBeInTheDocument()
      expect(screen.getByText('Include distributed systems experience')).toBeInTheDocument()
      expect(screen.getByText('Showcase LLM API integration work')).toBeInTheDocument()
    })
  })

  it('renders strengths section', async () => {
    renderWithRouter(<ResumeAnalyzerPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Strengths')).toBeInTheDocument()
      expect(screen.getByText('Strong Python foundation')).toBeInTheDocument()
      expect(screen.getByText('Machine Learning projects')).toBeInTheDocument()
      expect(screen.getByText('Full-stack development')).toBeInTheDocument()
    })
  })

  it('renders analyze button', async () => {
    renderWithRouter(<ResumeAnalyzerPage />)
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Analyze Resume/i })).toBeInTheDocument()
    })
  })

  it('handles file upload', async () => {
    renderWithRouter(<ResumeAnalyzerPage />)
    
    const file = new File(['test resume content'], 'test-resume.pdf', { type: 'application/pdf' })
    const input = screen.getByLabelText(/upload resume/i)
    
    await waitFor(() => {
      fireEvent.change(input, { target: { files: [file] } })
    })
    
    expect(input.files?.[0]).toBe(file)
  })

  it('shows loading state during analysis', async () => {
    renderWithRouter(<ResumeAnalyzerPage />)
    
    const file = new File(['test resume content'], 'test-resume.pdf', { type: 'application/pdf' })
    const input = screen.getByLabelText(/upload resume/i)
    const analyzeButton = screen.getByRole('button', { name: /Analyze Resume/i })
    
    await waitFor(() => {
      fireEvent.change(input, { target: { files: [file] } })
      fireEvent.click(analyzeButton)
    })
    
    await waitFor(() => {
      expect(screen.getByText(/Analyzing your resume/i)).toBeInTheDocument()
    })
  })

  it('renders analysis results after submission', async () => {
    renderWithRouter(<ResumeAnalyzerPage />)
    
    const file = new File(['test resume content'], 'test-resume.pdf', { type: 'application/pdf' })
    const input = screen.getByLabelText(/upload resume/i)
    const analyzeButton = screen.getByRole('button', { name: /Analyze Resume/i })
    
    await waitFor(() => {
      fireEvent.change(input, { target: { files: [file] } })
      fireEvent.click(analyzeButton)
    })
    
    await waitFor(() => {
      expect(screen.getByText('Analysis Complete!')).toBeInTheDocument()
      expect(screen.getByText('84%')).toBeInTheDocument()
      expect(screen.getByText('Good Match')).toBeInTheDocument()
    })
  })

  it('handles file type validation', async () => {
    renderWithRouter(<ResumeAnalyzerPage />)
    
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' })
    const input = screen.getByLabelText(/upload resume/i)
    
    await waitFor(() => {
      fireEvent.change(input, { target: { files: [file] } })
    })
    
    await waitFor(() => {
      expect(screen.getByText(/please upload a PDF file/i)).toBeInTheDocument()
    })
  })

  it('handles file size validation', async () => {
    renderWithRouter(<ResumeAnalyzerPage />)
    
    const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large-resume.pdf', { type: 'application/pdf' })
    const input = screen.getByLabelText(/upload resume/i)
    
    await waitFor(() => {
      fireEvent.change(input, { target: { files: [largeFile] } })
    })
    
    await waitFor(() => {
      expect(screen.getByText(/file size must be less than 10MB/i)).toBeInTheDocument()
    })
  })

  it('renders download report button', async () => {
    renderWithRouter(<ResumeAnalyzerPage />)
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Download Report/i })).toBeInTheDocument()
    })
  })

  it('handles download report action', async () => {
    const mockDownload = vi.fn()
    global.URL.createObjectURL = vi.fn(() => 'mock-url')
    global.URL.revokeObjectURL = vi.fn()
    
    renderWithRouter(<ResumeAnalyzerPage />)
    
    await waitFor(() => {
      const downloadButton = screen.getByRole('button', { name: /Download Report/i })
      fireEvent.click(downloadButton)
    })
    
    expect(mockDownload).toHaveBeenCalled()
  })

  it('renders share results button', async () => {
    renderWithRouter(<ResumeAnalyzerPage />)
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Share Results/i })).toBeInTheDocument()
    })
  })

  it('handles share results action', async () => {
    const mockShare = vi.fn().mockResolvedValueOnce({ shared: true })
    
    renderWithRouter(<ResumeAnalyzerPage />)
    
    await waitFor(() => {
      const shareButton = screen.getByRole('button', { name: /Share Results/i })
      fireEvent.click(shareButton)
    })
    
    await waitFor(() => {
      expect(mockShare).toHaveBeenCalled()
    })
  })

  it('renders retry button after error', async () => {
    const mockAnalyze = vi.fn().mockRejectedValueOnce(new Error('Analysis failed'))
    
    renderWithRouter(<ResumeAnalyzerPage />)
    
    const file = new File(['test resume content'], 'test-resume.pdf', { type: 'application/pdf' })
    const input = screen.getByLabelText(/upload resume/i)
    const analyzeButton = screen.getByRole('button', { name: /Analyze Resume/i })
    
    await waitFor(() => {
      fireEvent.change(input, { target: { files: [file] } })
      fireEvent.click(analyzeButton)
    })
    
    await waitFor(() => {
      expect(screen.getByText(/analysis failed/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Retry/i })).toBeInTheDocument()
    })
  })

  it('handles retry action', async () => {
    const mockAnalyze = vi.fn()
      .mockRejectedValueOnce(new Error('Analysis failed'))
      .mockResolvedValueOnce({ success: true })
    
    renderWithRouter(<ResumeAnalyzerPage />)
    
    const file = new File(['test resume content'], 'test-resume.pdf', { type: 'application/pdf' })
    const input = screen.getByLabelText(/upload resume/i)
    const analyzeButton = screen.getByRole('button', { name: /Analyze Resume/i })
    
    await waitFor(() => {
      fireEvent.change(input, { target: { files: [file] } })
      fireEvent.click(analyzeButton)
    })
    
    await waitFor(() => {
      const retryButton = screen.getByRole('button', { name: /Retry/i })
      fireEvent.click(retryButton)
    })
    
    await waitFor(() => {
      expect(mockAnalyze).toHaveBeenCalledTimes(2)
    })
  })

  it('renders progress bar during analysis', async () => {
    renderWithRouter(<ResumeAnalyzerPage />)
    
    const file = new File(['test resume content'], 'test-resume.pdf', { type: 'application/pdf' })
    const input = screen.getByLabelText(/upload resume/i)
    const analyzeButton = screen.getByRole('button', { name: /Analyze Resume/i })
    
    await waitFor(() => {
      fireEvent.change(input, { target: { files: [file] } })
      fireEvent.click(analyzeButton)
    })
    
    await waitFor(() => {
      expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })
  })

  it('renders analysis complete message', async () => {
    renderWithRouter(<ResumeAnalyzerPage />)
    
    const file = new File(['test resume content'], 'test-resume.pdf', { type: 'application/pdf' })
    const input = screen.getByLabelText(/upload resume/i)
    const analyzeButton = screen.getByRole('button', { name: /Analyze Resume/i })
    
    await waitFor(() => {
      fireEvent.change(input, { target: { files: [file] } })
      fireEvent.click(analyzeButton)
    })
    
    await waitFor(() => {
      expect(screen.getByText('Analysis Complete!')).toBeInTheDocument()
    })
  })
})
