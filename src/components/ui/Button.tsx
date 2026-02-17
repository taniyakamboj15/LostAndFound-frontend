import { forwardRef } from 'react';
import { ButtonProps } from '@app-types/ui.types';
import { SpinnerIcon } from '@assets/svg';
import { cn } from '@utils/helpers';
import { BUTTON_VARIANTS, BUTTON_SIZES } from '@constants/ui';

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg';

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          BUTTON_VARIANTS[variant],
          BUTTON_SIZES[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <SpinnerIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
