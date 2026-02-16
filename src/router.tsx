import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ROUTES } from './constants/routes';

import MainLayout from '@layouts/MainLayout';
import AuthLayout from '@layouts/AuthLayout';

import ProtectedRoute from '@components/auth/ProtectedRoute';
import GuestRoute from '@components/auth/GuestRoute';
const Login = lazy(() => import('@pages/Login'));
const Register = lazy(() => import('@pages/Register'));
const Dashboard = lazy(() => import('@pages/Dashboard'));
const PublicSearch = lazy(() => import('@pages/PublicSearch'));
const ItemsList = lazy(() => import('@pages/ItemsList'));
const CreateItem = lazy(() => import('@pages/CreateItem'));
const EditItem = lazy(() => import('@pages/EditItem'));
const ItemDetail = lazy(() => import('@pages/ItemDetail'));
const ClaimsList = lazy(() => import('@pages/ClaimsList'));
const FileClaim = lazy(() => import('@pages/FileClaim'));
const ClaimDetail = lazy(() => import('@pages/ClaimDetail'));
const ReportsList = lazy(() => import('@pages/ReportsList'));
const CreateReport = lazy(() => import('@pages/CreateReport'));
const ReportDetail = lazy(() => import('@pages/ReportDetail'));
const PickupsList = lazy(() => import('@pages/PickupsList'));
const PickupDetail = lazy(() => import('@pages/PickupDetail'));
const Analytics = lazy(() => import('@pages/Analytics'));
const StorageList = lazy(() => import('@pages/StorageList'));
const AdminStaff = lazy(() => import('@pages/AdminStaff'));
const Terms = lazy(() => import('@pages/Terms'));
const Privacy = lazy(() => import('@pages/Privacy'));
const UploadProof = lazy(() => import('@pages/UploadProof'));
const VerifyEmail = lazy(() => import('@pages/VerifyEmail'));

import {
  itemsListLoader,
  itemDetailLoader,
  claimsListLoader,
  claimDetailLoader,
  reportsListLoader,
  reportDetailLoader,
  pickupsListLoader,
  pickupDetailLoader,
  analyticsLoader,
  storageLoader,
  usersLoader,
} from './loaders';

import {
  createItemAction,
  updateItemAction,
  fileClaimAction,
  verifyClaimAction,
  createReportAction,
  completePickupAction,
  usersAction,
  storageAction,
} from './actions';
import ErrorBoundary from '@components/feedback/ErrorBoundary';
import { PageLoader, ShimmerList, ShimmerDetail } from '@components/ui';

import { ReactNode } from 'react';

const SuspenseWrapper = ({ 
  children, 
  fallback = <PageLoader /> 
}: { 
  children: ReactNode; 
  fallback?: ReactNode; 
}) => (
  <Suspense fallback={fallback}>
    {children}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Navigate to={ROUTES.SEARCH} replace />,
      },
      {
        path: ROUTES.DASHBOARD,
        element: <SuspenseWrapper><ProtectedRoute><Dashboard /></ProtectedRoute></SuspenseWrapper>,
      },
      {
        path: '/items',
        element: <SuspenseWrapper fallback={<ShimmerList />}><ProtectedRoute><ItemsList /></ProtectedRoute></SuspenseWrapper>,
        loader: itemsListLoader,
      },
      {
        path: '/items/create',
        element: <SuspenseWrapper><ProtectedRoute><CreateItem /></ProtectedRoute></SuspenseWrapper>,
        action: createItemAction,
      },
      {
        path: '/items/:id/edit',
        element: <SuspenseWrapper fallback={<ShimmerDetail />}><ProtectedRoute><EditItem /></ProtectedRoute></SuspenseWrapper>,
        loader: itemDetailLoader,
        action: updateItemAction,
      },
      {
        path: '/items/:id',
        element: <SuspenseWrapper fallback={<ShimmerDetail />}><ProtectedRoute><ItemDetail /></ProtectedRoute></SuspenseWrapper>,
        loader: itemDetailLoader,
      },
      {
        path: '/claims',
        element: <SuspenseWrapper fallback={<ShimmerList />}><ProtectedRoute><ClaimsList /></ProtectedRoute></SuspenseWrapper>,
        loader: claimsListLoader,
      },
      {
        path: '/claims/create',
        element: <SuspenseWrapper><ProtectedRoute><FileClaim /></ProtectedRoute></SuspenseWrapper>,
        action: fileClaimAction,
      },
      {
        path: '/claims/:id',
        element: <SuspenseWrapper fallback={<ShimmerDetail />}><ProtectedRoute><ClaimDetail /></ProtectedRoute></SuspenseWrapper>,
        loader: claimDetailLoader,
        action: verifyClaimAction,
      },
      {
        path: '/claims/:id/proof',
        element: <SuspenseWrapper><ProtectedRoute><UploadProof /></ProtectedRoute></SuspenseWrapper>,
      },
      {
        path: '/reports',
        element: <SuspenseWrapper fallback={<ShimmerList />}><ProtectedRoute><ReportsList /></ProtectedRoute></SuspenseWrapper>,
        loader: reportsListLoader,
      },
      {
        path: '/reports/create',
        element: <SuspenseWrapper><ProtectedRoute><CreateReport /></ProtectedRoute></SuspenseWrapper>,
        action: createReportAction,
      },
      {
        path: '/reports/:id',
        element: <SuspenseWrapper fallback={<ShimmerDetail />}><ProtectedRoute><ReportDetail /></ProtectedRoute></SuspenseWrapper>,
        loader: reportDetailLoader,
      },
      {
        path: '/pickups',
        element: <SuspenseWrapper fallback={<ShimmerList />}><ProtectedRoute><PickupsList /></ProtectedRoute></SuspenseWrapper>,
        loader: pickupsListLoader,
      },
      {
        path: '/pickups/:id',
        element: <SuspenseWrapper fallback={<ShimmerDetail />}><ProtectedRoute><PickupDetail /></ProtectedRoute></SuspenseWrapper>,
        loader: pickupDetailLoader,
        action: completePickupAction,
      },
      {
        path: '/analytics',
        element: <SuspenseWrapper><ProtectedRoute roles={['ADMIN', 'STAFF']}><Analytics /></ProtectedRoute></SuspenseWrapper>,
        loader: analyticsLoader,
      },
      {
        path: '/storage',
        element: <SuspenseWrapper fallback={<ShimmerList />}><ProtectedRoute roles={['ADMIN', 'STAFF']}><StorageList /></ProtectedRoute></SuspenseWrapper>,
        loader: storageLoader,
        action: storageAction,
      },
      {
        path: '/admin/staff',
        element: <SuspenseWrapper><ProtectedRoute roles={['ADMIN']}><AdminStaff /></ProtectedRoute></SuspenseWrapper>,
        loader: usersLoader,
        action: usersAction,
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <GuestRoute><Login /></GuestRoute>,
      },
      {
        path: 'register',
        element: <GuestRoute><Register /></GuestRoute>,
      },
      {
        path: 'verify-email',
        element: <VerifyEmail />,
      },
    ],
  },
  {
    path: ROUTES.SEARCH,
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <PublicSearch />,
      },
    ],
  },
  {
    path: '/terms',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Terms />,
      },
    ],
  },
  {
    path: '/privacy',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Privacy />,
      },
    ],
  },
]);
