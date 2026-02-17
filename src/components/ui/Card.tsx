import { CardProps } from '@app-types/ui.types';
import { cn } from '@utils/helpers';
import { CARD_PADDINGS } from '@constants/ui';

const Card = ({
  children,
  className,
  padding = 'md',
  hover = false,
}: CardProps) => {
  return (
    <div
      className={cn(
        'bg-white rounded-lg shadow',
        CARD_PADDINGS[padding],
        hover && 'transition-shadow hover:shadow-lg',
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
