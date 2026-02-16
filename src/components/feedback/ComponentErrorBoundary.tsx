import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button, Card } from '@components/ui';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
  title?: string;
  message?: string;
}

interface State {
  hasError: boolean;
}

export class ComponentErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Component Error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="border-red-200 bg-red-50 p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            {this.props.title || 'Component Error'}
          </h3>
          <p className="text-red-700 mb-6">
            {this.props.message || 'Something went wrong while rendering this component.'}
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={this.handleReset}
            className="border-red-300 text-red-700 hover:bg-red-100"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ComponentErrorBoundary;
