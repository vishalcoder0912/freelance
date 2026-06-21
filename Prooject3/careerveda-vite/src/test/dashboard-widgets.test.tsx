import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import DashboardWidgets from '../components/DashboardWidgets'

describe('Dashboard Widgets Component', () => {
  const renderWithRouter = (ui: React.ReactElement) => {
    return render(ui, { wrapper: MemoryRouter })
  }

  const mockStats = {
    careerReadiness: 87,
    interviewReady: 74,
    aiMatchScore: 92,
    salaryPotential: 18,
    readinessTrend: '+12%',
    interviewTrend: '+9%',
    matchTrend: '+5%',
    salaryTrend: '+32%'
  }

  it('renders career readiness widget', () => {
    renderWithRouter(<DashboardWidgets stats={mockStats} />)
    expect(screen.getByText('Career Readiness')).toBeInTheDocument()
    expect(screen.getByText('87%')).toBeInTheDocument()
    expect(screen.getByText('↑ 12% this month')).toBeInTheDocument()
  })

  it('renders interview readiness widget', () => {
    renderWithRouter(<DashboardWidgets stats={mockStats} />)
    expect(screen.getByText('Interview Ready')).toBeInTheDocument()
    expect(screen.getByText('74%')).toBeInTheDocument()
    expect(screen.getByText('↑ 9% this month')).toBeInTheDocument()
  })

  it('renders AI match score widget', () => {
    renderWithRouter(<DashboardWidgets stats={mockStats} />)
    expect(screen.getByText('AI Match Score')).toBeInTheDocument()
    expect(screen.getByText('92%')).toBeInTheDocument()
    expect(screen.getByText('Tag: AI Engineer')).toBeInTheDocument()
  })

  it('renders salary potential widget', () => {
    renderWithRouter(<DashboardWidgets stats={mockStats} />)
    expect(screen.getByText('Salary Potential')).toBeInTheDocument()
    expect(screen.getByText('₹18 LPA')).toBeInTheDocument()
    expect(screen.getByText('↑ 32% vs current')).toBeInTheDocument()
  })

  it('renders sub-metrics on hover', async () => {
    renderWithRouter(<DashboardWidgets stats={mockStats} />)
    
    const careerWidget = screen.getByText('Career Readiness').closest('div')
    fireEvent.mouseEnter(careerWidget!)
    
    await waitFor(() => {
      expect(screen.getByText('Communication')).toBeInTheDocument()
      expect(screen.getByText('Technical')).toBeInTheDocument()
      expect(screen.getByText('Projects')).toBeInTheDocument()
      expect(screen.getByText('Portfolio')).toBeInTheDocument()
    })
  }

  it('hides sub-metrics when not hovering', async () => {
    renderWithRouter(<DashboardWidgets stats={mockStats} />)
    
    const careerWidget = screen.getByText('Career Readiness').closest('div')
    fireEvent.mouseLeave(careerWidget!)
    
    await waitFor(() => {
      expect(screen.queryByText('Communication')).not.toBeInTheDocument()
    })
  )

  it('renders progress bars for sub-metrics', async () => {
    renderWithRouter(<DashboardWidgets stats={mockStats} />)
    
    const careerWidget = screen.getByText('Career Readiness').closest('div')
    fireEvent.mouseEnter(careerWidget!)
    
    await waitFor(() => {
      expect(screen.getByText('70%')).toBeInTheDocument()
      expect(screen.getByText('90%')).toBeInTheDocument()
      expect(screen.getByText('80%')).toBeInTheDocument()
      expect(screen.getByText('85%')).toBeInTheDocument()
    })
  })

  it('navigates to career analysis when view full analysis is clicked', async () => {
    const mockNavigate = vi.mocked(require('react-router-dom').useNavigate)
    renderWithRouter(<DashboardWidgets stats={mockStats} />)
    
    const button = screen.getByText('View Full Analysis')
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/career-analysis')
    })
  })

  it('renders with correct colors', () => {
    renderWithRouter(<DashboardWidgets stats={mockStats} />)
    
    const careerWidget = screen.getByText('Career Readiness').closest('div')
    expect(careerWidget).toHaveClass('text-[#5B3DF5]')
    
    const interviewWidget = screen.getByText('Interview Ready').closest('div')
    expect(interviewWidget).toHaveClass('text-emerald-600')
    
    const matchWidget = screen.getByText('AI Match Score').closest('div')
    expect(matchWidget).toHaveClass('text-[#00C2FF]')
    
    const salaryWidget = screen.getByText('Salary Potential').closest('div')
    expect(salaryWidget).toHaveClass('text-amber-500')
  })

  it('handles zero values', () => {
    const zeroStats = {
      ...mockStats,
      careerReadiness: 0,
      interviewReady: 0,
      aiMatchScore: 0,
      salaryPotential: 0
    }
    
    renderWithRouter(<DashboardWidgets stats={zeroStats} />)
    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('handles 100 values', () => {
    const maxStats = {
      ...mockStats,
      careerReadiness: 100,
      interviewReady: 100,
      aiMatchScore: 100,
      salaryPotential: 100
    }
    
    renderWithRouter(<DashboardWidgets stats={maxStats} />)
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('renders widget container with hover effects', () => {
    renderWithRouter(<DashboardWidgets stats={mockStats} />)
    
    const widget = screen.getByText('Career Readiness').closest('div')
    expect(widget).toHaveClass('hover:bg-slate-50/50')
    expect(widget).toHaveClass('cursor-pointer')
  })
})
