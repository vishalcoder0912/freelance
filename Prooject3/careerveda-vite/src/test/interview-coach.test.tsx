import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import InterviewCoachPage from '../pages/InterviewCoachPage'

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
    add: vi.fn().mockResolvedValueOnce({ id: 'new-session' }),
    get: vi.fn().mockResolvedValueOnce({
      docs: [
        { id: '1', data: () => ({ question: 'Tell me about yourself', category: 'behavioral', difficulty: 'medium' }) },
        { id: '2', data: () => ({ question: 'Explain system design', category: 'technical', difficulty: 'hard' }) }
      ]
    })
  }))
}))

vi.mock('@/lib/firebase', () => ({
  auth: vi.fn(() => ({ currentUser: { uid: 'test-user' } })),
  db: vi.fn(() => ({ collection: vi.fn() }))
}))

describe('Interview Coach Page Testing', () => {
  const renderWithRouter = (ui: React.ReactElement) => {
    return render(ui, { wrapper: MemoryRouter })
  }

  it('renders interview coach interface', async () => {
    renderWithRouter(<InterviewCoachPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Interview Coach')).toBeInTheDocument()
      expect(screen.getByText('Practice Your Interviews')).toBeInTheDocument()
    })
  })

  it('renders session creation section', async () => {
    renderWithRouter(<InterviewCoachPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Create New Session')).toBeInTheDocument()
      expect(screen.getByText('Job Role')).toBeInTheDocument()
      expect(screen.getByText('Experience Level')).toBeInTheDocument()
    })
  })

  it('renders question rendering section', async () => {
    renderWithRouter(<InterviewCoachPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Question 1 of 2')).toBeInTheDocument()
      expect(screen.getByText('Tell me about yourself')).toBeInTheDocument()
      expect(screen.getByText('Behavioral')).toBeInTheDocument()
      expect(screen.getByText('Medium')).toBeInTheDocument()
    })
  })

  it('renders scorecard display', async () => {
    renderWithRouter(<InterviewCoachPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Scorecard')).toBeInTheDocument()
      expect(screen.getByText('Communication')).toBeInTheDocument()
      expect(screen.getByText('Technical Knowledge')).toBeInTheDocument()
      expect(screen.getByText('Problem Solving')).toBeInTheDocument()
    })
  })

  it('renders session history', async () => {
    renderWithRouter(<InterviewCoachPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Session History')).toBeInTheDocument()
      expect(screen.getByText('AI Engineer Session')).toBeInTheDocument()
      expect(screen.getByText('Product Manager Session')).toBeInTheDocument()
    })
  })

  it('handles session creation', async () => {
    renderWithRouter(<InterviewCoachPage />)
    
    const jobRoleInput = screen.getByLabelText(/job role/i)
    const experienceSelect = screen.getByLabelText(/experience level/i)
    const createButton = screen.getByRole('button', { name: /create session/i })
    
    await waitFor(() => {
      fireEvent.change(jobRoleInput, { target: { value: 'AI Engineer' } })
      fireEvent.change(experienceSelect, { target: { value: 'intermediate' } })
      fireEvent.click(createButton)
    })
    
    await waitFor(() => {
      expect(screen.getByText('Session created successfully')).toBeInTheDocument()
    })
  })

  it('renders question navigation', async () => {
    renderWithRouter(<InterviewCoachPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Previous')).toBeInTheDocument()
      expect(screen.getByText('Next')).toBeInTheDocument()
      expect(screen.getByText('Skip')).toBeInTheDocument()
    })
  })

  it('handles question navigation', async () => {
    renderWithRouter(<InterviewCoachPage />)
    
    await waitFor(() => {
      const nextButton = screen.getByRole('button', { name: /next/i })
      fireEvent.click(nextButton)
    })
    
    await waitFor(() => {
      expect(screen.getByText('Question 2 of 2')).toBeInTheDocument()
      expect(screen.getByText('Explain system design')).toBeInTheDocument()
    })
  })

  it('handles answer submission', async () => {
    renderWithRouter(<InterviewCoachPage />)
    
    await waitFor(() => {
      const answerInput = screen.getByPlaceholderText(/type your answer/i)
      const submitButton = screen.getByRole('button', { name: /submit answer/i })
      
      fireEvent.change(answerInput, { target: { value: 'My answer...' } })
      fireEvent.click(submitButton)
    })
    
    await waitFor(() => {
      expect(screen.getByText('Answer submitted successfully')).toBeInTheDocument()
    })
  })

  it('renders feedback section', async () => {
    renderWithRouter(<InterviewCoachPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Feedback')).toBeInTheDocument()
      expect(screen.getByText('Your answer is good. Try to include specific examples.')).toBeInTheDocument()
    })
  })

  it('handles score updates', async () => {
    renderWithRouter(<InterviewCoachPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Score: 0/100')).toBeInTheDocument()
    })
    
    const answerInput = screen.getByPlaceholderText(/type your answer/i)
    const submitButton = screen.getByRole('button', { name: /submit answer/i })
    
    fireEvent.change(answerInput, { target: { value: 'My answer...' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Score: 85/100')).toBeInTheDocument()
    })
  })

  it('renders timer', async () => {
    renderWithRouter(<InterviewCoachPage />)
    
    await waitFor(() => {
      expect(screen.getByText(/Time remaining:/)).toBeInTheDocument()
      expect(screen.getByText('10:00')).toBeInTheDocument()
    })
  })

  it('handles timer countdown', async () => {
    renderWithRouter(<InterviewCoachPage />)
    
    await waitFor(() => {
      expect(screen.getByText('10:00')).toBeInTheDocument()
    })
    
    await new Promise(resolve => setTimeout(resolve, 1100))
    
    await waitFor(() => {
      expect(screen.getByText('9:59')).toBeInTheDocument()
    })
  })

  it('handles session completion', async () => {
    renderWithRouter(<InterviewCoachPage />)
    
    await waitFor(() => {
      const nextButton = screen.getByRole('button', { name: /next/i })
      fireEvent.click(nextButton)
    })
    
    await waitFor(() => {
      expect(screen.getByText('Session Complete!')).toBeInTheDocument()
      expect(screen.getByText('View Results')).toBeInTheDocument()
    })
  })

  it('handles session sharing', async () => {
    renderWithRouter(<InterviewCoachPage />)
    
    await waitFor(() => {
      const shareButton = screen.getByRole('button', { name: /share session/i })
      fireEvent.click(shareButton)
    })
    
    await waitFor(() => {
      expect(screen.getByText('Session shared successfully')).toBeInTheDocument()
    })
  })

  it('handles session export', async () => {
    renderWithRouter(<InterviewCoachPage />)
    
    await waitFor(() => {
      const exportButton = screen.getByRole('button', { name: /export results/i })
      fireEvent.click(exportButton)
    })
    
    await waitFor(() => {
      expect(screen.getByText('Results exported successfully')).toBeInTheDocument()
    })
  })

  it('renders question categories', async () => {
    renderWithRouter(<InterviewCoachPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Behavioral')).toBeInTheDocument()
      expect(screen.getByText('Technical')).toBeInTheDocument()
      expect(screen.getByText('System Design')).toBeInTheDocument()
      expect(screen.getByText('HR')).toBeInTheDocument()
    })
  })

  it('filters questions by category', async () => {
    renderWithRouter(<InterviewCoachPage />)
    
    await waitFor(() => {
      const categoryFilter = screen.getByLabelText(/category filter/i)
      fireEvent.change(categoryFilter, { target: { value: 'behavioral' } })
    })
    
    await waitFor(() => {
      expect(screen.getByText('Tell me about yourself')).toBeInTheDocument()
      expect(screen.queryByText('Explain system design')).not.toBeInTheDocument()
    })
  })

  it('handles question difficulty filter', async () => {
    renderWithRouter(<InterviewCoachPage />)
    
    await waitFor(() => {
      const difficultyFilter = screen.getByLabelText(/difficulty filter/i)
      fireEvent.change(difficultyFilter, { target: { value: 'hard' } })
    })
    
    await waitFor(() => {
      expect(screen.getByText('Explain system design')).toBeInTheDocument()
      expect(screen.queryByText('Tell me about yourself')).not.toBeInTheDocument()
    })
  })

  it('handles session pause', async () => {
    renderWithRouter(<InterviewCoachPage />)
    
    await waitFor(() => {
      const pauseButton = screen.getByRole('button', { name: /pause/i })
      fireEvent.click(pauseButton)
    })
    
    await waitFor(() => {
      expect(screen.getByText('Session paused')).toBeInTheDocument()
    })
  })

  it('handles session resume', async () => {
    renderWithRouter(<InterviewCoachPage />)
    
    await waitFor(() => {
      const pauseButton = screen.getByRole('button', { name: /pause/i })
      fireEvent.click(pauseButton)
    })
    
    await waitFor(() => {
      const resumeButton = screen.getByRole('button', { name: /resume/i })
      fireEvent.click(resumeButton)
    })
    
    await waitFor(() => {
      expect(screen.getByText('Session resumed')).toBeInTheDocument()
    })
  })
})
