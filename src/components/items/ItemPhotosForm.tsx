import { Upload, X } from 'lucide-react';
import { Card } from '@components/ui';
import { UploadedFile } from '../../types/item.types';
import { API_BASE_URL } from '../../constants/api';

interface ItemPhotosFormProps {
  existingPhotos: UploadedFile[];
  photos: File[];
  photoPreviews: string[];
  onRemoveExisting: (index: number) => void;
  onRemoveNew: (index: number) => void;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ItemPhotosForm = ({
  existingPhotos,
  photos,
  photoPreviews,
  onRemoveExisting,
  onRemoveNew,
  onPhotoChange,
}: ItemPhotosFormProps) => {
  const totalPhotos = existingPhotos.length + photos.length;

  return (
    <Card>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Photos <span className="text-red-500">*</span>
      </h2>
      <div className="space-y-4">
        {/* Existing Photos */}
        {existingPhotos.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Existing Photos</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {existingPhotos.map((photo, index) => (
                <div key={index} className="relative group">
                  <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src={photo.path.startsWith('http') ? photo.path : `${API_BASE_URL}/${photo.path}`} 
                      alt={photo.filename} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveExisting(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload New Photos */}
        {totalPhotos < 5 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Add New Photos</p>
            <label
              htmlFor="photo-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors border-gray-300"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG up to 5MB ({totalPhotos}/5 photos)
                </p>
              </div>
              <input
                id="photo-upload"
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={onPhotoChange}
              />
            </label>
          </div>
        )}

        {/* New Photo Previews */}
        {photoPreviews.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">New Photos</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photoPreviews.map((preview: string, index: number) => (
              <div key={index} className="relative group">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => onRemoveNew(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ItemPhotosForm;
