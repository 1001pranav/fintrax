import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'


export function middleware(request: NextRequest) {
    console.log('Middleware triggered for request:', request.nextUrl.pathname)
    return NextResponse.next()
}


export const config = {
    matcher: [ 'forgot-password', 'login', 'register', 'reset-password',
    /*
        * Match all routes except:
        * - /login
        * - /register
        * - /forgot-password
        * - /reset-password
        * - /_next/static (static files)
        * - /_next/image (image optimization)
        * - /favicon.ico (favicon)
    */
        
    // '/((?!login|register|forgot-password|reset-password|_next/static|_next/image|favicon.ico).*)',
    ]
}