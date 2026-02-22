'use client'

import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Filter, Moon, Sun, Calendar, Users, Shield } from 'lucide-react'
import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import CTASection from '@/components/landing/CTASection'
import { useTheme } from '@/components/providers/ThemeProvider'
import Link from 'next/link'

export default function LandingPage() {
  const { theme } = useTheme()

  return (
    <div className="overflow-hidden">
      <Hero />
      
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-20 bg-white dark:bg-gray-900"
      >
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need for Task Management
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              From personal to-dos to team projects, TaskFlow Pro has you covered
            </p>
          </div>
          
          <Features />
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="py-20 bg-gray-50 dark:bg-gray-800"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Beautiful Dark & Light Themes
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Switch between themes seamlessly with our elegant theme system
          </p>
          
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="p-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg">
                {theme === 'dark' ? (
                  <Moon size={32} className="text-white" />
                ) : (
                  <Sun size={32} className="text-white" />
                )}
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200"
              >
                <div className="text-left">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="text-green-500" size={20} />
                      <span className="font-medium text-gray-900">Light Theme</span>
                    </div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="flex gap-2 mt-6">
                      <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm">
                        Work
                      </div>
                      <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm">
                        Personal
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gray-900 rounded-2xl shadow-xl p-6 border border-gray-800"
              >
                <div className="text-left">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="text-green-400" size={20} />
                      <span className="font-medium text-gray-100">Dark Theme</span>
                    </div>
                    <div className="h-4 bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div className="flex gap-2 mt-6">
                      <div className="px-4 py-2 bg-blue-900/30 text-blue-300 rounded-lg text-sm">
                        Work
                      </div>
                      <div className="px-4 py-2 bg-green-900/30 text-green-300 rounded-lg text-sm">
                        Personal
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      <CTASection />
    </div>
  )
}