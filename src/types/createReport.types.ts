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


export interface CreateReportFormValues extends Omit<CreateReportFormData, 'identifyingFeatures' | 'dateLost'> {
  dateLost: string;
  identifyingFeatures: { text: string }[];
}
