import { Shield, Plus } from 'lucide-react';
import { Button } from '@components/ui';

interface StaffHeaderProps {
  onAddStaff: () => void;
}

const StaffHeader = ({ onAddStaff }: StaffHeaderProps) => (
  <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
    <div className="flex items-center gap-4">
      <div className="p-3 rounded-2xl bg-primary-50 border border-primary-100 shadow-sm">
        <Shield className="w-8 h-8 text-primary-600" />
      </div>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Staff Management</h1>
        <p className="text-gray-500 font-medium">Control system access and manage administrative roles</p>
      </div>
    </div>
    <Button onClick={onAddStaff} className="flex items-center gap-2 rounded-xl px-6 py-6 shadow-md hover:shadow-lg transition-all">
      <Plus className="w-5 h-5" />
      Add Staff Member
    </Button>
  </div>
);

export default StaffHeader;
