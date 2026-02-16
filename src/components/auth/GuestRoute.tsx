import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { Spinner } from '@components/ui';

interface GuestRouteProps {
  children: React.ReactNode;
}

const GuestRoute = ({ children }: GuestRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isAuthenticated) {
    // Redirect to dashboard or where they were trying to go
    interface LocationState {
      from?: {
        pathname: string;
      };
    }
    const state = location.state as LocationState;
    const from = state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

export default GuestRoute;
