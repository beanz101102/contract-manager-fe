export interface User {
  id: string
  username: string
  email?: string
  token?: string
}

export interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}
