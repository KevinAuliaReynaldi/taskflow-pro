import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { query } from '@/lib/db'

/**
 * Menangani permintaan GET untuk mengambil semua kategori milik pengguna.
 * 
 * @param request Objek NextRequest
 * @returns Respon JSON berisi daftar kategori
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Tidak diizinkan' }, { status: 401 })
    }

    const categories = await query(
      'SELECT * FROM categories WHERE user_id = ? ORDER BY name ASC',
      [session.user.id]
    )

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Gagal mengambil kategori:', error)
    return NextResponse.json(
      { error: 'Kesalahan internal server' },
      { status: 500 }
    )
  }
}

/**
 * Menangani permintaan POST untuk membuat kategori baru.
 * 
 * @param request Objek NextRequest berisi body (name, color)
 * @returns Respon JSON berisi pesan sukses dan kategori yang baru dibuat
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Tidak diizinkan' }, { status: 401 })
    }

    const body = await request.json()
    const { name, color } = body

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Nama kategori wajib diisi' },
        { status: 400 }
      )
    }

    const result = await query(
      'INSERT INTO categories (name, color, user_id) VALUES (?, ?, ?)',
      [name.trim(), color || '#6B7280', session.user.id]
    ) as { insertId: number }

    const categories = await query(
      'SELECT * FROM categories WHERE id = ?',
      [result.insertId]
    ) as any[]

    return NextResponse.json(
      { 
        message: 'Kategori berhasil dibuat',
        category: categories[0]
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Gagal membuat kategori:', error)
    return NextResponse.json(
      { error: 'Kesalahan internal server' },
      { status: 500 }
    )
  }
}