// Match Types
export interface Match {
  _id: string;
  itemId: {
    _id: string;
    category: string;
    description: string;
    photos: Array<{ path: string; filename?: string }>;
    locationFound: string;
    dateFound: string;
    status: string;
  } | null; // Can be null if item is deleted
  lostReportId: {
    _id: string;
    category: string;
    description: string;
    locationLost: string;
    dateLost: string;
    contactEmail?: string;
    identifyingFeatures?: string[];
  };
  confidenceScore: number;
  featureScore?: number;
  categoryScore: number;
  keywordScore: number;
  dateScore: number;
  locationScore: number;
  colorScore?: number;
  reasons?: string[];
  notified: boolean;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'AUTO_CONFIRMED';
  createdAt: string;
}


export interface MatchFilters {
  status?: string;
  minConfidence?: number;
  fromDate?: string;
  toDate?: string;
  search?: string;
}

// Match Score Details
export interface MatchScoreDetails {
  categoryScore: number;
  keywordScore: number;
  dateScore: number;
  locationScore: number;
  totalScore: number;
}

// Matches Response
export interface MatchesResponse {
  success: boolean;
  data: Match[];
}


export interface MatchListModalProps {
  isOpen: boolean;
  onClose: () => void;
  matches: Match[];
  title?: string;
}
