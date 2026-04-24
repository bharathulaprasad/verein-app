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
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const handleRoleChange = async (userId: string, newRole: string) => {
    // Optimistic UI Update
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    setMessage({ type: 'success', text: 'Erfolgreich gespeichert!' });
    setTimeout(() => setMessage(null), 3000);
    startTransition(async () => {
      try {
        await updateUserRole(userId, newRole as any);
      } catch (error) {
        // Revert on failure
        setUsers(initialUsers);
        alert(error instanceof Error ? error.message : "Failed to update role");
        
        setMessage({ 
          type: 'error', 
          text: error instanceof Error ? error.message : 'Fehler beim Speichern.' 
        });
        setTimeout(() => setMessage(null), 5000);
      }
    });
  };

  return (
    <div className="mt-6">
      
      {/* 4. Display the message banner if it exists */}
      {message && (
        <div 
          className={`mb-4 p-4 text-sm rounded-lg font-medium transition-all ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

    <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 shadow-sm mx-4 sm:mx-0">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
          <tr>
            <th scope="col" className="px-6 py-3">Name</th>
            <th scope="col" className="px-6 py-3">Email</th>
            <th scope="col" className="px-6 py-3">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md mb-4">
              <td className="px-6 py-4 font-medium text-gray-900">{user.name || 'Kein Name'}</td>
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
    </div>
  );
}