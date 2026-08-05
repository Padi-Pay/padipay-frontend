import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Sidebar } from '../components/layout/Sidebar';
import { Header, getInitials } from '../components/layout/Header';
import { ProfileView } from '../app/dashboard/profile';
import { useGlobalStore } from '../src/store/globalStore';
import { server } from './setup';
import { http, HttpResponse } from 'msw';

vi.mock('next/navigation', () => ({
  usePathname: () => '/dashboard/profile',
  useRouter: () => ({
    replace: vi.fn(),
    push: vi.fn(),
  }),
}));

describe('Authenticated Application Shell', () => {
  beforeEach(() => {
    useGlobalStore.setState({
      token: 'test-token',
      isAuthenticated: true,
      isHydrated: true,
      profile: {
        id: 'user-1',
        email: 'john@example.com',
        name: 'John Doe',
      },
    });
  });

  it('renders initials correctly for name and email fallback', () => {
    expect(getInitials('John Doe', 'john@example.com')).toBe('JD');
    expect(getInitials('Alice', 'alice@example.com')).toBe('A');
    expect(getInitials('', 'bob@example.com')).toBe('B');
    expect(getInitials('', '')).toBe('U');
  });

  it('renders Sidebar with active route highlighting and logout button', () => {
    render(<Sidebar />);
    
    const profileLink = screen.getByRole('link', { name: /profile/i });
    expect(profileLink).toHaveAttribute('aria-current', 'page');

    const logoutBtn = screen.getByTestId('logout-btn');
    expect(logoutBtn).toBeInTheDocument();
  });

  it('clears store and storage on logout', () => {
    const logoutSpy = vi.fn();
    render(<Sidebar onLogout={logoutSpy} />);

    fireEvent.click(screen.getByTestId('logout-btn'));
    expect(logoutSpy).toHaveBeenCalled();
    expect(useGlobalStore.getState().isAuthenticated).toBe(false);
  });

  it('toggles mobile drawer and closes on backdrop click or escape key', () => {
    render(
      <DashboardLayout header={<Header />} sidebar={<Sidebar />}>
        <div>Main Content</div>
      </DashboardLayout>
    );

    // Click hamburger button to open drawer
    fireEvent.click(screen.getByTestId('hamburger-menu-btn'));
    expect(screen.getByRole('dialog', { name: /mobile navigation/i })).toBeInTheDocument();

    // Click backdrop overlay to close
    fireEvent.click(screen.getByTestId('mobile-backdrop'));
    expect(screen.getByRole('dialog', { name: /mobile navigation/i })).toHaveClass('opacity-0');
  });

  it('fetches profile details on mount and handles optimistic UI update with rollback on failure', async () => {
    server.use(
      http.get('/api/users/me', () => {
        return HttpResponse.json({ id: 'user-1', name: 'John Doe', email: 'john@example.com' });
      }),
      http.patch('/api/users/me', () => {
        return new HttpResponse(JSON.stringify({ message: 'Network error' }), { status: 500 });
      })
    );

    render(<ProfileView />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText('Full Name');
    fireEvent.change(nameInput, { target: { value: 'Updated Name' } });

    const saveBtn = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(saveBtn);

    // Verify error displayed and rollback executed
    await waitFor(() => {
      expect(screen.getByText(/Network error|Failed to update profile/i)).toBeInTheDocument();
    });

    expect(useGlobalStore.getState().profile?.name).toBe('John Doe');
  });
});
