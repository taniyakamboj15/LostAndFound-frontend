import { ItemCategory } from "@constants/categories";
export interface CreateItemFormData {
  category: ItemCategory;
  description: string;
  locationFound: string;
  dateFound: string;
  finderName?: string;
  finderContact?: string;
  isHighValue: boolean;
  estimatedValue?: number;
  storageLocation?: string | null;
  identifyingFeatures?: string;
  // Structured markers
  brand?: string;
  color?: string;
  itemSize?: string;
  bagContents?: string;
  secretIdentifiers?: string;
}