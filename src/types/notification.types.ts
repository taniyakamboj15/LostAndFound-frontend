export interface Notification {
  _id: string;
  userId: string;
  event: string;
  title: string;
  body: string;
  data?: Record<string, string | number | boolean | null | undefined>;
  isRead: boolean;
  referenceId?: string;
  createdAt: string;
}

export interface NotificationsResponse {
  success: boolean;
  data: Notification[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
