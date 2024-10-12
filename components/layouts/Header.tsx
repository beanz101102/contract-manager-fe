import {
  Briefcase,
  Calendar,
  ChevronRight,
  ClipboardList,
  MessageSquare,
  Star,
  UserCheck,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

import NextImage from "../ui/next-img"

export default function SidebarMenu() {
  const menuItems = [
    { icon: <ClipboardList className="w-5 h-5" />, label: "Hợp đồng" },
    { icon: <Users className="w-5 h-5" />, label: "Quản lý nhân viên" },
    { icon: <UserCheck className="w-5 h-5" />, label: "Quản lý khách hàng" },
    { icon: <Calendar className="w-5 h-5" />, label: "Lịch" },
    { icon: <Briefcase className="w-5 h-5" />, label: "Ứng dụng" },
    { icon: <Calendar className="w-5 h-5" />, label: "Nghỉ phép" },
    { icon: <UserCheck className="w-5 h-5" />, label: "Chấm công" },
    { icon: <MessageSquare className="w-5 h-5" />, label: "Thảo luận" },
    { icon: <ClipboardList className="w-5 h-5" />, label: "Nhật ký công việc" },
    { icon: <Briefcase className="w-5 h-5" />, label: "Dự án" },
    { icon: <Star className="w-5 h-5" />, label: "Đánh giá" },
  ]

  return (
    <div className="flex flex-col h-screen bg-white border-r max-w-[300px]">
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2">
          <NextImage
            src="/img/logo.png"
            alt="logo"
            width={32}
            height={32}
            className="w-[200px]"
          />
        </div>
      </div>
      <ScrollArea className="flex-grow">
        <nav className="p-2">
          {menuItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-start text-left font-normal mb-1 text-black hover:bg-gray-100 hover:text-black"
            >
              <div className="flex items-center flex-1">
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </Button>
          ))}
        </nav>
      </ScrollArea>
    </div>
  )
}
