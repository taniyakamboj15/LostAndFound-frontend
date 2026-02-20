import { AlertTriangle } from 'lucide-react';
import { Card } from '@components/ui';

interface ClaimantStatementProps {
  description: string;
}

const ClaimantStatement = ({ description }: ClaimantStatementProps) => {
  return (
    <Card className="p-0 border-none shadow-sm overflow-hidden bg-white">
      <div className="p-6 bg-gray-50/50 border-b border-gray-100">
         <h3 className="font-bold text-gray-900 flex items-center gap-2">
           <AlertTriangle className="h-5 w-5 text-amber-500" />
           Claimant Statement
         </h3>
      </div>
      <div className="p-6">
         <p className="text-gray-700 leading-relaxed italic">
           "{description || 'No statement provided.'}"
         </p>
      </div>
    </Card>
  );
};

export default ClaimantStatement;
