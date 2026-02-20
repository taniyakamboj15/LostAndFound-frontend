import { useState, useEffect } from 'react';
import { History, FileCheck, ShieldCheck, User } from 'lucide-react';
import { Card } from '@components/ui';
import { dispositionService, Disposition } from '@services/disposition.service';
import { formatDate } from '@utils/formatters';

interface DispositionAuditProps {
  itemId: string;
}

const DispositionAudit = ({ itemId }: DispositionAuditProps) => {
  const [disposition, setDisposition] = useState<Disposition | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAudit = async () => {
      setLoading(true);
      try {
        const response = await dispositionService.getByItemId(itemId);
        if (response.success && response.data) {
          setDisposition(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch disposition audit:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAudit();
  }, [itemId]);

  if (loading) return <div className="animate-pulse h-24 bg-gray-100 rounded-xl" />;
  if (!disposition) return null;

  return (
    <Card className="p-6 border-none shadow-md bg-blue-50/30 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <ShieldCheck size={80} className="text-blue-600" />
      </div>
      
      <h3 className="text-sm font-bold uppercase tracking-widest text-blue-900 mb-6 flex items-center gap-2">
        <History className="h-4 w-4" />
        Legally-Sufficient Audit Trail
      </h3>

      <div className="space-y-6 relative">
        {/* Connection line */}
        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-blue-200" />

        {disposition.auditTrail.map((entry, index) => (
          <div key={index} className="flex gap-4 relative z-10 transition-all hover:translate-x-1">
            <div className={`mt-1.5 h-6 w-6 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
              entry.action === 'DISPOSITION_COMPLETED' 
                ? 'bg-green-500 text-white' 
                : 'bg-blue-500 text-white'
            }`}>
              {entry.action === 'DISPOSITION_COMPLETED' ? <FileCheck size={12} /> : <User size={12} />}
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start gap-4">
                <p className="font-bold text-gray-900 text-sm">
                  {entry.action.replace(/_/g, ' ')}
                </p>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                  {formatDate(entry.timestamp)}
                </span>
              </div>
              
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                {entry.details}
              </p>
              
              <div className="flex items-center gap-1.5 mt-2 bg-white/50 w-fit px-2 py-1 rounded-md border border-blue-100/50">
                <User size={10} className="text-blue-500" />
                <span className="text-[10px] font-medium text-gray-500">
                  {entry.userId?.name || 'System'} ({entry.userId?.email || 'automated'})
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-blue-100/50 flex items-center justify-between text-[10px] font-bold text-blue-400 uppercase tracking-widest">
        <span>Final Disposition: {disposition.type}</span>
        <span>ID: {disposition._id.substring(18)}</span>
      </div>
    </Card>
  );
};

export default DispositionAudit;
