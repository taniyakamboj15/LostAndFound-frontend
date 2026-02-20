import { LucideIcon, LogOut, Settings } from 'lucide-react';
import { MobileNavLink } from './NavLinks';
import { ROUTES } from '../../constants/routes';
import { NotificationsDropdown } from '../notifications/NotificationsDropdown';
import { Link } from 'react-router-dom';

import { User } from '@app-types/index';

interface NavItem {
  path: string;
  label: string;
  icon?: LucideIcon;
}

interface MobileMenuProps {
  isOpen: boolean;
  isAuthenticated: boolean;
  user: User | null;
  navItems: NavItem[];
  pathname: string;
  isResending: boolean;
  onClose: () => void;
  onLogout: () => void;
  onResendVerification: () => void;
}

const MobileMenu = ({
  isOpen,
  isAuthenticated,
  user,
  navItems,
  pathname,
  isResending,
  onClose,
  onLogout,
  onResendVerification
}: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-100 shadow-lg animate-in slide-in-from-top-2 duration-200">
      <div className="px-4 py-4 space-y-2">
        {isAuthenticated && (
          <MobileNavLink 
            to={ROUTES.DASHBOARD} 
            isActive={pathname === ROUTES.DASHBOARD}
            label="Dashboard"
            onClick={onClose}
          />
        )}
        
        {navItems.map((item) => (
          <MobileNavLink 
            key={item.path}
            to={item.path}
            isActive={pathname === item.path}
            label={item.label}
            onClick={onClose}
          />
        ))}

        <div className="h-px bg-gray-100 my-3" />

        {isAuthenticated ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 uppercase">{user?.role}</p>
              </div>
              
              <div className="flex items-center gap-3">
                <NotificationsDropdown />
                {!user?.isEmailVerified && (
                  <button
                    onClick={onResendVerification}
                    disabled={isResending}
                    className="text-xs text-amber-600 font-medium"
                  >
                    Verify Email
                  </button>
                )}
              </div>
            </div>

            <Link
              to="/settings/notifications"
              onClick={onClose}
              className="w-full flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-sm font-medium"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>

            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="block w-full text-center px-4 py-2 bg-gray-900 text-white rounded-lg font-medium"
            onClick={onClose}
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
