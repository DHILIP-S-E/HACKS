import React from 'react';

const TeacherDashboard: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Teacher Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">My Lessons</h2>
          <p className="text-gray-600 mb-4">Manage your created lessons</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            View Lessons
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Create New Lesson</h2>
          <p className="text-gray-600 mb-4">Design accessible learning content</p>
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Create Lesson
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Student Progress</h2>
          <p className="text-gray-600 mb-4">Track student performance</p>
          <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
            View Progress
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;