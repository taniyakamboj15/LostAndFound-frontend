import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BulkItemForm } from '@components/items/BulkItemForm';
import { useCreateItem } from '@hooks/useItems';
import { useToast } from '@hooks/useToast';
import { CreateItemFormData } from '@/types/createItem.types';
import { ComponentErrorBoundary } from '@components/feedback';

// Sub-components
import BulkIntakeHeader from '@components/items/bulk/BulkIntakeHeader';
import BatchQueue from '@components/items/bulk/BatchQueue';

type BulkItemData = CreateItemFormData & { photos: File[] };

const BulkIntakePage = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const { createItem } = useCreateItem();
    
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
            for (const item of pendingItems) {
                const formData = new FormData();
                Object.entries(item).forEach(([key, value]) => {
                    if (key === 'photos') return; 
                    if (value !== undefined && value !== null) {
                        if (value instanceof Date) {
                            formData.set(key, value.toISOString());
                        } else {
                            formData.set(key, value.toString());
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
        <ComponentErrorBoundary title="Bulk Intake Error">
            <div className="max-w-6xl mx-auto space-y-10 p-6">
                <BulkIntakeHeader />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Col: Form */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-3xl border-2 border-gray-100 p-1 shadow-sm overflow-hidden">
                            <BulkItemForm 
                                onAddItem={handleAddItem} 
                                lastItem={lastItem}
                            />
                        </div>
                    </div>

                    {/* Right Col: Batch List */}
                    <div className="space-y-6">
                        <BatchQueue 
                            pendingItems={pendingItems}
                            onRemoveItem={handleRemoveItem}
                            onSubmitBatch={submitAll}
                            isSubmitting={isSubmitting}
                        />
                    </div>
                </div>
            </div>
        </ComponentErrorBoundary>
    );
};

export default BulkIntakePage;
