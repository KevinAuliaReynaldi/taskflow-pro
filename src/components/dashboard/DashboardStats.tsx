'use client'

import { CheckCircle, Clock, AlertCircle, List } from 'lucide-react'
import { motion } from 'framer-motion'

interface DashboardStatsProps {
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  overdueTasks: number
}

export default function DashboardStats({
  totalTasks,
  completedTasks,
  pendingTasks,
  overdueTasks
}: DashboardStatsProps) {
  const stats = [
    {
      title: 'Total Tasks',
      value: totalTasks,
      icon: List,
      color: 'from-blue-500 to-cyan-500',
      change: '+12%'
    },
    {
      title: 'Completed',
      value: completedTasks,
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-500',
      change: '+8%'
    },
    {
      title: 'Pending',
      value: pendingTasks,
      icon: Clock,
      color: 'from-yellow-500 to-orange-500',
      change: '-3%'
    },
    {
      title: 'Overdue',
      value: overdueTasks,
      icon: AlertCircle,
      color: 'from-red-500 to-pink-500',
      change: overdueTasks > 0 ? 'Attention!' : 'All good'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
              <stat.icon size={24} className="text-white" />
            </div>
            <span className={`text-sm font-medium px-2 py-1 rounded-full ${
              stat.title === 'Overdue' && stat.value > 0
                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }`}>
              {stat.change}
            </span>
          </div>
          
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {stat.value}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-400">
            {stat.title}
          </p>
          
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full bg-gradient-to-r ${stat.color}`}
                style={{ 
                  width: `${totalTasks > 0 ? (stat.value / totalTasks) * 100 : 0}%` 
                }}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}