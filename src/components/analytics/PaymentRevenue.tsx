import { Link } from 'react-router-dom';
import { DollarSign, CreditCard, AlertCircle, TrendingUp } from 'lucide-react';
import { Card } from '@components/ui';
import StatCard from './StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatDate } from '@utils/formatters';
import type { PaymentAnalytics } from '../../types/analytics.types';

interface PaymentRevenueProps {
  pa: PaymentAnalytics;
}

const PaymentRevenue = ({ pa }: PaymentRevenueProps) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-gray-900">Payment Revenue</h2>
      <p className="text-gray-500 text-sm mt-1">Fee collection analytics — admin only</p>
    </div>

    {/* KPI cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Revenue Collected"
        value={`₹${pa.totalRevenue.toLocaleString('en-IN')}`}
        icon={DollarSign}
        color="text-emerald-600"
      />
      <StatCard
        label="Paid Claims"
        value={pa.totalPaidClaims}
        icon={CreditCard}
        color="text-blue-600"
      />
      <StatCard
        label="Awaiting Payment"
        value={pa.totalPendingPaymentClaims}
        icon={AlertCircle}
        color="text-amber-500"
      />
      <StatCard
        label="Avg Fee per Claim"
        value={`₹${(pa?.averageFee || 0).toFixed(0)}`}
        icon={TrendingUp}
        color="text-purple-600"
      />
    </div>

    {/* Monthly revenue */}
    {(pa?.revenueByMonth?.length || 0) > 0 && (
      <Card className="p-6">
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900">Revenue Trends</h3>
          <p className="text-sm text-gray-500">Monthly fee collection performance</p>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={pa?.revenueByMonth || []}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#059669" stopOpacity={1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                dy={10}
                tickFormatter={(str: string) => {
                  const [year, month] = str.split('-');
                  const date = new Date(parseInt(year), parseInt(month) - 1);
                  return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                tickFormatter={(val: number) => `₹${val}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  padding: '12px'
                }}
                cursor={{ fill: '#f9fafb' }}
                formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
              />
              <Bar
                dataKey="revenue"
                fill="url(#colorRevenue)"
                radius={[6, 6, 0, 0]}
                barSize={40}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    )}

    {/* Recent payments + top users side by side */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent payments */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Payments</h3>
        {(!pa?.recentPayments || pa.recentPayments.length === 0) ? (
          <p className="text-gray-500 text-sm">No payments yet.</p>
        ) : (
          <div className="space-y-3">
            {pa.recentPayments.map((p) => (
              <Link
                key={p.claimId}
                to={`/claims/${p.claimId}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{p.claimantName}</p>
                  <p className="text-xs text-gray-500 truncate">{p.itemDescription}</p>
                  <p className="text-xs text-gray-400">{formatDate(p.paidAt)}</p>
                </div>
                <span className="ml-4 shrink-0 font-bold text-emerald-700 text-sm">
                  ₹{p.amount.toLocaleString('en-IN')}
                </span>
              </Link>
            ))}
          </div>
        )}
      </Card>

      {/* Top payers */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Claimants by Payment</h3>
        {(!pa?.topPayingUsers || pa.topPayingUsers.length === 0) ? (
          <p className="text-gray-500 text-sm">No data yet.</p>
        ) : (
          <div className="space-y-3">
            {pa.topPayingUsers.map((u, i) => (
              <div
                key={u.userId}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 text-sm font-bold text-gray-400">#{i + 1}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{u.name}</p>
                    <p className="text-xs text-gray-500 truncate">{u.email}</p>
                    <p className="text-xs text-gray-400">{u.claimCount} claim{u.claimCount !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <span className="ml-4 shrink-0 font-bold text-emerald-700 text-sm">
                  ₹{u.totalPaid.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  </div>
);

export default PaymentRevenue;
