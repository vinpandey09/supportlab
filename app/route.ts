import html from '@/lib/workspace-shell';
export const dynamic = 'force-dynamic';
export async function GET() {
  return new Response(html, { headers: {'Content-Type':'text/html; charset=utf-8','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'} });
}
