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
    <div className="flex items-center gap-4">
      <Popover>
        <PopoverTrigger className="relative p-2 hover:bg-white/10 rounded-full transition-all">
          <Bell size={22} className="text-white" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </PopoverTrigger>
        <PopoverContent className="w-[380px] p-0 bg-white shadow-xl border-none rounded-xl">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Thông báo</h3>
            {notifications?.length > 0 && (
              <button
                onClick={() => markAllAsRead(user?.id ?? 0)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Đánh dấu đã đọc tất cả
              </button>
            )}
          </div>
          <div className="max-h-[460px] overflow-y-auto">
            {notifications?.length > 0 ? (
              notifications.map((notification: any) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    !notification.isRead ? "bg-blue-50/60" : ""
                  }`}
                >
                  <p
                    className={`text-sm leading-relaxed ${
                      !notification.isRead
                        ? "font-medium text-gray-900"
                        : "text-gray-600"
                    }`}
                  >
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1.5">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-gray-500">
                <p>Không có thông báo</p>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger>
          <div className="flex items-center gap-3 text-white bg-white/10 rounded-xl px-3 py-2 hover:bg-white/20 transition-all">
            <div className="p-1.5 bg-white/15 rounded-full">
              <User size={18} className="text-white" />
            </div>
            <div className="pr-1">
              <p className="font-medium text-sm leading-tight">
                {user?.fullName}
              </p>
              <p className="text-[11px] text-gray-200/90">{user?.role}</p>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-60 p-2 bg-white shadow-xl border-none rounded-xl">
          <div className="flex flex-col space-y-1">
            <button
              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => router.push("/profile")}
            >
              Thông tin cá nhân
            </button>
            <button
              className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
