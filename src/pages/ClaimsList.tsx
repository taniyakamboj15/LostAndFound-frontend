import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, FileText, Calendar, User as UserIcon, AlertCircle } from 'lucide-react';
import { Card, Input, Button, Badge, Select, Spinner } from '@components/ui';
import { ClaimStatus, CLAIM_STATUS_LABELS } from '@constants/status';
import { CLAIM_STATUS_VARIANT_MAP } from '@constants/ui';
import { formatRelativeTime } from '@utils/formatters';
import { useClaimsList } from '@hooks/useClaims';
import { useAuth } from '@hooks/useAuth';
import { ComponentErrorBoundary } from '@components/feedback';

import { ClaimFilterState } from '../types/claim.types';



const ClaimsList = () => {
  const { claims, isLoading, error, filters, updateFilters, refresh } = useClaimsList();
  const { user } = useAuth();
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = useCallback((key: keyof ClaimFilterState, value: string) => {
    updateFilters({ ...filters, [key]: value });
  }, [filters, updateFilters]);

  const handleSearch = useCallback(() => {
    refresh();
  }, [refresh]);

  const getStatusBadgeVariant = (status: ClaimStatus) => {
    return CLAIM_STATUS_VARIANT_MAP[status as keyof typeof CLAIM_STATUS_VARIANT_MAP] || 'default';
  };

  return (
    <ComponentErrorBoundary title="Claims List Error">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Claims</h1>
            <p className="text-gray-600 mt-1">Manage and track all item claims</p>
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Search by claimant name, item description..."
                  value={filters.keyword || ''}
                  onChange={(e) => handleFilterChange('keyword', e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  fullWidth
                />
              </div>
              <Button variant="primary" onClick={handleSearch}>
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </Button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Status"
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value as ClaimStatus | '')}
                  options={[
                    { value: '', label: 'All Statuses' },
                    ...Object.entries(CLAIM_STATUS_LABELS).map(([key, label]) => ({
                      value: key,
                      label,
                    })),
                  ]}
                  fullWidth
                />
                 <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Filed Date</label>
                  <input
                    type="date"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filters.date || ''}
                    onChange={(e) => handleFilterChange('date', e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Results Count & Error State */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{claims.length}</span> claims
          </p>
        </div>

        {/* Claims List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="space-y-4">
            {claims.map((claim) => (
              <Link key={claim._id} to={`/claims/${claim._id}`}>
                <Card hover>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge variant={getStatusBadgeVariant(claim.status)}>
                          {CLAIM_STATUS_LABELS[claim.status as keyof typeof CLAIM_STATUS_LABELS] || claim.status}
                        </Badge>
                        {claim.status === ClaimStatus.IDENTITY_PROOF_REQUESTED && (
                          <span className="text-sm text-orange-600 font-medium">
                            Action Required
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {claim.itemId.description}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <UserIcon className="h-4 w-4 flex-shrink-0" />
                          {/* Conditional display: "Claimed by You" if currentUser == claimant, otherwise "Claimant: Name" */}
                          {user?.id === (typeof claim.claimantId === 'object' ? claim.claimantId._id : claim.claimantId) ? (
                            <Badge variant="info" size="sm">Claimed by You</Badge>
                          ) : (
                            <span>Claimant: {typeof claim.claimantId === 'object' ? claim.claimantId.name : 'Unknown'}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-4 w-4 flex-shrink-0" />
                          <span>Filed {formatRelativeTime(claim.filedAt || claim.createdAt)}</span>
                        </div>
                        {claim.verifiedAt && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <AlertCircle className="h-4 w-4 flex-shrink-0" />
                            <span>Verified {formatRelativeTime(claim.verifiedAt)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="ml-4">
                      <FileText className="h-6 w-6 text-gray-400" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && claims.length === 0 && (
          <Card className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No claims found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or filters
            </p>
            <Button variant="primary" onClick={() => updateFilters({ keyword: '', status: '' })}>
              Clear Filters
            </Button>
          </Card>
        )}
      </div>
    </ComponentErrorBoundary>
  );
};

export default ClaimsList;
