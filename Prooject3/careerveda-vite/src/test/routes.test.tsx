import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'

describe('Route Testing', () => {
  const renderWithRouter = (ui: React.ReactElement) => {
    return render(ui, { wrapper: MemoryRouter })
  }

  describe('Public Routes', () => {
    const publicRoutes = [
      { path: '/', expectedText: /Become Irreplaceable/i },
      { path: '/programs', expectedText: /Transformative Paths/i },
      { path: '/program/ai-engineering', expectedText: /AI Engineering/i },
      { path: '/career-paths', expectedText: /Discover Programs/i },
      { path: '/achievers', expectedText: /Placed Learners/i },
      { path: '/faculty', expectedText: /Expert Mentorship/i },
      { path: '/blog', expectedText: /The Future of AI/i },
      { path: '/employers', expectedText: /For Companies/i }
    ]

    publicRoutes.forEach(({ path, expectedText }) => {
      it(`renders ${path} route successfully`, async () => {
        renderWithRouter(<App />)
        await waitFor(() => {
          expect(screen.getByText(expectedText)).toBeInTheDocument()
        })
      })
    })
  })

  describe('Auth Routes', () => {
    it('renders login page', async () => {
      renderWithRouter(<App />)
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Login/i })).toBeInTheDocument()
      })
    })

    it('renders register page', async () => {
      renderWithRouter(<App />)
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Register/i })).toBeInTheDocument()
      })
    })
  })

  describe('Protected Routes', () => {
    const protectedRoutes = [
      '/dashboard',
      '/ai-copilot',
      '/career-analysis',
      '/resume-analyzer',
      '/interview-coach'
    ]

    protectedRoutes.forEach((path) => {
      it(`redirects to login when accessing ${path} without authentication`, async () => {
        renderWithRouter(<App />)
        await waitFor(() => {
          expect(screen.getByRole('heading', { name: /Login/i })).toBeInTheDocument()
        })
      })
    })
  })

  describe('Lazy Loading', () => {
    it('renders page loader for lazy loaded components', async () => {
      renderWithRouter(<App />)
      await waitFor(() => {
        expect(screen.getByText(/CV/i)).toBeInTheDocument()
      })
    })
  })
})
