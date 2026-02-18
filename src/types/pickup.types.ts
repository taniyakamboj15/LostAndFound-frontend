// Pickup Types
export interface Pickup {
  _id: string;
  claimId: {
    _id: string;
    itemId: {
      _id: string;
      description: string;
    };
  };
  claimantId: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  itemId: {
    _id: string;
    description: string;
  };
  pickupDate: string;
  startTime: string;
  endTime: string;
  qrCode: string;
  referenceCode: string;
  isVerified?: boolean;
  verifiedAt?: string;
  isCompleted: boolean;
  completedAt?: string;
  completedBy?: {
    _id: string;
    name: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Book Pickup Data
export interface BookPickupData {
  claimId: string;
  pickupDate: string;
  startTime: string;
  endTime: string;
}

// Pickup Slot
export interface PickupSlot {
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

// Complete Pickup Data
export interface CompletePickupData {
  referenceCode: string;
  notes?: string;
}

// Pickup Response
export interface PickupResponse {
  success: boolean;
  message: string;
  data: Pickup;
}

// Pickups List Response
export interface PickupsListResponse {
  success: boolean;
  data: Pickup[];
}

// Available Slots Response
export interface AvailableSlotsResponse {
  success: boolean;
  data: PickupSlot[];
}

// Pickup Filters
export interface PickupFilters {
  isCompleted?: string;
  pickupDate?: string;
}
