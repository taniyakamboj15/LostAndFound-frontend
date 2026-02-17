import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { Button } from '@components/ui';
import { ERROR_UI_CONFIG, ErrorConfig } from '@constants/ui';

const RouterErrorBoundary = () => {
  const error = useRouteError();
  console.error('Router Error:', error);

  let config: ErrorConfig = ERROR_UI_CONFIG.default;

  if (isRouteErrorResponse(error)) {
    const errorMap: Record<number, keyof typeof ERROR_UI_CONFIG> = {
      404: 'notFound',
      401: 'unauthorized',
      503: 'unavailable',
    };
    const key = errorMap[error.status] || 'default';
    config = ERROR_UI_CONFIG[key];
  }

  const message = (error instanceof Error) ? error.message : (typeof error === 'string' ? error : config.message);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">{config.title}</h1>
          <p className="text-gray-600 mb-8">{message}</p>

          <div className="space-y-3">
            <Button
              onClick={() => window.location.reload()}
              fullWidth
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Reload Page
            </Button>
            
            <Link to="/" className="block">
              <Button
                variant="outline"
                fullWidth
                className="gap-2"
              >
                <Home className="w-4 h-4" />
                Return Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouterErrorBoundary;
