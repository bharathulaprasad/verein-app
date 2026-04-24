'use client'

import { useState, useTransition } from 'react';
import { updateUserRole } from '@/app/actions/roles';

type User = {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
};

export default function UserManagementClient({ initialUsers }: { initialUsers: User[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [isPending, startTransition] = useTransition();

  const handleRoleChange = async (userId: string, newRole: string) => {
    // Optimistic UI Update
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));

    startTransition(async () => {
      try {
        await updateUserRole(userId, newRole as any);
      } catch (error) {
        alert(error instanceof Error ? error.message : "Failed to update role");
        // Revert on failure
        setUsers(initialUsers);
      }
    });
  };

  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg mt-6">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">Name</th>
            <th scope="col" className="px-6 py-3">Email</th>
            <th scope="col" className="px-6 py-3">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900">{user.name || 'No Name'}</td>
              <td className="px-6 py-4">{user.email}</td>
              <td className="px-6 py-4">
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  disabled={isPending}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                >
                  {/* Replace these options with your actual Prisma Role enum values */}
                  <option value="GUEST">Guest</option>
                  <option value="MEMBER">Member</option>
                  <option value="VORSTAND">Vorstand</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}