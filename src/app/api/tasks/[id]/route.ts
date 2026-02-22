import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { query } from '@/lib/db'
import { Task } from '@/types'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * Menangani permintaan GET untuk mengambil detail tugas tunggal berdasarkan ID.
 * 
 * @param request Objek NextRequest
 * @param params Parameter rute berisi ID tugas
 * @returns Respon JSON berisi detail tugas
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Tidak diizinkan' }, { status: 401 })
    }

    const { id } = await params
    const taskId = parseInt(id)

    if (isNaN(taskId)) {
      return NextResponse.json(
        { error: 'ID tugas tidak valid' },
        { status: 400 }
      )
    }

    const tasks = await query(
      `SELECT t.*, c.name as category_name, c.color as category_color 
       FROM tasks t
       LEFT JOIN categories c ON t.category_id = c.id
       WHERE t.id = ? AND t.user_id = ?`,
      [taskId, session.user.id]
    ) as Task[]

    if (tasks.length === 0) {
      return NextResponse.json(
        { error: 'Tugas tidak ditemukan' },
        { status: 404 }
      )
    }

    return NextResponse.json(tasks[0])
  } catch (error) {
    console.error('Gagal mengambil tugas:', error)
    return NextResponse.json(
      { error: 'Kesalahan internal server' },
      { status: 500 }
    )
  }
}

/**
 * Menangani permintaan PATCH untuk memperbarui tugas yang ada.
 * 
 * @param request Objek NextRequest berisi body pembaruan
 * @param params Parameter rute berisi ID tugas
 * @returns Respon JSON berisi pesan sukses dan data tugas yang diperbarui
 */
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Tidak diizinkan' }, { status: 401 })
    }

    const { id } = await params
    const taskId = parseInt(id)
    const body = await request.json()
    
    if (isNaN(taskId)) {
      return NextResponse.json(
        { error: 'ID tugas tidak valid' },
        { status: 400 }
      )
    }

    // Periksa apakah tugas milik pengguna
    const existingTasks = await query(
      'SELECT id FROM tasks WHERE id = ? AND user_id = ?',
      [taskId, session.user.id]
    ) as { id: number }[]

    if (existingTasks.length === 0) {
      return NextResponse.json(
        { error: 'Tugas tidak ditemukan' },
        { status: 404 }
      )
    }

    // Bangun query pembaruan secara dinamis
    const updates: string[] = []
    const values: (string | number | null)[] = []

    if (body.title !== undefined) {
      updates.push('title = ?')
      values.push(body.title.trim())
    }
    
    if (body.description !== undefined) {
      updates.push('description = ?')
      values.push(body.description?.trim())
    }
    
    if (body.status !== undefined) {
      updates.push('status = ?')
      values.push(body.status)
      
      // Atur completed_at jika ditandai selesai
      if (body.status === 'completed') {
        updates.push('completed_at = CURRENT_TIMESTAMP')
      } else if (body.status === 'pending' || body.status === 'in_progress') {
        updates.push('completed_at = NULL')
      }
    }
    
    if (body.priority !== undefined) {
      updates.push('priority = ?')
      values.push(body.priority)
    }
    
    if (body.due_date !== undefined) {
      updates.push('due_date = ?')
      values.push(body.due_date || null)
    }
    
    if (body.category_id !== undefined) {
      updates.push('category_id = ?')
      values.push(body.category_id ? parseInt(body.category_id) : null)
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'Tidak ada data yang diperbarui' },
        { status: 400 }
      )
    }

    updates.push('updated_at = CURRENT_TIMESTAMP')
    values.push(taskId, session.user.id)

    await query(
      `UPDATE tasks SET ${updates.join(', ')} 
       WHERE id = ? AND user_id = ?`,
      values
    )

    // Ambil tugas yang diperbarui
    const updatedTasks = await query(
      `SELECT t.*, c.name as category_name, c.color as category_color 
       FROM tasks t
       LEFT JOIN categories c ON t.category_id = c.id
       WHERE t.id = ?`,
      [taskId]
    ) as Task[]

    return NextResponse.json({
      message: 'Tugas berhasil diperbarui',
      task: updatedTasks[0]
    })
  } catch (error) {
    console.error('Gagal memperbarui tugas:', error)
    return NextResponse.json(
      { error: 'Kesalahan internal server' },
      { status: 500 }
    )
  }
}

/**
 * Menangani permintaan DELETE untuk menghapus tugas.
 * 
 * @param request Objek NextRequest
 * @param params Parameter rute berisi ID tugas
 * @returns Respon JSON berisi pesan sukses
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Tidak diizinkan' }, { status: 401 })
    }

    const { id } = await params
    const taskId = parseInt(id)

    if (isNaN(taskId)) {
      return NextResponse.json(
        { error: 'ID tugas tidak valid' },
        { status: 400 }
      )
    }

    // Periksa apakah tugas milik pengguna
    const existingTasks = await query(
      'SELECT id FROM tasks WHERE id = ? AND user_id = ?',
      [taskId, session.user.id]
    ) as { id: number }[]

    if (existingTasks.length === 0) {
      return NextResponse.json(
        { error: 'Tugas tidak ditemukan' },
        { status: 404 }
      )
    }

    await query(
      'DELETE FROM tasks WHERE id = ? AND user_id = ?',
      [taskId, session.user.id]
    )

    return NextResponse.json({
      message: 'Tugas berhasil dihapus'
    })
  } catch (error) {
    console.error('Gagal menghapus tugas:', error)
    return NextResponse.json(
      { error: 'Kesalahan internal server' },
      { status: 500 }
    )
  }
}