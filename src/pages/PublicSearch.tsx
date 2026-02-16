import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MapPin, Calendar, Package } from 'lucide-react';
import { Card, Input, Button, Badge, Spinner } from '@components/ui';
import { ItemCategory, ITEM_CATEGORIES } from '@constants/categories';
import { formatDate } from '@utils/formatters';
import { usePublicSearch } from '@hooks/usePublicSearch';
import { ComponentErrorBoundary } from '@components/feedback';
import { getItemImageUrl } from '@utils/image';

const PublicSearch = () => {
  const { items, isLoading, error, filters, updateFilters, clearFilters, search } = usePublicSearch();
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = useCallback((key: string, value: string) => {
    updateFilters({ ...filters, [key]: value });
  }, [filters, updateFilters]);

  const handleSearch = useCallback(() => {
    search(filters);
  }, [filters, search]);

  return (
    <ComponentErrorBoundary title="Public Search Error">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Find Your Lost Items</h1>
          <p className="text-gray-600 mt-2 text-lg">
            Search through our database of found items
          </p>
        </div>

        {/* Search Bar */}
        <Card>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Search by keyword, description, or location..."
                  value={filters.keyword}
                  onChange={(e) => handleFilterChange('keyword', e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  fullWidth
                />
              </div>
              <Button
                variant="primary"
                onClick={handleSearch}
                isLoading={isLoading}
              >
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">All Categories</option>
                    {Object.entries(ITEM_CATEGORIES).map(([key, category]) => (
                      <option key={key} value={key}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <Input
                    placeholder="e.g., Main Library"
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    fullWidth
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date From
                  </label>
                  <Input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                    fullWidth
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date To
                  </label>
                  <Input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                    fullWidth
                  />
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            Found <span className="font-semibold text-gray-900">{items.length}</span> items
          </p>
        </div>

        {/* Results Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Card key={item._id} hover className="cursor-pointer">
                {/* Image Placeholder */}
                 <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                    {item.photos && item.photos.length > 0 ? (
                       <img 
                        src={getItemImageUrl(item.photos[0].path) || ''} 
                        alt={item.description} 
                        className="w-full h-full object-cover" 
                       />
                    ) : (
                       <Package className="h-12 w-12 text-gray-400" />
                    )}
                 </div>

                {/* Category Badge */}
                <div className="mb-3">
                  <Badge
                    variant="info"
                    className={`bg-${ITEM_CATEGORIES[item.category as ItemCategory]?.color || 'gray'}-100 text-${ITEM_CATEGORIES[item.category as ItemCategory]?.color || 'gray'}-800`}
                  >
                    {ITEM_CATEGORIES[item.category as ItemCategory]?.label || item.category}
                  </Badge>
                </div>

                {/* Description */}
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {item.description}
                </h3>

                {/* Location */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <MapPin className="h-4 w-4" />
                  <span className="line-clamp-1">{item.locationFound}</span>
                </div>

                {/* Date */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Found on {formatDate(item.dateFound)}</span>
                </div>

                {/* Action Button */}
                <div className="mt-4 pt-4 border-t">
                  <Link to={`/items/${item._id}`}>
                    <Button variant="outline" size="sm" fullWidth>
                      View Details
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && items.length === 0 && (
          <Card className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No items found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or filters
            </p>
            <Button variant="primary" onClick={clearFilters}>Clear Filters</Button>
          </Card>
        )}

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-primary-50 to-secondary-50">
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Can't find your item?
            </h2>
            <p className="text-gray-600 mb-6">
              Submit a lost item report and we'll notify you when we find a match
            </p>
            <Button variant="primary" size="lg">
              Submit Lost Report
            </Button>
          </div>
        </Card>
      </div>
    </ComponentErrorBoundary>
  );
};

export default PublicSearch;
