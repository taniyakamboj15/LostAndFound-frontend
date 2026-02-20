import { ArrowLeft, UserPlus } from 'lucide-react';
import { Button } from '@components/ui';
import { useNavigate } from 'react-router-dom';

const AnonymousClaimHeader = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="group -ml-2 rounded-xl">
        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back
      </Button>

      <div className="flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100 shadow-sm">
          <UserPlus className="h-8 w-8 text-amber-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">File Anonymous Claim</h1>
          <p className="text-gray-500 font-medium mt-1">
            Complete your claim without an account. We'll use your email for status updates.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnonymousClaimHeader;
