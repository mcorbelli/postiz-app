import { NextResponse } from 'next/server';
import { getCookieUrlFromDomain } from '@gitroom/helpers/subdomain/subdomain.management';

// Clears the two invite cookies proxy.ts sets (org, invited) so a declined
// or dead invite doesn't keep showing the banner or joining the org on the
// next register/login submit. Each cookie's attributes below mirror the
// exact conditional shape proxy.ts used to create it - they're not the
// same shape as each other, and a mismatch (or using `.delete()`/`maxAge:
// 0`, both of which are silently no-ops in Next's cookie implementation)
// would leave the real cookie alive while looking cleared in the response.
export async function POST() {
  const response = NextResponse.json({ ok: true });
  const secured = !process.env.NOT_SECURED;

  response.cookies.set('org', '', {
    path: '/',
    ...(secured
      ? {
          secure: true,
          httpOnly: true,
          sameSite: 'none' as const,
          domain: getCookieUrlFromDomain(process.env.FRONTEND_URL!),
        }
      : {}),
    expires: new Date(0),
  });

  response.cookies.set('invited', '', {
    path: '/',
    secure: secured,
    sameSite: false,
    ...(secured
      ? { domain: getCookieUrlFromDomain(process.env.FRONTEND_URL!) }
      : {}),
    expires: new Date(0),
  });

  return response;
}
