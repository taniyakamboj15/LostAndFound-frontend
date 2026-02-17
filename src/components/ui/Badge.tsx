import { BadgeProps } from '@app-types/ui.types';
import { cn } from '@utils/helpers';
import { variantStyles, sizeStyles } from '@constants/badge';

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className,
}: BadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
