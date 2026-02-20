import { Card } from '@components/ui';
import { FileText } from 'lucide-react';
import { LostReport } from '../../types/report.types';

interface ReportInfoCardProps {
  report: LostReport;
}

const ReportInfoCard = ({ report }: ReportInfoCardProps) => {
  return (
    <div className="space-y-6">
      <Card className="border-none shadow-xl shadow-gray-100/50 bg-white/80 backdrop-blur-sm overflow-hidden rounded-3xl">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
             <div className="h-10 w-10 rounded-2xl bg-blue-50 flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
             </div>
             <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
               Item Description
             </h2>
          </div>
          <p className="text-gray-700 text-lg leading-relaxed bg-gray-50/50 p-6 rounded-2xl italic border border-gray-100/50">
            "{report.description}"
          </p>

          {(report.brand || report.color || report.itemSize) && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              {report.brand && (
                <div className="bg-white p-4 rounded-2xl border border-blue-50">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Brand</p>
                  <p className="font-bold text-gray-900">{report.brand}</p>
                </div>
              )}
              {report.color && (
                <div className="bg-white p-4 rounded-2xl border border-blue-50">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Color</p>
                  <p className="font-bold text-gray-900">{report.color}</p>
                </div>
              )}
              {report.itemSize && (
                <div className="bg-white p-4 rounded-2xl border border-blue-50">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Size</p>
                  <p className="font-bold text-gray-900">{report.itemSize}</p>
                </div>
              )}
            </div>
          )}

          {report.bagContents && report.bagContents.length > 0 && (
            <div className="mt-6 p-4 bg-amber-50 rounded-2xl border border-amber-100">
               <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-2">Internal Bag Contents</p>
               <div className="flex flex-wrap gap-2">
                  {report.bagContents.map((item, idx) => (
                    <span key={idx} className="bg-white px-3 py-1 rounded-lg text-xs font-bold text-gray-600 border border-amber-200">
                      {item}
                    </span>
                  ))}
               </div>
            </div>
          )}
        </div>
      </Card>

      {/* Identifying Features */}
      {report.identifyingFeatures && report.identifyingFeatures.length > 0 && (
        <Card className="border-none shadow-lg bg-white overflow-hidden rounded-3xl">
          <div className="p-6">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 ml-1">
              Identifying Features
            </h2>
            <div className="flex flex-wrap gap-3">
              {report.identifyingFeatures.map((feature: string, index: number) => (
                <div
                  key={index}
                  className="group px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-xl text-sm font-bold border border-blue-100/50 hover:from-blue-100 hover:to-indigo-100 transition-all cursor-default flex items-center gap-2"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Keywords */}
      <Card className="border-none shadow-lg bg-white overflow-hidden rounded-3xl">
        <div className="p-6">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 ml-1">
            Search Keywords
          </h2>
          <div className="flex flex-wrap gap-2">
            {report.keywords.map((keyword: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-50 text-gray-600 rounded-lg text-xs font-bold border border-gray-100 uppercase tracking-tight"
              >
                #{keyword}
              </span>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ReportInfoCard;
