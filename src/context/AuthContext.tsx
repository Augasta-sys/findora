import { useState, type ReactNode } from 'react'
import { AuthContext } from './auth-context'
import type { AppUser } from '../services/authService'
import * as authService from '../services/authService'

interface AuthProviderProps {
  children: ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AppUser | null>(null)

  async function signIn(email: string, password: string) {
    const signedInUser = await authService.login(email, password)
    setUser(signedInUser)
  }

  async function signUp(name: string, email: string, password: string) {
    const newUser = await authService.register({ name, email, password })
    setUser(newUser)
  }

  function signOut() {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}