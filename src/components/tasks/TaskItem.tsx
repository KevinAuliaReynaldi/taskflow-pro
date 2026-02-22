'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircle, 
  Circle, 
  Trash2, 
  Edit, 
  Calendar,
  Flag,
  Tag,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { formatDate, getPriorityColor, getStatusColor } from '@/lib/utils'
import { Task } from '@/types'
import Button from '@/components/ui/Button'

interface TaskItemProps {
  task: Task
  onUpdate: (taskId: number, updates: Partial<Task>) => Promise<void>
  onDelete: (taskId: number) => Promise<void>
}

export default function TaskItem({ task, onUpdate, onDelete }: TaskItemProps) {
  const [expanded, setExpanded] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleToggleComplete = async () => {
    if (isUpdating) return
    
    setIsUpdating(true)
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed'
      await onUpdate(task.id, { status: newStatus })
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePriorityChange = async (priority: 'low' | 'medium' | 'high') => {
    if (isUpdating) return
    
    setIsUpdating(true)
    try {
      await onUpdate(task.id, { priority })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      await onDelete(task.id)
    }
  }

  const priorityColor = getPriorityColor(task.priority)
  const statusColor = getStatusColor(task.status)

  return (
    <motion.div
      whileHover={{ scale: 1.005 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Checkbox */}
          <button
            onClick={handleToggleComplete}
            disabled={isUpdating}
            className="mt-1 flex-shrink-0"
          >
            {task.status === 'completed' ? (
              <CheckCircle 
                size={24} 
                className="text-green-500 hover:text-green-600 transition-colors" 
              />
            ) : (
              <Circle 
                size={24} 
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" 
              />
            )}
          </button>

          {/* Task Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className={`font-medium text-lg ${
                  task.status === 'completed' 
                    ? 'line-through text-gray-500 dark:text-gray-400' 
                    : 'text-gray-900 dark:text-gray-100'
                }`}>
                  {task.title}
                </h3>
                
                {task.description && (
                  <motion.p
                    initial={false}
                    animate={{ height: expanded ? 'auto' : 0 }}
                    className="overflow-hidden text-gray-600 dark:text-gray-400 mt-2"
                  >
                    {task.description}
                  </motion.p>
                )}
              </div>

              <button
                onClick={() => setExpanded(!expanded)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
              >
                {expanded ? (
                  <ChevronUp size={20} className="text-gray-500" />
                ) : (
                  <ChevronDown size={20} className="text-gray-500" />
                )}
              </button>
            </div>

            {/* Tags and Metadata */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {/* Priority */}
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${priorityColor}`}>
                <div className="flex items-center gap-1">
                  <Flag size={12} />
                  <span className="capitalize">{task.priority}</span>
                </div>
              </div>

              {/* Category */}
              {task.category_name && (
                <div 
                  className="px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"
                  style={{ 
                    backgroundColor: `${task.category_color}20`,
                    color: task.category_color
                  }}
                >
                  <Tag size={12} />
                  <span>{task.category_name}</span>
                </div>
              )}

              {/* Due Date */}
              {task.due_date && (
                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar size={14} />
                  <span>{formatDate(task.due_date)}</span>
                </div>
              )}

              {/* Status */}
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
                <span className="capitalize">{task.status.replace('_', ' ')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Expanded Actions */}
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="flex flex-wrap gap-3">
              {/* Priority Buttons */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={task.priority === 'high' ? 'primary' : 'secondary'}
                  onClick={() => handlePriorityChange('high')}
                  disabled={isUpdating}
                >
                  High
                </Button>
                <Button
                  size="sm"
                  variant={task.priority === 'medium' ? 'primary' : 'secondary'}
                  onClick={() => handlePriorityChange('medium')}
                  disabled={isUpdating}
                >
                  Medium
                </Button>
                <Button
                  size="sm"
                  variant={task.priority === 'low' ? 'primary' : 'secondary'}
                  onClick={() => handlePriorityChange('low')}
                  disabled={isUpdating}
                >
                  Low
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 ml-auto">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => window.location.href = `/dashboard/tasks/${task.id}/edit`}
                >
                  <Edit size={16} className="mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={handleDelete}
                  disabled={isUpdating}
                >
                  <Trash2 size={16} className="mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}