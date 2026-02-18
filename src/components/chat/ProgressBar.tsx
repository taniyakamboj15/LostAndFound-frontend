import type { ConversationStep } from '@app-types/chat.types';
import { CHAT_STEPS_ORDER, CHAT_STEP_LABELS } from '@constants/chat';

interface ProgressBarProps {
  step: ConversationStep;
}

export default function ProgressBar({ step }: ProgressBarProps) {
  if (step === 'GREETING' || step === 'CANCELLED') return null;

  const currentIndex = CHAT_STEPS_ORDER.indexOf(step);
  const total = CHAT_STEPS_ORDER.length - 1;
  const progress = Math.max(0, ((currentIndex - 1) / (total - 1)) * 100);

  return (
    <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-500 font-medium">Filing Report</span>
        <span className="text-xs text-indigo-600 font-semibold">
          {step === 'COMPLETED' ? '✓ Done' : CHAT_STEP_LABELS[step] || ''}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
