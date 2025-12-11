import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Verificar si la ruta empieza con /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Obtener la cookie admin_access_token
    const token = request.cookies.get('admin_access_token');

    // Si no hay token, redirigir a login
    if (!token) {
      const loginUrl = new URL('/auth/login', request.url);
      // Opcional: guardar la url de retorno
      loginUrl.searchParams.set('from', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths starting with:
     * - admin
     */
    '/admin/:path*',
  ],
};
