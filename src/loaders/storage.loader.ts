import { storageService } from '@services/storage.service';
import { getErrorMessage } from '@utils/errors';

export async function storageLoader() {
  try {
    const response = await storageService.getAll();
    return {
      locations: response.data,
      error: null,
    };
  } catch (error: unknown) {
    console.error('Failed to load storage locations:', error);
    return {
      locations: [],
      error: getErrorMessage(error),
    };
  }
}
