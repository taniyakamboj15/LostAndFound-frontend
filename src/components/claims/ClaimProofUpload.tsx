import { Upload, FileText as FileTextIcon, X } from 'lucide-react';
import { Card } from '@components/ui';
import { cn } from '@utils/helpers';

interface ClaimProofUploadProps {
  proofFiles: File[];
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
}

const ClaimProofUpload = ({ proofFiles, onFileChange, onRemoveFile }: ClaimProofUploadProps) => (
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
              onChange={onFileChange}
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
                onClick={() => onRemoveFile(index)}
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
);

export default ClaimProofUpload;
