import type { ConversationStep } from '@app-types/chat.types';
import { CHAT_QUICK_REPLIES } from '@constants/chat';

interface QuickRepliesProps {
  step: ConversationStep;
  onSelect: (reply: string) => void;
  disabled: boolean;
}

export default function QuickReplies({ step, onSelect, disabled }: QuickRepliesProps) {
  const replies = CHAT_QUICK_REPLIES[step];
  if (!replies) return null;

  return (
    <div className="flex flex-wrap gap-1.5 px-3 pb-2">
      {replies.map((reply) => (
        <button
          key={reply}
          onClick={() => onSelect(reply)}
          disabled={disabled}
          className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
            reply === 'Confirm'
              ? 'bg-green-50 border-green-300 text-green-700 hover:bg-green-100'
              : reply === 'Cancel'
              ? 'bg-red-50 border-red-300 text-red-700 hover:bg-red-100'
              : 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
          } disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          {reply}
        </button>
      ))}
    </div>
  );
}
