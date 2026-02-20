import { Trash2, Send } from 'lucide-react';
import { Button, Card } from '@components/ui';
import { CreateItemFormData } from '@/types/createItem.types';

type BulkItemData = CreateItemFormData & { photos: File[] };

interface BatchQueueProps {
  pendingItems: BulkItemData[];
  onRemoveItem: (index: number) => void;
  onSubmitBatch: () => void;
  isSubmitting: boolean;
}

const BatchQueue = ({ pendingItems, onRemoveItem, onSubmitBatch, isSubmitting }: BatchQueueProps) => (
  <Card className="p-6 sticky top-6 rounded-3xl border-2 border-gray-100 shadow-sm">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-bold text-gray-900">Batch Queue</h2>
      <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-bold ring-4 ring-primary-50">
        {pendingItems.length} Items
      </span>
    </div>
    
    {pendingItems.length === 0 ? (
      <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50/50">
        <Layers className="h-10 w-10 text-gray-200 mx-auto mb-3" />
        <p className="text-gray-400 font-medium">Queue is empty</p>
        <p className="text-xs text-gray-300 mt-1">Add items using the form to start a batch</p>
      </div>
    ) : (
      <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1 custom-scrollbar">
        {pendingItems.map((item, idx) => (
          <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-4 relative group hover:border-primary-200 transition-all">
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <p className="font-bold text-gray-900 truncate pr-6">{item.category}</p>
                <span className="shrink-0 px-2 py-0.5 rounded-lg bg-gray-50 text-[10px] font-bold text-gray-500 uppercase">
                  {item.photos.length} PH
                </span>
              </div>
              <p className="text-xs text-gray-500 truncate mb-2">{item.description}</p>
              <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                <span className="truncate max-w-[80px]">{item.locationFound}</span>
                <span className="w-1 h-1 bg-gray-200 rounded-full" />
                <span>{item.dateFound ? new Date(item.dateFound).toLocaleDateString() : ''}</span>
              </div>
            </div>
            <button 
              onClick={() => onRemoveItem(idx)}
              className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors p-1"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    )}

    <div className="mt-8 pt-6 border-t border-gray-100">
      <Button 
        fullWidth 
        variant="primary" 
        size="lg"
        disabled={pendingItems.length === 0 || isSubmitting}
        onClick={onSubmitBatch}
        isLoading={isSubmitting}
        className="rounded-2xl py-6 shadow-lg shadow-primary-200"
      >
        <Send className="h-4 w-4 mr-2" />
        Submit Batch ({pendingItems.length})
      </Button>
      <p className="text-[10px] text-center text-gray-400 mt-4 font-medium uppercase tracking-widest">
        Items will be registered instantly
      </p>
    </div>
  </Card>
);

// Helper for the icon in empty state
import { Layers } from 'lucide-react';

export default BatchQueue;
