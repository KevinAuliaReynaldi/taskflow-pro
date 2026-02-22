import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { query } from '@/lib/db'
import CreateTaskClient from './client'
import { Category } from '@/types'

export default async function CreateTaskPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  const categories = await query(
    'SELECT * FROM categories WHERE user_id = ? ORDER BY name ASC',
    [session.user.id]
  ) as Category[]

  // Convert dates to ISO strings if needed, though categories usually don't have complex dates that break serialization
  // But plain objects from mysql2 might need serialization if they contain non-serializable fields (like Date objects)
  // Next.js server components to client components props need to be serializable.
  // MySQL 'created_at' is usually a Date object in JS if the driver parses it.
  
  const serializedCategories = categories.map(cat => ({
    ...cat,
    created_at: cat.created_at ? new Date(cat.created_at).toISOString() : '',
    // user_id might be null in DB? schema says user_id: number.
  }))

  return <CreateTaskClient categories={serializedCategories} /> 
  // Cast specific types if mismatch on date string vs Date object, 
  // but Category type in 'types/index.ts' has created_at: string.
}
