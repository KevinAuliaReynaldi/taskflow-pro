'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { 
  Menu, 
  X, 
  Home, 
  LayoutDashboard, 
  LogOut,
  User,
  Bell
} from 'lucide-react'
import ThemeToggle from './ThemeToggle'

/**
 * Properti untuk komponen Header.
 * 
 * @property session Sesi pengguna dari server (opsional)
 */
interface HeaderProps {
  session: any // Menggunakan any karena session bisa berasal dari server atau client
}

/**
 * Komponen Header utama yang berisi logo, navigasi, toggle tema, dan menu pengguna.
 * Menangani tampilan navigasi dinamis berdasarkan status login dan notifikasi.
 * 
 * @param props Properti HeaderProps
 * @returns Elemen JSX Header
 */
export default function Header({ session }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState({ undoneCount: 0, recentUpdates: [] as any[] })
  const { data: clientSession } = useSession()
  const currentSession = clientSession || session

  const fetchNotifications = async () => {
    if (!currentSession?.user?.id) return
    try {
      const res = await fetch('/api/notifications')
      if (res.ok) {
        const data = await res.json()
        setNotifications(data)
      }
    } catch (error) {
      console.error('Failed to fetch notifications', error)
    }
  }

  // Poll for notifications every 30 seconds
  // Also fetch on mount
  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [currentSession])

  const navigation = currentSession ? [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  ] : [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Login', href: '/login', icon: User },
    { name: 'Register', href: '/register', icon: User },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TF</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                TaskFlow
                <span className="text-blue-600 dark:text-blue-400">Pro</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <item.icon size={18} className="mr-2" />
                {item.name}
              </Link>
            ))}
            
            <ThemeToggle />
            
            {currentSession && (
              <>
                <div className="relative">
                  <button 
                    onClick={() => {
                      setNotificationMenuOpen(!notificationMenuOpen)
                      setUserMenuOpen(false)
                      fetchNotifications() // Refresh on click
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
                  >
                    <Bell size={20} className="text-gray-700 dark:text-gray-300" />
                    {notifications.undoneCount > 0 && (
                      <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full">
                        {notifications.undoneCount > 99 ? '99+' : notifications.undoneCount}
                      </span>
                    )}
                  </button>

                  {notificationMenuOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50 overflow-hidden">
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <span className="font-semibold text-gray-900 dark:text-white">Notifications</span>
                        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                          {notifications.undoneCount} pending
                        </span>
                      </div>
                      
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.recentUpdates.length === 0 ? (
                          <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                            No recent updates
                          </div>
                        ) : (
                          <div className="divide-y divide-gray-100 dark:divide-gray-700">
                            {notifications.recentUpdates.map((task, idx) => (
                              <div key={task.id} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                  {task.title}
                                </p>
                                <div className="flex items-center justify-between mt-1">
                                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                                    task.status === 'completed' 
                                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                  }`}>
                                    {task.status}
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    Updated {new Date(task.updated_at).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="relative">
                  <button
                    onClick={() => {
                      setUserMenuOpen(!userMenuOpen)
                      setNotificationMenuOpen(false)
                    }}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {currentSession.user?.username?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {currentSession.user?.username}
                    </span>
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {currentSession.user?.username}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {currentSession.user?.email}
                        </p>
                      </div>
                      <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <LogOut size={16} className="mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {mobileMenuOpen ? (
                <X size={24} className="text-gray-700 dark:text-gray-300" />
              ) : (
                <Menu size={24} className="text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-3 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <item.icon size={20} className="mr-3" />
                  {item.name}
                </Link>
              ))}
              
              {currentSession && (
                <>
                  <div className="px-3 py-3 border-t border-gray-200 dark:border-gray-800">
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                         <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Notifications</span>
                         <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full dark:bg-red-900/30 dark:text-red-400">
                            {notifications.undoneCount} pending
                         </span>
                      </div>
                      {notifications.recentUpdates.length > 0 && (
                        <div className="space-y-2 pl-2 border-l-2 border-gray-100 dark:border-gray-700">
                           {notifications.recentUpdates.slice(0, 3).map(task => (
                             <div key={task.id} className="text-sm">
                               <p className="text-gray-800 dark:text-gray-200 truncate">{task.title}</p>
                               <p className="text-xs text-gray-500">{task.status}</p>
                             </div>
                           ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center mt-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-bold">
                          {currentSession.user?.username?.[0]?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {currentSession.user?.username}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {currentSession.user?.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: '/' })
                      setMobileMenuOpen(false)
                    }}
                    className="flex items-center w-full px-3 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut size={20} className="mr-3" />
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
