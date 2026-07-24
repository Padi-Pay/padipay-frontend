import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GlobalErrorBoundary } from '../src/components/error/GlobalErrorBoundary';

const ThrowError = () => {
  throw new Error('test');
};

describe('GlobalErrorBoundary', () => {
  it('catches runtime errors and shows fallback UI', () => {
    // Suppress console.error for expected errors in test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <GlobalErrorBoundary>
        <ThrowError />
      </GlobalErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Refresh Page')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
