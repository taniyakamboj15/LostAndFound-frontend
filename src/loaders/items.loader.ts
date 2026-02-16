import { LoaderFunctionArgs } from 'react-router-dom';
import { itemService } from '@services/item.service';
import { ItemCategory } from '@constants/categories';
import { ItemStatus } from '@constants/status';

export async function itemsListLoader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const keyword = url.searchParams.get('keyword') || undefined;
  const category = url.searchParams.get('category') || undefined;
  const status = url.searchParams.get('status') || undefined;

  try {
    const response = await itemService.getItems({
      keyword,
      category: category as ItemCategory,
      status: status as ItemStatus,
    });
    
    return { items: response.data, error: null };
  } catch (error) {
    console.error('Failed to load items:', error);
    return { items: [], error: 'Failed to load items' };
  }
}

export async function itemDetailLoader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  
  if (!id) {
    throw new Response('Item ID is required', { status: 400 });
  }

  try {
    const response = await itemService.getById(id);
    return { item: response.data, error: null };
  } catch (error) {
    console.error('Failed to load item:', error);
    throw new Response('Item not found', { status: 404 });
  }
}
