import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import HeroSection from '../components/HeroSection'

vi.mock('react-router-dom', async () => {
  const actual = await import('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn()
  }
})

describe('Hero Section Component', () => {
  const renderWithRouter = (ui: React.ReactElement) => {
    return render(ui, { wrapper: MemoryRouter })
  }

  it('renders hero title and subtitle', () => {
    renderWithRouter(<HeroSection />)
    expect(screen.getByText('Become Irreplaceable')).toBeInTheDocument()
    expect(screen.getByText('Your AI Career Operating System')).toBeInTheDocument()
  })

  it('renders start analysis button', () => {
    renderWithRouter(<HeroSection />)
    expect(screen.getByRole('button', { name: /Start Free Career Analysis/i })).toBeInTheDocument()
  })

  it('renders watch demo button', () => {
    renderWithRouter(<HeroSection />)
    expect(screen.getByRole('button', { name: /Watch Demo/i })).toBeInTheDocument()
  })

  it('navigates to career analysis when start analysis button is clicked', async () => {
    const mockNavigate = vi.mocked(require('react-router-dom').useNavigate)
    renderWithRouter(<HeroSection />)
    
    const button = screen.getByRole('button', { name: /Start Free Career Analysis/i })
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/career-analysis')
    })
  })

  it('scrolls to copilot section when watch demo button is clicked', async () => {
    const mockScrollIntoView = vi.fn()
    Object.defineProperty(Element.prototype, 'scrollIntoView', {
      value: mockScrollIntoView
    })
    
    renderWithRouter(<HeroSection />)
    
    const button = screen.getByRole('button', { name: /Watch Demo/i })
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
    })
  })

  it('renders social proof section', () => {
    renderWithRouter(<HeroSection />)
    expect(screen.getByText('4.9/5 ⭐')).toBeInTheDocument()
    expect(screen.getByText('Trusted by 12,000+ learners')).toBeInTheDocument()
  })

  it('renders partner logos', () => {
    renderWithRouter(<HeroSection />)
    expect(screen.getByAltText('Google')).toBeInTheDocument()
    expect(screen.getByAltText('Microsoft')).toBeInTheDocument()
    expect(screen.getByAltText('Amazon')).toBeInTheDocument()
  })

  it('renders statistics bar', () => {
    renderWithRouter(<HeroSection />)
    expect(screen.getByText('12,000+')).toBeInTheDocument()
    expect(screen.getByText('Placed Learners')).toBeInTheDocument()
    expect(screen.getByText('900+')).toBeInTheDocument()
    expect(screen.getByText('Hiring Partners')).toBeInTheDocument()
    expect(screen.getByText('67%')).toBeInTheDocument()
    expect(screen.getByText('Average Hike')).toBeInTheDocument()
    expect(screen.getByText('120+')).toBeInTheDocument()
    expect(screen.getByText('Verified Capstones')).toBeInTheDocument()
    expect(screen.getByText('200+')).toBeInTheDocument()
    expect(screen.getByText('FAANG Advisors')).toBeInTheDocument()
  })

  it('renders AI-powered badge', () => {
    renderWithRouter(<HeroSection />)
    expect(screen.getByText('AI Powered Career Ecosystem')).toBeInTheDocument()
  }

  it('renders orbit animation container', () => {
    renderWithRouter(<HeroSection />)
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument()
  })

  it('renders career snapshot card', () => {
    renderWithRouter(<HeroSection />)
    expect(screen.getByText('Your Career Snapshot')).toBeInTheDocument()
    expect(screen.getByText('Career Readiness')).toBeInTheDocument()
    expect(screen.getByText('Interview Ready')).toBeInTheDocument()
    expect(screen.getByText('AI Match Score')).toBeInTheDocument()
    expect(screen.getByText('Salary Potential')).toBeInTheDocument()
  })

  it('renders career readiness metrics', () => {
    renderWithRouter(<HeroSection />)
    expect(screen.getByText('87%')).toBeInTheDocument()
    expect(screen.getByText('↑ 12% this month')).toBeInTheDocument()
    expect(screen.getByText('74%')).toBeInTheDocument()
    expect(screen.getByText('↑ 9% this month')).toBeInTheDocument()
    expect(screen.getByText('92%')).toBeInTheDocument()
    expect(screen.getByText('Tag: AI Engineer')).toBeInTheDocument()
    expect(screen.getByText('₹18 LPA')).toBeInTheDocument()
    expect(screen.getByText('↑ 32% vs current')).toBeInTheDocument()
  })

  it('navigates to career analysis when career snapshot button is clicked', async () => {
    const mockNavigate = vi.mocked(require('react-router-dom').useNavigate)
    renderWithRouter(<HeroSection />)
    
    const button = screen.getByText('View Full Analysis')
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/career-analysis')
    })
  })
})
