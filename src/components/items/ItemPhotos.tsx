import { useState } from 'react';
import { Package } from 'lucide-react';
import { Card } from '@components/ui';
import { UploadedFile } from '../../types/item.types';
import { API_BASE_URL } from '../../constants/api';

interface ItemPhotosProps {
  photos: UploadedFile[];
  itemTitle: string;
}

const ItemPhotos = ({ photos, itemTitle }: ItemPhotosProps) => {
  const [selectedPhoto, setSelectedPhoto] = useState<number>(0);

  return (
    <Card>
      {/* Main Photo */}
      <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
        {photos && photos.length > 0 && photos[selectedPhoto] ? (
          <img
            src={photos[selectedPhoto].path.startsWith('http') ? photos[selectedPhoto].path : `${API_BASE_URL}/${photos[selectedPhoto].path}`}
            alt={`${itemTitle} - ${photos[selectedPhoto].filename}`}
            className="w-full h-full object-contain"
          />
        ) : (
          <Package className="h-16 w-16 text-gray-400" />
        )}
      </div>

      {/* Thumbnail Gallery */}
      {photos && photos.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {photos.map((photo: UploadedFile, index: number) => (
            <button
              key={index}
              onClick={() => setSelectedPhoto(index)}
              className={`aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border-2 ${
                selectedPhoto === index ? 'border-primary-500' : 'border-transparent'
              }`}
            >
              <img
                src={photo.path.startsWith('http') ? photo.path : `${API_BASE_URL}/${photo.path}`}
                alt={photo.filename}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </Card>
  );
};

export default ItemPhotos;
