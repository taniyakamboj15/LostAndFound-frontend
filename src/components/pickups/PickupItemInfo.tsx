import { Link } from 'react-router-dom';
import { Card, Button } from '@components/ui';
import { Package } from 'lucide-react';
import { Pickup } from '../../types/pickup.types';

interface PickupItemInfoProps {
  pickup: Pickup;
}

const PickupItemInfo = ({ pickup }: PickupItemInfoProps) => (
  <Card className="p-6 rounded-[1.5rem] border-none shadow-lg shadow-gray-100/50 bg-white h-full border border-gray-100 flex flex-col justify-between">
    <div>
      <h2 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">
        <div className="p-1.5 bg-blue-50 rounded-lg">
          <Package className="h-4 w-4 text-blue-600" />
        </div>
        Item Context
      </h2>
      <div className="mt-2 p-3 bg-gray-50 rounded-xl border border-gray-100/50">
        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Description</p>
        <p className="text-xs text-gray-900 font-bold break-words leading-relaxed max-h-24 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-200">
          {pickup.itemId?.description || pickup.claimId?.itemId?.description || 'N/A'}
        </p>
      </div>
    </div>
    <div className="mt-4 pt-4 border-t border-gray-50">
      <Link to={`/items/${pickup.itemId?._id || pickup.claimId?.itemId?._id}`}>
        <Button variant="outline" size="sm" className="w-full text-[10px] font-black uppercase tracking-widest h-9 rounded-xl">
          Full Details
        </Button>
      </Link>
    </div>
  </Card>
);

export default PickupItemInfo;
