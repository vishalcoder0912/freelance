import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'

describe('Navbar Component', () => {
  const renderWithRouter = (ui: React.ReactElement) => {
    return render(ui, { wrapper: MemoryRouter })
  }

  it('renders logo and brand name', () => {
    renderWithRouter(<Navbar />)
    expect(screen.getByText('CareerVeda')).toBeInTheDocument()
    expect(screen.getByText('AI Career OS')).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    renderWithRouter(<Navbar />)
    expect(screen.getByRole('link', { name: /Programs/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Career Paths/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Our Achievers/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Our Faculty/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Our Blog/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /For Employers/i })).toBeInTheDocument()
  })

  it('renders login button', () => {
    renderWithRouter(<Navbar />)
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument()
  })

  it('renders start analysis button', () => {
    renderWithRouter(<Navbar />)
    expect(screen.getByRole('button', { name: /Start Free Analysis/i })).toBeInTheDocument()
  })

  it('shows mobile menu button on mobile', () => {
    renderWithRouter(<Navbar />)
    expect(screen.getByRole('button', { name: /menu/i })).toBeInTheDocument()
  })

  it('toggles mobile menu when menu button is clicked', async () => {
    renderWithRouter(<Navbar />)
    const menuButton = screen.getByRole('button', { name: /menu/i })
    
    fireEvent.click(menuButton)
    
    await waitFor(() => {
      expect(screen.getByText('Programs')).toBeInTheDocument()
    })
  })

  it('closes mobile menu when link is clicked', async () => {
    renderWithRouter(<Navbar />)
    const menuButton = screen.getByRole('button', { name: /menu/i })
    
    fireEvent.click(menuButton)
    fireEvent.click(screen.getByRole('link', { name: /Programs/i }))
    
    await waitFor(() => {
      expect(screen.queryByText('Programs')).not.toBeInTheDocument()
    })
  })

  it('navigates to login page when login button is clicked', async () => {
    renderWithRouter(<Navbar />)
    const loginButton = screen.getByRole('button', { name: /Login/i })
    
    fireEvent.click(loginButton)
    
    await waitFor(() => {
      expect(window.location.pathname).toBe('/login')
    })
  })

  it('navigates to career analysis when start analysis button is clicked', async () => {
    renderWithRouter(<Navbar />)
    const analysisButton = screen.getByRole('button', { name: /Start Free Analysis/i })
    
    fireEvent.click(analysisButton)
    
    await waitFor(() => {
      expect(window.location.pathname).toBe('/career-analysis')
    })
  })

  it('shows programs dropdown on hover (desktop)', async () => {
    renderWithRouter(<Navbar />)
    const programsButton = screen.getByRole('button', { name: /Programs/i })
    
    fireEvent.mouseEnter(programsButton)
    
    await waitFor(() => {
      expect(screen.getByText('Business Analytics with Gen AI')).toBeInTheDocument()
    })
  })

  it('closes programs dropdown when mouse leaves', async () => {
    renderWithRouter(<Navbar />)
    const programsButton = screen.getByRole('button', { name: /Programs/i })
    
    fireEvent.mouseEnter(programsButton)
    fireEvent.mouseLeave(programsButton)
    
    await waitFor(() => {
      expect(screen.queryByText('Business Analytics with Gen AI')).not.toBeInTheDocument()
    })
  })

  it('navigates to program details when program link is clicked', async () => {
    renderWithRouter(<Navbar />)
    const programsButton = screen.getByRole('button', { name: /Programs/i })
    
    fireEvent.mouseEnter(programsButton)
    const programLink = screen.getByRole('link', { name: /Business Analytics with Gen AI/i })
    
    fireEvent.click(programLink)
    
    await waitFor(() => {
      expect(window.location.pathname).toBe('/program/business-analytics-with-gen-ai')
    })
  })
})
