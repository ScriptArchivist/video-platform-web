import { NextResponse } from 'next/server';

export async function GET() {
  const body = `
# HELP frontend_up Frontend availability
# TYPE frontend_up gauge
frontend_up 1
`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; version=0.0.4',
    },
  });
}