import { ActionFunctionArgs, redirect } from 'react-router-dom';
import { itemService } from '@services/item.service';
import { ItemCategory } from '@constants/categories';

export async function createItemAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  
  try {
    const itemData = {
      category: formData.get('category') as ItemCategory,
      description: formData.get('description') as string,
      locationFound: formData.get('locationFound') as string,
      
      dateFound: formData.get('dateFound') as string,
      isHighValue: formData.get('isHighValue') === 'true',
      estimatedValue: formData.get('estimatedValue') ? Number(formData.get('estimatedValue')) : undefined,
      identifyingFeatures: formData.get('identifyingFeatures') as string,
      photos: formData.getAll('photos') as File[],
    };

    const response = await itemService.create(itemData);
    
    if (!response.data) {
      throw new Error('No data received from server');
    }
    
    // Redirect to the newly created item
    return redirect(`/items/${response.data._id}`);
  } catch (error) {
    console.error('Failed to create item:', error);
    return { error: 'Failed to create item. Please try again.' };
  }
}

export async function updateItemAction({ request, params }: ActionFunctionArgs) {
  const { id } = params;
  
  if (!id) {
    return { error: 'Item ID is required' };
  }

  const formData = await request.formData();
  const intent = formData.get('intent');

  try {
    if (intent === 'update-status') {
      const status = formData.get('status') as string;
      await itemService.updateStatus(id, status);
      return { success: true, message: 'Status updated successfully' };
    }

    if (intent === 'update-details') {
      const updateData = {
        description: formData.get('description') as string,
        locationFound: formData.get('locationFound') as string,
        isHighValue: formData.get('isHighValue') === 'true',
        estimatedValue: formData.get('estimatedValue') ? Number(formData.get('estimatedValue')) : undefined,
      };

      await itemService.update(id, updateData);
      return { success: true, message: 'Item updated successfully' };
    }

    return { error: 'Invalid action intent' };
  } catch (error) {
    console.error('Failed to update item:', error);
    return { error: 'Failed to update item. Please try again.' };
  }
}
