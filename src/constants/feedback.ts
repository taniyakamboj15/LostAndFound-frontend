export interface ComponentErrorBoundaryState {
  hasError: boolean;
}
export interface ErrorBoundaryState extends ComponentErrorBoundaryState {
  error: Error | null;
}

export const VERIFIED_CLAIM_STATUS = {
  title: 'Verified',
  description: 'Your claim has been verified and approved'
};

export const PROOF_DOCUMENT_TYPES = [
  { value: 'GOVERNMENT_ID', label: 'Government ID (Passport, Driver License)' },
  { value: 'INVOICE', label: 'Purchase Invoice / Receipt' },
  { value: 'PHOTO', label: 'Photo Verification' },
  { value: 'OWNERSHIP_PROOF', label: 'Other Proof of Ownership' },
  { value: 'OTHER', label: 'Other Document' },
];
