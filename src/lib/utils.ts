import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Menggabungkan nama kelas CSS menggunakan clsx dan tailwind-merge.
 * Berguna untuk menangani konflik kelas Tailwind secara dinamis.
 * 
 * @param inputs Daftar nama kelas atau nilai kondisional
 * @returns String nama kelas yang sudah digabungkan
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Mengformat string tanggal atau objek Date menjadi format yang mudah dibaca.
 * Menggunakan locale id-ID (Bahasa Indonesia).
 * 
 * @param dateString Tanggal dalam bentuk string atau objek Date
 * @returns String tanggal terformat (contoh: 22 Feb 2026)
 */
export function formatDate(dateString: string | Date): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Memberikan kelas warna latar belakang dan teks berdasarkan tingkat prioritas.
 * 
 * @param priority Tingkat prioritas (high, medium, low)
 * @returns String kelas CSS Tailwind untuk warna
 */
export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
    case 'low':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
  }
}

/**
 * Memberikan kelas warna latar belakang dan teks berdasarkan status tugas.
 * 
 * @param status Status tugas (completed, in_progress, pending)
 * @returns String kelas CSS Tailwind untuk warna
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    case 'in_progress':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
    case 'pending':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
  }
}

/**
 * Memeriksa apakah tanggal jatuh tempo sudah lewat dari hari ini.
 * 
 * @param dueDate Tanggal jatuh tempo dalam bentuk string
 * @returns True jika sudah lewat, false jika belum
 */
export function isOverdue(dueDate: string): boolean {
  const due = new Date(dueDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return due < today
}