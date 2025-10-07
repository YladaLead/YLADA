import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // Middleware completamente desabilitado
  return NextResponse.next()
}

export const config = {
  matcher: []
}