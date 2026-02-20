import { Menu, X } from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import { cn } from '@utils/helpers';
import { useNavbar } from '@hooks/useNavbar';
import NavLogo from './NavLogo';
import { NavLink } from './NavLinks';
import UserActions from './UserActions';
import MobileMenu from './MobileMenu';

const Navbar = () => {
  const {
    user,
    isAuthenticated,
    isResending,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    scrolled,
    navItems,
    pathname,
    handleResendVerification,
    logout
  } = useNavbar();

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
          <NavLogo isAuthenticated={isAuthenticated} />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-0.5">
            {isAuthenticated && (
              <NavLink 
                to={ROUTES.DASHBOARD} 
                isActive={pathname === ROUTES.DASHBOARD}
                label="Dashboard"
              />
            )}
            
            {navItems.map((item) => (
              <NavLink 
                key={item.path}
                to={item.path}
                isActive={pathname === item.path || (item.path === '/' && pathname === '/')}
                label={item.label}
              />
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            <UserActions 
              user={user}
              isAuthenticated={isAuthenticated}
              isResending={isResending}
              handleResendVerification={handleResendVerification}
              onLogout={logout}
            />

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <MobileMenu 
        isOpen={isMobileMenuOpen}
        isAuthenticated={isAuthenticated}
        user={user}
        navItems={navItems}
        pathname={pathname}
        isResending={isResending}
        onClose={() => setIsMobileMenuOpen(false)}
        onLogout={logout}
        onResendVerification={handleResendVerification}
      />
    </nav>
  );
};

export default Navbar;
