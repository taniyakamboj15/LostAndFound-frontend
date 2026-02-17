import { useAuth } from '@hooks/useAuth';
import { Card, Spinner } from '@components/ui';
import { Package, Users, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ROUTES } from '../constants/routes';
import { useDashboard } from '@hooks/useDashboard';
import { ComponentErrorBoundary } from '@components/feedback';
import { getItemImageUrl } from '@utils/image';

const Dashboard = () => {
  const { user, isAdmin, isStaff, isLoading: authLoading } = useAuth();
  const { metrics, recentItems, isLoading: dashboardLoading, error } = useDashboard();

  if (authLoading || (dashboardLoading && !metrics)) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error && !metrics) {
    return (
      <Card className="max-w-2xl mx-auto text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-600">{error}</p>
      </Card>
    );
  }

  return (
    <ComponentErrorBoundary title="Dashboard Error">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-1">
            {isAdmin() && 'Admin Dashboard - Full system access'}
            {isStaff() && !isAdmin() && 'Staff Dashboard - Manage items and claims'}
            {user?.role === 'CLAIMANT' && 'Your Dashboard - Track your claims and reports'}
          </p>
        </div>

        {metrics && (isAdmin() || isStaff()) && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card hover>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Items</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{metrics.totalItemsFound}</p>
                  <p className="text-sm text-gray-500 mt-1">Found items registered</p>
                </div>
                <div className="p-3 bg-primary-100 rounded-lg">
                  <Package className="h-6 w-6 text-primary-600" />
                </div>
              </div>
            </Card>

            <Card hover>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Claims</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{metrics.pendingClaims}</p>
                  <p className="text-sm text-blue-600 mt-1">Pending review</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card hover>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Returned Items</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{metrics.totalItemsReturned}</p>
                  <p className="text-sm text-green-600 mt-1">
                    {(metrics.matchSuccessRate * 100).toFixed(0)}% success rate
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card hover>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Actions</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {metrics.expiringItems + metrics.pendingClaims}
                  </p>
                  <p className="text-sm text-orange-600 mt-1">Needs attention</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </Card>
          </div>
        )}

        {metrics && user?.role === 'CLAIMANT' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             <Card hover>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">My Active Claims</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{metrics.pendingClaims}</p>
                  <p className="text-sm text-blue-600 mt-1">In progress</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </Card>
            
            <Card hover>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Browse Items</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{metrics.totalItemsFound}</p>
                  <p className="text-sm text-green-600 mt-1">Found available items</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card hover>
              <div className="flex items-center justify-between">
                <Link to={ROUTES.LOST_REPORT}>  
                <div>
                  <p className="text-sm font-medium text-gray-600">File a Report</p>
                  <p className="text-sm text-gray-500 mt-2">Submit a lost item report to find matches</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-orange-600" />
                </div>
                </Link>
              </div>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Recent Items Found</h2>
              <Link 
                to={user?.role === 'CLAIMANT' ? '/search' : '/items'} 
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {recentItems.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No recent items found.</p>
              ) : (
                recentItems.map((item) => (
                  <div key={item._id} className="flex items-start gap-3 pb-4 border-b last:border-0">
                    <div className="mt-1">
                        <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden">
                          {item.photos && item.photos.length > 0 ? (
                            <img 
                              src={getItemImageUrl(item.photos[0].path) || ''} 
                              alt={item.category} 
                              className="h-full w-full object-cover" 
                            />
                          ) : (
                            <Package className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.description}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{item.category}</span>
                        <span className="text-xs text-gray-400">{formatDistanceToNow(new Date(item.dateFound), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {(isAdmin() || isStaff()) && (
                <>
                  <Link to="/items/create" className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-left block">
                    <Package className="h-6 w-6 text-primary-600 mb-2" />
                    <p className="font-medium text-gray-900">Register Item</p>
                    <p className="text-xs text-gray-600 mt-1">Add found item</p>
                  </Link>
                  <Link to="/claims" className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left block">
                    <Users className="h-6 w-6 text-blue-600 mb-2" />
                    <p className="font-medium text-gray-900">Review Claims</p>
                    <p className="text-xs text-gray-600 mt-1">Verify pending</p>
                  </Link>
                </>
              )}
              <Link to={ROUTES.HOME} className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-left block">
                <CheckCircle className="h-6 w-6 text-green-600 mb-2" />
                <p className="font-medium text-gray-900">Search Items</p>
                <p className="text-xs text-gray-600 mt-1">Find lost items</p>
              </Link>
              <Link to={ROUTES.LOST_REPORT} className="p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors text-left block">
                <AlertCircle className="h-6 w-6 text-orange-600 mb-2" />
                <p className="font-medium text-gray-900">Report Lost</p>
                <p className="text-xs text-gray-600 mt-1">Submit report</p>
              </Link>
            </div>
          </Card>
        </div>

        {/* Alerts (Admin/Staff only) */}
        {(isAdmin() || isStaff()) && metrics && (
          <Card>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Alerts & Notifications</h2>
            </div>
            <div className="space-y-3">
              {metrics.expiringItems > 0 ? (
                <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-900">{metrics.expiringItems} items expiring soon</p>
                    <p className="text-sm text-red-700">Items will be disposed in 7 days</p>
                  </div>
                </div>
              ) : (
                  <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900">No items expiring soon</p>
                  </div>
                </div>
              )}
              
              {metrics.pendingClaims > 0 ? (
                <Link to="/claims" className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors">
                  <Clock className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-orange-900">{metrics.pendingClaims} claims pending review</p>
                    <p className="text-sm text-orange-700">Awaiting staff verification</p>
                  </div>
                </Link>
              ) : (
                  <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900">All claims reviewed</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </ComponentErrorBoundary>
  );
};

export default Dashboard;
