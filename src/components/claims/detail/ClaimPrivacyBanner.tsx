import { ShieldAlert } from 'lucide-react';
import { ClaimStatus } from '@constants/status';

interface ClaimPrivacyBannerProps {
  status: ClaimStatus;
  isAdmin: boolean;
  isStaff: boolean;
}

const ClaimPrivacyBanner = ({ status, isAdmin, isStaff }: ClaimPrivacyBannerProps) => {
  if (isAdmin || isStaff) return null;
  
  const visibleStatuses = [
    ClaimStatus.VERIFIED,
    ClaimStatus.PICKUP_BOOKED,
    ClaimStatus.RETURNED,
    ClaimStatus.AWAITING_TRANSFER,
    ClaimStatus.AWAITING_RECOVERY,
    ClaimStatus.IN_TRANSIT,
    ClaimStatus.ARRIVED
  ];

  if (visibleStatuses.includes(status)) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-6 rounded-3xl flex items-start gap-4 shadow-sm relative overflow-hidden group">
       <div className="absolute -right-4 -top-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <ShieldAlert className="h-24 w-24 text-blue-600" />
       </div>
       <div className="p-2.5 bg-white rounded-2xl shadow-sm ring-1 ring-blue-500/10">
          <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0" />
       </div>
       <div className="relative z-10">
          <h4 className="font-black text-blue-900 text-sm tracking-tight mb-1">Privacy Protection Active</h4>
          <p className="text-[11px] text-blue-800/60 leading-relaxed font-medium max-w-2xl">
            Because this claim is pending verification, specific details of the item (like serial numbers and private identifiers) are hidden from the public portal. 
            <strong> This protects the item from potential fraudulent claims.</strong>
          </p>
       </div>
    </div>
  );
};

export default ClaimPrivacyBanner;
