import { CheckCircle } from 'lucide-react';
import { formatDate } from '@utils/formatters';

interface PaymentReceiptProps {
  feeDetails: {
    totalAmount: number;
    paidAt?: string;
    transactionId?: string;
  };
}

const PaymentReceipt = ({ feeDetails }: PaymentReceiptProps) => (
  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 flex flex-col gap-3">
    <div className="flex items-center gap-2">
      <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
      <span className="font-semibold text-emerald-800 text-base">Payment Confirmed</span>
    </div>
    <div className="grid grid-cols-2 gap-3 text-sm">
      <div>
        <p className="text-gray-500">Amount Paid</p>
        <p className="font-bold text-gray-900 text-lg">
          ₹{feeDetails.totalAmount?.toLocaleString('en-IN')}
        </p>
      </div>
      {feeDetails.paidAt && (
        <div>
          <p className="text-gray-500">Date</p>
          <p className="font-medium text-gray-900">{formatDate(feeDetails.paidAt)}</p>
        </div>
      )}
      {feeDetails.transactionId && (
        <div className="col-span-2">
          <p className="text-gray-500">Transaction ID</p>
          <p className="font-mono text-xs text-gray-700 truncate">
            {`pi_...${feeDetails.transactionId.slice(-8)}`}
          </p>
        </div>
      )}
    </div>
  </div>
);

export default PaymentReceipt;
