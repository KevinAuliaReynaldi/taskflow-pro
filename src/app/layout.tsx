import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import AuthProvider from '@/components/providers/AuthProvider'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TaskFlow Pro - Manajemen Tugas Modern',
  description: 'Aplikasi manajemen tugas yang indah dan efisien untuk produktivitas Anda',
}

/**
 * Layout akar (Root Layout) untuk seluruh aplikasi.
 * Menyediakan ThemeProvider, AuthProvider, serta komponen Header dan Footer.
 * 
 * @param props Properti children
 * @returns Elemen JSX Layout Akar
 */
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-200`}>
        <ThemeProvider>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <Header session={session} />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}