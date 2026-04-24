import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/lib/auth"; 
import { getUsers } from '@/app/actions/roles';
import UserManagementClient from './UserManagementClient';

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);

  // Protect the route!
  // @ts-ignore
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/'); // Send non-admins back to the homepage
  }

  // Fetch the users from our Server Action
  const users = await getUsers();

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        User Access Management
      </h1>
      <p className="text-gray-500 mt-2">
        View and change the roles of registered users.
      </p>
      
      {/* Client Component for the interactive table */}
      <UserManagementClient initialUsers={users} />
    </div>
  );
}