import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getCurrentUser, getRoleRedirect, canAccess, type UserRole } from '@/lib/auth';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRole: UserRole;
}

export default function RoleGuard({ children, allowedRole }: RoleGuardProps) {
  const [checking, setChecking] = useState(true);
  const [access, setAccess] = useState<{ allowed: boolean; redirect: string | null }>({ allowed: false, redirect: null });
  const location = useLocation();

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      setAccess({ allowed: false, redirect: '/login' });
    } else if (canAccess(user.role, allowedRole)) {
      setAccess({ allowed: true, redirect: null });
    } else {
      setAccess({ allowed: false, redirect: getRoleRedirect(user.role) });
    }
    setChecking(false);
  }, [location.pathname, allowedRole]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFC]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-violet-100 border-t-[#6D28D9] rounded-full animate-spin" />
          <p className="text-xs font-medium text-slate-400">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!access.allowed) {
    return <Navigate to={access.redirect || '/login'} replace />;
  }

  return <>{children}</>;
}
