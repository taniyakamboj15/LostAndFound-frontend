import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Package, Plus } from 'lucide-react';
import { Card, Input, Button, Select, ShimmerList } from '@components/ui';
import ItemCard from '@components/items/ItemCard';
import { ItemCategory, ITEM_CATEGORIES } from '@constants/categories';
import { ItemStatus, ITEM_STATUS } from '@constants/status';
import { useAuth } from '@hooks/useAuth';
import { useItemsList } from '@hooks/useItems';
import { ComponentErrorBoundary } from '@components/feedback';

interface ItemFilters {
  keyword: string;
  category: ItemCategory | '';
  status: ItemStatus | '';
}

const ItemsList = () => {
  const { isAdmin, isStaff } = useAuth();
  const { items, isLoading, error, filters, updateFilters, refresh } = useItemsList();
  const [showFilters, setShowFilters] = useState(false);

  // Memoized category options
  const categoryOptions = useMemo(() => [
    { value: '', label: 'All Categories' },
    ...Object.entries(ITEM_CATEGORIES).map(([key, cat]) => ({
      value: key,
      label: cat.label,
    })),
  ], []);

  // Memoized status options
  const statusOptions = useMemo(() => [
    { value: '', label: 'All Statuses' },
    ...Object.entries(ITEM_STATUS).map(([key, status]) => ({
      value: key,
      label: status.label,
    })),
  ], []);

  // Memoized filter handlers
  const handleFilterChange = useCallback((key: keyof ItemFilters, value: string) => {
    updateFilters({ ...filters, [key]: value });
  }, [filters, updateFilters]);

  const handleSearch = useCallback(() => {
    refresh(filters);
  }, [filters, refresh]);


  return (
    <ComponentErrorBoundary title="Items List Error">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Found Items</h1>
            <p className="text-gray-600 mt-1">Browse and manage found items</p>
          </div>
          {(isAdmin() || isStaff()) && (
            <Link to="/items/create">
              <Button variant="primary">
                <Plus className="h-5 w-5 mr-2" />
                Register Item
              </Button>
            </Link>
          )}
        </div>

        {/* Search and Filters */}
        <Card>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Search by description, location..."
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
                  label="Category"
                  value={filters.category || ''}
                  onChange={(e) => handleFilterChange('category', e.target.value as ItemCategory | '')}
                  options={categoryOptions}
                  fullWidth
                />
                <Select
                  label="Status"
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value as ItemStatus | '')}
                  options={statusOptions}
                  fullWidth
                />
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
            Showing <span className="font-semibold text-gray-900">{items.length}</span> items
          </p>
        </div>

        {/* Items Grid */}
        {isLoading ? (
          <ShimmerList count={6} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <ItemCard key={item._id} item={item} />
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
            <Button variant="primary" onClick={() => {
              updateFilters({ keyword: '', category: '', status: '' });
            }}>
              Clear Filters
            </Button>
          </Card>
        )}
      </div>
    </ComponentErrorBoundary>
  );
};

export default ItemsList;
