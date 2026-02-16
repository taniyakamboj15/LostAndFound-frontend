import { LoaderFunctionArgs } from 'react-router-dom';
import { claimService } from '@services/claim.service';
import { ClaimStatus } from '@constants/status';

export async function claimsListLoader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const status = url.searchParams.get('status') || undefined;
  const keyword = url.searchParams.get('keyword') || undefined;

  // Get user role from localStorage
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;
  const isClaimant = user?.role === 'CLAIMANT';

  try {
    const filters = {
      status: status as ClaimStatus,
      keyword,
    };
    
    const response = isClaimant 
      ? await claimService.getMyClaims(filters)
      : await claimService.getAll(filters);
    
    return { claims: response.data, error: null };
  } catch (error) {
    console.error('Failed to load claims:', error);
    return { claims: [], error: 'Failed to load claims' };
  }
}

export async function claimDetailLoader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  
  if (!id) {
    throw new Response('Claim ID is required', { status: 400 });
  }

  try {
    const response = await claimService.getById(id);
    return { claim: response.data, error: null };
  } catch (error) {
    console.error('Failed to load claim:', error);
    throw new Response('Claim not found', { status: 404 });
  }
}
