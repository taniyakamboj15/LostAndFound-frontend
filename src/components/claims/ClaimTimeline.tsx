import { Card } from '@components/ui';
import { formatRelativeTime } from '@utils/formatters';

interface PaymentMetadata {
  amount: number;
  transactionId: string;
}

interface TimelineEvent {
  action: string;
  actor: string;
  timestamp: string;
  metadata?: PaymentMetadata;
}

interface ClaimTimelineProps {
  timeline?: TimelineEvent[];
}

const ClaimTimeline = ({ timeline }: ClaimTimelineProps) => (
  <Card>
    <h2 className="text-xl font-semibold text-gray-900 mb-4">Timeline</h2>
    <div className="space-y-4">
      {timeline?.map((event, index) => (
        <div key={index} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-2 h-2 bg-primary-600 rounded-full" />
            {index < (timeline?.length || 0) - 1 && (
              <div className="w-0.5 h-full bg-gray-300 mt-1" />
            )}
          </div>
          <div className="flex-1 pb-4">
            <p className="font-medium text-gray-900">{event.action}</p>
            <p className="text-sm text-gray-600">
              by {event.actor} • {formatRelativeTime(event.timestamp)}
            </p>
            {event.action === 'PAYMENT COMPLETED' && event.metadata && (
              <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800 font-semibold mb-1">Payment Successful</p>
                <div className="text-xs text-green-700 flex justify-between">
                  <span>Amount: ₹{event.metadata.amount}</span>
                  <span className="font-mono">TXN: {event.metadata.transactionId}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  </Card>
);

export default ClaimTimeline;
