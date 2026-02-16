import { ActionFunctionArgs } from 'react-router-dom';
import { pickupService } from '@services/pickup.service';

export async function completePickupAction({ request, params }: ActionFunctionArgs) {
  const { id } = params;
  
  if (!id) {
    return { error: 'Pickup ID is required' };
  }

  const formData = await request.formData();
  const intent = formData.get('intent');

  try {
    if (intent === 'complete') {
      const referenceCode = formData.get('referenceCode') as string;
      if (!referenceCode) {
        return { error: 'Reference code is required' };
      }
      await pickupService.complete(id, { referenceCode });
      return { success: true, message: 'Pickup completed successfully' };
    }

    return { error: 'Invalid action intent' };
  } catch (error) {
    console.error('Failed to complete pickup:', error);
    return { error: 'Failed to complete pickup. Please try again.' };
  }
}
