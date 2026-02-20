import { Mail } from 'lucide-react';
import { Card, Input } from '@components/ui';
import { UseFormRegister } from 'react-hook-form';

interface ClaimContactCardProps {
  register: UseFormRegister<{ email: string }>;
  error?: string;
}

const ClaimContactCard = ({ register, error }: ClaimContactCardProps) => (
  <Card className="p-6 rounded-3xl border-2 border-gray-100 shadow-sm relative overflow-hidden">
    <div className="absolute top-0 right-0 p-8 opacity-5">
      <Mail className="w-24 h-24" />
    </div>
    
    <div className="flex items-center gap-2 mb-6">
      <Mail className="w-5 h-5 text-primary-600" />
      <h3 className="text-xl font-bold text-gray-900">Contact Information</h3>
    </div>
    
    <div className="relative">
      <Input
        label="Email Address"
        placeholder="your-email@example.com"
        error={error}
        fullWidth
        required
        {...register('email')}
        className="rounded-xl pl-10"
      />
      <div className="absolute left-3 top-[38px] text-gray-400">
        <Mail className="w-4 h-4" />
      </div>
    </div>
    
    <p className="text-xs text-gray-400 mt-4 font-medium italic">
      * We will send verification links and status updates to this address.
    </p>
  </Card>
);

export default ClaimContactCard;
