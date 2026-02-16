import { useState } from 'react';
import { getErrorMessage } from '@utils/errors';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Upload, X, ShieldCheck } from 'lucide-react';
import { Button, Card, Select } from '@components/ui';
import { useToast } from '@hooks/useToast';
import { claimService } from '@services/claim.service';
import { ComponentErrorBoundary } from '@components/feedback';
import { cn } from '@utils/helpers';
import { usePhotoUpload } from '@hooks/usePhotoUpload';

const UploadProof = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [proofType, setProofType] = useState('GOVERNMENT_ID');
  /* Hook logic replacement */
  const { 
    photos: files, 
    handlePhotoChange, 
    removePhoto 
  } = usePhotoUpload({
    maxPhotos: 5,
    maxSizeMB: 10,
    acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf']
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (files.length === 0) {
      toast.error('Please select at least one document');
      return;
    }

    setIsSubmitting(true);
    try {
      await claimService.uploadProof(id, {
        type: proofType,
        files: files,
      });
      toast.success('Proof documents uploaded successfully');
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ComponentErrorBoundary title="Upload Proof Error">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Back Button */}
        <Link to={`/claims/${id}`}>
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Claim
          </Button>
        </Link>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Upload Proof</h1>
          <p className="text-gray-600 mt-1">
            Provide additional documentation to verify your claim
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <div className="space-y-4">
              <Select
                label="Document Type"
                value={proofType}
                onChange={(e) => setProofType(e.target.value)}
                options={[
                  { value: 'GOVERNMENT_ID', label: 'Government ID (Passport, Driver License)' },
                  { value: 'INVOICE', label: 'Purchase Invoice / Receipt' },
                  { value: 'PHOTO', label: 'Photo Verification' },
                  { value: 'OWNERSHIP_PROOF', label: 'Other Proof of Ownership' },
                  { value: 'OTHER', label: 'Other Document' },
                ]}
                fullWidth
                required
              />

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 flex gap-3">
                <ShieldCheck className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <p className="text-sm text-blue-800">
                  Your documents are stored securely and only visible to authorized staff during the verification process.
                </p>
              </div>

              {/* Upload Dropzone */}
              <div>
                <label
                  htmlFor="proof-upload"
                  className={cn(
                    'flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer',
                    'hover:bg-gray-50 transition-colors border-gray-300'
                  )}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="h-10 w-10 text-gray-400 mb-3" />
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG or PDF up to 10MB (max 5 files)
                    </p>
                  </div>
                  <input
                    id="proof-upload"
                    type="file"
                    className="hidden"
                    accept="image/*,.pdf"
                    multiple
                    onChange={handlePhotoChange}
                  />
                </label>
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="space-y-2 mt-4">
                  <p className="text-sm font-medium text-gray-700">Selected Files:</p>
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded border"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-sm text-gray-900 truncate">{file.name}</span>
                        <span className="text-xs text-gray-500">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="p-1 hover:text-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/claims/${id}`)}
              fullWidth
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isSubmitting}
              disabled={files.length === 0}
            >
              Upload Verification Proof
            </Button>
          </div>
        </form>
      </div>
    </ComponentErrorBoundary>
  );
};

export default UploadProof;
