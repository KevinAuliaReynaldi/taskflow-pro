import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcrypt'
import { query } from '@/lib/db'

/**
 * Menangani permintaan POST untuk registrasi pengguna baru.
 * 
 * @param request Objek NextRequest berisi body (email, username, password)
 * @returns Respon JSON berisi pesan sukses atau kesalahan
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, username, password } = body

    // Validasi
    if (!email || !username || !password) {
      return NextResponse.json(
        { error: 'Semua kolom wajib diisi' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Kata sandi minimal harus 6 karakter' },
        { status: 400 }
      )
    }

    // Periksa apakah pengguna sudah ada
    const existingUsers = await query(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    ) as { id: number }[]

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'Pengguna dengan email atau username ini sudah ada' },
        { status: 409 }
      )
    }

    // Hash kata sandi
    const hashedPassword = await hash(password, 10)

    // Buat pengguna
    const result = await query(
      'INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?)',
      [email, username, hashedPassword]
    ) as { insertId: number }

    return NextResponse.json(
      { 
        message: 'Pengguna berhasil didaftarkan',
        userId: result.insertId 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Kesalahan pendaftaran:', error)
    return NextResponse.json(
      { error: 'Kesalahan internal server' },
      { status: 500 }
    )
  }
}