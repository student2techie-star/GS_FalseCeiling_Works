import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, Home } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[var(--plaster)] flex items-center justify-center p-6 font-body">
          <div className="glass max-w-lg w-full p-10 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-3xl font-heading font-extrabold text-primary mb-4">Oops! Something went wrong</h1>
            <p className="text-slate-500 mb-8">
              We're sorry, but an unexpected error occurred. Please try refreshing the page or navigating back home.
            </p>
            <div className="bg-red-50 p-4 rounded-xl text-left text-sm text-red-700 font-mono mb-8 overflow-auto max-h-32">
              {this.state.error?.message || "Unknown error"}
            </div>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-3 rounded-full bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 transition-colors"
              >
                Refresh Page
              </button>
              <a 
                href="/"
                className="px-6 py-3 rounded-full bg-accent text-white font-semibold hover:shadow-lg hover:shadow-accent/30 transition-all flex items-center gap-2"
              >
                <Home className="w-4 h-4" /> Go Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
