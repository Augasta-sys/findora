
import api from './api'

export type UserRole = 'admin' | 'staff' | 'user'

export interface AppUser {
  id: string
  name: string
  email: string
  password: string
  role: UserRole
}

export interface RegisterInput {
  name: string
  email: string
  password: string
}

export async function login(email: string, password: string) {
  const normalizedEmail = email.toLowerCase().trim()

  const response = await api.get<AppUser[]>('/users')

  const user = response.data.find(
    (item) =>
      item.email.toLowerCase().trim() === normalizedEmail &&
      item.password === password,
  )

  if (!user) {
    throw new Error('Invalid email or password')
  }

  return user
}

export async function register(input: RegisterInput) {
  const email = input.email.toLowerCase().trim()

  const response = await api.get<AppUser[]>('/users')

  const existing = response.data.find(
    (item) => item.email.toLowerCase().trim() === email,
  )

  if (existing) {
    throw new Error('An account with this email already exists')
  }

  const newUser = {
    ...input,
    email,
    role: 'user' as UserRole,
  }

  const createResponse = await api.post<AppUser>(
    '/users',
    newUser,
  )

  return createResponse.data
}
