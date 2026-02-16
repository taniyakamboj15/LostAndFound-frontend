import { LoaderFunctionArgs } from 'react-router-dom';
import { pickupService } from '@services/pickup.service';

export async function pickupsListLoader() {
  try {
    const response = await pickupService.getAll();
    return { pickups: response.data, error: null };
  } catch (error) {
    console.error('Failed to load pickups:', error);
    return { pickups: [], error: 'Failed to load pickups' };
  }
}

export async function pickupDetailLoader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  
  if (!id) {
    throw new Response('Pickup ID is required', { status: 400 });
  }

  try {
    const response = await pickupService.getById(id);
    return { pickup: response.data, error: null };
  } catch (error) {
    console.error('Failed to load pickup:', error);
    throw new Response('Pickup not found', { status: 404 });
  }
}
