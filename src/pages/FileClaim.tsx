import { useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm, Resolver, FieldErrors } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AlertCircle, FileText as FileTextIcon } from 'lucide-react';
import BackButton from '@components/ui/BackButton';
import { Button, Card, Spinner } from '@components/ui';
import { claimSchema } from '@validators';
import { useItemDetail } from '@hooks/useItems';
import { useFileClaim } from '@hooks/useClaims';
import { ComponentErrorBoundary } from '@components/feedback';

// Components
import ClaimItemSummary from '@components/claims/ClaimItemSummary';
import ClaimDescriptionForm from '@components/claims/ClaimDescriptionForm';
import ClaimProofUpload from '@components/claims/ClaimProofUpload';

interface FileClaimFormData {
  description: string;
  itemId: string;
  lostReportId?: string;
}

const FileClaim = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const itemId = searchParams.get('itemId');
  
  const { item, isLoading: isItemLoading, error: itemError } = useItemDetail(itemId);
  const { 
    proofFiles, 
    isSubmitting, 
    handleFileChange, 
    removeFile, 
    submitClaim 
  } = useFileClaim(itemId);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FileClaimFormData>({
    resolver: yupResolver(claimSchema) as Resolver<FileClaimFormData>,
    defaultValues: {
      itemId: itemId || '',
    },
  });

  const onFileSelectorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFileChange(files);
  }, [handleFileChange]);

  const onSubmit = useCallback(async (data: FileClaimFormData) => {
    console.log('Submitting claim with data:', data);
    await submitClaim(data.description);
  }, [submitClaim]);

  const onInvalid = useCallback((errors: FieldErrors<FileClaimFormData>) => {
    console.error('Form validation errors:', errors);
  }, []);

  if (!itemId) {
    return (
      <Card className="max-w-2xl mx-auto text-center py-12">
        <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <p className="text-gray-600">Invalid claim request. Please select an item first.</p>
        <Button
          variant="primary"
          onClick={() => navigate('/items')}
          className="mt-4"
        >
          Browse Items
        </Button>
      </Card>
    );
  }

  if (isItemLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (itemError || !item) {
    return (
      <Card className="max-w-2xl mx-auto text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-600">{itemError || 'Item not found'}</p>
        <BackButton 
          label="Back to Items" 
          variant="outline" 
          className="mt-4"
        />      </Card>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">File a Claim</h1>
        <p className="text-gray-600 mt-1">
          Submit your claim for the found item
        </p>
      </div>

      <ComponentErrorBoundary title="Claim Form Error">
        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6">
          
          <ClaimItemSummary item={item} />
          
          <ClaimDescriptionForm register={register} errors={errors} />
          
          <ClaimProofUpload 
            proofFiles={proofFiles} 
            onFileChange={onFileSelectorChange} 
            onRemoveFile={removeFile} 
          />

          {/* Important Notice */}
          <Card className="bg-blue-50 border border-blue-200">
            <div className="flex items-start gap-3">
              <FileTextIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Important Information
                </p>
                <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
                  <li>Your claim will be reviewed by our staff</li>
                  <li>You may be asked to provide additional proof</li>
                  <li>False claims may result in account suspension</li>
                  <li>You'll be notified via email about your claim status</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
            >
              Submit Claim
            </Button>
          </div>
        </form>
      </ComponentErrorBoundary>
    </div>
  );
};

export default FileClaim;
