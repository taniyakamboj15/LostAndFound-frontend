import { ShieldAlert, Loader2 } from 'lucide-react';
import Button from '@components/ui/Button';
import { useFraudDashboard } from '@hooks/useFraudDashboard';
import { ComponentErrorBoundary } from '@components/feedback';

// Sub-components
import FraudRiskControl from '@components/analytics/fraud/FraudRiskControl';
import FraudClaimCard from '@components/analytics/fraud/FraudClaimCard';

const FraudDashboard = () => {
  const {
    claims,
    pagination,
    threshold,
    inputThreshold,
    setInputThreshold,
    loading,
    error,
    applyThreshold,
    fetchHighRiskClaims
  } = useFraudDashboard();

  return (
    <ComponentErrorBoundary title="Fraud Dashboard Error">
      <div className="container mx-auto p-6 max-w-5xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-2xl bg-red-50 border border-red-100 shadow-sm">
            <ShieldAlert className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Fraud Detection</h1>
            <p className="text-sm text-slate-500 font-medium">Claims flagged with elevated risk scores for human review</p>
          </div>
        </div>

        {/* Threshold Control */}
        <FraudRiskControl 
          inputThreshold={inputThreshold}
          setInputThreshold={setInputThreshold}
          applyThreshold={applyThreshold}
          totalClaims={pagination?.total ?? 0}
          threshold={threshold}
        />

        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-red-500" />
            <p className="text-slate-500 font-medium">Analyzing risk patterns...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-2 border-red-100 rounded-2xl p-6 text-red-700 text-sm flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 shrink-0" />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {!loading && !error && claims.length === 0 && (
          <div className="text-center py-32 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <ShieldAlert className="w-16 h-16 mx-auto mb-4 text-slate-300 opacity-50" />
            <p className="text-xl font-bold text-slate-400">All clear!</p>
            <p className="text-slate-500 mt-1">No high-risk claims found at threshold <strong>{threshold}</strong>.</p>
          </div>
        )}

        <div className="grid gap-4">
          {!loading && claims.map(claim => (
            <FraudClaimCard key={claim._id} claim={claim} />
          ))}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
              <Button
                key={p}
                size="sm"
                variant={p === pagination.page ? 'primary' : 'outline'}
                onClick={() => fetchHighRiskClaims(threshold, p)}
                className="w-10 h-10 rounded-xl"
              >
                {p}
              </Button>
            ))}
          </div>
        )}
      </div>
    </ComponentErrorBoundary>
  );
};

export default FraudDashboard;
