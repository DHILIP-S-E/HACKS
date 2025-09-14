import React from 'react'
import { useAuthStore } from '@/store/authStore'

const Profile: React.FC = () => {
  const { user } = useAuthStore()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Profile</h1>
      <div className="bg-muted p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">User Information</h2>
        <div className="space-y-2">
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Role:</strong> {user?.role}</p>
        </div>
      </div>
    </div>
  )
}

export default Profile