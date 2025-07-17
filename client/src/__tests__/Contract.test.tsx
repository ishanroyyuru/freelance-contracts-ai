// src/__tests__/Contract.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';

import * as AuthCtx from '../contexts/AuthContext';
import Contract from '../pages/Contract';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

beforeEach(() => {
  jest.resetAllMocks();

  jest.spyOn(AuthCtx, 'useAuth').mockReturnValue({ token: 'test‑jwt' } as any);

  mockedAxios.get.mockImplementation((url) => {
    switch (true) {
      case /\/contracts\/123$/.test(url):
        return Promise.resolve({
          data: {
            id: '123',
            title: 'S',
            text: 'T',
            status: 'd',
            createdAt: '',
          },
        });
      case /\/annotations$/.test(url):
        return Promise.resolve({ data: [] });
      case /\/summaries$/.test(url):
        return Promise.resolve({ data: [] });
      default:
        return Promise.reject(new Error(`Unhandled GET ${url}`));
    }
  });
});

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/contracts/123']}>
      <Routes>
        <Route path="/contracts/:id" element={<Contract />} />
      </Routes>
    </MemoryRouter>
  );

describe('Contract Detail Page', () => {
  it('adds an annotation', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        id: 'a1',
        startOffset: 1,
        endOffset: 2,
        comment: 'X',
        createdAt: '',
      },
    });

    renderPage();

    await screen.findByText('S');

    await userEvent.type(screen.getByPlaceholderText(/start/i), '1');
    await userEvent.type(screen.getByPlaceholderText(/end/i), '2');
    await userEvent.type(screen.getByPlaceholderText(/comment/i), 'X');
    await userEvent.click(screen.getByRole('button', { name: /add annotation/i }));

    expect(await screen.findByText('X')).toBeInTheDocument();
  });

  it('creates an AI summary', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        id: 's1',
        originalText: 'Clause',
        summaryText: 'Summ',
        createdAt: '',
      },
    });

    renderPage();
    await screen.findByText('S');

    await userEvent.type(
      screen.getByPlaceholderText(/paste clause/i),
      'Clause'
    );
    await userEvent.click(screen.getByRole('button', { name: /summarize/i }));

    const summaryPara = await screen.findByText(
      (txt, node) => node?.tagName === 'P' && txt === 'Summ'
    );
    expect(summaryPara).toBeInTheDocument();
  });
});
