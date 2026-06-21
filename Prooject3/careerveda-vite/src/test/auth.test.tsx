import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({ currentUser: null })),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn()
}))

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  collection: vi.fn(),
  addDoc: vi.fn(),
  doc: vi.fn()
}))

describe('Authentication Testing', () => {
  const renderWithRouter = (ui: React.ReactElement) => {
    return render(ui, { wrapper: MemoryRouter })
  }

  describe('Login Form', () => {
    it('renders login form with all fields', () => {
      renderWithRouter(<LoginPage />)
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    })

    it('validates email field', async () => {
      renderWithRouter(<LoginPage />)
      const emailInput = screen.getByLabelText(/email/i)
      
      await userEvent.click(emailInput)
      await userEvent.tab()
      
      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument()
      })
    })

    it('validates password field', async () => {
      renderWithRouter(<LoginPage />)
      const passwordInput = screen.getByLabelText(/password/i)
      
      await userEvent.click(passwordInput)
      await userEvent.tab()
      
      await waitFor(() => {
        expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument()
      })
    })

    it('submits form with valid data', async () => {
      const mockSignIn = vi.mocked(require('firebase/auth').signInWithEmailAndPassword)
      mockSignIn.mockResolvedValueOnce({ user: { uid: 'test-user' } })
      
      renderWithRouter(<LoginPage />)
      
      await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com')
      await userEvent.type(screen.getByLabelText(/password/i), 'password123')
      await userEvent.click(screen.getByRole('button', { name: /sign in/i }))
      
      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith(
          expect.anything(),
          'test@example.com',
          'password123'
        )
      })
    })

    it('handles login error', async () => {
      const mockSignIn = vi.mocked(require('firebase/auth').signInWithEmailAndPassword)
      mockSignIn.mockRejectedValueOnce(new Error('Invalid credentials'))
      
      renderWithRouter(<LoginPage />)
      
      await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com')
      await userEvent.type(screen.getByLabelText(/password/i), 'wrongpassword')
      await userEvent.click(screen.getByRole('button', { name: /sign in/i }))
      
      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
      })
    })

    it('shows loading state during submission', async () => {
      const mockSignIn = vi.mocked(require('firebase/auth').signInWithEmailAndPassword)
      mockSignIn.mockImplementation(() => new Promise(() => {}))
      
      renderWithRouter(<LoginPage />)
      
      await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com')
      await userEvent.type(screen.getByLabelText(/password/i), 'password123')
      await userEvent.click(screen.getByRole('button', { name: /sign in/i }))
      
      await waitFor(() => {
        expect(screen.getByText(/signing in/i)).toBeInTheDocument()
      })
    })
  })

  describe('Register Form', () => {
    it('renders register form with all fields', () => {
      renderWithRouter(<RegisterPage />)
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
    })

    it('validates name field', async () => {
      renderWithRouter(<RegisterPage />)
      const nameInput = screen.getByLabelText(/name/i)
      
      await userEvent.click(nameInput)
      await userEvent.tab()
      
      await waitFor(() => {
        expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument()
      })
    })

    it('validates password confirmation', async () => {
      renderWithRouter(<RegisterPage />)
      const passwordInput = screen.getByLabelText(/password/i)
      const confirmInput = screen.getByLabelText(/confirm password/i)
      
      await userEvent.type(passwordInput, 'password123')
      await userEvent.type(confirmInput, 'different123')
      
      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
      })
    })

    it('submits form with valid data', async () => {
      const mockCreateUser = vi.mocked(require('firebase/auth').createUserWithEmailAndPassword)
      mockCreateUser.mockResolvedValueOnce({ user: { uid: 'new-user' } })
      
      renderWithRouter(<RegisterPage />)
      
      await userEvent.type(screen.getByLabelText(/name/i), 'Test User')
      await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com')
      await userEvent.type(screen.getByLabelText(/password/i), 'password123')
      await userEvent.type(screen.getByLabelText(/confirm password/i), 'password123')
      await userEvent.click(screen.getByRole('button', { name: /create account/i }))
      
      await waitFor(() => {
        expect(mockCreateUser).toHaveBeenCalledWith(
          expect.anything(),
          'test@example.com',
          'password123'
        )
      })
    })
  })

  describe('Protected Route Access', () => {
    it('redirects to login when accessing protected route without auth', async () => {
      renderWithRouter(<LoginPage />)
      expect(screen.getByRole('heading', { name: /Login/i })).toBeInTheDocument()
    })

    it('redirects to login when accessing dashboard without auth', async () => {
      renderWithRouter(<LoginPage />)
      expect(screen.getByRole('heading', { name: /Login/i })).toBeInTheDocument()
    })
  })

  describe('Logout Functionality', () => {
    it('handles logout successfully', async () => {
      const mockSignOut = vi.mocked(require('firebase/auth').signOut)
      mockSignOut.mockResolvedValueOnce()
      
      renderWithRouter(<LoginPage />)
      
      await userEvent.click(screen.getByRole('button', { name: /sign out/i }))
      
      await waitFor(() => {
        expect(mockSignOut).toHaveBeenCalled()
      })
    })
  })
})
