# Middleware & Session Strategy

## Overview

STUDY EXPRESS UK uses a two-layer RBAC approach:

1. **Edge Middleware** (`app/middleware.ts`): Quick, header-based checks at the Edge Runtime. Provides fast fallback protection.
2. **Server-Side Session Checks** (API routes): Authoritative checks using NextAuth JWT session to verify role and user context.

## Why Two Layers?

- **Edge middleware**: Runs on the Edge Runtime, which cannot execute async operations (like session verification) reliably. It's best for simple header checks or rejecting obvious unauthorized requests early.
- **Server-side checks**: Handle full session verification, database lookups, and permission logic within the API route handler.

### Session-Based RBAC (Authoritative)

NextAuth (v5) provides JWT-based sessions:
- User authenticates via `/api/auth/signin` (Credentials provider).
- Session token includes `user.role` (INDIVIDUAL, CORPORATE, SUB_ADMIN, ADMIN).
- All API routes call `getServerAuthSession()` to obtain and validate the session.
- Routes check `session.user.role` before executing business logic.

### Configuration

- **MongoDB Adapter** (`@auth/mongodb-adapter`): Persists session and account data in MongoDB.
- **Credentials Provider**: Authenticates against `User` model using bcrypt-hashed passwords.
- **JWT Strategy**: Sessions are JWT tokens; no server-side session store needed (stateless).

## Limitations & Future Work

- Edge middleware cannot perform async session checks. Middleware remains simple and relies on server-side enforcement.
- For even tighter security, consider adding middleware that:
  - Rejects requests without a valid Authorization Bearer token before passing to handlers.
  - Uses a custom JWT verification library that works in Edge Runtime.
- NextAuth provides utilities for this; see `next-auth/jwt` and middleware examples in the Next-Auth docs.

## Usage Example

```typescript
// In API route
import { getServerAuthSession } from '@/src/server/auth/session';

export async function POST(req: Request) {
  const session: any = await getServerAuthSession(req);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  // Process request with admin privileges
}
```

## Testing

- Unit tests mock `getServerAuthSession` to simulate different roles.
- Integration tests use MongoDB in-memory server.
- E2E tests can start the dev server and test full flows (signup → login → protected routes).

---

For production, ensure `NEXTAUTH_SECRET` and `NEXTAUTH_URL` are set in environment variables.
