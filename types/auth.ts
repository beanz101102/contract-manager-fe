export interface User {
  id: number
  code: string
  fullName: string
  gender: string
  dateOfBirth: string | null
  placeOfBirth: string | null
  address: string | null
  idNumber: string
  idIssueDate: string | null
  idIssuePlace: string | null
  phoneNumber: string | null
  email: string
  position: string | null
  role: string
  username: string
  passwordHash: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  refreshToken: string | null
  active: boolean
  department: {
    createdAt: string
    departmentName: string
    description: string
    id: number
    updatedAt: string
  }
}

export interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}
