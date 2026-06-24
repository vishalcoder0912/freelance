import { createContext, useContext, useState, type ReactNode } from 'react'

type UserRole = 'student' | 'parent' | 'teacher' | 'admin'

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  classLevel?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = async (email: string, _password: string) => {
    const mockUsers: Record<string, User> = {
      'admin@school.com': { id: '1', name: 'Admin', email, role: 'admin' },
      'teacher@school.com': { id: '2', name: 'Ms. Sarah', email, role: 'teacher' },
      'parent@school.com': { id: '3', name: 'John Parent', email, role: 'parent' },
      'student@school.com': { id: '4', name: 'Little Emma', email, role: 'student', classLevel: 'kindergarten' },
    }
    const foundUser = mockUsers[email] || { id: '5', name: 'Guest User', email, role: 'student' as UserRole, classLevel: 'kindergarten' }
    setUser(foundUser)
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
