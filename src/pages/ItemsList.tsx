import { Link } from 'react-router-dom';
import { Package, Plus } from 'lucide-react';
import { Card, Button, ShimmerList, Pagination } from '@components/ui';
import ItemCard from '@components/items/ItemCard';
import ItemFilterBar from '@components/items/ItemFilterBar';
import { useAuth } from '@hooks/useAuth';
import { ComponentErrorBoundary } from '@components/feedback';
import { useItemsFilter } from '@hooks/useItemsFilter';

const ItemsList = () => {
  const { isAdmin, isStaff } = useAuth();
  const {
    items,
    isLoading,
    error,
    filters,
    showFilters,
    categoryOptions,
    statusOptions,
    handleFilterChange,
    handleSearch,
    toggleFilters,
    clearFilters,
    pagination,
    handlePageChange
  } = useItemsFilter();

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
        <ItemFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          showFilters={showFilters}
          toggleFilters={toggleFilters}
          categoryOptions={categoryOptions}
          statusOptions={statusOptions}
        />

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
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>
            
            {/* Pagination */}
            {items.length > 0 && pagination.pages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.pages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
            
            {/* Empty State */}
            {items.length === 0 && (
              <Card className="text-center py-12">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No items found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria or filters
                </p>
                <Button variant="primary" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </Card>
            )}
          </>
        )}
      </div>
    </ComponentErrorBoundary>
  );
};

export default ItemsList;
