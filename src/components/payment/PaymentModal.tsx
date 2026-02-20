import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { FeeBreakdown as IFeeBreakdown } from '../../types/ui.types';
import toast from 'react-hot-toast';

// Make sure to use environment variable
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

interface CheckoutFormProps {
  onSuccess: (paymentIntentId: string) => void;
  amount: number;
}

const CheckoutForm = ({ onSuccess, amount }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href, // Or a specific success page
      },
      redirect: 'if_required',
    });

    if (error) {
      setErrorMessage(error.message ?? 'Payment failed');
      toast.error(error.message ?? 'Payment failed');
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess(paymentIntent.id);
      setIsProcessing(false);
    } else {
        setErrorMessage('Unexpected payment status');
        setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium"
      >
        {isProcessing ? 'Processing...' : `Pay ₹${amount}`}
      </button>
    </form>
  );
};

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientSecret: string;
  breakdown: IFeeBreakdown;
  onPaymentSuccess: (paymentIntent: string) => void;
}

const PaymentModal = ({ isOpen, onClose, clientSecret, breakdown, onPaymentSuccess }: PaymentModalProps) => {
  if (!isOpen || !clientSecret) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">Complete Payment</h2>
        
        <div className="mb-6 bg-gray-50 p-4 rounded text-sm">
            <div className="flex justify-between mb-2">
                <span>Handling Fee</span>
                <span>₹{breakdown.handlingFee}</span>
            </div>
            <div className="flex justify-between mb-2">
                <span>Storage Fee</span>
                <span>₹{breakdown.storageFee}</span>
            </div>
            <div className="flex justify-between font-bold border-t pt-2">
                <span>Total</span>
                <span>₹{breakdown.totalAmount}</span>
            </div>
        </div>

        <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
          <CheckoutForm onSuccess={onPaymentSuccess} amount={breakdown.totalAmount} />
        </Elements>
      </div>
    </div>
  );
};

export default PaymentModal;
