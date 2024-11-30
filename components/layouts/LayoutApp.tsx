"use client"

import React, { useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { atom, useAtom } from "jotai"
import { uniqBy } from "lodash"
import { Bell, User } from "lucide-react"

import useNotifications from "@/hooks/useNotifications"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import SidebarMenu from "./Header"

const LayoutApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full">
      <div className="h-screen">
        <SidebarMenu />
      </div>
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
        <div className="flex-1 overflow-auto p-6 text-black">{children}</div>
      </div>
    </div>
  )
}

export default LayoutApp

const notificationsAtom = atom<Notification[]>([])
const ContentRight = () => {
  const { useGetNotifications } = useNotifications()
  const { user } = useAuth()
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
            className="text-gray-600 hover:text-gray-800 cursor-pointer transition-colors duration-200"
          />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0 bg-white shadow-lg border border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-medium text-gray-700">Thông báo</h3>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {notifications?.length > 0 ? (
              notifications.map((notification: any) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                    !notification.isRead ? "bg-blue-50" : ""
                  }`}
                >
                  <p
                    className={`text-sm ${
                      !notification.isRead
                        ? "font-medium text-gray-800"
                        : "text-gray-700"
                    }`}
                  >
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-400">
                Không có thông báo
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
      <div className="flex items-center gap-3 text-white bg-white/10 rounded-lg px-4 py-2 hover:bg-white/20 transition-colors duration-200 cursor-pointer">
        <div className="p-1 bg-white/20 rounded-full">
          <User size={20} className="text-white" />
        </div>
        <div>
          <p className="font-medium text-sm">Nguyễn Văn A</p>
          <p className="text-xs text-gray-200">Admin</p>
        </div>
      </div>
    </div>
  )
}
