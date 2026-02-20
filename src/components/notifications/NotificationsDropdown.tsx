import { useRef, useState, useEffect } from 'react';
import { Bell, Check, ArrowUpRight } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { Notification } from '@app-types/index';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { getNotificationIcon, getNotificationLink } from '../../utils/notifications';
import { Trash2 } from 'lucide-react';

export const NotificationsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAll, loading } = useNotifications();
  const navigate = useNavigate();

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }
    setIsOpen(false);
    navigate(getNotificationLink(notification));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 rounded-full transition-colors flex items-center justify-center focus:outline-none"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-2 w-2 min-w-4 min-h-4 bg-rose-500 flex items-center justify-center rounded-full text-[10px] font-bold text-white shadow-sm ring-2 ring-white transform translate-x-1 -translate-y-1"></span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl ring-1 ring-slate-900/10 z-50 overflow-hidden flex flex-col max-h-[85vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">Notifications</h3>
            <div className="flex items-center gap-2">
              {notifications.length > 0 && (
                <button 
                  onClick={clearAll}
                  className="text-[10px] font-bold text-rose-500 hover:text-rose-600 px-2 py-1 rounded"
                >
                  Clear All
                </button>
              )}
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-2 py-1 rounded transition-colors flex items-center gap-1"
                >
                  <Check className="h-3 w-3" /> Mark all read
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="overflow-y-auto max-h-[60vh] flex-1 min-h-[100px]">
            {loading && notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm flex flex-col items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mb-3"></div>
                Loading...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500 flex flex-col items-center">
                <Bell className="h-8 w-8 text-slate-200 mb-2" />
                <p className="text-sm font-medium">No notifications yet</p>
                <p className="text-xs mt-1">When you get updates, they'll show up here.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {notifications.map((notification) => (
                  <button
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`w-full text-left p-4 hover:bg-slate-50 transition-colors flex gap-3 group ${!notification.isRead ? 'bg-indigo-50/30' : ''}`}
                  >
                    <div className={`flex-shrink-0 mt-1 h-10 w-10 rounded-full flex items-center justify-center ${!notification.isRead ? 'bg-white shadow-sm ring-1 ring-indigo-100' : 'bg-slate-100'}`}>
                      {getNotificationIcon(notification.event)}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <p className={`text-sm font-semibold truncate pr-2 ${!notification.isRead ? 'text-slate-900' : 'text-slate-600'}`}>
                          {notification.title}
                        </p>
                        <span className="text-[10px] whitespace-nowrap text-slate-400 font-medium">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true }).replace("about ", "")}
                        </span>
                      </div>
                      <p className={`text-sm line-clamp-2 ${!notification.isRead ? 'text-slate-700' : 'text-slate-500'}`}>
                        {notification.body}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification._id);
                        }}
                        className="p-1 hover:bg-rose-100 text-slate-300 hover:text-rose-600 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      
                      {!notification.isRead && (
                        <div className="h-2 w-2 bg-indigo-500 rounded-full mx-auto"></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="p-2 border-t border-slate-100 bg-white">
            <button className="w-full py-2 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center gap-1">
              View All <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
