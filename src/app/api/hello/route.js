import { NextResponse } from 'next/server';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export function OPTIONS() {
  // handle preflight
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export function GET(request) {
  const body = {
    message: 'Hello from Next.js app-router API!',
    time: new Date().toISOString(),
    url: request.url,
  };
  return NextResponse.json(body, { headers: CORS_HEADERS });
}