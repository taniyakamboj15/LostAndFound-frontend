import { ItemCategory } from "@constants/categories";

export interface CreateReportFormData {
  category: ItemCategory;
  description: string;
  locationLost: string;
  dateLost: Date;
  contactEmail: string;
  contactPhone?: string;
  identifyingFeatures: string[];
}
