"use client"

import { createContext, use, useContext, useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { toast } from "react-hot-toast"

import { AuthContextType, User } from "@/types/auth"
import { api } from "@/lib/axios"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (pathname.includes("/client-signature")) return
    const user = localStorage.getItem("user")
    if (user) {
      setUser(JSON.parse(user))
      if (pathname === "/login") {
        router.push("/")
      }
      setTimeout(() => {
        setIsLoading(false)
      }, 500)
    } else {
      router.push("/login")
      setTimeout(() => {
        setIsLoading(false)
      }, 500)
    }
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const response = await api.post<{
        message: string
        user: User
      }>("/api/auth/login", {
        username: username,
        passwordHash: password,
      })

      localStorage.setItem("user", JSON.stringify(response.data?.user))
      setUser(response.data?.user)
      router.push("/")
    } catch (error: any) {
      console.error("Login error:", error)
      toast.error(
        error.response.data.message ??
          "Vui lòng kiểm tra lại tài khoản và mật khẩu"
      )
      // throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
    router.push("/login")
  }

  if (isLoading && !pathname.includes("/client-signature")) {
    return (
      <div className="flex gap-2 justify-center items-center h-screen">
        <div
          style={{
            background: "#2563eb",
          }}
          className="w-5 h-5 rounded-full animate-pulse"
        ></div>
        <div
          style={{
            background: "#2563eb",
          }}
          className="w-5 h-5 rounded-full animate-pulse"
        ></div>
        <div
          style={{
            background: "#2563eb",
          }}
          className="w-5 h-5 rounded-full animate-pulse"
        ></div>
      </div>
    )
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
