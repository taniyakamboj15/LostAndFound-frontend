import { ActionFunctionArgs, redirect } from 'react-router-dom';
import { claimService } from '@services/claim.service';

export async function fileClaimAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  
  try {
    const claimData = {
      itemId: formData.get('itemId') as string,
      description: formData.get('description') as string,
      proofOfOwnership: formData.getAll('proofOfOwnership') as File[],
    };

    const response = await claimService.create(claimData);
    
    // Redirect to the claim detail page
    return redirect(`/claims/${response.data._id}`);
  } catch (error) {
    console.error('Failed to file claim:', error);
    return { error: 'Failed to file claim. Please try again.' };
  }
}

export async function verifyClaimAction({ request, params }: ActionFunctionArgs) {
  const { id } = params;
  
  if (!id) {
    return { error: 'Claim ID is required' };
  }

  const formData = await request.formData();
  const intent = formData.get('intent');

  try {
    if (intent === 'verify') {
      await claimService.verify(id, {});
      return { success: true, message: 'Claim verified successfully' };
    }

    if (intent === 'reject') {
      const reason = formData.get('reason') as string;
      await claimService.reject(id, { reason });
      return { success: true, message: 'Claim rejected' };
    }

    return { error: 'Invalid action intent' };
  } catch (error) {
    console.error('Failed to process claim:', error);
    return { error: 'Failed to process claim. Please try again.' };
  }
}
