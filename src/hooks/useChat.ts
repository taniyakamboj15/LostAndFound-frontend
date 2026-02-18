import { useState, useRef, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@hooks/useAuth';
import chatService from '@services/chat.service';
import type { ChatMessage, ConversationStep, ChatIntent, ChatQueryResult } from '@app-types/chat.types';

export interface UseChatReturn {
  // State
  messages: ChatMessage[];
  inputValue: string;
  isLoading: boolean;
  isOpen: boolean;
  currentStep: ConversationStep;
  currentIntent: ChatIntent;
  error: string | null;
  reportId: string | null;
  // Refs
  messagesEndRef: React.RefObject<HTMLDivElement>;
  inputRef: React.RefObject<HTMLInputElement>;
  // Actions
  setInputValue: (value: string) => void;
  handleOpen: () => void;
  handleClose: () => void;
  handleReset: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  sendMessage: (text: string) => Promise<void>;
}

export function useChat(): UseChatReturn {
  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<ConversationStep>('GREETING');
  const [currentIntent, setCurrentIntent] = useState<ChatIntent>('UNKNOWN');
  const [error, setError] = useState<string | null>(null);
  const [reportId, setReportId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const startSession = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await chatService.startSession();
      setSessionId(result.sessionId);
      setCurrentStep(result.step);
      setCurrentIntent(result.intent ?? 'UNKNOWN');
      setMessages([
        {
          id: uuidv4(),
          role: 'assistant',
          content: result.reply,
          timestamp: new Date(),
        },
      ]);
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 401 || status === 403) {
        setError('Please verify your email address to use the chat assistant.');
      } else {
        setError('Failed to start chat. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading || !sessionId) return;

      const userMessage: ChatMessage = {
        id: uuidv4(),
        role: 'user',
        content: text.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputValue('');
      setIsLoading(true);
      setError(null);

      try {
        const result = await chatService.sendMessage(sessionId, text.trim());
        setCurrentStep(result.step);
        setCurrentIntent(result.intent ?? 'UNKNOWN');
        if (result.reportId) setReportId(result.reportId);

        // Attach queryResult to the assistant message if present
        const assistantMessage: ChatMessage = {
          id: uuidv4(),
          role: 'assistant',
          content: result.reply,
          timestamp: new Date(),
          queryResult: result.queryResult as ChatQueryResult | undefined,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err: unknown) {
        const status = (err as { response?: { status?: number } })?.response?.status;
        if (status === 401 || status === 403) {
          setError('Please verify your email address to use the chat assistant.');
        } else {
          const errorMsg =
            err && typeof err === 'object' && 'message' in err
              ? String((err as { message: string }).message)
              : 'Something went wrong. Please try again.';
          setError(errorMsg);
        }
      } finally {
        setIsLoading(false);
        inputRef.current?.focus();
      }
    },
    [isLoading, sessionId]
  );

  const handleOpen = () => {
    setIsOpen(true);
    if (!sessionId && messages.length === 0) {
      startSession();
    }
  };

  const handleClose = () => setIsOpen(false);

  const handleReset = () => {
    setSessionId(null);
    setMessages([]);
    setCurrentStep('GREETING');
    setCurrentIntent('UNKNOWN');
    setError(null);
    setReportId(null);
    setInputValue('');
    startSession();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  return {
    messages,
    inputValue,
    isLoading,
    isOpen,
    currentStep,
    currentIntent,
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
  };
}
