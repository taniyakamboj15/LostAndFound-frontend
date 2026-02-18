import api from './api';
import { Match } from '../types/match.types';

export const matchService = {
  /**
   * Get potential found item matches for a specific report
   * @param itemId Item ID to find matches for
   * @returns List of matching lost reports
   */
  getMatchesForItem: async (itemId: string): Promise<Match[]> => {
    const response = await api.get<{ success: boolean; data: Match[] }>(
      `/api/matches/item/${itemId}`
    );
    return response.data.data;
  },

  /**
   * Get potential lost report matches for a specific item
   * @param reportId Lost report ID to find matches for
   * @returns List of matching found items
   */
  getMatchesForReport: async (reportId: string): Promise<Match[]> => {
    const response = await api.get<{ success: boolean; data: Match[] }>(
      `/api/matches/report/${reportId}`
    );
    return response.data.data;
  },
};

export default matchService;
