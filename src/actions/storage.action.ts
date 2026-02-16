import { ActionFunctionArgs } from 'react-router-dom';
import { storageService } from '@services/storage.service';
import { getErrorMessage } from '@utils/errors';
import { CreateStorageData, UpdateStorageData } from '../types/storage.types';

export async function storageAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent');
  const id = formData.get('id') as string;

  const data = {
    name: formData.get('name') as string,
    location: formData.get('location') as string,
    shelfNumber: formData.get('shelfNumber') as string || undefined,
    binNumber: formData.get('binNumber') as string || undefined,
    capacity: parseInt(formData.get('capacity') as string),
    isActive: formData.get('isActive') === 'true',
  };

  try {
    if (intent === 'create-storage') {
      await storageService.create(data as CreateStorageData);
      return { success: true, message: 'Storage location created' };
    }

    if (intent === 'update-storage') {
      await storageService.update(id, data as UpdateStorageData);
      return { success: true, message: 'Storage location updated' };
    }

    return { error: 'Invalid intent' };
  } catch (error: unknown) {
    console.error('Storage action failed:', error);
    return { error: getErrorMessage(error) };
  }
}
