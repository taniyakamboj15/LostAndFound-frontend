import { useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm, Resolver, FieldErrors } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Upload, X, FileText as FileTextIcon, AlertCircle } from 'lucide-react';
import BackButton from '@components/ui/BackButton';
import { Button, Textarea, Card, Spinner } from '@components/ui';
import { claimSchema } from '@validators';
import { cn } from '@utils/helpers';
import { useItemDetail } from '@hooks/useItems';
import { useFileClaim } from '@hooks/useClaims';
import { ComponentErrorBoundary } from '@components/feedback';
import { formatDate } from '@utils/formatters';

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
          {/* Item Information */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Item You're Claiming
            </h2>
            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-700">Description</p>
                <p className="text-gray-900">{item.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Category</p>
                  <p className="text-gray-900">{item.category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Date Found</p>
                  <p className="text-gray-900">{formatDate(item.dateFound)}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Location Found</p>
                <p className="text-gray-900">{item.locationFound}</p>
              </div>
            </div>
          </Card>

        {/* Claim Description */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Why is this your item? <span className="text-red-500">*</span>
          </h2>
          <Textarea
            placeholder="Describe how you can identify this item as yours. Include specific details like brand, model, unique features, when and where you lost it, etc."
            error={errors.description?.message}
            fullWidth
            required
            rows={6}
            {...register('description')}
          />
          <p className="text-sm text-gray-500 mt-2">
            Be as specific as possible. This helps us verify your ownership.
          </p>
        </Card>

        {/* Proof Documents */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Proof of Ownership <span className="text-red-500">*</span>
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Upload documents that prove you own this item (e.g., purchase receipt, photos showing you with the item, ID card, etc.)
          </p>

          <div className="space-y-4">
            {/* Upload Button */}
            <div>
              <label
                htmlFor="proof-upload"
                className={cn(
                  'flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer',
                  'hover:bg-gray-50 transition-colors',
                  proofFiles.length >= 5
                    ? 'border-gray-300 bg-gray-100 cursor-not-allowed'
                    : 'border-gray-300'
                )}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Images or PDF up to 10MB ({proofFiles.length}/5 files)
                  </p>
                </div>
                  <input
                    id="proof-upload"
                    type="file"
                    className="hidden"
                    accept="image/*,application/pdf"
                    multiple
                    onChange={onFileSelectorChange}
                    disabled={proofFiles.length >= 5}
                  />
              </label>
            </div>

            {/* File List */}
            {proofFiles.length > 0 && (
              <div className="space-y-2">
                {proofFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FileTextIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {proofFiles.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileTextIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>No proof documents uploaded yet</p>
              </div>
            )}
          </div>
        </Card>

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
