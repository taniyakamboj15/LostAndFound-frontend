import { Card } from '@components/ui';
import { formatDate } from '@utils/formatters';
import type { Item } from '../../types';

interface ClaimItemDetailsProps {
  item: Item;
  description: string;
}

const ClaimItemDetails = ({ item, description }: ClaimItemDetailsProps) => (
  <div className="space-y-6">
    {/* Claim Identification Statement */}
    <Card>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Statement of Ownership</h2>
      <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
        <p className="text-gray-900 whitespace-pre-wrap">
          {description || 'No description provided.'}
        </p>
      </div>
    </Card>

    {/* Item Details */}
    <Card>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Full Details</h2>
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-700">Item Description</p>
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
      </div>
    </Card>
  </div>
);

export default ClaimItemDetails;
