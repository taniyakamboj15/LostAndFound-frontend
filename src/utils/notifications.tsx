import { Package, HandCoins, CircleAlert, Info, Truck, MapPin } from 'lucide-react';
import { Notification } from '../types';

const iconMap: Record<string, JSX.Element> = {
  'MATCH_FOUND': <Package className="h-5 w-5 text-indigo-500" />,
  'PAYMENT_REQUIRED': <HandCoins className="h-5 w-5 text-emerald-500" />,
  'PAYMENT_RECEIVED': <HandCoins className="h-5 w-5 text-emerald-500" />,
  'CLAIM_STATUS_UPDATE': <CircleAlert className="h-5 w-5 text-amber-500" />,
  'TRANSFER_SENT': <Truck className="h-5 w-5 text-blue-500" />,
  'TRANSFER_ARRIVED': <MapPin className="h-5 w-5 text-indigo-500" />,
  'PICKUP_BOOKED': <Package className="h-5 w-5 text-blue-500" />,
  'PICKUP_COMPLETED': <Package className="h-5 w-5 text-emerald-500" />,
  'NEW_CLAIM_PENDING': <CircleAlert className="h-5 w-5 text-amber-500" />,
};

export const getNotificationIcon = (event: string) => {
  return iconMap[event] || <Info className="h-5 w-5 text-slate-500" />;
};

export const getNotificationLink = (notification: Notification): string => {
  const { data, referenceId } = notification;
  if(data?.pickupId) return `/pickups/${data.pickupId}`;
  if(data?.claimId) return `/claims/${data.claimId}`;
  if(data?.matchId && data?.itemId) return `/items/${data.itemId}`;
  if(referenceId) {
    // If it's a claim-related reference
    if (referenceId.length === 24) return `/claims/${referenceId}`;
  }
  return '/dashboard'; // Default
};