import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { query } from '@/lib/db'
import { Task } from '@/types'

/**
 * Menangani permintaan GET untuk mengambil notifikasi pengguna.
 * Mengembalikan jumlah tugas yang belum selesai dan daftar pembaruan tugas terbaru.
 * 
 * @param request Objek NextRequest
 * @returns Respon JSON berisi undoneCount dan recentUpdates
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Tidak diizinkan (Unauthorized)' }, { status: 401 })
    }

    // 1. Ambil jumlah tugas yang belum selesai (pending atau in_progress)
    const undoneCountResult = await query(
      `SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND status != 'completed'`,
      [session.user.id]
    ) as { count: number }[]
    const undoneCount = undoneCountResult[0]?.count || 0

    // 2. Ambil tugas yang baru saja diperbarui
    let recentUpdates: Partial<Task>[] = []
    try {
        recentUpdates = await query(
            `SELECT t.id, t.title, t.status, t.updated_at 
             FROM tasks t 
             WHERE t.user_id = ? 
             ORDER BY t.updated_at DESC 
             LIMIT 5`,
            [session.user.id]
        ) as Partial<Task>[]
    } catch (e) {
        // Fallback jika kolom updated_at tidak ada atau terjadi kesalahan lain
        console.warn('Gagal mengambil berdasarkan updated_at, beralih ke created_at', e)
        recentUpdates = await query(
            `SELECT t.id, t.title, t.status, t.created_at as updated_at 
             FROM tasks t 
             WHERE t.user_id = ? 
             ORDER BY t.created_at DESC 
             LIMIT 5`,
            [session.user.id]
        ) as Partial<Task>[]
    }

    return NextResponse.json({
      undoneCount,
      recentUpdates
    })
  } catch (error) {
    console.error('Kesalahan saat mengambil notifikasi:', error)
    return NextResponse.json(
      { error: 'Kesalahan internal server' },
      { status: 500 }
    )
  }
}
