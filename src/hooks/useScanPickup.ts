import { useState, useEffect, useRef, useCallback } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import api from '@services/api';
import toast from 'react-hot-toast';
import { API_ENDPOINTS } from '@constants/api';
import { getErrorMessage } from '@/utils/errors';
import { Pickup } from '../types/pickup.types';

export const useScanPickup = (isOpen: boolean, onVerifySuccess: (pickupData: Pickup) => void, onClose: () => void) => {
  const [activeTab, setActiveTab] = useState<'scan' | 'manual'>('scan');
  const [manualCode, setManualCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  const handleVerification = useCallback(async (codeInput: string) => {
    setIsVerifying(true);
    setError(null);

    let referenceCode = codeInput;

    // Try to parse as JSON if it looks like one (from QR code)
    try {
      const parsed = JSON.parse(codeInput);
      if (parsed.referenceCode) {
        referenceCode = parsed.referenceCode;
      }
    } catch (e) {
      // Not JSON, treat as raw reference code
    }

    try {
      const response = await api.post(`${API_ENDPOINTS.PICKUPS.BASE}/verify`, { referenceCode });
      
      if (response.data.success) {
        toast.success('Pickup verified successfully!');
        onVerifySuccess(response.data); // specific response structure
        onClose();
      }
    } catch (err: unknown) {
      console.error('Verification failed:', err);
      setError(getErrorMessage(err));
    } finally {
      setIsVerifying(false);
    }
  }, [onVerifySuccess, onClose]);

  const onScanSuccess = useCallback((decodedText: string) => {
    if (scannerRef.current) {
         scannerRef.current.clear().catch(console.error);
         scannerRef.current = null;
    }
    handleVerification(decodedText);
  }, [handleVerification]);

  const onScanFailure = useCallback((_error: unknown) => {
    // console.warn(`Code scan error = ${error}`);
  }, []);

  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;
    let timer: ReturnType<typeof setTimeout>;

    if (isOpen && activeTab === 'scan') {
      timer = setTimeout(() => {
        try {
          const element = document.getElementById("reader");
          if (element) {
              scanner = new Html5QrcodeScanner(
                "reader",
                { fps: 10, qrbox: { width: 250, height: 250 } },
                /* verbose= */ false
              );
              
              scanner.render(onScanSuccess, onScanFailure);
              scannerRef.current = scanner;
          }
        } catch (err) {
          console.error("Failed to initialize scanner", err);
          setError("Failed to initialize camera. Please try manual entry.");
        }
      }, 100);

      return () => {
        clearTimeout(timer);
        if (scanner) {
          scanner.clear().catch(err => console.error("Failed to clear scanner", err));
        }
      };
    } else {
         if (scannerRef.current) {
            scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
            scannerRef.current = null;
        }
    }
  }, [isOpen, activeTab, onScanSuccess, onScanFailure]);

  const handleManualSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    handleVerification(manualCode.trim());
  }, [manualCode, handleVerification]);

  return {
    activeTab,
    setActiveTab,
    manualCode,
    setManualCode,
    isVerifying,
    error,
    handleManualSubmit
  };
};
