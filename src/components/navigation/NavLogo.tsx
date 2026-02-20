import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { ROUTES } from '../../constants/routes';

interface NavLogoProps {
  isAuthenticated: boolean;
}

const NavLogo = ({ isAuthenticated }: NavLogoProps) => (
  <Link to={isAuthenticated ? ROUTES.DASHBOARD : '/'} className="flex items-center gap-2 z-50">
    <div className="bg-primary-50 p-1.5 rounded-lg">
      <Package className="h-6 w-6 text-primary-600" />
    </div>
    <span className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
      Lost & Found
    </span>
  </Link>
);

export default NavLogo;
