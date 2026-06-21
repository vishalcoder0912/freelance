import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import DashboardPage from '../pages/DashboardPage'

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
          email: 'test@example.com',
          enrolledPrograms: ['ai-engineering', 'product-management'],
          completedModules: 12,
          totalModules: 45,
          currentStreak: 5,
          lastActive: new Date().toISOString()
        })
      })
    })),
    get: vi.fn().mockResolvedValueOnce({
      docs: [
        { id: '1', data: () => ({ title: 'Python Fundamentals', completed: true, progress: 100 }) },
        { id: '2', data: () => ({ title: 'Machine Learning Basics', completed: false, progress: 45 }) },
        { id: '3', data: () => ({ title: 'Deep Learning', completed: false, progress: 0 }) }
      ]
    })
  }))
}))

vi.mock('@/lib/firebase', () => ({
  auth: vi.fn(() => ({ currentUser: { uid: 'test-user' } })),
  db: vi.fn(() => ({ collection: vi.fn() }))
}))

describe('Dashboard Page Testing', () => {
  const renderWithRouter = (ui: React.ReactElement) => {
    return render(ui, { wrapper: MemoryRouter })
  }

  it('renders dashboard with user data', async () => {
    renderWithRouter(<DashboardPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Welcome back, Test User!')).toBeInTheDocument()
      expect(screen.getByText('test@example.com')).toBeInTheDocument()
    })
  })

  it('renders progress widgets', async () => {
    renderWithRouter(<DashboardPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Career Readiness')).toBeInTheDocument()
      expect(screen.getByText('Interview Ready')).toBeInTheDocument()
      expect(screen.getByText('AI Match Score')).toBeInTheDocument()
      expect(screen.getByText('Salary Potential')).toBeInTheDocument()
    })
  })

  it('renders course cards', async () => {
    renderWithRouter(<DashboardPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Python Fundamentals')).toBeInTheDocument()
      expect(screen.getByText('Machine Learning Basics')).toBeInTheDocument()
      expect(screen.getByText('Deep Learning')).toBeInTheDocument()
    })
  })

  it('renders notifications', async () => {
    renderWithRouter(<DashboardPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Course Completed')).toBeInTheDocument()
      expect(screen.getByText('New Assignment Available')).toBeInTheDocument()
      expect(screen.getByText('Interview Prep Reminder')).toBeInTheDocument()
    })
  })

  it('renders analytics cards', async () => {
    renderWithRouter(<DashboardPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Learning Progress')).toBeInTheDocument()
      expect(screen.getByText('Skill Assessment')).toBeInTheDocument()
      expect(screen.getByText('Placement Statistics')).toBeInTheDocument()
    })
  })

  it('handles enrollment data', async () => {
    renderWithRouter(<DashboardPage />)
    
    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument() // 2 enrolled programs
      expect(screen.getByText('AI Engineering')).toBeInTheDocument()
      expect(screen.getByText('Product Management')).toBeInTheDocument()
    })
  })

  it('renders progress bars for courses', async () => {
    renderWithRouter(<DashboardPage />)
    
    await waitFor(() => {
      const progressBars = screen.getAllByRole('progressbar')
      expect(progressBars).toHaveLength(3)
    })
  })

  it('navigates to course when clicked', async () => {
    const mockNavigate = vi.mocked(require('react-router-dom').useNavigate)
    renderWithRouter(<DashboardPage />)
    
    await waitFor(() => {
      const courseCard = screen.getByText('Python Fundamentals').closest('div')
      fireEvent.click(courseCard!)
    })
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/course/python-fundamentals')
    })
  })

  it('shows completion status for courses', async () => {
    renderWithRouter(<DashboardPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Completed')).toBeInTheDocument()
      expect(screen.getByText('In Progress')).toBeInTheDocument()
      expect(screen.getByText('Not Started')).toBeInTheDocument()
    })
  })

  it('renders streak counter', async () => {
    renderWithRouter(<DashboardPage />)
    
    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument() // current streak
      expect(screen.getByText('day streak')).toBeInTheDocument()
    })
  })

  it('renders last active date', async () => {
    renderWithRouter(<DashboardPage />)
    
    await waitFor(() => {
      expect(screen.getByText(/Last active:/)).toBeInTheDocument()
    })
  })

  it('handles empty enrolled programs', async () => {
    vi.mocked(require('firebase/firestore').collection).mockReturnValueOnce({
      doc: vi.fn(() => ({
        get: vi.fn().mockResolvedValueOnce({
          exists: true,
          data: () => ({
            name: 'Test User',
            email: 'test@example.com',
            enrolledPrograms: [],
            completedModules: 0,
            totalModules: 0,
            currentStreak: 0,
            lastActive: new Date().toISOString()
          })
        })
      }))),
      get: vi.fn().mockResolvedValueOnce({ docs: [] })
    })
    
    renderWithRouter(<DashboardPage />)
    
    await waitFor(() => {
      expect(screen.getByText('0')).toBeInTheDocument() // 0 enrolled programs
      expect(screen.getByText('Start Your First Program')).toBeInTheDocument()
    })
  })

  it('handles API error gracefully', async () => {
    vi.mocked(require('firebase/firestore').collection).mockReturnValueOnce({
      doc: vi.fn(() => ({
        get: vi.fn().mockRejectedValueOnce(new Error('Failed to fetch user data'))
      }))
    })
    
    renderWithRouter(<DashboardPage />)
    
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })

  it('refreshes data on manual trigger', async () => {
    renderWithRouter(<DashboardPage />)
    
    const refreshButton = screen.getByRole('button', { name: /refresh/i })
    fireEvent.click(refreshButton)
    
    await waitFor(() => {
      expect(screen.getByText('Dashboard refreshed')).toBeInTheDocument()
    })
  })

  it('opens course details modal', async () => {
    renderWithRouter(<DashboardPage />)
    
    await waitFor(() => {
      const courseCard = screen.getByText('Python Fundamentals').closest('div')
      fireEvent.click(courseCard!)
    })
    
    await waitFor(() => {
      expect(screen.getByText('Course Details')).toBeInTheDocument()
    })
  })
})
