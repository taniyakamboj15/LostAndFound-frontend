import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@components/navigation/Navbar';
import ChatWidget from '@components/chat/ChatWidget';
import { useAppDispatch } from '@store/hooks';
import { useAuth } from '@hooks/useAuth';
import { getProfile } from '@store/slices/authSlice';

const MainLayout = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Verify session on mount (or reload) if user is logged in locally
    if (isAuthenticated) {
      dispatch(getProfile());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600">
            © 2024 Lost & Found Platform. All rights reserved.
          </p>
        </div>
      </footer>
      {/* AI Chat Assistant - visible to all authenticated users */}
      <ChatWidget />
    </div>
  );
};

export default MainLayout;

