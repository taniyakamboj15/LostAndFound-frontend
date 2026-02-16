import { GoogleIcon } from '@assets/svg';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input, Card } from '@components/ui';
import { loginSchema } from '../validators';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginUser } from '../store/slices/authSlice';
import { useToast } from '../hooks/useToast';
import { ROUTES } from '../constants/routes';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await dispatch(loginUser(data)).unwrap();
      
      if (data.rememberMe) {
        localStorage.setItem('remembered_email', data.email);
      } else {
        localStorage.removeItem('remembered_email');
      }

      toast.success('Login successful!');
      navigate(ROUTES.DASHBOARD);
    } catch (err: unknown) {
      let message = 'Login failed. Please try again.';
      if (typeof err === 'string') message = err;
      else if (err instanceof Error) message = err.message;
      else if (typeof err === 'object' && err !== null && 'message' in err) message = String((err as {message: unknown}).message);
      
      toast.error(message);
    }
  };

  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
        <p className="text-gray-600 mt-1">Welcome back! Please sign in to continue.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          fullWidth
          {...register('email')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          fullWidth
          {...register('password')}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              {...register('rememberMe')}
            />
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </label>
          <Link
            to="/auth/forgot-password"
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
        >
          Sign In
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
          Sign in with Google
        </Button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Sign up
          </Link>
        </p>
      </form>
    </Card>
  );
};

export default Login;
