import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, FileText, Calendar, MapPin, Plus, AlertCircle } from 'lucide-react';
import { Card, Input, Button, Badge, Select, Spinner, Pagination } from '@components/ui';
import { ItemCategory, ITEM_CATEGORIES } from '@constants/categories';
import { formatDate, formatRelativeTime } from '@utils/formatters';
import { useReportsList } from '@hooks/useReports';
import { ComponentErrorBoundary } from '@components/feedback';
import { motion, AnimatePresence } from 'framer-motion';

import { ReportFilterState } from '../types/report.types';

const ReportsList = () => {
  const { reports, isLoading, error, filters, updateFilters, refresh, pagination, handlePageChange } = useReportsList();
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = useCallback((key: keyof ReportFilterState, value: string | number) => {
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
    <ComponentErrorBoundary title="Reports List Error">
      <div className="space-y-8 max-w-6xl mx-auto py-6 px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Lost Reports</h1>
            <p className="text-gray-500 mt-2 font-medium">Track and find matches for your lost belongings</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="px-4 py-2 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-2">
               <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
               <span className="text-sm font-bold text-blue-700">{pagination.total} Total Reports</span>
            </div>
            <Link to="/reports/create">
              <Button variant="primary" className="rounded-2xl shadow-lg shadow-blue-100 h-11 px-6">
                <Plus className="h-5 w-5 mr-2" />
                Submit Report
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <Card className="p-1 border-none bg-white shadow-xl shadow-gray-100/50">
          <div className="p-4 space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Input
                  placeholder="Search by keywords, location..."
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
                  <div className="pt-6 border-t border-gray-50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Select
                      label="Category"
                      value={filters.category || ''}
                      onChange={(e) => handleFilterChange('category', e.target.value as ItemCategory | '')}
                      options={[
                        { value: '', label: 'All Categories' },
                        ...Object.entries(ITEM_CATEGORIES).map(([key, cat]) => ({
                          value: key,
                          label: cat.label,
                        })),
                      ]}
                      fullWidth
                    />
                    <div className="w-full">
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Lost From</label>
                      <input
                        type="date"
                        className="w-full h-11 rounded-xl border border-gray-100 bg-gray-50 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                        value={filters.dateLostFrom || ''}
                        onChange={(e) => handleFilterChange('dateLostFrom', e.target.value)}
                      />
                    </div>
                    <div className="w-full">
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Lost To</label>
                      <input
                        type="date"
                        className="w-full h-11 rounded-xl border border-gray-100 bg-gray-50 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                        value={filters.dateLostTo || ''}
                        onChange={(e) => handleFilterChange('dateLostTo', e.target.value)}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>

        {/* Error State */}
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

        {/* Reports List */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Spinner size="lg" />
            <p className="text-gray-400 font-medium animate-pulse">Scanning reports database...</p>
          </div>
        ) : reports.length > 0 ? (
          <>
            <motion.div 
               variants={containerVariants}
               initial="hidden"
               animate="show"
               className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {reports.map((report) => (
                <motion.div key={report._id} variants={itemVariants}>
                  <Link to={`/reports/${report._id}`}>
                    <Card hover className="group border-none shadow-md hover:shadow-xl bg-white overflow-hidden transition-all duration-300">
                       <div className="p-5 flex flex-col h-full space-y-4">
                          <div className="flex items-center justify-between">
                            <Badge variant="info" className="shadow-sm">
                              {ITEM_CATEGORIES[report.category as keyof typeof ITEM_CATEGORIES]?.label || report.category}
                            </Badge>
                            {(report.matchCount || 0) > 0 && (
                              <Badge variant="success" className="animate-bounce">
                                {report.matchCount} Matches Found
                              </Badge>
                            )}
                          </div>

                          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                            {report.description}
                          </h3>

                          <div className="mt-auto space-y-2.5">
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                              <MapPin className="h-4 w-4 text-red-400" />
                              <span className="truncate">Lost at: {report.locationLost}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                              <Calendar className="h-4 w-4 text-blue-400" />
                              <span>Lost on {formatDate(report.dateLost)}</span>
                            </div>
                            <div className="pt-2 border-t border-gray-50 flex items-center justify-between">
                               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                 {formatRelativeTime(report.createdAt)}
                               </span>
                               <span className="text-blue-600 font-bold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                 Details <Plus className="h-3 w-3" />
                               </span>
                            </div>
                          </div>
                       </div>
                    </Card>
                  </Link>
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
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No reports found</h3>
            <p className="text-gray-500 mb-8 max-w-xs mx-auto">
              We couldn't find any lost reports matching your filters. Try widening your search.
            </p>
            <Button 
               variant="outline" 
               onClick={() => updateFilters({ keyword: '', category: '', page: 1 })}
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

export default ReportsList;
