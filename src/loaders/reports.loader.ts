import { LoaderFunctionArgs } from 'react-router-dom';
import { reportService } from '@services/report.service';
// import { ItemCategory } from '@constants/categories';

// export async function reportsListLoader({ request }: LoaderFunctionArgs) {
//   const url = new URL(request.url);
//   const keyword = url.searchParams.get('keyword') || undefined;
//   const category = url.searchParams.get('category') || undefined;

//   try {
//     const response = await reportService.getAll({
//       keyword,
//       category: category as ItemCategory,
//     });
    
//     return { reports: response.data, error: null };
//   } catch (error) {
//     console.error('Failed to load reports:', error);
//     return { reports: [], error: 'Failed to load reports' };
//   }
// }

export async function reportDetailLoader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  
  if (!id) {
    throw new Response('Report ID is required', { status: 400 });
  }

  try {
    const [reportResponse, matchesResponse] = await Promise.all([
      reportService.getById(id),
      reportService.getMatches(id),
    ]);
    
    return { 
      report: reportResponse.data, 
      matches: matchesResponse.data,
      error: null 
    };
  } catch (error) {
    console.error('Failed to load report:', error);
    throw new Response('Report not found', { status: 404 });
  }
}
