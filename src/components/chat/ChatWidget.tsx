import { MessageCircle, X, Send, Loader2, Bot, RotateCcw, CheckCircle2, MailWarning, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { useChat } from '@hooks/useChat';
import ProgressBar from './ProgressBar';
import MessageBubble from './MessageBubble';
import QuickReplies from './QuickReplies';

// ─── Email Not Verified Panel ──────────────────────────────────────────────────

function EmailVerificationRequired({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 w-[340px] flex flex-col bg-white rounded-2xl shadow-2xl border border-amber-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-sm">Lost &amp; Found Assistant</p>
            <p className="text-xs text-amber-100">Action required</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-col items-center gap-4 px-6 py-8 text-center">
        <div className="w-14 h-14 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center">
          <MailWarning className="w-7 h-7 text-amber-500" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 text-base">Verify your email first</h3>
          <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
            The chat assistant is only available to users with a verified email address. Please check your inbox and verify your email to continue.
          </p>
        </div>
        <Link
          to="/verify-email"
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
        >
          Verify Email
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
        <p className="text-xs text-gray-400">
          Didn't receive the email?{' '}
          <Link to="/verify-email" className="text-amber-500 hover:underline">
            Resend verification
          </Link>
        </p>
      </div>
    </div>
  );
}

// ─── Main Chat Widget ──────────────────────────────────────────────────────────

export default function ChatWidget() {
  const { user } = useAuth();
  const {
    messages,
    inputValue,
    isLoading,
    isOpen,
    currentStep,
    error,
    reportId,
    messagesEndRef,
    inputRef,
    setInputValue,
    handleOpen,
    handleClose,
    handleReset,
    handleSubmit,
    handleKeyDown,
    sendMessage,
  } = useChat();

  if (!user) return null;

  const isCompleted = currentStep === 'COMPLETED';
  const isCancelled = currentStep === 'CANCELLED';

  // ── Email not verified: show locked button + verification panel ──────────────
  if (!user.isEmailVerified) {
    return (
      <>
        {!isOpen && (
          <button
            onClick={handleOpen}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center"
            aria-label="Chat assistant — email verification required"
            title="Verify your email to use the chat assistant"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-300 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-[8px] font-bold text-amber-800">!</span>
            </span>
          </button>
        )}
        {isOpen && <EmailVerificationRequired onClose={handleClose} />}
      </>
    );
  }

  // ── Verified user: full chat widget ──────────────────────────────────────────
  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center"
          aria-label="Open chat assistant"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-h-[620px] flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-sm">Lost &amp; Found Assistant</p>
                <p className="text-xs text-indigo-100">{isLoading ? 'Typing...' : 'Online'}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={handleReset} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors" title="Start over">
                <RotateCcw className="w-4 h-4" />
              </button>
              <button onClick={handleClose} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors" title="Close">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <ProgressBar step={currentStep} />

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50 min-h-0">
            {messages.length === 0 && isLoading && (
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Starting chat...</span>
              </div>
            )}

            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {/* Typing indicator */}
            {isLoading && messages.length > 0 && (
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-sm px-3 py-2">
                  <div className="flex gap-1 items-center h-4">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            {/* Success Banner */}
            {isCompleted && reportId && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-green-800">Report Filed!</p>
                  <p className="text-xs text-green-600 font-mono">{reportId}</p>
                </div>
              </div>
            )}

            {/* Error Banner */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-2 text-xs text-red-600">
                {error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {!isCompleted && !isCancelled && (
            <QuickReplies step={currentStep} onSelect={sendMessage} disabled={isLoading} />
          )}

          {/* Input / Done Footer */}
          {!isCompleted && !isCancelled ? (
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 px-3 py-2 border-t border-gray-100 bg-white flex-shrink-0"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                disabled={isLoading || !messages.length}
                className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 disabled:opacity-50 transition-all"
                maxLength={1000}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading || !messages.length}
                className="w-9 h-9 bg-indigo-500 text-white rounded-xl flex items-center justify-center hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
          ) : (
            <div className="px-3 py-2 border-t border-gray-100 bg-white flex-shrink-0">
              <button
                onClick={handleReset}
                className="w-full text-sm text-indigo-600 hover:text-indigo-700 font-medium py-1.5 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                Start a new conversation
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
