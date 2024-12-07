"use client"

import React, { useState } from "react"
import { useAuth } from "@/contexts/auth-context"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import NextImage from "@/components/ui/next-img"

const LoginPage = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(username, password)
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 relative">
      {/* Left side */}
      <div className="w-full md:w-[45%] p-6 md:p-12 flex flex-col justify-between items-center">
        <div className="flex-grow" />
        <NextImage
          src="/img/logo.png"
          alt="PHATDAT CORPORATION logo"
          className="w-[200px] md:w-[400px] transition-transform hover:scale-105"
        />
        <div className="flex-grow" />
        <NextImage
          src="/img/banner_login.png"
          alt="Login illustration"
          className="w-[300px] md:w-[600px] transition-transform hover:scale-105 hidden md:block"
        />
      </div>

      {/* Right side */}
      <div className="w-full md:w-[55%] bg-white p-6 md:p-12 flex items-center justify-center md:rounded-l-[50px] shadow-2xl">
        <div className="max-w-[500px] w-full">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#359499] mb-8 md:mb-12 relative">
            Đăng nhập
            <span className="absolute bottom-0 left-0 w-16 md:w-20 h-1 bg-[#4BC5BE] rounded-full"></span>
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-lg md:text-xl text-gray-700 font-bold"
              >
                Tên đăng nhập
              </Label>
              <Input
                id="username"
                className="bg-gray-50 p-4 md:p-6 border border-gray-200 h-[50px] md:h-[70px] rounded-2xl mt-2 focus:ring-2 focus:ring-[#4BC5BE] focus:border-transparent transition-all"
                type="text"
                placeholder="Nhập tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-lg md:text-xl text-gray-700 font-bold"
              >
                Mật khẩu
              </Label>
              <Input
                id="password"
                className="bg-gray-50 p-4 md:p-6 border border-gray-200 h-[50px] md:h-[70px] rounded-2xl mt-2 focus:ring-2 focus:ring-[#4BC5BE] focus:border-transparent transition-all"
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-[#4B9FA4] hover:text-[#359499] font-bold transition-colors"
              >
                Quên mật khẩu?
              </button>
            </div> */}

            <div className="flex justify-center pt-2 md:pt-4">
              <Button
                type="submit"
                className="max-w-[300px] w-full bg-[#4BC5BE] rounded-xl text-white hover:bg-[#359499] h-[50px] md:h-[60px] text-base md:text-lg font-bold transition-all duration-300 hover:shadow-lg"
              >
                Đăng nhập
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
