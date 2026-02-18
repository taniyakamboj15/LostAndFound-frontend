import { Bot, User } from 'lucide-react';
import type { ChatMessage } from '@app-types/chat.types';
import QueryResultCard from './QueryResultCard';

interface MessageBubbleProps {
  message: ChatMessage;
}

function renderContent(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
          isUser ? 'bg-indigo-100' : 'bg-gradient-to-br from-indigo-500 to-purple-600'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-indigo-600" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Bubble + optional result card */}
      <div className={`max-w-[85%] ${isUser ? '' : 'flex-1'}`}>
        <div
          className={`rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? 'bg-indigo-500 text-white rounded-tr-sm'
              : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-tl-sm'
          }`}
        >
          {renderContent(message.content)}
          <div className={`text-[10px] mt-1 ${isUser ? 'text-indigo-200 text-right' : 'text-gray-400'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>

        {/* Inline query result card (assistant messages only) */}
        {!isUser && message.queryResult && (
          <QueryResultCard result={message.queryResult} />
        )}
      </div>
    </div>
  );
}
