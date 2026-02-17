import { useSearchParams } from 'react-router-dom';
import { Card } from '@components/ui';
import { VerificationStatus } from '@components/auth/VerificationStatus';
import { useEmailVerification } from '@hooks/useEmailVerification';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { status, message } = useEmailVerification(token);

  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center py-8">
        <VerificationStatus status={status} message={message} />
      </Card>
    </div>
  );
};

export default VerifyEmail;
