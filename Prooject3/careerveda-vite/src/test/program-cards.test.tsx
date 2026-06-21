import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProgramCards from '../components/ProgramCards'

vi.mock('react-router-dom', async () => {
  const actual = await import('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn()
  }
})

describe('Program Cards Component', () => {
  const renderWithRouter = (ui: React.ReactElement) => {
    return render(ui, { wrapper: MemoryRouter })
  }

  const mockPrograms = [
    {
      id: 'ai-engineering',
      title: 'AI Engineering',
      slug: 'ai-engineering',
      duration: '12 Months',
      description: 'Master AI Engineering with hands-on projects',
      placementRate: '95%',
      avgPackage: '₹24 LPA',
      color: 'from-[#5B3DF5] to-[#7C6CFD]',
      isPopular: true,
      tag: 'Premium'
    },
    {
      id: 'product-management',
      title: 'Product Management',
      slug: 'product-management',
      duration: '6 Months',
      description: 'Become a product management expert',
      placementRate: '90%',
      avgPackage: '₹26 LPA',
      color: 'from-emerald-500 to-emerald-600',
      isPopular: false,
      tag: 'Fast Track'
    }
  ]

  it('renders program cards', () => {
    renderWithRouter(<ProgramCards programs={mockPrograms} />)
    expect(screen.getByText('AI Engineering')).toBeInTheDocument()
    expect(screen.getByText('Product Management')).toBeInTheDocument()
  })

  it('renders program duration', () => {
    renderWithRouter(<ProgramCards programs={mockPrograms} />)
    expect(screen.getByText('12 Months')).toBeInTheDocument()
    expect(screen.getByText('6 Months')).toBeInTheDocument()
  })

  it('renders placement rate', () => {
    renderWithRouter(<ProgramCards programs={mockPrograms} />)
    expect(screen.getByText('95%')).toBeInTheDocument()
    expect(screen.getByText('90%')).toBeInTheDocument()
  })

  it('renders average package', () => {
    renderWithRouter(<ProgramCards programs={mockPrograms} />)
    expect(screen.getByText('₹24 LPA')).toBeInTheDocument()
    expect(screen.getByText('₹26 LPA')).toBeInTheDocument()
  })

  it('renders program description', () => {
    renderWithRouter(<ProgramCards programs={mockPrograms} />)
    expect(screen.getByText('Master AI Engineering with hands-on projects')).toBeInTheDocument()
    expect(screen.getByText('Become a product management expert')).toBeInTheDocument()
  })

  it('renders popular badge for popular programs', () => {
    renderWithRouter(<ProgramCards programs={mockPrograms} />)
    expect(screen.getByText('Popular')).toBeInTheDocument()
  }

  it('renders program tag', () => {
    renderWithRouter(<ProgramCards programs={mockPrograms} />)
    expect(screen.getByText('Premium')).toBeInTheDocument()
    expect(screen.getByText('Fast Track')).toBeInTheDocument()
  })

  it('navigates to program details when explore button is clicked', async () => {
    const mockNavigate = vi.mocked(require('react-router-dom').useNavigate)
    renderWithRouter(<ProgramCards programs={mockPrograms} />)
    
    const button = screen.getByRole('button', { name: /Explore Program DNA/i })
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/program/ai-engineering')
    })
  })

  it('renders program color gradient', () => {
    renderWithRouter(<ProgramCards programs={mockPrograms} />)
    const aiCard = screen.getByText('AI Engineering').closest('div')
    expect(aiCard).toHaveClass('from-[#5B3DF5] to-[#7C6CFD]')
  }

  it('renders bullet points', () => {
    renderWithRouter(<ProgramCards programs={mockPrograms} />)
    expect(screen.getByText('Python')).toBeInTheDocument()
    expect(screen.getByText('Machine Learning')).toBeInTheDocument()
  })

  it('renders placement statistics row', () => {
    renderWithRouter(<ProgramCards programs={mockPrograms} />)
    expect(screen.getByText('Placement Rate')).toBeInTheDocument()
    expect(screen.getByText('Average Package')).toBeInTheDocument()
  })

  it('handles empty programs list', () => {
    renderWithRouter(<ProgramCards programs={[]} />)
    expect(screen.queryByText('AI Engineering')).not.toBeInTheDocument()
    expect(screen.queryByText('Product Management')).not.toBeInTheDocument()
  })

  it('renders with hover effects', () => {
    renderWithRouter(<ProgramCards programs={mockPrograms} />)
    const card = screen.getByText('AI Engineering').closest('div')
    
    fireEvent.mouseEnter(card!)
    
    await waitFor(() => {
      expect(card).toHaveClass('hover:border-[#5B3DF5]/30')
    })
  })
})
