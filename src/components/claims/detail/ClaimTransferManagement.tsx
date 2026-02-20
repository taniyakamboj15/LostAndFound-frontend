import { Badge, Button } from '@components/ui';
import { CheckCircle2 } from 'lucide-react';
import { Transfer } from '@/types/transfer.types';
import { Storage } from '@/types/storage.types';
import { getTransferStatusVariant } from '@utils/ui';

interface ClaimTransferManagementProps {
  activeTab: 'DETAILS' | 'TRANSFER';
  transfer: Transfer | null;
  fromStorage: Storage | null;
  toStorage: Storage | null;
}

const ClaimTransferManagement = ({
  activeTab,
  transfer,
  fromStorage,
  toStorage
}: ClaimTransferManagementProps) => {
  if (activeTab !== 'TRANSFER') return null;

  return (
    <section className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Current Status</p>
              <Badge variant={getTransferStatusVariant(transfer?.status || '')}>
                  {(transfer?.status || 'PENDING').replace('_', ' ')}
              </Badge>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Route</p>
              <p className="font-bold text-gray-900 text-sm">{fromStorage?.name || 'Local'} → {toStorage?.name || 'Local'}</p>
          </div>
      </div>

      <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
          <p className="font-medium text-blue-800 text-sm mb-4">
              Update the transfer status to automatically notify the claimant and handle inventory routing.
          </p>

          {transfer?.status === 'RECOVERY_REQUIRED' && (
              <Button className="w-full h-12 rounded-xl text-md" variant="primary" onClick={() => window.open('/admin/transfers', '_blank')}>
                  Go to Main Transfer Board
              </Button>
          )}
          {(transfer?.status === 'PENDING') && (
               <Button className="w-full h-12 rounded-xl text-md" variant="primary" onClick={() => window.open('/admin/transfers', '_blank')}>
                  Go to Main Transfer Board (Dispatch)
               </Button>
          )}
          {transfer?.status === 'IN_TRANSIT' && (
               <Button className="w-full h-12 rounded-xl text-md" variant="primary" onClick={() => window.open('/admin/transfers', '_blank')}>
                  Go to Main Transfer Board (Receive)
               </Button>
          )}
          {transfer?.status === 'ARRIVED' && (
              <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold bg-emerald-50 p-3 rounded-xl">
                  <CheckCircle2 className="h-5 w-5" /> Transfer Complete
              </div>
          )}

          <p className="text-xs text-gray-500 mt-4 text-center">
              Full controls including carrier updates and notes are available in the dedicated Transfer Dashboard.
          </p>
      </div>
    </section>
  );
};

export default ClaimTransferManagement;
