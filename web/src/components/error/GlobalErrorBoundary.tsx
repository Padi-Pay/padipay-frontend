'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { useGlobalStore } from '@/src/store/globalStore';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const status = (error as { response?: { status?: number } }).response?.status;

    if (status === 401) {
      useGlobalStore.getState().markSessionExpired();
    }

    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] rounded-3xl border border-outline-variant/50 bg-surface-container/70 px-6 py-12 text-center shadow-sm backdrop-blur">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <span className="text-2xl font-black">!</span>
          </div>
          <h1 className="text-2xl font-bold mb-4 text-foreground">Something went wrong</h1>
          <p className="mb-6 max-w-md text-foreground/70">
            We apologize for the inconvenience. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
