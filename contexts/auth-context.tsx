"use client"

import { createContext, use, useContext, useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

import { AuthContextType, User } from "@/types/auth"
import { api } from "@/lib/axios"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user) {
      setUser(JSON.parse(user))
      if (pathname === "/login") {
        router.push("/dashboard")
      }
    } else {
      router.push("/login")
    }
  }, [])

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await api.post<{
        message: string
        user: User
      }>("/api/auth/login", {
        email: username,
        passwordHash: password,
      })

      localStorage.setItem("user", JSON.stringify(response.data?.user))
      setUser(response.data?.user)
      router.push("/dashboard")
    } catch (error) {
      console.error("Login error:", error)
      // throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
