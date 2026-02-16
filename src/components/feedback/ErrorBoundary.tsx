import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@components/ui';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to an error reporting service
    console.error('Critical UI Error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.href = '/';
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                Something went wrong
              </h1>
              <p className="text-gray-600 mb-8">
                An unexpected error occurred. Our team has been notified. 
                Please try resetting the application or return home.
              </p>
              
              <div className="grid grid-cols-1 gap-3">
                <Button 
                  onClick={this.handleReset}
                  className="flex items-center justify-center gap-2"
                  variant="primary"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </Button>
                <Button 
                  onClick={() => window.location.href = '/'}
                  variant="outline"
                  className="flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Return Home
                </Button>
              </div>

              {import.meta.env.DEV && this.state.error && (
                <div className="mt-8 text-left">
                  <p className="text-xs font-mono text-red-500 bg-red-50 p-3 rounded overflow-auto max-h-40">
                    {this.state.error.toString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
