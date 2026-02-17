import { Link, useLocation } from 'react-router-dom';
import { 
  Package, 
  LogOut
} from 'lucide-react';
import { useAuth } from '@hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import { cn } from '@utils/helpers';
import { PUBLIC_NAV_ITEMS, PROTECTED_NAV_ITEMS, STAFF_NAV_ITEMS, ADMIN_NAV_ITEMS } from '@constants/ui';

const Navbar = () => {
  const location = useLocation();
  const { user, isAuthenticated, isAdmin, isStaff, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const navItems = [
    ...PUBLIC_NAV_ITEMS,
    ...(isAuthenticated ? PROTECTED_NAV_ITEMS : []),
    ...(isAdmin() || isStaff() ? STAFF_NAV_ITEMS : []),
    ...(isAdmin() ? ADMIN_NAV_ITEMS : [])
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={isAuthenticated ? ROUTES.DASHBOARD : '/'} className="flex items-center gap-2">
            <Package className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">Lost & Found</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {isAuthenticated && (
              <Link
                to={ROUTES.DASHBOARD}
                className={cn(
                  'px-4 py-2 rounded-lg transition-colors',
                  location.pathname === ROUTES.DASHBOARD
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                Dashboard
              </Link>
            )}
            
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'px-4 py-2 rounded-lg transition-colors',
                  location.pathname === item.path || (item.path === '/' && location.pathname === '/')
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="hidden sm:inline text-sm font-medium">Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
