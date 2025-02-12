import { NextResponse } from 'next/server';

export function middleware(req) {
  const authHeader = req.headers.get('authorization');
  const validAuth = 'Basic ' + Buffer.from('cobra:honesta').toString('base64');

  if (!authHeader || authHeader !== validAuth) {
    return new Response('Unauthorized', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' },
    });
  }

  return NextResponse.next();
}