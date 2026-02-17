import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@components/ui';
import { Pickup } from '@app-types/pickup.types';
import { useAuth } from '@hooks/useAuth';

interface CalendarViewProps {
  pickups: Pickup[];
}

const CalendarView = ({ pickups }: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { user } = useAuth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getClaimantName = (pickup: Pickup) => {
    const claimantId = typeof pickup.claimantId === 'object' ? pickup.claimantId._id : pickup.claimantId;
    const userId = user?.id || user?._id;
    
    // Check if the current user is the claimant
    const isMe = user && (claimantId === userId);
    
    if (isMe) return 'You';
    return (typeof pickup.claimantId === 'object' ? pickup.claimantId.name : 'Unknown');
  };

  const CalendarGrid = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = endOfMonth.getDate();
    
    // Helper to check if a date string matches current calendar cell
    const isSameDay = (dateStr: string | Date, day: number) => {
        const d = new Date(dateStr);
        return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
    };

    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
        const dayPickups = pickups.filter(p => isSameDay(p.pickupDate, i));
        
        days.push(
            <div key={i} className={`min-h-[100px] border p-2 rounded-lg ${dayPickups.length > 0 ? 'bg-primary-50 border-primary-200' : 'bg-gray-50 border-gray-100'}`}>
                <div className="text-right font-medium text-sm text-gray-500">{i}</div>
                <div className="space-y-1 mt-1 overflow-y-auto max-h-[80px]">
                    {dayPickups.map(p => (
                        <Link key={p._id} to={`/pickups/${p._id}`} className="block">
                            <div className="text-xs bg-white p-1 rounded border border-primary-100 shadow-sm truncate hover:bg-primary-100 transition-colors" title={`${p.startTime} - ${p.itemId?.description || 'Item'}`}>
                                {p.startTime} - {getClaimantName(p)}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={handlePrevMonth}>&lt; Prev</Button>
                <h3 className="text-lg font-medium text-gray-900">
                    {startOfMonth.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
                </h3>
                <Button variant="ghost" size="sm" onClick={handleNextMonth}>Next &gt;</Button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-gray-500 mb-2">
                <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
            </div>
            <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: startOfMonth.getDay() }).map((_, i) => (
                    <div key={`empty-${i}`} className="min-h-[100px] bg-transparent" />
                ))}
                {days}
            </div>
        </div>
    );
  }, [pickups, currentDate, user]);

  return CalendarGrid;
};

export default CalendarView;
