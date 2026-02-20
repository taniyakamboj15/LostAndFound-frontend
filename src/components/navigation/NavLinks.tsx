import { Link } from 'react-router-dom';
import { cn } from '@utils/helpers';

interface NavLinkProps {
  to: string;
  isActive: boolean;
  label: string;
  onClick?: () => void;
  className?: string;
}

export const NavLink = ({ to, isActive, label, className }: NavLinkProps) => (
  <Link
    to={to}
    className={cn(
      'px-2 py-1.5 sm:px-3 rounded-lg text-sm font-medium transition-all duration-200',
      isActive
        ? 'bg-gray-100 text-gray-900'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
      className
    )}
  >
    {label}
  </Link>
);

export const MobileNavLink = ({ to, isActive, label, onClick }: NavLinkProps) => (
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
