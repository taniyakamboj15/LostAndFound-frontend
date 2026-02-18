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

// Senior Dev Practice: Define form-specific values for better useFieldArray compatibility
export interface CreateReportFormValues extends Omit<CreateReportFormData, 'identifyingFeatures' | 'dateLost'> {
  dateLost: string; // HTML input[type="date"] returns string
  identifyingFeatures: { text: string }[];
}
