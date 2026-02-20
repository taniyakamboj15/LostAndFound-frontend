import { Layers, ArrowLeft } from 'lucide-react';
import { Button } from '@components/ui';
import { useNavigate } from 'react-router-dom';

const BulkIntakeHeader = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-primary-50 border border-primary-100 shadow-sm">
          <Layers className="h-8 w-8 text-primary-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Bulk Item Intake</h1>
          <p className="text-gray-500 font-medium">Rapidly register multiple found items in a single batch</p>
        </div>
      </div>
      <Button variant="outline" onClick={() => navigate('/items')} className="rounded-xl px-5">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>
    </div>
  );
};

export default BulkIntakeHeader;
