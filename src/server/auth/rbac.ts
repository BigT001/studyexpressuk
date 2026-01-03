import { UserRole } from '../db/models/user.model';

export function isRoleAllowed(userRole: string | undefined, allowedRoles: UserRole[] | string[]) {
  if (!userRole) return false;
  return allowedRoles.includes(userRole as any);
}

export function requireRoleHeader(req: Request, allowedRoles: UserRole[] | string[]) {
  const role = req.headers.get('x-user-role') || undefined;
  if (!isRoleAllowed(role, allowedRoles)) {
    const err = new Error('Forbidden');
    // attach status for controllers/middleware
    (err as any).status = 403;
    throw err;
  }
  return role;
}
