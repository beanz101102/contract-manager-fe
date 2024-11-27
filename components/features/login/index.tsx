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
    <div className="flex h-screen bg-blue-100 relative">
      {/* Left side */}
      <div className="w-[40%] p-8 flex flex-col justify-between items-center">
        <div className="flex-grow"></div>
        <NextImage
          src="/img/logo.png"
          alt="PHATDAT CORPORATION logo"
          className="w-[500px]"
        />
        <div className="flex-grow"></div>
        <NextImage
          src="/img/banner_login.png"
          alt="Login illustration"
          className="w-[500px]"
        />
      </div>

      {/* Right side */}
      <div className="w-[60%] bg-white p-8 flex items-center justify-center">
        <div className="max-w-[50vh] w-full">
          <p
            style={{
              textShadow: "0px 4px 4px 0px #00000040",
            }}
            className="text-4xl font-extrabold text-[#359499] mb-8"
          >
            Đăng nhập
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <Label
                htmlFor="username"
                className="text-xl text-black font-extrabold"
              >
                Tên đăng nhập
              </Label>
              <Input
                id="username"
                className="bg-[#F5F5F5] p-4 border-none h-[85px] rounded-[25px] mt-2"
                type="text"
                placeholder="Nhập tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <Label
                htmlFor="username"
                className="text-xl text-black font-extrabold"
              >
                Mật khẩu
              </Label>
              <Input
                id="password"
                className="bg-[#F5F5F5] p-4 border-none h-[85px] rounded-[25px] mt-2"
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-6 flex justify-end">
              <p className="text-sm text-[#4B9FA4] hover:underline font-bold">
                Quên mật khẩu?
              </p>
            </div>
            <div className="flex justify-center">
              <Button
                // type="submit"
                className="max-w-[256px] w-full bg-[#4BC5BE] rounded text-white hover:bg-[#2ea39d]"
                onClick={handleSubmit}
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
