// src/__tests__/Login.test.tsx
import { jest } from '@jest/globals';
import axios from 'axios';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from '../pages/Login';
import { AuthProvider } from '../contexts/AuthContext';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom') as any;
  return {
    __esModule: true,
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Login Page', () => {
  beforeEach(() => {
    mockedAxios.post.mockReset();
    mockNavigate.mockReset();
  });

  it('renders form with disabled submit initially', () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthProvider>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    // Button should start disabled
    expect(
      screen.getByRole('button', { name: /log in/i })
    ).toBeDisabled();
  });

  it('enables submit when both fields are filled', async () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthProvider>
    );

    // type into both fields
    await userEvent.type(screen.getByLabelText(/email/i), 'user@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'pass123');

    // now it should be enabled
    expect(
      screen.getByRole('button', { name: /log in/i })
    ).toBeEnabled();
  });

  it('submits and redirects on success', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { token: 'tok' } });

    render(
      <AuthProvider>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthProvider>
    );

    await userEvent.type(screen.getByLabelText(/email/i), 'user@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'pass123');
    userEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:5001/login',
        { email: 'user@example.com', password: 'pass123' }
      );
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });
  });
});
