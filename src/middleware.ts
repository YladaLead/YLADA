import { NextRequest, NextResponse } from 'next/server'

export async function middleware() {
  // Middleware completamente desabilitado
  return NextResponse.next()
}

export const config = {
  matcher: []
}