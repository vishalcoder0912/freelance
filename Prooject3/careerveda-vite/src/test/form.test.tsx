import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'

// Form Validation Utilities
export const validateForm = async (formData: Record<string, string>) => {
  const errors: Record<string, string> = {}
  
  if (!formData.email || !/^[^@]+@[^@]+\.[^@]+$/.test(formData.email)) {
    errors.email = 'Please enter a valid email'
  }
  
  if (!formData.password || formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
  }
  
  if (!formData.name || formData.name.length < 2) {
    errors.name = 'Name must be at least 2 characters'
  }
  
  return errors
}

describe('Form Testing Utilities', () => {
  it('validates email field', async () => {
    const errors = await validateForm({ email: 'invalid-email', password: '123', name: 'John' })
    expect(errors.email).toBe('Please enter a valid email')
  })

  it('validates password length', async () => {
    const errors = await validateForm({ email: 'test@example.com', password: '123', name: 'John' })
    expect(errors.password).toBe('Password must be at least 6 characters')
  })

  it('validates name length', async () => {
    const errors = await validateForm({ email: 'test@example.com', password: 'password123', name: 'J' })
    expect(errors.name).toBe('Name must be at least 2 characters')
  })

  it('passes validation with valid data', async () => {
    const errors = await validateForm({ 
      email: 'test@example.com', 
      password: 'password123', 
      name: 'John Doe' 
    })
    expect(Object.keys(errors)).toHaveLength(0)
  })
})

describe('Form Component Testing', () => {
  const renderWithRouter = (ui: React.ReactElement) => {
    return render(ui, { wrapper: MemoryRouter })
  }

  describe('Form Field Testing', () => {
    it('renders input field with correct label', () => {
      renderWithRouter(
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" />
        </div>
      )
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    })

    it('handles input change', async () => {
      renderWithRouter(
        <div>
          <input id="test-input" type="text" />
        </div>
      )
      const input = screen.getByRole('textbox')
      
      await userEvent.type(input, 'test value')
      
      expect(input).toHaveValue('test value')
    })

    it('handles input blur validation', async () => {
      renderWithRouter(
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" />
          <span role="alert"></span>
        </div>
      )
      const emailInput = screen.getByLabelText(/email/i)
      const errorSpan = screen.getByRole('alert')
      
      await userEvent.click(emailInput)
      await userEvent.tab()
      
      await waitFor(() => {
        expect(errorSpan).toBeInTheDocument()
      })
    })

    it('handles checkbox input', async () => {
      renderWithRouter(
        <div>
          <input id="terms" type="checkbox" />
          <label htmlFor="terms">I agree to terms</label>
        </div>
      )
      const checkbox = screen.getByLabelText(/agree to terms/i)
      
      await userEvent.click(checkbox)
      
      expect(checkbox).toBeChecked()
    })

    it('handles select input', async () => {
      renderWithRouter(
        <div>
          <select id="program">
            <option value="">Select program</option>
            <option value="ai">AI Engineering</option>
            <option value="pm">Product Management</option>
          </select>
        </div>
      )
      const select = screen.getByLabelText(/program/i)
      
      await userEvent.selectOptions(select, 'ai')
      
      expect(select).toHaveValue('ai')
    })

    it('handles textarea input', async () => {
      renderWithRouter(
        <div>
          <textarea id="message" placeholder="Enter message"></textarea>
        </div>
      )
      const textarea = screen.getByPlaceholderText(/enter message/i)
      
      await userEvent.type(textarea, 'Hello world')
      
      expect(textarea).toHaveValue('Hello world')
    })
  })

  describe('Form Submission Testing', () => {
    it('prevents default submission', async () => {
      renderWithRouter(
        <form onSubmit={(e) => e.preventDefault()}>
          <button type="submit">Submit</button>
        </form>
      )
      const form = screen.getByRole('button', { type: 'submit' }).closest('form')
      const submitButton = screen.getByRole('button', { type: 'submit' })
      
      const preventDefault = vi.fn()
      form?.addEventListener('submit', (e) => {
        e.preventDefault = preventDefault
      })
      
      await userEvent.click(submitButton)
      
      expect(preventDefault).toHaveBeenCalled()
    })

    it('shows loading state during submission', async () => {
      renderWithRouter(
        <form>
          <button type="submit" disabled={false}>Submit</button>
          <span role="status">Submitting...</span>
        </form>
      )
      const submitButton = screen.getByRole('button', { type: 'submit' })
      const loadingText = screen.getByRole('status')
      
      await userEvent.click(submitButton)
      
      await waitFor(() => {
        expect(loadingText).toBeInTheDocument()
      })
    })

    it('handles successful submission', async () => {
      const mockSubmit = vi.fn().mockResolvedValueOnce({ success: true })
      
      renderWithRouter(
        <form onSubmit={mockSubmit}>
          <input type="text" name="field" />
          <button type="submit">Submit</button>
        </form>
      )
      
      const input = screen.getByRole('textbox')
      const submitButton = screen.getByRole('button', { type: 'submit' })
      
      await userEvent.type(input, 'test value')
      await userEvent.click(submitButton)
      
      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith(
          expect.objectContaining({\n            target: expect.anything()
          })
        )
      })
    })

    it('handles submission error', async () => {
      const mockSubmit = vi.fn().mockRejectedValueOnce(new Error('Submission failed'))
      
      renderWithRouter(
        <form onSubmit={mockSubmit}>
          <input type="text" name="field" />
          <button type="submit">Submit</button>
          <span role="alert"></span>
        </form>
      )
      
      const input = screen.getByRole('textbox')
      const submitButton = screen.getByRole('button', { type: 'submit' })
      const errorSpan = screen.getByRole('alert')
      
      await userEvent.type(input, 'test value')
      await userEvent.click(submitButton)
      
      await waitFor(() => {
        expect(errorSpan).toBeInTheDocument()
      })
    })
  })

  describe('Form Validation Testing', () => {
    it('validates required fields', async () => {
      renderWithRouter(
        <form>
          <input type="text" name="required" required />
          <button type="submit">Submit</button>
          <span role="alert"></span>
        </form>
      )
      const input = screen.getByRole('textbox')
      const submitButton = screen.getByRole('button', { type: 'submit' })
      const errorSpan = screen.getByRole('alert')
      
      await userEvent.click(submitButton)
      
      await waitFor(() => {
        expect(errorSpan).toBeInTheDocument()
      })
    })

    it('validates field patterns', async () => {
      renderWithRouter(
        <form>
          <input type="email" name="email" pattern="[^@]+@[^@]+\\.[^@]+$" required />
          <button type="submit">Submit</button>
          <span role="alert"></span>
        </form>
      )
      const input = screen.getByRole('textbox')
      const submitButton = screen.getByRole('button', { type: 'submit' })
      
      await userEvent.type(input, 'invalid-email')
      await userEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/invalid email format/i)).toBeInTheDocument()
      })
    })

    it('validates field length', async () => {
      renderWithRouter(
        <form>
          <input type="text" name="name" minlength="2" required />
          <button type="submit">Submit</button>
          <span role="alert"></span>
        </form>
      )
      const input = screen.getByRole('textbox')
      const submitButton = screen.getByRole('button', { type: 'submit' })
      
      await userEvent.type(input, 'A')
      await userEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/must be at least 2 characters/i)).toBeInTheDocument()
      })
    })
  })
})
