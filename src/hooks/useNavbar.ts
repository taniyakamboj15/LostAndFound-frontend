import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { PUBLIC_NAV_ITEMS, PROTECTED_NAV_ITEMS, STAFF_NAV_ITEMS, ADMIN_NAV_ITEMS } from '@constants/ui';
import { authService } from '@services/auth.service';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@utils/errors';

export const useNavbar = () => {
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

  const handleResendVerification = async () => {
    if (isResending) return;
    
    try {
      setIsResending(true);
      if (user?.email) {
        await authService.resendVerification(user.email);
        toast.success('Verification email sent! Please check your inbox.');
      }
    } catch (error: unknown) {
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

  return {
    user,
    isAuthenticated,
    isAdmin,
    isStaff,
    logout,
    isResending,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    scrolled,
    navItems,
    pathname: location.pathname,
    handleResendVerification
  };
};
