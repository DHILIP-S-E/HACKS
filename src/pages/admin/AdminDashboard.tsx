import React from 'react';

const AdminDashboard: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Users</h2>
          <p className="text-3xl font-bold text-blue-500 mb-2">1,234</p>
          <p className="text-gray-600">Total registered users</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Lessons</h2>
          <p className="text-3xl font-bold text-green-500 mb-2">456</p>
          <p className="text-gray-600">Total lessons created</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Teachers</h2>
          <p className="text-3xl font-bold text-purple-500 mb-2">89</p>
          <p className="text-gray-600">Active teachers</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Students</h2>
          <p className="text-3xl font-bold text-orange-500 mb-2">1,145</p>
          <p className="text-gray-600">Active students</p>
        </div>
      </div>
      
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2">
            Manage Users
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Add User
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">System Settings</h2>
          <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 mr-2">
            Settings
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Logs
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;