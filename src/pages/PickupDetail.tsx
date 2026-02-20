import { motion } from 'framer-motion';
import BackButton from '@components/ui/BackButton';
import { Calendar, Clock, MapPin, Package, ShieldCheck, CheckCircle, AlertCircle, QrCode } from 'lucide-react';
import { Card, Badge, Button, Spinner } from '@components/ui';
import { formatDate } from '@utils/formatters';
import { ComponentErrorBoundary } from '@components/feedback';

import PickupQRCode from '@components/pickups/PickupQRCode';
import PickupLogistics from '@components/pickups/PickupLogistics';
import PickupItemInfo from '@components/pickups/PickupItemInfo';
import PickupClaimantInfo from '@components/pickups/PickupClaimantInfo';
import ScanPickupModal from '@components/claims/ScanPickupModal';
import { usePickupDetailPage } from '@hooks/usePickupDetailPage';

const PickupDetail = () => {
  const {
    pickup,
    isLoading,
    isCompleting,
    completePickup,
    isStaff,
    isAdmin,
    isScanModalOpen,
    openScanModal,
    closeScanModal,
    onVerifySuccess
  } = usePickupDetailPage();

  if (isLoading || !pickup) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Spinner size="lg" />
        <p className="text-gray-400 font-medium animate-pulse">Loading pickup logistics...</p>
      </div>
    );
  }

  return (
    <ComponentErrorBoundary title="Pickup Detail Error">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6 max-w-5xl mx-auto py-4 px-4"
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
          <Card className="p-0 border-none bg-white shadow-xl shadow-indigo-500/5 overflow-hidden rounded-[1.5rem] border border-indigo-500/5">
            <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 py-4 px-8 text-white relative">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Package className="h-20 w-20" />
               </div>
               <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="space-y-4 flex-1">
                     <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest border border-white/30">
                          {pickup.isCompleted ? 'Historical Record' : 'Active Logistics'}
                        </span>
                        {!isStaff() && !isAdmin() && (
                          <span className="text-blue-200 text-[9px] font-black uppercase tracking-widest bg-blue-900/40 px-3 py-1 rounded-lg border border-blue-500/30">Ref: #{pickup.referenceCode}</span>
                        )}
                     </div>
                     <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-none">
                       {pickup.itemId?.description || 'Item Handoff'}
                     </h1>
                     <div className="flex flex-wrap items-center gap-6 pt-1">
                        <div className="flex items-center gap-2 group">
                           <div className="p-1.5 bg-white/10 rounded-xl border border-white/10">
                              <Calendar className="h-4 w-4 text-blue-300" />
                           </div>
                           <span className="font-bold text-base">{formatDate(pickup.pickupDate)}</span>
                        </div>
                        <div className="flex items-center gap-2 group">
                           <div className="p-1.5 bg-white/10 rounded-xl border border-white/10">
                              <Clock className="h-4 w-4 text-blue-300" />
                           </div>
                           <span className="font-bold text-base">{pickup.startTime} - {pickup.endTime}</span>
                        </div>
                     </div>
                  </div>

                  {/* Compact QR Section */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 shadow-lg"
                  >
                    <PickupQRCode pickup={pickup} />
                    <p className="text-center text-white/40 text-[7px] font-black mt-1.5 uppercase tracking-widest leading-none">Verification QR</p>
                  </motion.div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-50">
               <div className="p-5 space-y-1.5 flex-1">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Handoff Point</span>
                  <div className="flex items-center gap-3">
                     <div className="p-1.5 bg-blue-50 rounded-lg">
                        <MapPin className="h-4 w-4 text-blue-600" />
                     </div>
                      <div className="flex flex-col">
                        <span className="font-black text-gray-900 text-sm">
                          {typeof pickup.claimId === 'object' && pickup.claimId.preferredPickupLocation && typeof pickup.claimId.preferredPickupLocation === 'object' 
                            ? pickup.claimId.preferredPickupLocation.name 
                            : typeof pickup.itemId === 'object' && pickup.itemId.storageLocation && typeof pickup.itemId.storageLocation === 'object'
                            ? pickup.itemId.storageLocation.name
                            : 'Main Security Office'}
                        </span>
                        <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest leading-none">
                          {typeof pickup.claimId === 'object' && pickup.claimId.preferredPickupLocation && typeof pickup.claimId.preferredPickupLocation === 'object' 
                            ? pickup.claimId.preferredPickupLocation.city 
                            : typeof pickup.itemId === 'object' && pickup.itemId.storageLocation && typeof pickup.itemId.storageLocation === 'object'
                            ? pickup.itemId.storageLocation.city
                            : 'Central Branch'}
                        </span>
                     </div>
                  </div>
               </div>
               <div className="p-5 space-y-1.5 flex-1">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Security Status</span>
                  <div className="flex items-center gap-3">
                     <div className="p-1.5 bg-green-50 rounded-lg">
                        <ShieldCheck className="h-4 w-4 text-green-600" />
                     </div>
                     <span className="font-black text-gray-900 text-sm">System Checked</span>
                  </div>
               </div>
                <div className="p-5 flex items-center justify-center">
                  {(isStaff() || isAdmin()) ? (
                     pickup.isCompleted ? (
                        <div className="text-center">
                           <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter mb-1">Handed Over On</p>
                           <p className="font-bold text-gray-900">{formatDate(pickup.completedAt || '')}</p>
                        </div>
                     ) : pickup.isVerified ? (
                        <Button 
                          variant="primary" 
                          onClick={() => completePickup(pickup.referenceCode)} 
                          isLoading={isCompleting}
                          className="w-full h-12 rounded-xl shadow-lg shadow-blue-200"
                        >
                          Mark as Handed Over
                        </Button>
                     ) : (
                        <Button 
                          variant="primary" 
                          onClick={openScanModal}
                          className="w-full h-12 rounded-xl shadow-lg shadow-blue-600/20 bg-blue-600 hover:bg-blue-700"
                        >
                          <QrCode className="h-5 w-5 mr-2" />
                          Verify Pickup
                        </Button>
                     )
                  ) : pickup.isCompleted ? (
                     <div className="text-center">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter mb-1">Collected On</p>
                        <p className="font-bold text-gray-900">{formatDate(pickup.completedAt || '')}</p>
                     </div>
                  ) : (
                     <div className="flex flex-col items-center gap-2 text-blue-600 bg-blue-50 px-6 py-3 rounded-2xl border border-blue-100 shadow-sm">
                        <Clock className="h-5 w-5 animate-pulse" />
                        <span className="text-sm font-bold tracking-tight">Ready for Collection</span>
                     </div>
                  )}
               </div>
            </div>
          </Card>
        </motion.div>

        {/* Logistics Ribbon */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <PickupLogistics pickup={pickup} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
           {/* Item Context (Left - 4/12) */}
           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="lg:col-span-4"
           >
              <PickupItemInfo pickup={pickup} />
           </motion.div>

           {/* Claimant & Logistics (Filling the rest - 8/12) */}
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8"
           >
              <PickupClaimantInfo pickup={pickup} />
           </motion.div>
        </div>

        {pickup.isCompleted && pickup.notes && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8"
          >
            <Card className="p-6 bg-gray-50 border-none rounded-[1.5rem]">
               <h3 className="text-sm font-black text-gray-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-gray-400" />
                  Notes
               </h3>
               <p className="text-xs text-gray-600 italic leading-relaxed font-medium">"{pickup.notes}"</p>
            </Card>
          </motion.div>
        )}
      </motion.div>

      <ScanPickupModal 
        isOpen={isScanModalOpen}
        onClose={closeScanModal}
        onVerifySuccess={onVerifySuccess}
      />
    </ComponentErrorBoundary>
  );
};

export default PickupDetail;
