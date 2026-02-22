import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcrypt'
import { query } from './db'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      /**
       * Fungsi otorisasi untuk memvalidasi kredensial pengguna.
       * 
       * @param credentials Kredensial email dan password
       * @returns Objek user jika valid, atau melempar error jika tidak
       */
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Kredensial tidak valid')
        }

        const users = await query(
          'SELECT * FROM users WHERE email = ?',
          [credentials.email]
        ) as any[]

        if (users.length === 0) {
          throw new Error('Pengguna tidak ditemukan')
        }

        const user = users[0]
        const isValidPassword = await compare(credentials.password, user.password_hash)

        if (!isValidPassword) {
          throw new Error('Kata sandi salah')
        }

        return {
          id: user.id,
          email: user.email,
          username: user.username
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as number
        token.username = user.username
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as number
        session.user.username = token.username as string
      }
      return session
    }
  }
}