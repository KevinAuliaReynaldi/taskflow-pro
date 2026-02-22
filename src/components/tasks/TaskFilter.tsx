'use client'

import { Search, Filter } from 'lucide-react'
import Input from '@/components/ui/Input'
import { Category } from '@/types'

/**
 * Properti untuk komponen TaskFilter.
 * 
 * @property filters Keadaan filter saat ini (status, prioritas, kategori, pencarian)
 * @property onFilterChange Callback fungsi saat filter berubah
 * @property categories Daftar kategori untuk pilihan filter
 */
interface TaskFilterProps {
  filters: {
    status: string
    priority: string
    categoryId: string
    search: string
  }
  onFilterChange: (filters: TaskFilterProps['filters']) => void
  categories: Category[]
}

/**
 * Komponen untuk menyaring daftar tugas berdasarkan status, prioritas, kategori, dan pencarian teks.
 */
export default function TaskFilter({ filters, onFilterChange, categories }: TaskFilterProps) {
  const handleChange = (key: string, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value
    })
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <Input
          type="text"
          placeholder="Cari tugas..."
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors focus:outline-none"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Tertunda</option>
            <option value="in_progress">Dalam Proses</option>
            <option value="completed">Selesai</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Prioritas
          </label>
          <select
            value={filters.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors focus:outline-none"
          >
            <option value="all">Semua Prioritas</option>
            <option value="low">Rendah</option>
            <option value="medium">Sedang</option>
            <option value="high">Tinggi</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Kategori
          </label>
          <select
            value={filters.categoryId}
            onChange={(e) => handleChange('categoryId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors focus:outline-none"
          >
            <option value="all">Semua Kategori</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}