import { Card, Badge } from '@components/ui';
import { Claim } from '@/types/claim.types';

interface ClaimAttributeComparisonProps {
  claim: Claim;
}

const ClaimAttributeComparison = ({ claim }: ClaimAttributeComparisonProps) => {
  if (!claim.lostReportId || typeof claim.lostReportId !== 'object') return null;
  
  const lostReport = claim.lostReportId;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
         <h2 className="text-xl font-bold text-gray-900">Attribute Comparison</h2>
         <div className="h-px flex-1 bg-gray-100 ml-2" />
      </div>
      <Card className="p-0 border-none shadow-sm overflow-hidden bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          {/* Found Item Column */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="info" className="text-[10px] font-bold">Found Item</Badge>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Brand</p>
                <p className={`font-bold ${claim.itemId.brand?.toLowerCase() === lostReport.brand?.toLowerCase() ? 'text-green-600' : 'text-gray-900'}`}>
                  {claim.itemId.brand || 'Not specified'}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Color</p>
                <p className={`font-bold ${claim.itemId.color?.toLowerCase() === lostReport.color?.toLowerCase() ? 'text-green-600' : 'text-gray-900'}`}>
                  {claim.itemId.color || 'Not specified'}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Size</p>
                <p className={`font-bold ${claim.itemId.itemSize === lostReport.itemSize ? 'text-green-600' : 'text-gray-900'}`}>
                  {claim.itemId.itemSize || 'Not specified'}
                </p>
              </div>
            </div>
          </div>

          {/* Lost Report Column */}
          <div className="p-6 bg-blue-50/20">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="warning" className="text-[10px] font-bold">Lost Report</Badge>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Brand</p>
                <p className="font-bold text-gray-900">{lostReport.brand || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Color</p>
                <p className="font-bold text-gray-900">{lostReport.color || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Size</p>
                <p className="font-bold text-gray-900">{lostReport.itemSize || 'Not specified'}</p>
              </div>
            </div>
          </div>
        </div>
        
        {lostReport.bagContents && lostReport.bagContents.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-amber-50/30">
            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-2">Claimant's Reported Bag Contents</p>
            <div className="flex flex-wrap gap-2">
              {lostReport.bagContents.map((content, idx) => (
                <span key={idx} className="bg-white px-3 py-1 rounded-lg text-xs font-bold text-gray-600 border border-amber-100">
                  {content}
                </span>
              ))}
            </div>
            <p className="text-[10px] text-amber-500 mt-2 font-medium italic">Verify these against the physical item if possible.</p>
          </div>
        )}
      </Card>
    </section>
  );
};

export default ClaimAttributeComparison;
