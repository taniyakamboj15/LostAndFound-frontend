
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Trash2, Send, ArrowLeft } from 'lucide-react';
import { Button, Card } from '@components/ui';
import { BulkItemForm } from '@components/items/BulkItemForm';
import { useCreateItem } from '@hooks/useItems';
import { useToast } from '@hooks/useToast';
import { CreateItemFormData } from '@/types/createItem.types';

// Extended type to include photos (which are not in the JSON form data usually)
type BulkItemData = CreateItemFormData & { photos: File[] };

const BulkIntakePage = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const { createItem } = useCreateItem(); // We might need a bulkCreateItem hook optimization later
    
    const [pendingItems, setPendingItems] = useState<BulkItemData[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddItem = (item: BulkItemData) => {
        setPendingItems(prev => [...prev, item]);
        toast.success('Item added to batch');
    };

    const handleRemoveItem = (index: number) => {
        setPendingItems(prev => prev.filter((_, i) => i !== index));
    };

    const submitAll = async () => {
        if (pendingItems.length === 0) return;
        
        setIsSubmitting(true);
        try {
            // Sequential submission for now to reuse existing API
            // Optimally, we'd have a /api/items/bulk endpoint
            for (const item of pendingItems) {
                const formData = new FormData();
                Object.entries(item).forEach(([key, value]) => {
                    if (key === 'photos') return; // Handle photos separately
                    if (value !== undefined && value !== null) {
                        if (value instanceof Date) {
                            formData.append(key, value.toISOString());
                        } else {
                            formData.append(key, value.toString());
                        }
                    }
                });
                item.photos.forEach(p => formData.append('photos', p));
                
                await createItem(formData);
            }
            
            toast.success(`Successfully registered ${pendingItems.length} items`);
            navigate('/items');
        } catch (error) {
            console.error('Bulk upload failed', error);
            toast.error('Failed to complete batch upload');
        } finally {
            setIsSubmitting(false);
        }
    };

    const lastItem = pendingItems.length > 0 ? pendingItems[pendingItems.length - 1] : undefined;

    return (
        <div className="max-w-5xl mx-auto space-y-8 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <Layers className="h-8 w-8 text-primary-600" />
                        Bulk Intake
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Rapidly register multiple found items.
                    </p>
                </div>
                <Button variant="outline" onClick={() => navigate('/items')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Col: Form */}
                <div className="lg:col-span-2 space-y-6">
                    <BulkItemForm 
                        onAddItem={handleAddItem} 
                        lastItem={lastItem}
                    />
                </div>

                {/* Right Col: Batch List */}
                <div className="space-y-6">
                    <Card className="p-4 sticky top-6">
                        <h2 className="text-lg font-semibold mb-4 flex justify-between items-center">
                            Batch Queue 
                            <span className="bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full text-sm">
                                {pendingItems.length}
                            </span>
                        </h2>
                        
                        {pendingItems.length === 0 ? (
                            <div className="text-center py-8 text-gray-400 border-2 border-dashed rounded-lg">
                                No items in batch
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                                {pendingItems.map((item, idx) => (
                                    <div key={idx} className="bg-white p-3 rounded-lg border shadow-sm flex gap-3 relative group">
                                         <div className="flex-1 min-w-0">
                                             <div className="flex justify-between">
                                                <p className="font-medium text-gray-900 truncate">{item.category}</p>
                                                <span className="text-xs text-gray-500">
                                                    {item.photos.length} photo(s)
                                                </span>
                                             </div>
                                             <p className="text-sm text-gray-500 truncate">{item.description}</p>
                                             <div className="flex gap-2 mt-1 text-xs text-gray-400">
                                                 <span>{item.locationFound}</span>
                                                 <span>•</span>
                                                 <span>{item.dateFound ? new Date(item.dateFound).toLocaleDateString() : ''}</span>
                                             </div>
                                         </div>
                                         <button 
                                            onClick={() => handleRemoveItem(idx)}
                                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                         >
                                             <Trash2 className="h-4 w-4" />
                                         </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="mt-6 pt-4 border-t">
                            <Button 
                                fullWidth 
                                variant="primary" 
                                size="lg"
                                disabled={pendingItems.length === 0 || isSubmitting}
                                onClick={submitAll}
                                isLoading={isSubmitting}
                            >
                                <Send className="h-4 w-4 mr-2" />
                                Submit Batch ({pendingItems.length})
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default BulkIntakePage;
