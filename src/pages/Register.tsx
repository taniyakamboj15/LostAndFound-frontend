import { GoogleIcon } from '@assets/svg';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Input, Card } from '@components/ui';
import { registerSchema } from '../validators';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { registerUser } from '@store/slices/authSlice';
import { useToast } from '@hooks/useToast';
import { ROUTES } from '../constants/routes';
import { getErrorMessage } from '../utils/errors';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
}

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await dispatch(registerUser(data)).unwrap();
      toast.success('Registration successful! Please check your email to verify your account.');
      navigate(ROUTES.LOGIN);
    } catch (err: unknown) {
      let message = 'Registration failed. Please try again.';
      message = getErrorMessage(err);
      toast.error(message);
    }
  };

  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
        <p className="text-gray-600 mt-1">Join us to start recovering lost items.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          placeholder="John Doe"
          error={errors.name?.message}
          fullWidth
          required
          {...register('name')}
        />

        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          fullWidth
          required
          {...register('email')}
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="1234567890"
          helperText="10 digits, optional"
          error={errors.phone?.message}
          fullWidth
          {...register('phone')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          helperText="At least 8 characters with uppercase, lowercase, and number"
          error={errors.password?.message}
          fullWidth
          required
          {...register('password')}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          fullWidth
          required
          {...register('confirmPassword')}
        />

        <div className="flex items-start">
          <input
            type="checkbox"
            required
            className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="ml-2 text-sm text-gray-600">
            I agree to the{' '}
            <Link to="/terms" className="text-primary-600 hover:text-primary-700">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-primary-600 hover:text-primary-700">
              Privacy Policy
            </Link>
          </span>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
        >
          Create Account
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          fullWidth
          onClick={() => {
            window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
          }}
        >
          <GoogleIcon className="w-5 h-5 mr-2" />
          Sign up with Google
        </Button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Sign in
          </Link>
        </p>
      </form>
    </Card>
  );
};

export default Register;
