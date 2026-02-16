import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { UserRole } from '@constants/roles';
import { logoutUser } from '@store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  const logout = useCallback(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  const hasRole = useCallback((role: UserRole): boolean => {
    return user?.role === role;
  }, [user]);

  const hasAnyRole = useCallback((roles: UserRole[]): boolean => {
    return user ? roles.includes(user.role) : false;
  }, [user]);

  const isAdmin = useCallback((): boolean => hasRole(UserRole.ADMIN), [hasRole]);
  const isStaff = useCallback((): boolean => hasRole(UserRole.STAFF), [hasRole]);
  const isClaimant = useCallback((): boolean => hasRole(UserRole.CLAIMANT), [hasRole]);

  const canAccessAdminRoutes = useCallback((): boolean => isAdmin(), [isAdmin]);
  const canAccessStaffRoutes = useCallback((): boolean => isAdmin() || isStaff(), [isAdmin, isStaff]);

  return useMemo(() => ({
    user,
    isAuthenticated,
    isLoading,
    logout,
    hasRole,
    hasAnyRole,
    isAdmin,
    isStaff,
    isClaimant,
    canAccessAdminRoutes,
    canAccessStaffRoutes,
  }), [
    user,
    isAuthenticated,
    isLoading,
    logout,
    hasRole,
    hasAnyRole,
    isAdmin,
    isStaff,
    isClaimant,
    canAccessAdminRoutes,
    canAccessStaffRoutes,
  ]);
};
