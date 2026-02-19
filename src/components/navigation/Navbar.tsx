import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  Package, 
  LogOut,
  BadgeCheck,
  ShieldAlert,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import { cn } from '@utils/helpers';
import { PUBLIC_NAV_ITEMS, PROTECTED_NAV_ITEMS, STAFF_NAV_ITEMS, ADMIN_NAV_ITEMS } from '@constants/ui';
import { authService } from '@services/auth.service';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@utils/errors';

const Navbar = () => {
  const location = useLocation();
  const { user, isAuthenticated, isAdmin, isStaff, logout } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
  };

  const handleResendVerification = async () => {
    if (isResending) return;
    
    try {
      setIsResending(true);
      if (user?.email) {
        await authService.resendVerification(user.email);
        toast.success('Verification email sent! Please check your inbox.');
      }
    } catch (error:unknown) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || 'Failed to send verification email');
    } finally {
      setIsResending(false);
    }
  };

  const navItems = [
    ...PUBLIC_NAV_ITEMS,
    ...(isAuthenticated ? PROTECTED_NAV_ITEMS : []),
    ...(isAdmin() || isStaff() ? STAFF_NAV_ITEMS : []),
    ...(isAdmin() ? ADMIN_NAV_ITEMS : [])
  ];

  return (
    <nav 
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 border-b",
        scrolled 
          ? "bg-white/80 backdrop-blur-md border-gray-200 shadow-sm" 
          : "bg-white border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={isAuthenticated ? ROUTES.DASHBOARD : '/'} className="flex items-center gap-2 z-50">
            <div className="bg-primary-50 p-1.5 rounded-lg">
                <Package className="h-6 w-6 text-primary-600" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Lost & Found
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {isAuthenticated && (
              <NavLink 
                to={ROUTES.DASHBOARD} 
                isActive={location.pathname === ROUTES.DASHBOARD}
                label="Dashboard"
              />
            )}
            
            {navItems.map((item) => (
              <NavLink 
                key={item.path}
                to={item.path}
                isActive={location.pathname === item.path || (item.path === '/' && location.pathname === '/')}
                label={item.label}
              />
            ))}
          </div>

          {/* User Menu & Mobile Toggle */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
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
                <div className="hidden md:block text-right">
                  <p className="text-sm font-semibold text-gray-900 leading-none">{user?.name}</p>
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 font-medium mt-1">{user?.role}</p>
                </div>

                <button
                  onClick={handleLogout}
                  className="hidden md:flex p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="hidden md:block">
                 <Link
                    to="/login"
                    className="px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all shadow-sm hover:shadow font-medium text-sm"
                  >
                    Login
                  </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-100 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-4 space-y-2">
            {isAuthenticated && (
               <MobileNavLink 
                 to={ROUTES.DASHBOARD} 
                 isActive={location.pathname === ROUTES.DASHBOARD}
                 label="Dashboard"
                 onClick={() => setIsMobileMenuOpen(false)}
               />
            )}
            
            {navItems.map((item) => (
              <MobileNavLink 
                key={item.path}
                to={item.path}
                isActive={location.pathname === item.path}
                label={item.label}
                onClick={() => setIsMobileMenuOpen(false)}
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
                    {!user?.isEmailVerified && (
                        <button
                          onClick={handleResendVerification}
                          disabled={isResending}
                          className="text-xs text-amber-600 font-medium"
                        >
                          Verify Email
                        </button>
                    )}
                 </div>
                 <button
                    onClick={handleLogout}
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
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ to, isActive, label }: { to: string; isActive: boolean; label: string }) => (
  <Link
    to={to}
    className={cn(
      'px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
      isActive
        ? 'bg-gray-100 text-gray-900'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
    )}
  >
    {label}
  </Link>
);

const MobileNavLink = ({ to, isActive, label, onClick }: { to: string; isActive: boolean; label: string; onClick: () => void }) => (
  <Link
    to={to}
    onClick={onClick}
    className={cn(
      'block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
      isActive
        ? 'bg-primary-50 text-primary-700'
        : 'text-gray-600 hover:bg-gray-50'
    )}
  >
    {label}
  </Link>
);

export default Navbar;
