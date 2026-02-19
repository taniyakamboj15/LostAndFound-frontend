import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import BackButton from '@components/ui/BackButton';
import { Calendar, Clock, MapPin, Package, ShieldCheck, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, Badge, Button, Spinner } from '@components/ui';
import { usePickupDetail } from '@hooks/usePickups';
import { formatDate } from '@utils/formatters';
import { ComponentErrorBoundary } from '@components/feedback';
import { useAuth } from '@hooks/useAuth';

import PickupQRCode from '@components/pickups/PickupQRCode';
import PickupLogistics from '@components/pickups/PickupLogistics';
import PickupItemInfo from '@components/pickups/PickupItemInfo';
import PickupClaimantInfo from '@components/pickups/PickupClaimantInfo';

const PickupDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { pickup, isLoading, isCompleting, completePickup } = usePickupDetail(id);
  const { isStaff, isAdmin } = useAuth();

  if (isLoading || !pickup) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Spinner size="lg" />
        <p className="text-gray-400 font-medium animate-pulse">Loading pickup logistics...</p>
      </div>
    );
  }

  const canComplete = (isStaff() || isAdmin()) && !pickup.isCompleted;

  return (
    <ComponentErrorBoundary title="Pickup Detail Error">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-8 max-w-5xl mx-auto py-6 px-4"
      >
        <div className="flex items-center justify-between">
           <BackButton label="Back to Pickups" />
           {pickup.isCompleted && (
             <Badge variant="success" className="px-4 py-1.5 rounded-full shadow-sm flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Pickup Completed
             </Badge>
           )}
        </div>

        {/* Hero Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-0 border-none bg-white shadow-xl shadow-gray-100/50 overflow-hidden rounded-3xl">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white relative">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Package className="h-32 w-32" />
               </div>
               <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/30">
                          {pickup.isCompleted ? 'Historical Record' : 'Active Schedule'}
                        </span>
                        <span className="text-blue-200 text-sm font-medium">Ref: #{pickup.referenceCode}</span>
                     </div>
                     <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                       {pickup.itemId?.description || 'Item Handoff'}
                     </h1>
                     <div className="flex flex-wrap items-center gap-6 pt-2">
                        <div className="flex items-center gap-2">
                           <Calendar className="h-5 w-5 text-blue-200" />
                           <span className="font-bold">{formatDate(pickup.pickupDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <Clock className="h-5 w-5 text-blue-200" />
                           <span className="font-bold">{pickup.startTime} - {pickup.endTime}</span>
                        </div>
                     </div>
                  </div>

                  {/* QR Code Segment for Claimant */}
                  {!pickup.isCompleted && (
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="bg-white p-4 rounded-2xl shadow-2xl"
                    >
                      <PickupQRCode pickup={pickup} />
                      <p className="text-center text-gray-900 text-[10px] font-bold mt-2 uppercase tracking-tighter">Verification Code</p>
                    </motion.div>
                  )}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-50">
               <div className="p-8 space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Handoff Point</span>
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-blue-50 rounded-lg">
                        <MapPin className="h-5 w-5 text-blue-600" />
                     </div>
                     <span className="font-bold text-gray-900">Main Security Office</span>
                  </div>
               </div>
               <div className="p-8 space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ownership Verified</span>
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-green-50 rounded-lg">
                        <ShieldCheck className="h-5 w-5 text-green-600" />
                     </div>
                     <span className="font-bold text-gray-900">Yes (System Checked)</span>
                  </div>
               </div>
               <div className="p-8 flex items-center justify-center">
                  {canComplete ? (
                     <Button 
                       variant="primary" 
                       onClick={() => completePickup(pickup.referenceCode)} 
                       isLoading={isCompleting}
                       className="w-full h-12 rounded-xl shadow-lg shadow-blue-200"
                     >
                       Mark as Handed Over
                     </Button>
                  ) : pickup.isCompleted ? (
                     <div className="text-center">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter mb-1">Handed Over On</p>
                        <p className="font-bold text-gray-900">{formatDate(pickup.completedAt || '')}</p>
                     </div>
                  ) : (
                     <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-xl border border-amber-100">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-xs font-bold">Scanning mode only</span>
                     </div>
                  )}
               </div>
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
           >
              <PickupItemInfo pickup={pickup} />
           </motion.div>
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
           >
              <PickupClaimantInfo pickup={pickup} />
           </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <PickupLogistics pickup={pickup} />
        </motion.div>

        {pickup.isCompleted && pickup.notes && (
          <Card className="p-8 bg-gray-50 border-none rounded-3xl">
             <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-gray-400" />
                Handover Notes
             </h3>
             <p className="text-gray-600 italic leading-relaxed">"{pickup.notes}"</p>
          </Card>
        )}
      </motion.div>
    </ComponentErrorBoundary>
  );
};

export default PickupDetail;
