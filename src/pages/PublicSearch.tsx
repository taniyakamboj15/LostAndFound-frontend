import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Package } from 'lucide-react';
import { Card, Input, Button, Spinner } from '@components/ui';
import { ITEM_CATEGORIES } from '@constants/categories';
import { usePublicSearch } from '@hooks/usePublicSearch';
import { ComponentErrorBoundary } from '@components/feedback';
import { ItemStatus } from '@constants/status';
import ItemCard from '@components/items/ItemCard';
import { ROUTES } from '@constants/routes';
import { Link } from 'react-router-dom';

const PublicSearch = () => {
  const { items, isLoading, error, filters, updateFilters, clearFilters, search } = usePublicSearch();
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = useCallback((key: string, value: string) => {
    updateFilters({ ...filters, [key]: value });
  }, [filters, updateFilters]);

  const handleSearch = useCallback(() => {
    search(filters);
  }, [filters, search]);

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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <ComponentErrorBoundary title="Public Search Error">
      <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
            Find Your <span className="text-blue-600">Lost Items</span>
          </h1>
          <p className="text-gray-500 text-xl max-w-2xl mx-auto leading-relaxed">
            Easily search through our campus-wide database of found belongings.
          </p>
        </motion.div>

        {/* Search Bar */}
        <Card className="p-1 border-none bg-white shadow-xl shadow-blue-50/50">
          <div className="p-4 space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Input
                  placeholder="Search by keyword, description, or location..."
                  value={filters.keyword}
                  onChange={(e) => handleFilterChange('keyword', e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  fullWidth
                  className="pl-12 h-14 bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="primary"
                  onClick={handleSearch}
                  isLoading={isLoading}
                  size="lg"
                  className="h-14 px-8 shadow-lg shadow-blue-100"
                >
                  Search 
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  size="lg"
                  className="h-14"
                >
                  <Filter className="h-5 w-5 mr-2" />
                  Advanced
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-gray-100">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">
                        Category
                      </label>
                      <select
                        value={filters.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="w-full h-11 px-4 bg-gray-50 border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      >
                        <option value="">All Types</option>
                        {Object.entries(ITEM_CATEGORIES).map(([key, category]) => (
                          <option key={key} value={key}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">
                        Location
                      </label>
                      <Input
                        placeholder="e.g., Main Library"
                        value={filters.location}
                        onChange={(e) => handleFilterChange('location', e.target.value)}
                        fullWidth
                        className="h-11 bg-gray-50 border-transparent"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">
                        From Date
                      </label>
                      <Input
                        type="date"
                        value={filters.dateFrom}
                        onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                        fullWidth
                        className="h-11 bg-gray-50 border-transparent"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">
                        To Date
                      </label>
                      <Input
                        type="date"
                        value={filters.dateTo}
                        onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                        fullWidth
                        className="h-11 bg-gray-50 border-transparent"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>

        {/* Results Info */}
        {!isLoading && items.length > 0 && (
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-bold text-gray-900">
              Discovered <span className="text-blue-600">{items.length}</span> Objects
            </h2>
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-400 hover:text-red-500">
              Reset Search
            </Button>
          </div>
        )}

        {/* Results Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : items.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {items.map((item) => (
              <motion.div key={item._id} variants={itemVariants}>
                <ItemCard 
                  item={{
                    ...item,
                    status: ItemStatus.AVAILABLE, // Public items are expected to be available
                  } as any} 
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Empty State */
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-16"
          >
            <Card className="max-w-md mx-auto text-center p-12 border-none shadow-sm bg-white/50">
              <div className="bg-gray-100 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="h-10 w-10 text-gray-400 stroke-[1.5]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No items found
              </h3>
              <p className="text-gray-500 mb-8 leading-relaxed">
                We couldn't find anything matching your search. Try different keywords or check out categories.
              </p>
              <Button variant="primary" onClick={clearFilters} fullWidth size="lg">
                Start Over
              </Button>
            </Card>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
            {error}
          </div>
        )}

        {/* CTA Section */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
        >
          <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 border-none overflow-hidden relative group">
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity" />
            <div className="text-center py-12 px-6 relative z-10">
              <div className="inline-flex p-3 bg-white/20 backdrop-blur-md rounded-2xl mb-6 text-white">
                <Package className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-extrabold text-white mb-3">
                Still missing something?
              </h2>
              <p className="text-blue-100 mb-8 max-w-lg mx-auto text-lg">
                Submit a Lost Report. Our automated matching system will keep scanning and notify you instantly.
              </p>
              <Link to={ROUTES.LOST_REPORT}>
                <Button variant="outline" size="lg" className="bg-white text-blue-700 border-none hover:bg-blue-50 px-10 h-14 font-bold shadow-xl">
                  File Your Report Now
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </ComponentErrorBoundary>
  );
};

export default PublicSearch;
