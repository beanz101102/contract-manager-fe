"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { atom, useAtom } from "jotai"
import { uniqBy } from "lodash"
import { Bell, Menu, User } from "lucide-react"

import useNotifications from "@/hooks/useNotifications"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Sheet, SheetContent } from "@/components/ui/sheet"

import NextImage from "../ui/next-img"
import SidebarMenu from "./Header"

const LayoutApp = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden lg:block h-screen fixed">
        <SidebarMenu />
      </div>

      <div className="lg:hidden">
        <Sheet open={isSidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="max-w-[280px]">
            <SidebarMenu />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex lg:pl-[280px] flex-col flex-1 overflow-hidden">
        <div
          className="h-[100px] w-full flex items-center justify-between px-5"
          style={{
            background: "linear-gradient(90deg, #36989D 0%, #3C5F60 100%)",
          }}
        >
          <div className="flex items-center justify-center cursor-pointer lg:hidden">
            <NextImage
              src="/img/logo.png"
              alt="logo"
              width={32}
              height={32}
              className="w-[160px]"
            />
            <Menu
              size={24}
              className="text-white lg:hidden ml-2"
              onClick={() => setSidebarOpen(true)}
            />
          </div>
          <p className="text-white text-3xl font-bold hidden lg:block">
            CÔNG TY CP PHÁT TRIỂN BĐS PHÁT ĐẠT
          </p>

          <ContentRight />
        </div>
        <div className="flex-1 p-6 text-black h-[calc(100vh-100px)] overflow-auto">
          {children}
        </div>
      </div>
    </div>
  )
}

export default LayoutApp

export const HeaderContent = () => {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div
        className="h-[100px] w-full flex items-center justify-between px-5"
        style={{
          background: "linear-gradient(90deg, #36989D 0%, #3C5F60 100%)",
        }}
      >
        <p className="text-white text-3xl font-bold">
          CÔNG TY CP PHÁT TRIỂN BĐS PHÁT ĐẠT
        </p>

        <ContentRight />
      </div>
    </div>
  )
}

const notificationsAtom = atom<Notification[]>([])
const ContentRight = () => {
  const router = useRouter()
  const { useGetNotifications } = useNotifications()
  const { user, logout } = useAuth()
  const { data } = useGetNotifications(user?.id ?? 0)
  const [notifications, setNotifications] = useAtom(notificationsAtom)
  const { useMarkAllAsRead } = useNotifications()
  const { mutate: markAllAsRead } = useMarkAllAsRead(() => {
    const newNotifications = notifications.map((notification) => ({
      ...notification,
      isRead: true,
    }))
    setNotifications(newNotifications)
  })

  useEffect(() => {
    setNotifications(uniqBy(data || [], "id"))
  }, [data])

  const unreadCount = notifications?.filter(
    (notification: any) => !notification.isRead
  ).length

  return (
    <div className="flex items-center gap-6">
      <Popover>
        <PopoverTrigger
          className="relative"
          onClick={() => markAllAsRead(user?.id ?? 0)}
        >
          <Bell
            size={24}
            className="text-white hover:text-gray-100 cursor-pointer transition-colors duration-200"
          />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0 bg-white shadow-lg border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">Thông báo</h3>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {notifications?.length > 0 ? (
              notifications.map((notification: any) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${
                    !notification.isRead ? "bg-blue-50" : ""
                  }`}
                >
                  <p
                    className={`text-sm ${
                      !notification.isRead
                        ? "font-medium text-gray-900"
                        : "text-gray-700"
                    }`}
                  >
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                Không có thông báo
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger>
          <div className="flex items-center gap-3 text-white bg-white/10 rounded-lg px-4 py-2 hover:bg-white/20 transition-colors duration-200 cursor-pointer">
            <div className="p-1 bg-white/20 rounded-full">
              <User size={20} className="text-white" />
            </div>
            <div>
              <p className="font-medium text-sm">{user?.fullName}</p>
              <p className="text-xs text-gray-200">{user?.role}</p>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2 bg-white shadow-lg border border-gray-200 rounded-lg">
          <div className="flex flex-col space-y-1">
            <button
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
              onClick={() => {
                router.push("/profile")
              }}
            >
              Thông tin cá nhân
            </button>
            <button
              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
              onClick={logout}
            >
              Đăng xuất
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
