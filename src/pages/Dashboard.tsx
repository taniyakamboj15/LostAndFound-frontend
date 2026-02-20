import { useAuth } from '@hooks/useAuth';
import { Card, Spinner } from '@components/ui';
import { motion } from 'framer-motion';
import { Package, Users, CheckCircle, Clock, AlertCircle, ArrowRight, Search } from 'lucide-react';
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <Card className="border-none shadow-lg bg-white overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                Recent Items Found
              </h2>
              <Link 
                to={user?.role === 'CLAIMANT' ? '/search' : '/items'} 
                className="text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                View Gallery
              </Link>
            </div>
            <div className="p-2">
              {recentItems.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-300 mx-auto mb-3 stroke-[1.5]" />
                  <p className="text-gray-400 font-medium">No recent activity detected.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {recentItems.map((item, idx) => (
                    <motion.div 
                      key={item._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group flex items-center gap-4 p-4 hover:bg-gray-50 transition-all rounded-xl"
                    >
                      <div className="relative h-14 w-14 rounded-xl bg-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm group-hover:scale-110 transition-transform">
                        {item.photos && item.photos.length > 0 ? (
                          <img 
                            src={getItemImageUrl(item.photos[0].path) || ''} 
                            alt={item.category} 
                            className="h-full w-full object-cover" 
                          />
                        ) : (
                          <Package className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link to={`/items/${item._id}`} className="text-sm font-bold text-gray-900 truncate block group-hover:text-blue-600 transition-colors">
                          {item.description}
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                            {item.category}
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium">
                            {formatDistanceToNow(new Date(item.dateFound), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                      <Link to={`/items/${item._id}`} className="p-2 opacity-0 group-hover:opacity-100 bg-white shadow-sm rounded-lg border border-gray-100 transition-all">
                        <ArrowRight className="h-4 w-4 text-blue-600" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="border-none shadow-lg bg-white p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {(isAdmin() || isStaff()) && (
                <>
                  <Link to={ROUTES.ITEMS_NEW} className="group p-5 bg-blue-50/50 rounded-2xl hover:bg-blue-50 transition-all border border-blue-100/30 text-left block relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                       <Package className="h-12 w-12" />
                    </div>
                    <Package className="h-7 w-7 text-blue-600 mb-3" />
                    <p className="font-extrabold text-gray-900">Register Item</p>
                    <p className="text-xs text-blue-600 font-medium mt-1">Add new found object</p>
                  </Link>
                  <Link to={ROUTES.CLAIMS} className="group p-5 bg-purple-50/50 rounded-2xl hover:bg-purple-50 transition-all border border-purple-100/30 text-left block relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                       <Users className="h-12 w-12" />
                    </div>
                    <Users className="h-7 w-7 text-purple-600 mb-3" />
                    <p className="font-extrabold text-gray-900">Review Claims</p>
                    <p className="text-xs text-purple-600 font-medium mt-1">Verify ownership</p>
                  </Link>
                  <Link to={ROUTES.MATCHING} className="group p-5 bg-indigo-50/50 rounded-2xl hover:bg-indigo-50 transition-all border border-indigo-100/30 text-left block relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                       <Search className="h-12 w-12" />
                    </div>
                    <Search className="h-7 w-7 text-indigo-600 mb-3" />
                    <p className="font-extrabold text-gray-900">Matching Engine</p>
                    <p className="text-xs text-indigo-600 font-medium mt-1">Configure & review matches</p>
                  </Link>
                </>
              )}
              <Link to={ROUTES.HOME} className="group p-5 bg-green-50/50 rounded-2xl hover:bg-green-50 transition-all border border-green-100/30 text-left block relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Search className="h-12 w-12" />
                </div>
                <Search className="h-7 w-7 text-green-600 mb-3" />
                <p className="font-extrabold text-gray-900">Search Items</p>
                <p className="text-xs text-green-600 font-medium mt-1">Find lost belongings</p>
              </Link>
              <Link to={ROUTES.LOST_REPORT} className="group p-5 bg-orange-50/50 rounded-2xl hover:bg-orange-50 transition-all border border-orange-100/30 text-left block relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <AlertCircle className="h-12 w-12" />
                </div>
                <AlertCircle className="h-7 w-7 text-orange-600 mb-3" />
                <p className="font-extrabold text-gray-900">Report Lost</p>
                <p className="text-xs text-orange-600 font-medium mt-1">Setup auto-match</p>
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
              
              {metrics.pendingReviewClaims > 0 ? (
                <Link to="/claims?status=FILED" className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-900">{metrics.pendingReviewClaims} claims urgent review</p>
                    <p className="text-sm text-red-700">Awaiting identity or proof verification</p>
                  </div>
                </Link>
              ) : (
                <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900">No urgent claims to review</p>
                  </div>
                </div>
              )}
              
              {metrics.readyForHandoverClaims > 0 ? (
                <Link to="/claims?status=VERIFIED" className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors">
                  <Clock className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-orange-900">{metrics.readyForHandoverClaims} claims ready for handover</p>
                    <p className="text-sm text-orange-700">Paid and verified items awaiting pickup</p>
                  </div>
                </Link>
              ) : (
                <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">No items ready for handover</p>
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
