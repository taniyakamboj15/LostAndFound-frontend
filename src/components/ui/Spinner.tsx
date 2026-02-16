import { SpinnerIcon } from '@assets/svg';
import { cn } from '@utils/helpers';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Spinner = ({ size = 'md', className }: SpinnerProps) => {
  const sizeStyles = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex items-center justify-center">
      <SpinnerIcon
        className={cn(
          'animate-spin text-primary-600',
          sizeStyles[size],
          className
        )}
      />
    </div>
  );
};

export default Spinner;
