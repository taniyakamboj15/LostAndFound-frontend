import { Card } from '@components/ui';
import { User, Mail, Phone, AlertCircle, CreditCard } from 'lucide-react';
import { Pickup } from '../../types/pickup.types';

interface PickupClaimantInfoProps {
  pickup: Pickup;
}

const PickupClaimantInfo = ({ pickup }: PickupClaimantInfoProps) => (
  <>
    {/* Claimant Information */}
    <Card className="p-6 rounded-[1.5rem] border-none shadow-lg shadow-gray-100/50 bg-white border border-gray-100">
      <h2 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">
        <div className="p-1.5 bg-blue-50 rounded-lg">
          <User className="h-4 w-4 text-blue-600" />
        </div>
        Claimant Details
      </h2>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center shadow-inner">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <div className="min-w-0">
            <p className="text-base font-black text-gray-900 truncate leading-none">{pickup.claimantId?.name}</p>
            <p className="text-[8px] font-black text-blue-500 uppercase tracking-widest mt-1">Verified Recipient</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-2 pt-1">
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-100 group hover:bg-blue-50/50 transition-colors">
            <Mail className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-xs font-bold text-gray-600 truncate">{pickup.claimantId?.email}</span>
          </div>
          {pickup.claimantId?.phone && (
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-100 group hover:bg-blue-50/50 transition-colors">
              <Phone className="h-3.5 w-3.5 text-gray-400" />
              <span className="text-xs font-bold text-gray-600">{pickup.claimantId.phone}</span>
            </div>
          )}
        </div>
      </div>
    </Card>

    {/* Important Info & Fees Column */}
    <div className="space-y-6">
      {!pickup.isCompleted && (
        <Card className="p-6 rounded-[1.5rem] bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 shadow-lg shadow-amber-500/5 relative overflow-hidden group">
           <div className="absolute -right-2 -top-2 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
              <AlertCircle className="h-16 w-16 text-amber-600" />
           </div>
           <div className="flex items-start gap-3">
            <div className="p-1.5 bg-white rounded-xl shadow-sm ring-1 ring-amber-500/10">
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
            </div>
            <div className="relative z-10">
              <p className="text-xs font-black text-amber-900 tracking-tight mb-2">
                Checklist
              </p>
              <ul className="text-[10px] text-amber-800/80 space-y-1.5 font-bold">
                <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-amber-400" /> Valid Govt. ID</li>
                <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-amber-400" /> QR / Reference ID</li>
                <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-amber-400" /> Arrive in window</li>
              </ul>
            </div>
          </div>
        </Card>
      )}

      {/* Fee Paid Card */}
      {pickup.claimId?.paymentStatus === 'PAID' && pickup.claimId?.feeDetails && (
        <Card className="p-6 rounded-[1.5rem] border-none shadow-lg shadow-emerald-500/5 bg-white border border-emerald-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-[0.03]">
             <CreditCard className="h-24 w-24 text-emerald-600" />
          </div>
          <h2 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-2">
            <div className="p-1.5 bg-emerald-50 rounded-lg">
              <CreditCard className="h-4 w-4 text-emerald-600" />
            </div>
            Payment
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg border border-gray-100">
              <span className="text-gray-400 uppercase tracking-widest text-[8px] font-black">Fees</span>
              <span className="text-xs font-black text-gray-900">₹{pickup.claimId.feeDetails.totalAmount}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-xl border border-emerald-100 shadow-sm">
              <span className="text-emerald-900 font-black text-[10px] uppercase tracking-tighter">Paid Total</span>
              <span className="text-emerald-700 text-lg font-black leading-none">₹{pickup.claimId.feeDetails.totalAmount?.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  </>
);

export default PickupClaimantInfo;
