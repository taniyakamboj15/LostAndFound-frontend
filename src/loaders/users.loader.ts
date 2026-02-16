import { userService } from '@services/user.service';
import { getErrorMessage } from '@utils/errors';

export async function usersLoader() {
  try {
    const response = await userService.getAll();
    return {
      users: response.data,
      error: null,
    };
  } catch (error: unknown) {
    console.error('Failed to load users:', error);
    return {
      users: [],
      error: getErrorMessage(error),
    };
  }
}
