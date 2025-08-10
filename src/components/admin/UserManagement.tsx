import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'user' | 'admin' | 'super_admin';
  is_active: boolean;
  created_at: string;
  last_login?: string;
  permissions?: any;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState<number | null>(null);
  const [form, setForm] = useState<{ email: string; password: string; full_name: string; role: string }>({ email: '', password: '', full_name: '', role: 'user' });
  const [saving, setSaving] = useState(false);

  const API_BASE = 'http://localhost:5000/api';

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Fetching users from:', `${API_BASE}/users`);
      const res = await fetch(`${API_BASE}/users`);
      console.log('Fetch response status:', res.status);
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch users');
      }
      
      const data = await res.json();
      console.log('Fetched users:', data);
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch users');
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      console.log('Sending user data:', form);
      const res = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      console.log('Response status:', res.status);
      const responseData = await res.json();
      console.log('Response data:', responseData);
      
      if (!res.ok) {
        throw new Error(responseData.error || 'Failed to add user');
      }
      
      setShowAdd(false);
      setForm({ email: '', password: '', full_name: '', role: 'user' });
      fetchUsers();
    } catch (error) {
      console.error('Error adding user:', error);
      setError(error instanceof Error ? error.message : 'Failed to add user');
    }
    setSaving(false);
  };

  const handleEdit = async (e: React.FormEvent, id: number) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Failed to update user');
      setShowEdit(null);
      setForm({ email: '', password: '', full_name: '', role: 'user' });
      fetchUsers();
    } catch {
      setError('Failed to update user');
    }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this user?')) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/users/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete user');
      fetchUsers();
    } catch {
      setError('Failed to delete user');
    }
    setSaving(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">User Management</h2>
        <button onClick={() => setShowAdd(true)} className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus size={16} /> <span>Add User</span>
        </button>
      </div>
      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full mb-6">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Email</th>
              <th className="text-left py-2">Full Name</th>
              <th className="text-left py-2">Role</th>
              <th className="text-left py-2">Status</th>
              <th className="text-left py-2">Created</th>
              <th className="text-left py-2">Last Login</th>
              <th className="text-left py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b">
                <td>{user.email}</td>
                <td>{user.full_name}</td>
                <td>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    user.role === 'super_admin' ? 'bg-purple-100 text-purple-800' :
                    user.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role.replace('_', ' ').toUpperCase()}
                  </span>
                </td>
                <td>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="text-sm text-gray-600">{new Date(user.created_at).toLocaleDateString()}</td>
                <td className="text-sm text-gray-600">
                  {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                </td>
                <td>
                  <button onClick={() => { setShowEdit(user.id); setForm({ email: user.email, password: '', full_name: user.full_name, role: user.role }); }} className="text-blue-600 hover:text-blue-800 mr-2"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* Add User Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Add User</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <input type="email" required placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full p-2 border rounded" />
              <input type="text" required placeholder="Full Name" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} className="w-full p-2 border rounded" />
              <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className="w-full p-2 border rounded">
                <option value="user">Regular User</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
              <input type="password" required placeholder="Password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} className="w-full p-2 border rounded" />
              <div className="flex space-x-2 justify-end">
                <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"><X size={16} /></button>
                <button type="submit" disabled={saving} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"><Save size={16} /> Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Edit User Modal */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Edit User</h3>
            <form onSubmit={e => handleEdit(e, showEdit)} className="space-y-4">
              <input type="text" required placeholder="Full Name" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} className="w-full p-2 border rounded" />
              <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className="w-full p-2 border rounded">
                <option value="user">Regular User</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
              <input type="password" placeholder="New Password (leave blank to keep)" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} className="w-full p-2 border rounded" />
              <div className="flex space-x-2 justify-end">
                <button type="button" onClick={() => setShowEdit(null)} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"><X size={16} /></button>
                <button type="submit" disabled={saving} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"><Save size={16} /> Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement; 