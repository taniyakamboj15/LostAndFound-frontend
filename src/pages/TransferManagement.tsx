import { 
  Truck, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Search, 
  Package,
  Info,
  AlertTriangle,
  LucideIcon,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Card, 
  Button, 
  Badge, 
  Spinner, 
  Input, 
  Modal,
  Textarea,
  Pagination
} from '@components/ui';
import { ComponentErrorBoundary } from '@components/feedback';
import { format } from 'date-fns';

// Hooks
import { useTransferManagement, FilterStatus } from '@hooks/useTransferManagement';

// Types
import { Claim, TransferStatus } from '@app-types/index';

const TransferManagement = () => {
  const { 
    transfers, 
    isLoading, 
    fetchTransfers, 
    searchTerm,
    setSearchTerm,
    activeFilter,
    setActiveFilter,
    filteredTransfers,
    selectedTransfer,
    isUpdateModalOpen,
    updateData,
    setUpdateData,
    handleOpenUpdate,
    handleUpdateStatus,
    closeUpdateModal,
    pagination,
    setPage,
    updateTransferStatus
  } = useTransferManagement();

  const statusMap = new Map<TransferStatus, { label: string; icon: LucideIcon; color: string }>([
    [TransferStatus.PENDING, { label: 'Pending', icon: Clock, color: 'bg-amber-100 text-amber-800' }],
    [TransferStatus.RECOVERY_REQUIRED, { label: 'Recovery Needed', icon: AlertTriangle, color: 'bg-rose-100 text-rose-800' }],
    [TransferStatus.IN_TRANSIT, { label: 'In Transit', icon: Truck, color: 'bg-blue-100 text-blue-800' }],
    [TransferStatus.ARRIVED, { label: 'Arrived', icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-800' }],
    [TransferStatus.CANCELLED, { label: 'Cancelled', icon: Info, color: 'bg-red-100 text-red-800' }]
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Internal Transfers</h1>
          <p className="text-gray-600 mt-1">Manage inventory movement between branches and city pickup points.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => fetchTransfers()} isLoading={isLoading}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by item or claim..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex bg-gray-50 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
          {['ALL', ...Object.values(TransferStatus)].filter(v => v !== TransferStatus.CANCELLED).map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f as FilterStatus)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeFilter === f 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f === TransferStatus.RECOVERY_REQUIRED ? 'Recoveries' : f.charAt(0) + f.slice(1).toLowerCase().replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <ComponentErrorBoundary>
        {isLoading && transfers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Spinner size="lg" />
            <p className="text-gray-500 mt-4">Loading transfers...</p>
          </div>
        ) : filteredTransfers.length === 0 ? (
          <Card className="text-center py-20 bg-gray-50/50 border-dashed">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4 stroke-[1.5]" />
            <h3 className="text-xl font-bold text-gray-900">No transfers found</h3>
            <p className="text-gray-500 max-w-sm mx-auto mt-2">There are currently no internal transfers matching your filters.</p>
          </Card>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredTransfers.map((transfer) => {
                  const statusInfo = statusMap.get(transfer.status) || statusMap.get(TransferStatus.PENDING)!;
                  const StatusIcon = statusInfo.icon;

                  return (
                    <motion.div
                      key={transfer._id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <Card className="hover:shadow-md transition-shadow h-full border-gray-100 overflow-hidden group">
                        <div className="flex flex-col h-full">
                          {/* Status bar */}
                          <div className={`h-1.5 w-full ${statusInfo.color.split(' ')[0]}`} />
                          
                          <div className="p-6 space-y-4 flex-1">
                            <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                <Badge className={statusInfo.color}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {statusInfo.label}
                                </Badge>
                                <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                                    {transfer.itemId && typeof transfer.itemId === 'object' ? transfer.itemId.description : 'Unknown Item'}
                                  </h3>
                                <p className="text-xs text-gray-500 font-mono">
                                  TRF-{transfer._id.substring(transfer._id.length - 8).toUpperCase()}
                                </p>
                              </div>
                              
                              <div className="text-right">
                                 <p className="text-xs text-gray-400">Created</p>
                                 <p className="text-sm font-medium">{format(new Date(transfer.createdAt), 'MMM d, p')}</p>
                              </div>
                            </div>

                            {/* Route Info */}
                            <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between gap-4 relative">
                              <div className="flex-1">
                                <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">From</p>
                                <div className="flex items-center gap-2">
                                  <div className="p-1.5 bg-white rounded-lg shadow-sm">
                                    <MapPin className="h-4 w-4 text-gray-500" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-gray-900">
                                      {transfer.fromStorageId && typeof transfer.fromStorageId === 'object' ? transfer.fromStorageId.name : 'Original Branch'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {transfer.fromStorageId && typeof transfer.fromStorageId === 'object' ? transfer.fromStorageId.city : 'Original Branch'}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-grow justify-center">
                                <ArrowRight className="h-5 w-5 text-gray-300 animate-pulse" />
                              </div>

                              <div className="flex-1 text-right">
                                <p className="text-[10px] uppercase font-bold text-gray-400 mb-1 text-right">To (Pickup)</p>
                                <div className="flex items-center gap-2 justify-end">
                                  <div className="text-right">
                                    <p className="text-sm font-bold text-gray-900">
                                      {transfer.toStorageId && typeof transfer.toStorageId === 'object' ? transfer.toStorageId.name : 'Target Branch'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {transfer.toStorageId && typeof transfer.toStorageId === 'object' ? transfer.toStorageId.city : 'Target Branch'}
                                    </p>
                                  </div>
                                  <div className="p-1.5 bg-blue-50 rounded-lg shadow-sm border border-blue-100">
                                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {transfer.notes && (
                              <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 flex gap-2">
                                 <Info className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                 <p className="text-xs text-amber-700 font-medium">
                                   <span className="font-bold">Staff Note:</span> {transfer.notes}
                                 </p>
                              </div>
                            )}

                            {/* Details Row */}
                            <div className="grid grid-cols-2 gap-4 text-sm pt-2">
                               <div className="space-y-1">
                                  <p className="text-xs text-gray-400">Carrier / Tracking</p>
                                  <p className="font-medium text-gray-700 truncate">
                                    {transfer.carrierInfo || 'Not assigned'}
                                  </p>
                               </div>
                                <div className="space-y-1 text-right">
                                   <p className="text-xs text-gray-400">Claim ID</p>
                                   <p className="font-mono text-xs text-blue-600 font-bold">
                                     #{transfer.claimId && typeof transfer.claimId === 'object' ? (transfer.claimId as Claim)._id?.substring((transfer.claimId as Claim)._id.length - 6).toUpperCase() : transfer.claimId?.substring((transfer.claimId?.length || 0) - 6).toUpperCase()}
                                   </p>
                                </div>
                            </div>
                          </div>

                          <div className="border-t border-gray-50 bg-gray-25/50 p-4 flex gap-2">
                            {transfer.status === TransferStatus.RECOVERY_REQUIRED && (
                              <Button 
                                variant="primary" 
                                className="w-full rounded-xl bg-rose-600 hover:bg-rose-700"
                                onClick={() => handleOpenUpdate(transfer, TransferStatus.PENDING)}
                              >
                                Mark as Recovered
                              </Button>
                            )}
                            {transfer.status === TransferStatus.PENDING && (
                              <Button 
                                variant="primary" 
                                className="w-full rounded-xl"
                                onClick={() => handleOpenUpdate(transfer, TransferStatus.IN_TRANSIT)}
                              >
                                Mark as Shipped
                              </Button>
                            )}
                            {transfer.status === TransferStatus.IN_TRANSIT && (
                              <Button 
                                variant="primary" 
                                className="w-full rounded-xl"
                                onClick={() => handleOpenUpdate(transfer, TransferStatus.ARRIVED)}
                              >
                                Mark as Received
                              </Button>
                            )}
                            {transfer.status === TransferStatus.PENDING && (
                              <Button
                                variant="outline"
                                className="px-3 rounded-xl border-red-100 text-red-600 hover:bg-red-50"
                                onClick={() => {
                                  if (window.confirm('Cancel this transfer?')) {
                                    updateTransferStatus(transfer._id, TransferStatus.CANCELLED);
                                  }
                                }}
                                title="Cancel Transfer"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                            {transfer.status === TransferStatus.ARRIVED && (
                              <Button variant="outline" className="w-full rounded-xl" disabled>
                                Transfer Complete
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Pagination Component */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center pt-8">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </div>
        )}
      </ComponentErrorBoundary>

      <Modal
        isOpen={isUpdateModalOpen}
        onClose={closeUpdateModal}
        title={
          selectedTransfer 
            ? `${updateData.status === TransferStatus.IN_TRANSIT ? 'Ship' : 'Receive'} ${selectedTransfer.itemId && typeof selectedTransfer.itemId === 'object' ? selectedTransfer.itemId.description : 'Item'}`
            : 'Update Transfer'
        }
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-2xl flex gap-3 text-sm text-blue-700">
            <Info className="h-5 w-5 flex-shrink-0" />
            <p>
              Updating this status will automatically notify the claimant and update the item location. 
              {updateData.status === TransferStatus.ARRIVED ? ' The item will be marked as READY for pickup.' : ''}
            </p>
          </div>

          <Input
            label="Carrier / Shipping Details"
            placeholder="e.g. SF Express, Tracking #12345..."
            value={updateData.carrierInfo}
            onChange={(e) => setUpdateData({ ...updateData, carrierInfo: e.target.value })}
            fullWidth
          />

          <Textarea
             label="Internal Notes"
             placeholder="Optional notes for other staff..."
             value={updateData.notes}
             onChange={(e) => setUpdateData({ ...updateData, notes: e.target.value })}
             fullWidth
             rows={3}
          />

          <div className="grid grid-cols-2 gap-3 pt-4">
            <Button variant="outline" onClick={closeUpdateModal}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleUpdateStatus}
              isLoading={isLoading}
            >
              Confirm {updateData.status === TransferStatus.IN_TRANSIT ? 'Shipment' : 'Arrival'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TransferManagement;
