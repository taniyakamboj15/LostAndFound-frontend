import { Card } from '@components/ui';
import { formatDate } from '@utils/formatters';
import { Item } from '../../types/item.types';

interface ClaimItemSummaryProps {
  item: Item;
}

const ClaimItemSummary = ({ item }: ClaimItemSummaryProps) => (
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
);

export default ClaimItemSummary;
