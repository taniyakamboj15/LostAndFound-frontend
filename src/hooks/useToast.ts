import { useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';

export const useToast = () => {
  const success = useCallback((message: string) => {
    toast.success(message, {
      duration: 3000,
      position: 'top-right',
    });
  }, []);

  const error = useCallback((message: string) => {
    if (!message) return;
    toast.error(message, {
      duration: 4000,
      position: 'top-right',
    });
  }, []);

  const loading = useCallback((message: string) => {
    return toast.loading(message, {
      position: 'top-right',
    });
  }, []);

  const dismiss = useCallback((toastId: string) => {
    toast.dismiss(toastId);
  }, []);

  return useMemo(() => ({
    success,
    error,
    loading,
    dismiss,
  }), [success, error, loading, dismiss]);
};
