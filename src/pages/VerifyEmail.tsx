import { useEffect, useState } from 'react';
import { getErrorMessage } from '@utils/errors';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { Button, Card } from '@components/ui';
import { authService } from '@services/auth.service';
import { ROUTES } from '@constants/routes';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('No verification token found in the URL.');
        return;
      }

      try {
        const response = await authService.verifyEmail(token);
        setStatus('success');
        setMessage(response.message || 'Your email has been successfully verified!');
      } catch (error: unknown) {
        setStatus('error');
        setMessage(getErrorMessage(error) || 'Failed to verify email. The link may be expired or invalid.');
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center py-8">
        {status === 'loading' && (
          <div className="space-y-4">
            <Loader2 className="h-12 w-12 text-primary-600 animate-spin mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900">Verifying Email</h2>
            <p className="text-gray-600">Please wait while we verify your email address...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900">Email Verified!</h2>
            <p className="text-gray-600">{message}</p>
            <div className="pt-4">
              <Button
                variant="primary"
                fullWidth
                onClick={() => navigate(ROUTES.LOGIN)}
              >
                Continue to Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <XCircle className="h-12 w-12 text-red-500 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900">Verification Failed</h2>
            <p className="text-gray-600">{message}</p>
            <div className="pt-4 space-y-3">
              <Button
                variant="primary"
                fullWidth
                onClick={() => navigate(ROUTES.REGISTER)}
              >
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
        )}
      </Card>
    </div>
  );
};

export default VerifyEmail;
