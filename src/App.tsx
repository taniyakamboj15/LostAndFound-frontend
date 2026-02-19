import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import ErrorBoundary from '@components/feedback/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <div className="pt-16 min-h-screen bg-gray-50">
        <RouterProvider router={router} />
      </div>
    </ErrorBoundary>
  );
}

export default App;
