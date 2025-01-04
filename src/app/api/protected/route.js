import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
    // Get the cookie from the request headers
    const cookieHeader = request.headers.get('cookie');
    const accessTokenCookie = cookieHeader?.split('; ').find((c) => c.startsWith('access token for socket chat app='));
    const token = accessTokenCookie?.split('=')[1];

    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return new Response(JSON.stringify({ message: 'You are logged in', user: decoded }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error verifying JWT:', err);
    return new Response(JSON.stringify({ error: 'Invalid or expired token' }), {
      status: 403,
    });
  }
}
