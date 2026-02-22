'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Filter, Calendar, Tag, Shield, Users, Zap } from 'lucide-react'

const features = [
  {
    icon: CheckCircle,
    title: 'Task Management',
    description: 'Create, edit, and organize tasks with ease. Mark them as done with a single click.',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Filter,
    title: 'Smart Filtering',
    description: 'Filter tasks by status, priority, category, or search keywords to find what you need.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Calendar,
    title: 'Due Dates',
    description: 'Set deadlines and get reminders to stay on top of your schedule.',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Tag,
    title: 'Categories & Tags',
    description: 'Organize tasks into categories and add tags for better organization.',
    color: 'from-orange-500 to-red-500'
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is encrypted and secure. We never share your information.',
    color: 'from-indigo-500 to-blue-500'
  },
  {
    icon: Zap,
    title: 'Fast & Responsive',
    description: 'Lightning-fast performance on any device with smooth animations.',
    color: 'from-yellow-500 to-orange-500'
  }
]

export default function Features() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5 }}
          className="group"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 h-full transition-all duration-300 group-hover:shadow-xl">
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6`}>
              <feature.icon size={28} className="text-white" />
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              {feature.title}
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400">
              {feature.description}
            </p>
            
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mr-2"></span>
                Included in all plans
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}