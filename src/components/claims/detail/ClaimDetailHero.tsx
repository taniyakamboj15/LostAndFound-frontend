import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, Clock } from 'lucide-react';
import { Badge } from '@components/ui';
import { Claim } from '@/types/claim.types';
import { CLAIM_STATUS_LABELS } from '@constants/status';
import { getClaimStatusVariant } from '@utils/ui';
import { formatRelativeTime } from '@utils/formatters';

interface ClaimDetailHeroProps {
  claim: Claim;
  isAdmin: boolean;
  isStaff: boolean;
  isClaimant: boolean;
}

const ClaimDetailHero = ({ claim, isAdmin, isStaff, isClaimant }: ClaimDetailHeroProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/10 border border-indigo-500/5"
    >
      {/* Background Layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-blue-500 to-indigo-700" />
      
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 p-8 opacity-10 blur-sm">
         <ShieldCheck className="h-48 w-48 text-white" />
      </div>
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-3xl opacity-50" />
      
      <div className="relative z-10 p-8 md:p-10 text-white">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div className="space-y-6 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant={getClaimStatusVariant(claim.status)} className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/20 backdrop-blur-md border border-white/30 text-white">
                {CLAIM_STATUS_LABELS[claim.status]}
              </Badge>
              {isClaimant && (
                 <span className="flex items-center gap-1.5 px-3 py-1 bg-green-400/20 backdrop-blur-md text-green-200 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-400/30">
                   <ShieldCheck className="h-3 w-3" />
                   Verified Owner
                 </span>
              )}
              {(isAdmin || isStaff) && (claim.fraudRiskScore || 0) > 0 && (
                <span
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border backdrop-blur-md ${
                    (claim.fraudRiskScore || 0) >= 70
                      ? 'bg-red-400/20 text-red-200 border-red-400/30'
                      : 'bg-amber-400/20 text-amber-200 border-amber-400/30'
                  }`}
                >
                  <ShieldAlert className="h-3 w-3" />
                  Risk Score: {claim.fraudRiskScore}
                </span>
              )}
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.1] max-w-3xl drop-shadow-sm">
                {claim.itemId.description}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/80 font-bold text-sm">
                 <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-indigo-200" />
                    <span>Filed {formatRelativeTime(claim.filedAt || claim.createdAt)}</span>
                 </div>
                 <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
                 <div className="bg-white/15 px-3 py-1 rounded-xl backdrop-blur-md border border-white/20 shadow-sm">
                    <span className="text-indigo-100/70">REF_ID:</span> <span className="text-white">#{claim._id.slice(-8).toUpperCase()}</span>
                 </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 z-20">
             {[
               { label: 'Brand', value: claim.itemId.brand },
               { label: 'Color', value: claim.itemId.color },
               { label: 'Size', value: claim.itemId.itemSize }
             ].map((attr, idx) => attr.value && (
               <div key={idx} className="px-5 py-3 bg-white/15 backdrop-blur-xl rounded-[1.25rem] border border-white/20 shadow-xl shadow-indigo-900/10 group hover:bg-white/25 transition-all transform hover:-translate-y-1">
                 <span className="block text-[10px] font-black uppercase tracking-widest text-indigo-100/70 mb-1 leading-none">{attr.label}</span>
                 <span className="text-sm font-black text-white">{attr.value}</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ClaimDetailHero;
