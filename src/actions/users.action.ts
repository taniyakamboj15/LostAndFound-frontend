import { ActionFunctionArgs } from 'react-router-dom';
import { userService } from '@services/user.service';
import { getErrorMessage } from '@utils/errors';
import { UserRole } from '@constants/roles';

export async function usersAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent');

  try {
    if (intent === 'add-staff') {
      const data = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        role: formData.get('role') as UserRole,
      };

      const response = await userService.create(data);
      return { success: true, user: response.data };
    }

    return { error: 'Invalid action intent' };
  } catch (error: unknown) {
    console.error('User action failed:', error);
    return { error: getErrorMessage(error) };
  }
}
