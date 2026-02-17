import { SpinnerProps } from '@app-types/ui.types';
import { SpinnerIcon } from '@assets/svg';
import { cn } from '@utils/helpers';
import { SPINNER_SIZES } from '@constants/ui';

const Spinner = ({ size = 'md', className }: SpinnerProps) => {
  return (
    <div className="flex items-center justify-center">
      <SpinnerIcon
        className={cn(
          'animate-spin text-primary-600',
          SPINNER_SIZES[size],
          className
        )}
      />
    </div>
  );
};

export default Spinner;
