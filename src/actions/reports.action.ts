import { ActionFunctionArgs, redirect } from 'react-router-dom';
import { reportService } from '@services/report.service';
import { ItemCategory } from '@constants/categories';

export async function createReportAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  
  try {
    const reportData = {
      category: formData.get('category') as ItemCategory,
      description: formData.get('description') as string,
      locationLost: formData.get('locationLost') as string,
      dateLost: formData.get('dateLost') as string,
      contactEmail: formData.get('contactEmail') as string,
      contactPhone: formData.get('contactPhone') as string || undefined,
      identifyingFeatures: JSON.parse(formData.get('identifyingFeatures') as string || '[]'),
    };

    const response = await reportService.create(reportData);
    
    // Redirect to the report detail page to see matches
    return redirect(`/reports/${response.data._id}`);
  } catch (error) {
    console.error('Failed to create report:', error);
    return { error: 'Failed to create report. Please try again.' };
  }
}
