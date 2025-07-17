import { jest } from '@jest/globals'
import axios from 'axios'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
import { AuthProvider } from '../contexts/AuthContext'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('Dashboard Page', () => {
  beforeEach(() => {
    mockedAxios.get.mockReset()
    localStorage.setItem('token', 'tok')
  })

  it('shows empty state when no contracts', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] })

    render(
      <AuthProvider>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </AuthProvider>
    )

    await waitFor(() =>
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://localhost:5001/contracts',
        { headers: { Authorization: 'Bearer tok' } }
      )
    )
    expect(screen.getByText(/no contracts yet/i)).toBeInTheDocument()
  })

  it('renders a list of contracts', async () => {
    const sample = [
      { id: '1', title: 'First', createdAt: '2025-01-01T00:00:00.000Z' },
      { id: '2', title: 'Second', createdAt: '2025-02-02T00:00:00.000Z' },
    ]
    mockedAxios.get.mockResolvedValueOnce({ data: sample })

    render(
      <AuthProvider>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </AuthProvider>
    )

    // wait for data to arrive
    await waitFor(() => screen.getByText('First'))
    // check both items and links
    sample.forEach((c) => {
      const link = screen.getByRole('link', { name: c.title })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', `/contracts/${c.id}`)
    })
  })
})
