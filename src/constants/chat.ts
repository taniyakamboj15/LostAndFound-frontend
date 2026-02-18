import type { ConversationStep } from '@app-types/chat.types';

// Ordered steps for progress tracking (excludes CANCELLED)
export const CHAT_STEPS_ORDER: ConversationStep[] = [
  'GREETING',
  'COLLECTING_CATEGORY',
  'COLLECTING_DESCRIPTION',
  'COLLECTING_LOCATION',
  'COLLECTING_DATE',
  'COLLECTING_FEATURES',
  'COLLECTING_PHONE',
  'CONFIRMING',
  'COMPLETED',
];

export const CHAT_STEP_LABELS: Partial<Record<ConversationStep, string>> = {
  COLLECTING_CATEGORY: 'Category',
  COLLECTING_DESCRIPTION: 'Description',
  COLLECTING_LOCATION: 'Location',
  COLLECTING_DATE: 'Date',
  COLLECTING_FEATURES: 'Features',
  COLLECTING_PHONE: 'Contact',
  CONFIRMING: 'Confirm',
  COMPLETED: 'Done',
};

export const CHAT_QUICK_REPLIES: Partial<Record<ConversationStep, string[]>> = {
  // Greeting: intent shortcuts
  GREETING: [
    '📋 File a lost report',
    '🔍 Search found items',
    '📄 My reports',
    '🔗 Check my matches',
    '📦 My pickups',
  ],
  COLLECTING_CATEGORY: ['Electronics', 'Bags', 'Documents', 'Keys', 'Clothing', 'Accessories', 'Jewelry', 'Other'],
  COLLECTING_DATE: ['Today', 'Yesterday', 'Last week'],
  COLLECTING_FEATURES: ['None', 'Has serial number', 'Has stickers', 'Has name tag'],
  COLLECTING_PHONE: ['Skip'],
  CONFIRMING: ['Confirm', 'Cancel'],
};
