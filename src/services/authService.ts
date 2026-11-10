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
  const response = await api.get<AppUser[]>('/users', {
    params: { email: email.toLowerCase().trim() },
  })

  const user = response.data.find(
    (item) => item.password === password,
  )

  if (!user) {
    throw new Error('Invalid email or password')
  }

  return user
}

export async function register(input: RegisterInput) {
  const email = input.email.toLowerCase().trim()

  const existing = await api.get<AppUser[]>('/users', {
    params: { email },
  })

  if (existing.data.length > 0) {
    throw new Error('An account with this email already exists')
  }

  const response = await api.post<AppUser>('/users', {
    ...input,
    email,
    role: 'user',
  })

  return response.data
}