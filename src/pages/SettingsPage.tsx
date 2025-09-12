import React from 'react';

const SettingsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Accessibility Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6">Accessibility Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">High Contrast Mode</label>
              <input type="checkbox" className="toggle" />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Dyslexic Font</label>
              <input type="checkbox" className="toggle" />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Reduced Motion</label>
              <input type="checkbox" className="toggle" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
              <input type="range" min="12" max="24" defaultValue="16" className="w-full" />
            </div>
          </div>
        </div>
        
        {/* Theme Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6">Theme Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Email Notifications</label>
              <input type="checkbox" className="toggle" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Push Notifications</label>
              <input type="checkbox" className="toggle" />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Lesson Reminders</label>
              <input type="checkbox" className="toggle" defaultChecked />
            </div>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
            Save Settings
          </button>
          <button className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600">
            Reset to Default
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;