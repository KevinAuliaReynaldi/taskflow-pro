'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TaskItem from './TaskItem'
import TaskFilter from './TaskFilter'
import { Task, Category } from '@/types'

interface TaskListProps {
  initialTasks: Task[]
  categories: Category[]
  onTasksChange?: () => void
}

export default function TaskList({ initialTasks, categories, onTasksChange }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(initialTasks)
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    categoryId: 'all',
    search: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setTasks(initialTasks)
    setFilteredTasks(initialTasks)
  }, [initialTasks])

  useEffect(() => {
    let filtered = [...tasks]
    
    if (filters.status !== 'all') {
      filtered = filtered.filter(task => task.status === filters.status)
    }
    
    if (filters.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === filters.priority)
    }
    
    if (filters.categoryId !== 'all') {
      const categoryId = parseInt(filters.categoryId)
      filtered = filtered.filter(task => task.category_id === categoryId)
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower)
      )
    }
    
    setFilteredTasks(filtered)
  }, [tasks, filters])

  const handleTaskUpdate = async (taskId: number, updates: Partial<Task>) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      
      if (response.ok) {
        const data = await response.json()
        setTasks(tasks.map(task => 
          task.id === taskId ? data.task : task
        ))
        onTasksChange?.()
      }
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const handleTaskDelete = async (taskId: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return
    
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setTasks(tasks.filter(task => task.id !== taskId))
        onTasksChange?.()
      }
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const refreshTasks = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/tasks')
      if (response.ok) {
        const data = await response.json()
        setTasks(data)
      }
    } catch (error) {
      console.error('Error refreshing tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <TaskFilter
        filters={filters}
        onFilterChange={setFilters}
        categories={categories}
      />
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredTasks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="max-w-md mx-auto">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No tasks found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {tasks.length === 0 
                ? "Get started by creating your first task!" 
                : "Try changing your filters or search query"}
            </p>
          </div>
        </motion.div>
      ) : (
        <AnimatePresence>
          <div className="space-y-4">
            {filteredTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <TaskItem
                  task={task}
                  onUpdate={handleTaskUpdate}
                  onDelete={handleTaskDelete}
                />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  )
}