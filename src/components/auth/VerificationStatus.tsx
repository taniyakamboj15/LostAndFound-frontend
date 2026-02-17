import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@components/ui';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@constants/routes';

interface VerificationStatusProps {
  status: 'loading' | 'success' | 'error';
  message: string;
}

export const VerificationStatus = ({ status, message }: VerificationStatusProps) => {
  const navigate = useNavigate();

  if (status === 'loading') {
    return (
      <div className="space-y-4">
        <Loader2 className="h-12 w-12 text-primary-600 animate-spin mx-auto" />
        <h2 className="text-2xl font-bold text-gray-900">Verifying Email</h2>
        <p className="text-gray-600">Please wait while we verify your email address...</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="space-y-4">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
        <h2 className="text-2xl font-bold text-gray-900">Email Verified!</h2>
        <p className="text-gray-600">{message}</p>
        <div className="pt-4">
          <Button variant="primary" fullWidth onClick={() => navigate(ROUTES.LOGIN)}>
            Continue to Sign In
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <XCircle className="h-12 w-12 text-red-500 mx-auto" />
      <h2 className="text-2xl font-bold text-gray-900">Verification Failed</h2>
      <p className="text-gray-600">{message}</p>
      <div className="pt-4 space-y-3">
        <Button variant="primary" fullWidth onClick={() => navigate(ROUTES.REGISTER)}>
          Back to Registration
        </Button>
        <Link
          to={ROUTES.LOGIN}
          className="block text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Sign In instead
        </Link>
      </div>
    </div>
  );
};
