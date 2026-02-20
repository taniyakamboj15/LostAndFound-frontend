import { Card } from '@components/ui';
import { API_BASE_URL } from '../../constants/api';
import { UploadedFile, ProofDocument } from '../../types';

interface ClaimPhotosProps {
  itemPhotos: UploadedFile[];
  proofDocuments: ProofDocument[];
}

const ClaimPhotos = ({ itemPhotos, proofDocuments }: ClaimPhotosProps) => {
  const photoDocs = proofDocuments.filter((doc) => doc.filename.match(/\.(jpg|jpeg|png|gif)$/i));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Found Item Photos</h2>
        <div className="grid grid-cols-2 gap-2">
          {itemPhotos.map((photo, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
              <img
                src={photo.path.startsWith('http') ? photo.path : `${API_BASE_URL}/${photo.path}`}
                alt={`Found item ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          ))}
          {itemPhotos.length === 0 && (
            <div className="col-span-2 py-8 text-center text-gray-500 bg-gray-50 rounded-lg">
              No photos available
            </div>
          )}
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Ownership Proof Photos</h2>
        <div className="grid grid-cols-2 gap-2">
          {photoDocs.map((doc, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
              <img
                src={doc.path.startsWith('http') ? doc.path : `${API_BASE_URL}/${doc.path}`}
                alt={`Proof ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          ))}
          {photoDocs.length === 0 && (
            <div className="col-span-2 py-8 text-center text-gray-500 bg-gray-50 rounded-lg">
              No proof images available
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ClaimPhotos;
