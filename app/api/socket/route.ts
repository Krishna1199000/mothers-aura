// Socket.IO is handled at the server level in server.js
// This route is a placeholder for Socket.IO path configuration
export const dynamic = 'force-dynamic';

// Export a proper handler to satisfy TypeScript
export async function GET() {
  return new Response('Socket.IO endpoint', { status: 200 });
}

export async function POST() {
  return new Response('Socket.IO endpoint', { status: 200 });
}
