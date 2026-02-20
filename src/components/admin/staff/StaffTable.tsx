import { User as UserIcon, Mail } from 'lucide-react';
import { Card, Badge } from '@components/ui';
import { User } from '@/types';
import { ROLE_BADGE_CONFIG, STATUS_BADGE_CONFIG } from '@constants/ui';

interface StaffTableProps {
  users: User[];
}

const StaffTable = ({ users }: StaffTableProps) => (
  <Card className="overflow-hidden border-2 border-gray-100 rounded-3xl shadow-sm">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50/50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Name</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Email</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Role</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Joined</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {users.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-24 text-center">
                <div className="flex flex-col items-center gap-2 opacity-40">
                  <UserIcon className="w-12 h-12 text-gray-400" />
                  <p className="text-gray-500 font-bold text-lg">No staff found</p>
                </div>
              </td>
            </tr>
          ) : (
            users.map((u) => {
              const roleConfig = ROLE_BADGE_CONFIG[u.role as keyof typeof ROLE_BADGE_CONFIG] || ROLE_BADGE_CONFIG.STAFF;
              const statusConfig = STATUS_BADGE_CONFIG[String(u.isEmailVerified) as keyof typeof STATUS_BADGE_CONFIG];
              const RoleIcon = roleConfig.icon;

              return (
                <tr key={u._id} className="hover:bg-primary-50/30 transition-colors group">
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 group-hover:bg-primary-200 transition-colors shadow-inner">
                        <UserIcon className="w-6 h-6" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-bold text-gray-900">{u.name}</div>
                        <div className="text-xs text-gray-400 font-medium">@{u.email.split('@')[0]}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2 text-gray-300" />
                      {u.email}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <Badge variant={roleConfig.variant} className="flex items-center w-fit gap-1.5 px-3 py-1 rounded-lg">
                      <RoleIcon className="w-3.5 h-3.5" />
                      {u.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <Badge variant={statusConfig.variant} className="px-3 py-1 rounded-lg">
                      {statusConfig.label}
                    </Badge>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500 font-medium">
                    {new Date(u.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  </Card>
);

export default StaffTable;
