import { Component, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@components/ui';
import { ERROR_UI_CONFIG } from '@constants/ui';
import { ErrorBoundaryProps } from '@app-types/ui.types';
import { ErrorBoundaryState } from '@constants/feedback';

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
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

      const config = ERROR_UI_CONFIG.default;

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">{config.title}</h1>
              <p className="text-gray-600 mb-8">{config.message}</p>
              
              <div className="space-y-3">
                <Button 
                  onClick={this.handleReset}
                  fullWidth
                  className="gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </Button>
                <Button 
                  onClick={() => window.location.href = '/'}
                  variant="outline"
                  fullWidth
                  className="gap-2"
                >
                  <Home className="w-4 h-4" />
                  Return Home
                </Button>
              </div>

              {import.meta.env.DEV && this.state.error && (
                <div className="mt-8 text-left">
                  <pre className="text-xs font-mono text-red-500 bg-red-50 p-3 rounded overflow-auto max-h-40 whitespace-pre-wrap">
                    {this.state.error.stack || this.state.error.toString()}
                  </pre>
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
