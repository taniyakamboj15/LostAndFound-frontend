import { useState, useCallback, useEffect } from 'react';
import { notificationService } from '../services/notification.service';
import { Notification } from '../types';
import { useAuth } from './useAuth'; // assuming this is how we get auth status

export const useNotifications = (pollingIntervalMs = 60000) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      const res = await notificationService.getNotifications(1, 20); // Get latest 20
      setNotifications(res.data);
      setUnreadCount(res.data.filter((n: Notification) => !n.isRead).length);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const markAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map((n: Notification) => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark read', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map((n: Notification) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all read', err);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(prev => prev.filter((n: Notification) => n._id !== id));
      setUnreadCount(prev => notifications.find(n => n._id === id)?.isRead ? prev : Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to delete notification', err);
    }
  };

  const clearAll = async () => {
    try {
      await notificationService.clearAll();
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to clear notifications', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    let interval: ReturnType<typeof setInterval>;
    if (user) {
      interval = setInterval(fetchNotifications, pollingIntervalMs);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [fetchNotifications, user, pollingIntervalMs]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    refetch: fetchNotifications,
  };
};
