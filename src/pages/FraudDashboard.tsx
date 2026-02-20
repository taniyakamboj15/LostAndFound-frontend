import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, AlertTriangle, AlertOctagon, ChevronRight, Loader2 } from 'lucide-react';
import api from '../services/api';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { format } from 'date-fns';

interface HighRiskClaim {
  _id: string;
  fraudRiskScore: number;
  fraudFlags: string[];
  status: string;
  createdAt: string;
  claimantId?: { name: string; email: string };
  itemId?: { category: string; description: string };
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const FLAG_LABELS: Record<string, string> = {
  RAPID_CLAIMS_24H:        'Rapid Claims (24h)',
  HIGH_MONTHLY_VOLUME:     'High Monthly Volume',
  REJECTED_CLAIMS_HISTORY: 'Rejection History',
  DATE_ANOMALY:            'Date Anomaly',
  REPEATED_CLAIM_SAME_ITEM:'Repeated Same Item',
  EXACT_DESCRIPTION_MATCH: 'Exact Description Match',
};

const getRiskLevel = (score: number): { label: string; color: 'danger' | 'warning' | 'default' } => {
  if (score >= 85) return { label: 'CRITICAL', color: 'danger' };
  if (score >= 70) return { label: 'HIGH', color: 'danger' };
  return { label: 'MODERATE', color: 'warning' };
};

const FraudDashboard: React.FC = () => {
  const [claims, setClaims] = useState<HighRiskClaim[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [threshold, setThreshold] = useState(70);
  const [inputThreshold, setInputThreshold] = useState('70');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHighRiskClaims = async (t = threshold, page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/api/fraud/high-risk?threshold=${t}&page=${page}&limit=20`);
      setClaims(res.data.data);
      setPagination(res.data.pagination);
    } catch {
      setError('Failed to load high-risk claims');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHighRiskClaims(); }, []);

  const applyThreshold = () => {
    const val = parseInt(inputThreshold);
    if (!isNaN(val) && val >= 0 && val <= 100) {
      setThreshold(val);
      fetchHighRiskClaims(val, 1);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-red-100">
          <ShieldAlert className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Fraud Detection Dashboard</h1>
          <p className="text-sm text-slate-500">Claims flagged with elevated risk scores</p>
        </div>
      </div>

      {/* Threshold Control */}
      <Card className="p-4 mb-6 flex flex-wrap items-center gap-3">
        <label className="text-sm font-medium text-slate-700">Risk Threshold:</label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={0}
            max={100}
            value={inputThreshold}
            onChange={e => setInputThreshold(e.target.value)}
            className="w-40 accent-red-500"
          />
          <input
            type="number"
            value={inputThreshold}
            onChange={e => setInputThreshold(e.target.value)}
            className="w-16 border rounded px-2 py-1 text-sm text-center"
            min={0}
            max={100}
          />
        </div>
        <Button size="sm" variant="primary" onClick={applyThreshold}>Apply</Button>
        <span className="text-sm text-slate-500 ml-auto">
          Showing {pagination?.total ?? '–'} high-risk claim(s) ≥ {threshold}
        </span>
      </Card>

      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-red-500" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && claims.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <ShieldAlert className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">No high-risk claims at threshold {threshold}</p>
        </div>
      )}

      <div className="grid gap-4">
        {claims.map(claim => {
          const risk = getRiskLevel(claim.fraudRiskScore);
          return (
            <Card key={claim._id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between p-4">
                {/* Left: fraud info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertOctagon className={`w-5 h-5 flex-shrink-0 ${claim.fraudRiskScore >= 85 ? 'text-red-600' : 'text-amber-500'}`} />
                    <span className="font-semibold text-slate-900">Risk Score: {claim.fraudRiskScore}/100</span>
                    <Badge variant={risk.color}>{risk.label}</Badge>
                    <Badge variant="default">{claim.status}</Badge>
                  </div>

                  {/* Item info */}
                  {claim.itemId && (
                    <p className="text-sm text-slate-600 truncate mb-1">
                      <span className="font-medium">{claim.itemId.category}</span>: {claim.itemId.description}
                    </p>
                  )}

                  {/* Claimant info */}
                  {claim.claimantId && (
                    <p className="text-xs text-slate-500 mb-2">
                      Claimant: {claim.claimantId.name} ({claim.claimantId.email})
                    </p>
                  )}

                  {/* Fraud flags */}
                  <div className="flex flex-wrap gap-1">
                    {claim.fraudFlags?.map(flag => (
                      <span key={flag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                        <AlertTriangle className="w-3 h-3" />
                        {FLAG_LABELS[flag] ?? flag}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-slate-400 mt-2">Filed {format(new Date(claim.createdAt), 'PPP p')}</p>
                </div>

                {/* Right: score bar + link */}
                <div className="flex flex-col items-end gap-3 ml-4">
                  <div className="w-24">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Risk</span>
                      <span>{claim.fraudRiskScore}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${claim.fraudRiskScore >= 85 ? 'bg-red-500' : 'bg-amber-400'}`}
                        style={{ width: `${claim.fraudRiskScore}%` }}
                      />
                    </div>
                  </div>
                  <Link to={`/claims/${claim._id}`}>
                    <Button size="sm" variant="outline" className="flex items-center gap-1">
                      View <ChevronRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
            <Button
              key={p}
              size="sm"
              variant={p === pagination.page ? 'primary' : 'outline'}
              onClick={() => fetchHighRiskClaims(threshold, p)}
            >
              {p}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FraudDashboard;
