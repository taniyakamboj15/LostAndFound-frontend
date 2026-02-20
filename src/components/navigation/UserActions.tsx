import { BadgeCheck, ShieldAlert, LogOut, Settings } from 'lucide-react';
import { NotificationsDropdown } from '../notifications/NotificationsDropdown';
import { Link } from 'react-router-dom';

import { User } from '@app-types/index';

interface UserActionsProps {
  user: User | null;
  isAuthenticated: boolean;
  isResending: boolean;
  handleResendVerification: () => void;
  onLogout: () => void;
}

const UserActions = ({ 
  user, 
  isAuthenticated, 
  isResending, 
  handleResendVerification, 
  onLogout 
}: UserActionsProps) => {
  if (!isAuthenticated) {
    return (
      <div className="hidden md:block">
        <Link
          to="/login"
          className="px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all shadow-sm hover:shadow font-medium text-sm"
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 sm:gap-3">
      {/* Verification Badge (Desktop) */}
      <div className="hidden md:flex items-center gap-2">
        {user?.isEmailVerified ? (
          <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 text-xs font-medium" title="Verified Account">
            <BadgeCheck className="h-3.5 w-3.5" />
            Verified
          </div>
        ) : (
          <button
            onClick={handleResendVerification}
            disabled={isResending}
            className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100 hover:bg-amber-100 transition-colors text-xs font-medium"
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            {isResending ? 'Sending...' : 'Verify Email'}
          </button>
        )}
      </div>

      {/* User Profile (Desktop) */}
      <div className="hidden lg:block text-right">
        <p className="text-sm font-semibold text-gray-900 leading-none">{user?.name}</p>
        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-medium mt-1">{user?.role}</p>
      </div>

      {/* Notifications */}
      <NotificationsDropdown />

      <Link
        to="/settings/notifications"
        className="hidden md:flex p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
        title="Settings"
      >
        <Settings className="h-5 w-5" />
      </Link>

      <button
        onClick={onLogout}
        className="hidden md:flex p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        title="Logout"
      >
        <LogOut className="h-5 w-5" />
      </button>
    </div>
  );
};

export default UserActions;
