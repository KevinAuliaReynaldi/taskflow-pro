'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import TaskForm from '@/components/tasks/TaskForm'
import { Category, TaskFormData } from '@/types'

interface CreateTaskClientProps {
  categories: Category[]
}

export default function CreateTaskClient({ categories }: CreateTaskClientProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: TaskFormData) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error('Failed to create task')
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError('Failed to create task. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Task</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Add a new task to your list</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <TaskForm 
          onSubmit={handleSubmit} 
          categories={categories}
          loading={loading}
        />
      </div>
    </div>
  )
}
