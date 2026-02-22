'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

/**
 * Halaman Login.
 * Memungkinkan pengguna yang sudah terdaftar untuk masuk ke aplikasi menggunakan email dan kata sandi.
 * 
 * @returns Elemen JSX Halaman Login
 */
export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false
      })

      if (result?.error) {
        setError('Email atau kata sandi salah')
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error) {
      setError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Selamat Datang Kembali
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Masuk ke akun Anda
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Alamat Email
          </label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Kata Sandi
            </label>
            <Link 
              href="#" 
              className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              Lupa kata sandi?
            </Link>
          </div>
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Masuk...' : 'Masuk'}
        </Button>
      </form>

      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        Belum punya akun?{' '}
        <Link 
          href="/register" 
          className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
        >
          Daftar
        </Link>
      </div>
    </div>
  )
}