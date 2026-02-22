import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuthPage = req.nextUrl.pathname.startsWith('/login') || 
                      req.nextUrl.pathname.startsWith('/register')
    
    if (isAuthPage && token) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isDashboard = req.nextUrl.pathname.startsWith('/dashboard')
        const isAuthPage = req.nextUrl.pathname.startsWith('/login') || 
                          req.nextUrl.pathname.startsWith('/register')
        
        if (isDashboard && !token) {
          return false
        }
        
        return true
      }
    }
  }
)

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register']
}