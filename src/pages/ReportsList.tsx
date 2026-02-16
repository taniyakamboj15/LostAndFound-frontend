import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, FileText, Calendar, MapPin, Plus } from 'lucide-react';
import { Card, Input, Button, Badge, Select, Spinner } from '@components/ui';
import { ItemCategory, ITEM_CATEGORIES } from '@constants/categories';
import { formatDate, formatRelativeTime } from '@utils/formatters';
import { useReportsList } from '@hooks/useReports';
import { ComponentErrorBoundary } from '@components/feedback';

interface ReportFilters {
  keyword: string;
  category: ItemCategory | '';
}

const ReportsList = () => {
  const { reports, isLoading, error, filters, updateFilters, refresh } = useReportsList();
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = useCallback((key: keyof ReportFilters, value: string) => {
    updateFilters({ ...filters, [key]: value });
  }, [filters, updateFilters]);

  const handleSearch = useCallback(() => {
    refresh(filters);
  }, [filters, refresh]);

  return (
    <ComponentErrorBoundary title="Reports List Error">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Lost Reports</h1>
            <p className="text-gray-600 mt-1">Track and manage lost item reports</p>
          </div>
          <Link to="/reports/create">
            <Button variant="primary">
              <Plus className="h-5 w-5 mr-2" />
              Submit Report
            </Button>
          </Link>
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
              <div className="pt-4 border-t">
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
            Showing <span className="font-semibold text-gray-900">{reports.length}</span> reports
          </p>
        </div>

        {/* Reports List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <Link key={report._id} to={`/reports/${report._id}`}>
                <Card hover>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge variant="info">
                          {ITEM_CATEGORIES[report.category as keyof typeof ITEM_CATEGORIES]?.label || report.category}
                        </Badge>
                        {(report.matchCount || 0) > 0 && (
                          <Badge variant="success">
                            {report.matchCount} {(report.matchCount || 0) === 1 ? 'Match' : 'Matches'}
                          </Badge>
                        )}
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {report.description}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <span>Lost at: {report.locationLost}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-4 w-4 flex-shrink-0" />
                          <span>Lost on {formatDate(report.dateLost)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FileText className="h-4 w-4 flex-shrink-0" />
                          <span>Submitted {formatRelativeTime(report.createdAt)}</span>
                        </div>
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
        {!isLoading && reports.length === 0 && (
          <Card className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No reports found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or filters
            </p>
            <Button variant="primary" onClick={() => updateFilters({ keyword: '', category: '' })}>
              Clear Filters
            </Button>
          </Card>
        )}
      </div>
    </ComponentErrorBoundary>
  );
};

export default ReportsList;
