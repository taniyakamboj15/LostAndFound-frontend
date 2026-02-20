import { Truck, Package, CheckCircle2 } from 'lucide-react';
import { Card } from '@components/ui';
import { ClaimStatus } from '@constants/status';
import { format } from 'date-fns';
import { Transfer } from '@/types/transfer.types';
import { Storage } from '@/types/storage.types';

interface ClaimTransferTrackingProps {
  status: ClaimStatus;
  transfer: Transfer | null;
  toStorage: Storage | null;
}

const ClaimTransferTracking = ({ status, transfer, toStorage }: ClaimTransferTrackingProps) => {
  const visibleStatuses = [
    ClaimStatus.AWAITING_TRANSFER,
    ClaimStatus.AWAITING_RECOVERY,
    ClaimStatus.IN_TRANSIT,
    ClaimStatus.ARRIVED
  ];

  if (!visibleStatuses.includes(status) || !transfer) return null;

  return (
    <Card className="border-blue-100 bg-blue-50/30 p-6 rounded-3xl overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-5">
         <Truck className="h-32 w-32" />
      </div>
      
      <div className="flex items-center gap-4 mb-8">
         <div className="p-3 bg-blue-100 rounded-2xl">
            <Truck className="h-6 w-6 text-blue-600" />
         </div>
         <div>
            <h3 className="text-xl font-bold text-gray-900">
              {status === ClaimStatus.AWAITING_RECOVERY ? 'Recovery Attempt' : 'Transfer in Progress'}
            </h3>
             <p className="text-sm text-gray-500 font-medium">
              {status === ClaimStatus.AWAITING_RECOVERY 
                ? 'Staff are locating your item in our archive' 
                : `Moving item to ${toStorage?.city || 'your selected location'}`}
            </p>
         </div>
      </div>

      <div className="relative mb-10 px-2">
         {/* Track Line */}
         <div className="absolute top-5 left-8 right-8 h-1 bg-gray-100 rounded-full" />
         <div 
            className="absolute top-5 left-8 h-1 bg-blue-600 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(37,99,235,0.4)]" 
            style={{ 
              width: status === ClaimStatus.ARRIVED ? 'calc(100% - 64px)' : 
                     status === ClaimStatus.IN_TRANSIT ? '50%' : '0%' 
            }} 
         />

         <div className="flex justify-between items-start relative px-1">
            <div className="flex flex-col items-center">
               <div className={`z-10 w-10 h-10 rounded-2xl flex items-center justify-center border-4 border-white shadow-sm transition-colors ${
                  status === ClaimStatus.AWAITING_RECOVERY ? 'bg-amber-400 animate-pulse' :
                  status !== ClaimStatus.AWAITING_TRANSFER ? 'bg-blue-600' : 'bg-amber-400'
               }`}>
                  <Package className="h-5 w-5 text-white" />
               </div>
               <div className="mt-3 text-center">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Step 1</p>
                  <p className="text-xs font-bold text-gray-900">
                    {status === ClaimStatus.AWAITING_RECOVERY ? 'Recovering' : 'Preparing'}
                  </p>
               </div>
            </div>

            <div className="flex flex-col items-center">
               <div className={`z-10 w-10 h-10 rounded-2xl flex items-center justify-center border-4 border-white shadow-sm transition-all ${
                  status === ClaimStatus.IN_TRANSIT ? 'bg-blue-600 animate-pulse scale-110 shadow-lg' : 
                  status === ClaimStatus.ARRIVED ? 'bg-blue-600' : 'bg-white text-gray-300'
               }`}>
                  <Truck className={`h-5 w-5 ${status === ClaimStatus.AWAITING_TRANSFER || status === ClaimStatus.AWAITING_RECOVERY ? 'text-gray-200' : 'text-white'}`} />
               </div>
               <div className="mt-3 text-center">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Step 2</p>
                  <p className="text-xs font-bold text-gray-900">In Transit</p>
               </div>
            </div>

            <div className="flex flex-col items-center">
               <div className={`z-10 w-10 h-10 rounded-2xl flex items-center justify-center border-4 border-white shadow-sm transition-colors ${
                  status === ClaimStatus.ARRIVED ? 'bg-emerald-500' : 'bg-white'
               }`}>
                  <CheckCircle2 className={`h-5 w-5 ${status === ClaimStatus.ARRIVED ? 'text-white' : 'text-gray-200'}`} />
               </div>
               <div className="mt-3 text-center">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Step 3</p>
                  <p className="text-xs font-bold text-gray-900">Arrived</p>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-2 gap-8 p-5 bg-white/60 rounded-2xl border border-white">
         <div>
            <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Destination</p>
             <p className="text-sm font-bold text-gray-900 leading-tight">
              {toStorage?.name || 'Local Archive'}
            </p>
            <p className="text-xs text-gray-500 font-medium">
              {toStorage?.city || 'Selected Branch'}
            </p>
         </div>
         <div className="text-right">
            <p className="text-[10px] uppercase font-bold text-gray-400 mb-1 text-right">Carrier Info</p>
            <p className="text-sm font-bold text-blue-600">
              {transfer.carrierInfo || (status === ClaimStatus.AWAITING_TRANSFER ? 'Awaiting Dispatch' : 'Internal Logistics')}
            </p>
            {transfer.estimatedArrival && (
              <p className="text-xs text-gray-500 font-bold mt-1">
                Est. {format(new Date(transfer.estimatedArrival), 'MMM d, p')}
              </p>
            )}
         </div>
      </div>
    </Card>
  );
};

export default ClaimTransferTracking;
