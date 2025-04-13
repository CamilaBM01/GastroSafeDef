import { validateSessionToken } from '@/lib/session';

interface Cookies {
    get: (name: string) => { value?: string } | undefined;
  }
  
  export async function GET({ cookies }: { cookies: Cookies }) {
    const token = cookies.get('session')?.value;

  if (!token) {
    return new Response(JSON.stringify({ user: null }), { status: 200 });
  }

  const { user } = await validateSessionToken(token);

  return new Response(JSON.stringify({ user }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
