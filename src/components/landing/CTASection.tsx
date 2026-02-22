'use client'

import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Star } from 'lucide-react'
import Link from 'next/link'
import Button from '@/components/ui/Button'

/**
 * Komponen CTA (Call to Action) Section.
 * Menampilkan ajakan terakhir bagi pengguna untuk bergabung dengan TaskFlow Pro.
 * 
 * @returns Elemen JSX CTASection
 */
export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-6">
            <Star size={16} className="mr-2" />
            Bergabunglah dengan ribuan pengguna produktif
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Siap untuk Meningkatkan Produktivitas Anda?
          </h2>

          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10">
            Mulailah mengatur tugas Anda hari ini. Tanpa kartu kredit. Tersedia paket selamanya gratis.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/register">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 group"
              >
                Mulai Gratis
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/login">
              <Button 
                variant="secondary" 
                size="lg"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10"
              >
                Masuk
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              'Tanpa kartu kredit',
              'Paket selamanya gratis',
              'Dukungan pelanggan 24/7'
            ].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-center text-white"
              >
                <CheckCircle size={20} className="mr-2" />
                <span>{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}