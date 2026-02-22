import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { query } from '@/lib/db'

/**
 * Menangani permintaan GET untuk mengambil semua tugas milik pengguna yang sedang login.
 * Mendukung filter berdasarkan status, prioritas, kategori, dan pencarian teks.
 * 
 * @param request Objek NextRequest berisi parameter query (status, priority, categoryId, search)
 * @returns Respon JSON berisi daftar tugas
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Tidak diizinkan' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const categoryId = searchParams.get('categoryId')
    const search = searchParams.get('search')

    let sql = `
      SELECT t.*, c.name as category_name, c.color as category_color 
      FROM tasks t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = ?
    `
    const params: (string | number)[] = [session.user.id]

    if (status && status !== 'all') {
      sql += ' AND t.status = ?'
      params.push(status)
    }
    
    if (priority && priority !== 'all') {
      sql += ' AND t.priority = ?'
      params.push(priority)
    }
    
    if (categoryId && categoryId !== 'all') {
      sql += ' AND t.category_id = ?'
      params.push(parseInt(categoryId))
    }
    
    if (search) {
      sql += ' AND (t.title LIKE ? OR t.description LIKE ?)'
      params.push(`%${search}%`, `%${search}%`)
    }

    sql += ` ORDER BY
      CASE WHEN t.due_date IS NULL THEN 1 ELSE 0 END,
      t.due_date ASC,
      CASE t.priority
        WHEN "high" THEN 1
        WHEN "medium" THEN 2
        WHEN "low" THEN 3
      END,
      t.created_at DESC`

    const tasks = await query(sql, params)
    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Gagal mengambil tugas:', error)
    return NextResponse.json(
      { error: 'Kesalahan internal server' },
      { status: 500 }
    )
  }
}

/**
 * Menangani permintaan POST untuk membuat tugas baru.
 * 
 * @param request Objek NextRequest berisi body (title, description, priority, due_date, category_id)
 * @returns Respon JSON berisi pesan sukses dan detail tugas yang baru dibuat
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Tidak diizinkan' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, priority, due_date, category_id } = body

    if (!title || title.trim() === '') {
      return NextResponse.json(
        { error: 'Judul wajib diisi' },
        { status: 400 }
      )
    }

    const result = await query(
      `INSERT INTO tasks
       (title, description, status, priority, due_date, category_id, user_id)
       VALUES (?, ?, 'pending', ?, ?, ?, ?)`,
      [
        title.trim(),
        description?.trim(),
        priority || 'medium',
        due_date || null,
        category_id ? parseInt(category_id) : null,
        session.user.id
      ]
    ) as { insertId: number }

    // Ambil tugas yang baru dibuat
    const tasks = await query(
      `SELECT t.*, c.name as category_name, c.color as category_color
       FROM tasks t
       LEFT JOIN categories c ON t.category_id = c.id
       WHERE t.id = ?`,
      [result.insertId]
    ) as any[]

    return NextResponse.json(
      {
        message: 'Tugas berhasil dibuat',
        task: tasks[0]
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Gagal membuat tugas:', error)
    return NextResponse.json(
      { error: 'Kesalahan internal server' },
      { status: 500 }
    )
  }
}