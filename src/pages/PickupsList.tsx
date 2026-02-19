import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Calendar as MapIcon, List as ListIcon, AlertCircle } from 'lucide-react';
import { Card, Input, Button, Spinner, Select } from '@components/ui';
import { usePickups } from '@hooks/usePickups';
import { ComponentErrorBoundary } from '@components/feedback';
import PickupCard from '@components/pickups/PickupCard';
import CalendarView from '@components/pickups/CalendarView';
import { Pagination } from '@components/ui';

const PickupsList = () => {
  const { pickups, isLoading, error, filters, updateFilters, pagination, handlePageChange, refresh } = usePickups();
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = useCallback(() => {
    refresh();
  }, [refresh]);

  const handleFilterChange = (key: string, value: string) => {
    updateFilters({ ...filters, [key]: value, page: 1 as any });
  };

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
    <ComponentErrorBoundary title="Pickups List Error">
      <div className="space-y-8 max-w-6xl mx-auto py-6 px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">Pickup Logistics</h1>
            <p className="text-gray-500 mt-2 font-medium">Coordinate and track item handoffs effectively</p>
          </motion.div>

          {/* View Toggle */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex p-1 bg-gray-100 rounded-2xl w-fit border border-gray-200"
          >
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all font-bold text-sm ${
                viewMode === 'list' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <ListIcon className="h-4 w-4" />
              List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all font-bold text-sm ${
                viewMode === 'calendar' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <MapIcon className="h-4 w-4" />
              Calendar
            </button>
          </motion.div>
        </div>

        {/* Search & Filters */}
        <Card className="p-1 border-none bg-white shadow-xl shadow-gray-100/50">
          <div className="p-4 space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Input
                  placeholder="Search item, claimant name..."
                  value={filters.keyword || ''}
                  onChange={(e) => handleFilterChange('keyword', e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-12 h-12 bg-gray-50 border-transparent focus:bg-white"
                  fullWidth
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              <div className="flex gap-3">
                <Button variant="primary" onClick={handleSearch} className="h-12 px-8 font-bold">
                  Search
                </Button>
                <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="h-12">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>

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
                         label="Completion Status"
                         value={filters.isCompleted || ''}
                         onChange={(e) => handleFilterChange('isCompleted', e.target.value)}
                         options={[
                           { label: 'All Pickups', value: '' },
                           { label: 'Pending/Scheduled', value: 'false' },
                           { label: 'Completed', value: 'true' },
                         ]}
                         fullWidth
                       />
                       <div className="w-full">
                         <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Schedule Month</label>
                         <input
                           type="month"
                           className="w-full h-11 rounded-xl border border-gray-100 bg-gray-50 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                           value={filters.month || ''}
                           onChange={(e) => handleFilterChange('month', e.target.value)}
                         />
                       </div>
                    </div>
                 </motion.div>
               )}
            </AnimatePresence>
          </div>
        </Card>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 gap-4"
            >
              <Spinner size="lg" />
              <p className="text-gray-400 font-medium animate-pulse">Syncing logistics data...</p>
            </motion.div>
          ) : error ? (
            <motion.div 
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 bg-red-50 border border-red-100 rounded-3xl text-red-600 flex items-center gap-3 font-bold"
            >
              <AlertCircle className="h-6 w-6" />
              {error}
            </motion.div>
          ) : viewMode === 'list' ? (
            <motion.div
              key="list"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {pickups.length > 0 ? (
                <>
                  {pickups.map((pickup) => (
                    <motion.div key={pickup._id} variants={itemVariants}>
                      <PickupCard pickup={pickup} />
                    </motion.div>
                  ))}
                  {pagination.totalPages > 1 && (
                    <div className="col-span-full mt-8 flex justify-center">
                      <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="col-span-full py-20 text-center bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200">
                   <ListIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                   <h3 className="text-xl font-bold text-gray-900 mb-1">No pickups scheduled</h3>
                   <p className="text-gray-500 max-w-xs mx-auto">Try changing your search terms or wait for new claims to be verified.</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-3xl p-6 shadow-xl shadow-blue-900/5 border border-gray-100"
            >
              <CalendarView pickups={pickups} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ComponentErrorBoundary>
  );
};

export default PickupsList;
