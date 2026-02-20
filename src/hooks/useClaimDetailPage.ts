import { useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { useClaimActions } from './useClaimActions';
import { useClaimPayment } from './useClaimPayment';
import { useTransferDetail } from './useTransfers';
import api from '../services/api';
import { User, Storage } from '@app-types/index';

export const useClaimDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin, isStaff } = useAuth();

  const { 
    claim, 
    isLoading: loading, 
    handleVerify, 
    handleReject, 
    isSubmitting,
    isRejectModalOpen,
    openRejectModal,
    closeRejectModal,
    rejectionReason,
    setRejectionReason,
    refresh,
    handleRequestProof,
    handleDelete
  } = useClaimActions(id || null);

  // Challenge-response state
  const [challengeQuestion, setChallengeQuestion] = useState('');
  const [challengeAnswers, setChallengeAnswers] = useState<Record<string, string>>({});
  const [challengeLoadingId, setChallengeLoadingId] = useState<string | null>(null);
  const [isChallengeOpen, setIsChallengeOpen] = useState(false);

  // Tab State for Admin/Staff
  const [activeTab, setActiveTab] = useState<'DETAILS' | 'TRANSFER'>('DETAILS');

  const handleSubmitChallengeQuestion = useCallback(async () => {
    if (!id || !challengeQuestion.trim()) return;
    setChallengeLoadingId('new');
    try {
      await api.post(`/api/claims/${id}/challenge-question`, { question: challengeQuestion });
      setChallengeQuestion('');
      refresh();
    } catch { /* ignore */ }
    setChallengeLoadingId(null);
  }, [id, challengeQuestion, refresh]);

  const handleSubmitChallengeAnswer = useCallback(async (challengeId: string) => {
    const answer = challengeAnswers[challengeId];
    if (!id || !answer?.trim()) return;
    setChallengeLoadingId(challengeId);
    try {
      await api.post(`/api/claims/${id}/challenge-answer/${challengeId}`, { answer });
      refresh();
    } catch { /* ignore */ }
    setChallengeLoadingId(null);
  }, [id, challengeAnswers, refresh]);

  const claimantId = useMemo(() => {
    if (!claim) return null;
    return typeof claim.claimantId === 'object' ? (claim.claimantId as User)._id : claim.claimantId;
  }, [claim]);

  const isClaimant = useMemo(() => {
    if (!user || !claimantId) return false;
    return user._id === claimantId || user.id === claimantId;
  }, [user, claimantId]);

  const {
    feeBreakdown,
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    clientSecret,
    loadingFee,
    isPayLoading,
    handlePayClick,
    handlePaymentSuccess
  } = useClaimPayment(claim, isClaimant, refresh);

  const { transfer, isLoading: loadingTransfer } = useTransferDetail(id);

  // Helpers for view
  const toStorage = useMemo(() => {
    if (!transfer || !transfer.toStorageId) return null;
    return typeof transfer.toStorageId === 'object' ? (transfer.toStorageId as Storage) : null;
  }, [transfer]);

  const fromStorage = useMemo(() => {
    if (!transfer || !transfer.fromStorageId) return null;
    return typeof transfer.fromStorageId === 'object' ? (transfer.fromStorageId as Storage) : null;
  }, [transfer]);

  return {
    id,
    navigate,
    user,
    isAdmin: isAdmin(),
    isStaff: isStaff(),
    claim,
    loading,
    handleVerify,
    handleReject,
    isSubmitting,
    isRejectModalOpen,
    openRejectModal,
    closeRejectModal,
    rejectionReason,
    setRejectionReason,
    refresh,
    handleRequestProof,
    handleDelete,
    challengeQuestion,
    setChallengeQuestion,
    challengeAnswers,
    setChallengeAnswers,
    challengeLoadingId,
    isChallengeOpen,
    setIsChallengeOpen,
    activeTab,
    setActiveTab,
    handleSubmitChallengeQuestion,
    handleSubmitChallengeAnswer,
    isClaimant,
    feeBreakdown,
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    clientSecret,
    loadingFee,
    isPayLoading,
    handlePayClick,
    handlePaymentSuccess,
    transfer,
    loadingTransfer,
    toStorage,
    fromStorage
  };
};
