import { jest } from '@jest/globals'
import axios from 'axios'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Signup from '../pages/Signup'
import { AuthProvider } from '../contexts/AuthContext'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom') as any
  return {
    __esModule: true,
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('Signup Page', () => {
  beforeEach(() => {
    mockedAxios.post.mockReset()
    mockNavigate.mockReset()
  })

  it('renders name, email & password inputs and a disabled submit', () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <Signup />
        </MemoryRouter>
      </AuthProvider>
    )
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /sign up/i })
    ).toBeDisabled()
  })

  it('enables submit when all fields are filled', async () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <Signup />
        </MemoryRouter>
      </AuthProvider>
    )
    await userEvent.type(screen.getByLabelText(/name/i), 'Tester')
    await userEvent.type(screen.getByLabelText(/email/i), 'a@b.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'pw123')
    expect(
      screen.getByRole('button', { name: /sign up/i })
    ).toBeEnabled()
  })

  it('POSTs to /signup and navigates on success', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { token: 'tok' } })

    render(
      <AuthProvider>
        <MemoryRouter>
          <Signup />
        </MemoryRouter>
      </AuthProvider>
    )
    await userEvent.type(screen.getByLabelText(/name/i), 'Tester')
    await userEvent.type(screen.getByLabelText(/email/i), 'x@y.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'pw123')
    userEvent.click(screen.getByRole('button', { name: /sign up/i }))

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:5001/signup',
        { name: 'Tester', email: 'x@y.com', password: 'pw123' }
      )
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true })
    })
  })
})
