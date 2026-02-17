import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import Button from './Button';
import { ButtonProps } from '../../types/ui.types'; // Assuming ButtonProps is exported from here or similar

interface BackButtonProps extends Omit<ButtonProps, 'onClick'> {
  label?: string;
  fallbackPath?: string; // Optional path to navigate to if history is empty (though -1 usually works)
}

const BackButton = ({ 
  label = 'Back', 
  variant = 'ghost', 
  size = 'sm', 
  className,
  ...props 
}: BackButtonProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleBack}
      className={className}
      {...props}
    >
      <ChevronLeft className="h-4 w-4 mr-1" />
      {label}
    </Button>
  );
};

export default BackButton;
