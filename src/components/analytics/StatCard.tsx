import { Card } from '@components/ui';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  className?: string;
}

const StatCard = ({ label, value, icon: Icon, color, className }: StatCardProps) => (
  <Card className={className}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      </div>
      <Icon className={`h-12 w-12 ${color}`} />
    </div>
  </Card>
);

export default StatCard;
