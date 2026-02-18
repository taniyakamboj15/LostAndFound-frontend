import api from './api';
import { API_ENDPOINTS } from '../constants/api';
import type { ConversationStep, CollectedReportData, ChatIntent, ChatQueryResult } from '@app-types/chat.types';

export interface ChatSessionResponse {
  sessionId: string;
  reply: string;
  step: ConversationStep;
  intent: ChatIntent;
  collectedData: CollectedReportData;
  reportId?: string;
  queryResult?: ChatQueryResult;
}

const chatService = {
  /**
   * Initialize a new AI chat session
   * @returns Initial session state and welcome message
   */
  startSession: async (): Promise<ChatSessionResponse> => {
    const response = await api.post<{ success: boolean; data: ChatSessionResponse }>(
      API_ENDPOINTS.CHAT.START
    );
    return response.data.data;
  },

  /**
   * Send a user message to the AI assistant
   * @param sessionId Active session ID
   * @param message User's input text
   * @returns AI response and updated session state
   */
  sendMessage: async (sessionId: string, message: string): Promise<ChatSessionResponse> => {
    const response = await api.post<{ success: boolean; data: ChatSessionResponse }>(
      API_ENDPOINTS.CHAT.MESSAGE,
      { sessionId, message }
    );
    return response.data.data;
  },

  /**
   * Retrieve the current state of a chat session
   * @param sessionId Active session ID
   * @returns Current session details
   */
  getSession: async (sessionId: string): Promise<ChatSessionResponse> => {
    const response = await api.get<{ success: boolean; data: ChatSessionResponse }>(
      API_ENDPOINTS.CHAT.SESSION(sessionId)
    );
    return response.data.data;
  },

  /**
   * Terminate and delete a chat session
   * @param sessionId Session ID to delete
   */
  deleteSession: async (sessionId: string): Promise<void> => {
    await api.delete(API_ENDPOINTS.CHAT.SESSION(sessionId));
  },
};

export default chatService;
