import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { query } from '@/lib/db'
import DashboardStats from '@/components/dashboard/DashboardStats'
import TaskList from '@/components/tasks/TaskList'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Fetch user's tasks
  const tasks = await query(
    `SELECT t.*, c.name as category_name, c.color as category_color 
     FROM tasks t
     LEFT JOIN categories c ON t.category_id = c.id
     WHERE t.user_id = ?
     ORDER BY 
       CASE WHEN t.due_date IS NULL THEN 1 ELSE 0 END,
       t.due_date ASC,
       CASE t.priority 
         WHEN "high" THEN 1
         WHEN "medium" THEN 2
         WHEN "low" THEN 3
       END,
       t.created_at DESC`,
    [session.user.id]
  ) as any[]

  // Fetch user's categories
  const categories = await query(
    'SELECT * FROM categories WHERE user_id = ? ORDER BY name ASC',
    [session.user.id]
  ) as any[]

  // Calculate statistics
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t: any) => t.status === 'completed').length
  const pendingTasks = tasks.filter((t: any) => t.status === 'pending').length
  const overdueTasks = tasks.filter((t: any) => {
    if (!t.due_date) return false
    const dueDate = new Date(t.due_date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return dueDate < today && t.status !== 'completed'
  }).length

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Welcome back, {session.user?.username}!
        </h1>
        <p className="text-blue-100">
          You have {pendingTasks} pending task{pendingTasks !== 1 ? 's' : ''} to complete.
        </p>
      </div>

      {/* Statistics */}
      <DashboardStats
        totalTasks={totalTasks}
        completedTasks={completedTasks}
        pendingTasks={pendingTasks}
        overdueTasks={overdueTasks}
      />

      {/* Tasks Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Your Tasks
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Manage all your tasks in one place
            </p>
          </div>
          <a
            href="/dashboard/tasks/new"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            + New Task
          </a>
        </div>

        <TaskList
          initialTasks={tasks}
          categories={categories}
        />
      </div>
    </div>
  )
}