import { connectToDatabase } from '../../../../src/server/db/mongoose';
import UserModel from '../../../../src/server/db/models/user.model';
import { Card, Table } from '../../../../src/components/ui';

// Mark this page as dynamic to prevent build-time data fetching
export const dynamic = 'force-dynamic';

export default async function SubAdminUsersPage() {
  try {
    await connectToDatabase();

    const users = await UserModel.find()
      .select('email role status createdAt')
      .lean()
      .maxTimeMS(30000)
      .limit(100);

    const roleStats = {
      individual: users.filter((u: any) => u.role === 'INDIVIDUAL').length,
      corporate: users.filter((u: any) => u.role === 'CORPORATE').length,
      admin: users.filter((u: any) => u.role === 'ADMIN').length,
      subAdmin: users.filter((u: any) => u.role === 'SUB_ADMIN').length,
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <div className="p-4">
              <p className="text-xs text-gray-600 uppercase">Individual Users</p>
              <p className="text-2xl font-bold">{roleStats.individual}</p>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <p className="text-xs text-gray-600 uppercase">Corporate Accounts</p>
              <p className="text-2xl font-bold">{roleStats.corporate}</p>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <p className="text-xs text-gray-600 uppercase">Admins</p>
              <p className="text-2xl font-bold">{roleStats.admin}</p>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <p className="text-xs text-gray-600 uppercase">Sub Admins</p>
              <p className="text-2xl font-bold">{roleStats.subAdmin}</p>
            </div>
          </Card>
        </div>

        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">All Users</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-2 px-4 font-semibold text-gray-900">Email</th>
                    <th className="text-left py-2 px-4 font-semibold text-gray-900">Role</th>
                    <th className="text-left py-2 px-4 font-semibold text-gray-900">Status</th>
                    <th className="text-left py-2 px-4 font-semibold text-gray-900">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user: any) => (
                    <tr key={user._id.toString()} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          user.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
    );
  } catch (error) {
    console.error('Error fetching users:', error);
    return <div className="text-red-600">Error loading users</div>;
  }
}
