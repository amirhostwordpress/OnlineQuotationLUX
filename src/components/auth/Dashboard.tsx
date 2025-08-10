import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useQuotation } from '../../context/QuotationContext';
import { 
  FileText, 
  Settings, 
  Users, 
  BarChart3, 
  LogOut, 
  Building2,
  User,
  Shield,
  Crown
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { resetQuotation } = useQuotation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    resetQuotation();
    navigate('/login');
  };

  const handleNewQuotation = () => {
    resetQuotation();
    navigate('/quotation');
  };

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'super_admin':
        return <Crown className="h-5 w-5 text-purple-600" />;
      case 'admin':
        return <Shield className="h-5 w-5 text-blue-600" />;
      default:
        return <User className="h-5 w-5 text-green-600" />;
    }
  };

  const getRoleName = () => {
    switch (user?.role) {
      // case 'super_admin':
      //   return 'Super Admin';
      case 'admin':
        return 'Admin';
      default:
        return 'User';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
            <img
  src="../logo.webp"
  alt="Company Logo"
  className="h-8 w-8 mr-3 object-contain"
/>

              <h1 className="text-2xl font-bold text-gray-900">Luxone Quotation System</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {getRoleIcon()}
                <span className="text-sm text-gray-600">{getRoleName()}</span>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-600">{user?.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.full_name || user?.email}!</h2>
          <p className="text-gray-600">What would you like to do today?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
          {/* New Quotation */}
          <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900">New Quotation</h3>
            </div>
            <p className="text-gray-600 mb-4">Create a new quotation for your project</p>
            <button
              onClick={handleNewQuotation}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Start New Quotation
            </button>
          </div>

          {/* Admin Features */}
          {(user?.role === 'admin' || user?.role === 'super_admin') && (
            <>
              {/* <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-900">User Management</h3>
                </div>
                <p className="text-gray-600 mb-4">Manage users and their permissions</p>
                <button
                  onClick={() => navigate('/admin/users')}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                >
                  Manage Users
                </button>
              </div> */}

              {/* <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Settings className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-900">Company Settings</h3>
                </div>
                <p className="text-gray-600 mb-4">Configure company information and settings</p>
                <button
                  onClick={() => navigate('/admin/settings')}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
                >
                  Manage Settings
                </button>
              </div> */}

              {/* <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-900">Analytics</h3>
                </div>
                <p className="text-gray-600 mb-4">View quotation analytics and reports</p>
                <button
                  onClick={() => navigate('/admin/analytics')}
                  className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors"
                >
                  View Analytics
                </button>
              </div> */}
            </>
          )}

          {/* Super Admin Features */}
          {user?.role === 'super_admin' && (
            <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Crown className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="ml-3 text-lg font-semibold text-gray-900">Super Admin Panel</h3>
              </div>
              <p className="text-gray-600 mb-4">Access full system administration</p>
              <button
                onClick={() => navigate('/super-admin')}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
              >
                Super Admin Panel
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
