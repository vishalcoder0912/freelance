export type UserRole = 'student' | 'mentor' | 'recruiter' | 'admin';

export interface AuthUser {
  name: string;
  email: string;
  role: UserRole;
  photoURL: string | null;
}

const USER_KEY = 'careerveda_user';

export function login(email: string, password: string, role?: UserRole): AuthUser {
  const e = email.toLowerCase();
  const detectedRole: UserRole = role || (
    e.includes('admin') ? 'admin' :
    e.includes('mentor') ? 'mentor' :
    e.includes('recruiter') ? 'recruiter' :
    'student'
  );
  const name = e.split('@')[0];
  const user: AuthUser = { name, email: e, role: detectedRole, photoURL: null };
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}

export function register(name: string, email: string, password: string, role: UserRole): AuthUser {
  const user: AuthUser = { name, email: email.toLowerCase(), role, photoURL: null };
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}

export function logout(): void {
  localStorage.removeItem(USER_KEY);
}

export function getCurrentUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getUserRole(): UserRole | null {
  return getCurrentUser()?.role ?? null;
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

export function getRoleRedirect(role: UserRole): string {
  const routes: Record<UserRole, string> = {
    student: '/dashboard',
    mentor: '/mentor',
    recruiter: '/recruiter',
    admin: '/admin',
  };
  return routes[role];
}

export function canAccess(role: UserRole, requiredRole: UserRole): boolean {
  if (role === 'admin') return true;
  return role === requiredRole;
}

export function isValidEmailForRole(email: string, role: UserRole): boolean {
  const e = email.toLowerCase();
  if (role === 'admin') return e.includes('admin');
  if (role === 'mentor') return e.includes('mentor');
  if (role === 'recruiter') return e.includes('recruiter');
  return true;
}
