// Chat types mirroring the backend

export type ConversationStep =
  | 'GREETING'
  | 'COLLECTING_CATEGORY'
  | 'COLLECTING_DESCRIPTION'
  | 'COLLECTING_LOCATION'
  | 'COLLECTING_DATE'
  | 'COLLECTING_FEATURES'
  | 'COLLECTING_PHONE'
  | 'CONFIRMING'
  | 'COMPLETED'
  | 'CANCELLED';

export type ChatIntent =
  | 'FILE_REPORT'
  | 'SEARCH_ITEMS'
  | 'MY_REPORTS'
  | 'CHECK_MATCHES'
  | 'MY_PICKUPS'
  | 'UNKNOWN';

export interface CollectedReportData {
  category?: string;
  description?: string;
  locationLost?: string;
  dateLost?: string;
  identifyingFeatures?: string[];
  contactPhone?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  queryResult?: ChatQueryResult;
}

// ─── Query Result Types ────────────────────────────────────────────────────────

export interface ChatFoundItem {
  id: string;
  category: string;
  description: string;
  locationFound: string;
  dateFound: string;
  status: string;
}

export interface ChatLostReport {
  id: string;
  category: string;
  description: string;
  locationLost: string;
  dateLost: string;
  createdAt: string;
}

export interface ChatMatch {
  matchId: string;
  confidenceScore: number;
  item: ChatFoundItem;
}

export interface ChatPickup {
  pickupId: string;
  referenceCode: string;
  pickupDate: string;
  startTime: string;
  endTime: string;
  isCompleted: boolean;
  isVerified: boolean;
  itemDescription: string;
  itemCategory: string;
}

export type ChatQueryResultType = 'SEARCH_ITEMS' | 'MY_REPORTS' | 'CHECK_MATCHES' | 'MY_PICKUPS';

export interface ChatQueryResult {
  type: ChatQueryResultType;
  items?: ChatFoundItem[];
  reports?: ChatLostReport[];
  matches?: ChatMatch[];
  pickups?: ChatPickup[];
  total: number;
  message: string;
}
