import { Outlet } from 'react-router-dom';
import Navbar from '@components/navigation/Navbar';

const MainLayout = () => {
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
    </div>
  );
};

export default MainLayout;
