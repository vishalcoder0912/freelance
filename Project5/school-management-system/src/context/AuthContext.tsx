/*
 * AuthContext.tsx - Authentication context provider for the school system.
 * Manages user state, login, and logout using mock data. Provides the
 * useAuth hook for consuming components.
 */
import { createContext, useContext, useState, type ReactNode } from 'react'

/** Allowed user roles in the system */
type UserRole = 'student' | 'parent' | 'teacher' | 'admin'

/** Shape of the authenticated user object */
interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  classLevel?: string
}

/** Exposed auth context value */
interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * AuthProvider - Wraps children with authentication state.
 * Provides login (mock-based), logout, and current user info.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  /**
   * Simulates a login by matching email against mock users.
   * Falls back to a guest student account if email is not found.
   */
  const login = async (email: string, _password: string) => {
    const mockUsers: Record<string, User> = {
      'admin@school.com': { id: '1', name: 'Admin', email, role: 'admin' },
      'teacher@school.com': { id: '2', name: 'Ms. Sarah', email, role: 'teacher' },
      'parent@school.com': { id: '3', name: 'John Parent', email, role: 'parent' },
      'student@school.com': { id: '4', name: 'Little Emma', email, role: 'student', classLevel: 'kindergarten' },
    }
    // Use matched user or create a default guest
    const foundUser = mockUsers[email] || { id: '5', name: 'Guest User', email, role: 'student' as UserRole, classLevel: 'kindergarten' }
    setUser(foundUser)
  }

  /** Clears the current user to log out */
  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * useAuth - Hook to access auth context.
 * Throws if used outside of AuthProvider.
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
