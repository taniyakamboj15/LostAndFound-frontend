import { useEffect, useState } from 'react';
import { authService } from '@services/auth.service';
import { getErrorMessage } from '@utils/errors';

type VerificationStatus = 'loading' | 'success' | 'error';

export const useEmailVerification = (token: string | null) => {
  const [status, setStatus] = useState<VerificationStatus>('loading');
  const [message, setMessage] = useState('');

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
        setMessage(
          getErrorMessage(error) || 'Failed to verify email. The link may be expired or invalid.'
        );
      }
    };

    verify();
  }, [token]);

  return { status, message };
};
