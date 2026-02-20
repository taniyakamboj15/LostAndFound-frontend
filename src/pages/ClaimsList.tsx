import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, FileText, AlertCircle } from 'lucide-react';
import { Card, Input, Button, Select, Spinner, Pagination } from '@components/ui';
import { ClaimStatus, CLAIM_STATUS_LABELS } from '@constants/status';
import { useClaimsList } from '@hooks/useClaims';
import { ComponentErrorBoundary } from '@components/feedback';
import ClaimCard from '@components/claims/ClaimCard';

import { ClaimFilterState } from '../types/claim.types';

const ClaimsList = () => {
  const { claims, isLoading, error, filters, updateFilters, refresh, pagination, handlePageChange, deleteClaim } = useClaimsList();
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = useCallback((key: keyof ClaimFilterState, value: string | number) => {
    updateFilters({ ...filters, [key]: value, page: 1 });
  }, [filters, updateFilters]);

  const handleSearch = useCallback(() => {
    refresh();
  }, [refresh]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <ComponentErrorBoundary title="Claims List Error">
      <div className="space-y-8 max-w-6xl mx-auto py-6 px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Claim Requests</h1>
            <p className="text-gray-500 mt-2 font-medium">Verify ownership and manage item retrieval requests</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="px-4 py-2 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-2">
               <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
               <span className="text-sm font-bold text-blue-700">{pagination.total} Total Claims</span>
            </div>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <Card className="p-1 border-none bg-white shadow-xl shadow-gray-100/50">
          <div className="p-4 space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Input
                  placeholder="Search claimant name, item description..."
                  value={filters.keyword || ''}
                  onChange={(e) => handleFilterChange('keyword', e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  fullWidth
                  className="pl-12 h-12 bg-gray-50 border-transparent focus:bg-white"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              <div className="flex gap-3">
                <Button variant="primary" onClick={handleSearch} className="h-12 px-6">
                  Search
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="h-12"
                >
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                </Button>
              </div>
            </div>

            {/* Advanced Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div 
                   initial={{ height: 0, opacity: 0 }}
                   animate={{ height: 'auto', opacity: 1 }}
                   exit={{ height: 0, opacity: 0 }}
                   className="overflow-hidden"
                >
                  <div className="pt-6 border-t border-gray-50 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Select
                      label="Status Filter"
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
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Filed Date</label>
                      <input
                        type="date"
                        className="w-full h-11 rounded-xl border border-gray-100 bg-gray-50 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                        value={filters.date || ''}
                        onChange={(e) => handleFilterChange('date', e.target.value)}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>

        {/* Results Info & Error */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold"
          >
            <AlertCircle className="h-5 w-5" />
            {error}
          </motion.div>
        )}

        {/* Claims List */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Spinner size="lg" />
            <p className="text-gray-400 font-medium animate-pulse">Loading claims database...</p>
          </div>
        ) : claims.length > 0 ? (
          <>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {claims.map((claim) => (
                <motion.div key={claim._id} variants={itemVariants}>
                  <ClaimCard claim={claim} onDelete={deleteClaim} />
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="mt-12 flex justify-center"
              >
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </motion.div>
            )}
          </>
        ) : (
          /* Empty State */
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200"
          >
            <div className="bg-white h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <FileText className="h-10 w-10 text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-500 mb-8 max-w-xs mx-auto">
              We couldn't find any claims matching your filters. Try widening your search.
            </p>
            <Button 
               variant="outline" 
               onClick={() => updateFilters({ keyword: '', status: '', page: 1 })}
               className="rounded-xl px-8"
            >
              Reset All Filters
            </Button>
          </motion.div>
        )}
      </div>
    </ComponentErrorBoundary>
  );
};

export default ClaimsList;
