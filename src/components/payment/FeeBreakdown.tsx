import React from 'react';
import { FeeBreakdown as IFeeBreakdown } from '../../types/ui.types';

interface FeeBreakdownProps {
  breakdown: IFeeBreakdown | null;
  isLoading?: boolean;
}

const FeeBreakdown: React.FC<FeeBreakdownProps> = ({ breakdown, isLoading }) => {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-3 p-4 bg-gray-50 rounded-lg">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-6 bg-gray-200 rounded w-full mt-4"></div>
      </div>
    );
  }

  if (!breakdown) return null;

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
      <h3 className="font-semibold text-gray-800 border-b border-gray-200 pb-2">
        Recovery Fee Breakdown
      </h3>
      
      <div className="flex justify-between text-sm text-gray-600">
        <span>Handling Fee (Fixed)</span>
        <span className="font-medium">₹{breakdown.handlingFee}</span>
      </div>

      <div className="flex justify-between text-sm text-gray-600">
        <span>
          Storage Fee ({breakdown.daysStored} days × ₹{breakdown.storageFee / breakdown.daysStored}/day)
        </span>
        <span className="font-medium">₹{breakdown.storageFee}</span>
      </div>

      <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200 mt-2">
        <span>Total Recovery Fee</span>
        <span>₹{breakdown.totalAmount}</span>
      </div>
      
      <p className="text-xs text-gray-500 mt-2">
        * Fee covers administrative costs and secure storage maintenance.
      </p>
    </div>
  );
};

export default FeeBreakdown;
