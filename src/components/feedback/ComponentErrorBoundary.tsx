import { Component, ErrorInfo } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button, Card } from '@components/ui';
import { ERROR_UI_CONFIG } from '@constants/ui';
import { ComponentErrorBoundaryProps } from '@app-types/ui.types';
import { ComponentErrorBoundaryState } from '@/constants/feedback';

export class ComponentErrorBoundary extends Component<ComponentErrorBoundaryProps, ComponentErrorBoundaryState> {
  public state: ComponentErrorBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): ComponentErrorBoundaryState {
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

      const config = ERROR_UI_CONFIG.default;

      return (
        <Card className="border-red-200 bg-red-50 p-6 text-center shadow-none">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            {this.props.title || config.title}
          </h3>
          <p className="text-red-700 mb-6 text-sm">
            {this.props.message || config.message}
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={this.handleReset}
            className="border-red-300 text-red-700 hover:bg-red-100 mx-auto"
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
