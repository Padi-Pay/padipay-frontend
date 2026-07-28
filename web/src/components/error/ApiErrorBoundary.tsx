'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ApiErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('API rendering error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 rounded-lg border border-red-200 bg-red-50 text-red-800 text-center">
          <p className="mb-4">Failed to load content.</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-white border border-red-200 text-red-800 rounded-md hover:bg-red-50 transition text-sm font-medium"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
