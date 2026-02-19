import { Card, Button } from '@components/ui';
import { FileText, Upload } from 'lucide-react';
import { API_BASE_URL } from '../../constants/api';
import { formatRelativeTime } from '@utils/formatters';
import { ProofDocument } from '../../types';

interface ClaimDocumentsProps {
  documents: ProofDocument[];
}

const ClaimDocuments = ({ documents }: ClaimDocumentsProps) => (
  <Card>
    <h2 className="text-xl font-semibold text-gray-900 mb-4">
      All Documents ({documents.length})
    </h2>
    {documents.length > 0 ? (
      <div className="space-y-3">
        {documents.map((doc) => (
          <div
            key={doc.path}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">{doc.filename}</p>
                <p className="text-xs text-gray-500">
                  {doc.type} • Uploaded {formatRelativeTime(doc.uploadedAt)}
                </p>
              </div>
            </div>
            <a
              href={doc.path.startsWith('http') ? doc.path : `${API_BASE_URL}/${doc.path}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="sm">
                View Original
              </Button>
            </a>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-8 text-gray-500">
        <Upload className="h-12 w-12 mx-auto mb-2 text-gray-400" />
        <p>No documents uploaded yet</p>
      </div>
    )}
  </Card>
);

export default ClaimDocuments;
