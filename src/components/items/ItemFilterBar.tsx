import { Card, Input, Button, Select } from '@components/ui';
import { Search, Filter } from 'lucide-react';
import { ItemCategory } from '@constants/categories';
import { ItemStatus } from '@constants/status';
import { AdminItemFilters } from '../../types/ui.types';

interface ItemFilterBarProps {
  filters: AdminItemFilters;
  onFilterChange: (key: keyof AdminItemFilters, value: string) => void;
  onSearch: () => void;
  showFilters: boolean;
  toggleFilters: () => void;
  categoryOptions: { value: string; label: string }[];
  statusOptions: { value: string; label: string }[];
}

const ItemFilterBar = ({
  filters,
  onFilterChange,
  onSearch,
  showFilters,
  toggleFilters,
  categoryOptions,
  statusOptions,
}: ItemFilterBarProps) => (
  <Card>
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search by description, location..."
            value={filters.keyword || ''}
            onChange={(e) => onFilterChange('keyword', e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSearch()}
            fullWidth
          />
        </div>
        <Button variant="primary" onClick={onSearch}>
          <Search className="h-5 w-5 mr-2" />
          Search
        </Button>
        <Button variant="outline" onClick={toggleFilters}>
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
            onChange={(e) => onFilterChange('category', e.target.value as ItemCategory | '')}
            options={categoryOptions}
            fullWidth
          />
          <Select
            label="Status"
            value={filters.status || ''}
            onChange={(e) => onFilterChange('status', e.target.value as ItemStatus | '')}
            options={statusOptions}
            fullWidth
          />
        </div>
      )}
    </div>
  </Card>
);

export default ItemFilterBar;
