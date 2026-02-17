import { User } from "./user.types";
import {Item, ItemFilters  } from "./item.types";
import { PaginationMeta } from "./api.types";
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
export interface ItemState {
  items: Item[];
  selectedItem: Item | null;
  filters: ItemFilters;
  pagination: PaginationMeta;
  isLoading: boolean;
  error: string | null;
}