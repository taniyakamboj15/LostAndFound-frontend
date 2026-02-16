import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { itemService } from '../../services';
import type { Item, ItemFilters, PaginationMeta, CreateItemData, UpdateItemData } from '../../types';

// State interface
interface ItemState {
  items: Item[];
  selectedItem: Item | null;
  filters: ItemFilters;
  pagination: PaginationMeta;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: ItemState = {
  items: [],
  selectedItem: null,
  filters: {
    page: 1,
    limit: 20,
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchItems = createAsyncThunk(
  'items/fetchAll',
  async (filters?: ItemFilters) => {
    const response = await itemService.getItems(filters);
    return response;
  }
);

export const fetchItemById = createAsyncThunk(
  'items/fetchById',
  async (id: string) => {
    const response = await itemService.getById(id);
    return response.data;
  }
);

export const createItem = createAsyncThunk(
  'items/create',
  async (data: CreateItemData) => {
    const response = await itemService.create(data);
    return response.data;
  }
);

export const updateItem = createAsyncThunk(
  'items/update',
  async ({ id, data }: { id: string; data: UpdateItemData }) => {
    const response = await itemService.update(id, data);
    return response.data;
  }
);

export const updateItemStatus = createAsyncThunk(
  'items/updateStatus',
  async ({ id, status }: { id: string; status: string }) => {
    const response = await itemService.updateStatus(id, status);
    return response.data;
  }
);

// Slice
const itemSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<ItemFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = { page: 1, limit: 20 };
    },
    clearSelectedItem: (state) => {
      state.selectedItem = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch items
    builder
      .addCase(fetchItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch items';
      });

    // Fetch item by ID
    builder
      .addCase(fetchItemById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchItemById.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.selectedItem = action.payload;
        }
      })
      .addCase(fetchItemById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch item';
      });

    // Create item
    builder
      .addCase(createItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createItem.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.items.unshift(action.payload);
        }
      })
      .addCase(createItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create item';
      });

    // Update item
    builder
      .addCase(updateItem.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.items.findIndex(item => item._id === action.payload?._id);
          if (index !== -1) {
            state.items[index] = action.payload;
          }
          if (state.selectedItem?._id === action.payload._id) {
            state.selectedItem = action.payload;
          }
        }
      });

    // Update item status
    builder
      .addCase(updateItemStatus.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.items.findIndex(item => item._id === action.payload?._id);
          if (index !== -1) {
            state.items[index] = action.payload;
          }
          if (state.selectedItem?._id === action.payload._id) {
            state.selectedItem = action.payload;
          }
        }
      });
  },
});

export const { setFilters, clearFilters, clearSelectedItem, clearError } = itemSlice.actions;
export default itemSlice.reducer;
