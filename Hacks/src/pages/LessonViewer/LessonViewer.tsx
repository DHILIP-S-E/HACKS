import React from 'react'
import { useParams } from 'react-router-dom'

const LessonViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">
        Lesson Viewer
      </h1>
      <p className="text-muted-foreground">
        Viewing lesson: {id}
      </p>
      <div className="bg-muted p-6 rounded-lg">
        <p>Lesson content will be displayed here with accessibility features.</p>
      </div>
    </div>
  )
}

export default LessonViewer