import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WalletPage from '../app/dashboard/wallet/page';
import { useGlobalStore } from '../src/store/globalStore';
import { server } from './setup';
import { http, HttpResponse } from 'msw';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('Wallet Page', () => {
  beforeEach(() => {
    useGlobalStore.setState({
      token: 'test-token',
      isAuthenticated: true,
      profile: {
        id: 'user-1',
        email: 'john@example.com',
        name: 'John Doe',
      },
    });

    server.use(
      http.get('/api/wallets/me/balance', () => {
        return HttpResponse.json({
          success: true,
          data: { balance: '100', asset: 'XLM' },
        });
      }),
      http.get('/api/wallets/me', () => {
        return HttpResponse.json({
          success: true,
          data: { publicKey: 'GABCDEFGHIJKLMNOPQRSTUVWXYZ' },
        });
      })
    );
  });

  it('renders wallet balance and public key', async () => {
    render(<WalletPage />);

    await waitFor(() => {
      expect(screen.getByText('100 XLM')).toBeInTheDocument();
      expect(screen.getByText('GABCDEFGHIJKLMNOPQRSTUVWXYZ')).toBeInTheDocument();
    });
  });

  it('handles funding request', async () => {
    const fundMock = vi.fn();
    server.use(
      http.post('/api/relayer/fund', async ({ request }) => {
        const body = await request.json();
        fundMock(body);
        return HttpResponse.json({ success: true });
      })
    );

    render(<WalletPage />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('100 XLM')).toBeInTheDocument();
    });

    const fundBtn = screen.getByRole('button', { name: /Fund via Testnet/i });
    fireEvent.click(fundBtn);

    await waitFor(() => {
      expect(fundMock).toHaveBeenCalledWith({
        walletAddress: 'GABCDEFGHIJKLMNOPQRSTUVWXYZ',
        amount: '10000',
        asset: 'XLM',
      });
    });
  });

  it('handles withdrawal submission', async () => {
    const withdrawMock = vi.fn();
    server.use(
      http.post('/api/wallets/withdraw', async ({ request }) => {
        const body = await request.json();
        withdrawMock(body);
        return HttpResponse.json({ success: true });
      })
    );

    render(<WalletPage />);

    await waitFor(() => {
      expect(screen.getByText('100 XLM')).toBeInTheDocument();
    });

    // Open Modal
    fireEvent.click(screen.getByRole('button', { name: /Withdraw Funds/i }));
    
    expect(screen.getByRole('dialog', { name: /Withdraw Funds/i })).toBeInTheDocument();

    const destInput = screen.getByLabelText('Destination Address');
    const amountInput = screen.getByLabelText('Amount (XLM)');

    fireEvent.change(destInput, { target: { value: 'GAOLDMIQ7HE4L7BQRVK6X5RW3N74MACJVVG3TZPEYG5OLESBQJZQMQ26' } });
    fireEvent.change(amountInput, { target: { value: '50' } });

    fireEvent.click(screen.getByRole('button', { name: /Confirm Withdrawal/i }));

    await waitFor(() => {
      expect(withdrawMock).toHaveBeenCalledWith({
        destinationAddress: 'GAOLDMIQ7HE4L7BQRVK6X5RW3N74MACJVVG3TZPEYG5OLESBQJZQMQ26',
        amount: '50',
        asset: 'XLM'
      });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
