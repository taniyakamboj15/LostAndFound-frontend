
import { useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ArrowLeft } from 'lucide-react';
import { Button, Card, Input, Spinner } from '@components/ui';
import { useItemDetail } from '@hooks/useItems';
import { useFileClaim } from '@hooks/useClaims';
import { ComponentErrorBoundary } from '@components/feedback';
import ClaimItemSummary from '@components/claims/ClaimItemSummary';
import ClaimDescriptionForm from '@components/claims/ClaimDescriptionForm';

import ClaimProofUpload from '@components/claims/ClaimProofUpload';

// Validation Schema including Email
const anonymousClaimSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  description: yup.string().required('Description is required').min(10, 'Description too short'),
  itemId: yup.string().required(),
}).required();

type AnonymousClaimFormData = yup.InferType<typeof anonymousClaimSchema>;

const AnonymousClaim = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const itemId = searchParams.get('itemId');
  
  const { item, isLoading: isItemLoading, error: itemError } = useItemDetail(itemId);
  const { fileAnonymousClaim, isSubmitting, proofFiles, handleFileChange, removeFile } = useFileClaim(itemId);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AnonymousClaimFormData>({
    resolver: yupResolver(anonymousClaimSchema),
    defaultValues: {
      itemId: itemId || '',
    },
  });

  const onSubmit = useCallback(async (data: AnonymousClaimFormData) => {
      await fileAnonymousClaim(data);
  }, [fileAnonymousClaim]);

  if (!itemId) return <div className="text-center p-8">Invalid Item ID</div>;

  if (isItemLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (itemError || !item) {
    return (
      <div className="text-center p-8 text-red-500">
        Item not found or unavailable.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">File Anonymous Claim</h1>
        <p className="text-gray-600 mt-1">
          We need your email to communicate the status of your claim.
        </p>
      </div>

      <ComponentErrorBoundary title="Claim Form Error">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          <ClaimItemSummary item={item} />

          <Card>
              <h3 className="text-lg font-medium mb-4">Contact Information</h3>
              <Input
                label="Email Address"
                placeholder="you@example.com"
                error={errors.email?.message}
                fullWidth
                required
                {...register('email')}
              />
          </Card>
          
          <ClaimDescriptionForm register={register} errors={errors} />

          <ClaimProofUpload 
            proofFiles={proofFiles} 
            onFileChange={(e) => handleFileChange(Array.from(e.target.files || []))} 
            onRemoveFile={removeFile} 
          />
          
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              variant="primary"
              fullWidth
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

export default AnonymousClaim;
