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
  reasons?: string[];
  notified: boolean;
  createdAt: string;
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
