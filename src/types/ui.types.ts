import { ItemCategory } from '@constants/categories';
import { ItemStatus } from '@constants/status';

export interface BaseSearchFilters {
  keyword: string;
  category: ItemCategory | '';
}

export interface PublicSearchFilters extends BaseSearchFilters {
  location: string;
  dateFrom: string;
  dateTo: string;
}

export interface AdminItemFilters extends BaseSearchFilters {
  status: ItemStatus | '';
}
