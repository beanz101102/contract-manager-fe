"use client"

import Link from "next/link"

import NextImage from "@/components/ui/next-img"
import { HeaderContent } from "@/components/layouts/LayoutApp"

export default function Dashboard() {
  return (
    <div className="h-[100vh] bg-gray-100/90">
      <HeaderContent />

      {/* Grid Layout */}
      <div
        className="flex justify-center items-center w-full h-[calc(100vh-100px)] relative"
        style={{
          backgroundImage: "url('/background.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay layer */}
        <div className="absolute inset-0 bg-[#98A5B2D4]"></div>

        <div className="mx-auto max-w-4xl w-full relative z-10 px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-6">
            {[
              {
                title: "Hợp đồng",
                icon: "contract",
                href: "/contract/personal",
                disabled: false,
              },
              {
                title: "Nhân viên",
                icon: "employee",
                href: "/employees",
                disabled: false,
              },
              {
                title: "Khách hàng",
                icon: "customer",
                href: "/customers",
                disabled: false,
              },
              {
                title: "Báo cáo",
                icon: "report",
                href: "/dashboard",
                disabled: false,
              },
              {
                title: "Lịch",
                icon: "calendar",
                href: "/calendar",
                disabled: true,
              },
              {
                title: "Nghỉ phép",
                icon: "onleave",
                href: "/leave",
                disabled: true,
              },
              {
                title: "Chấm công",
                icon: "timekeeping",
                href: "/timekeeping",
                disabled: true,
              },
              {
                title: "Thảo luận",
                icon: "discuss",
                href: "/discussion",
                disabled: true,
              },
              {
                title: "Nhật ký công việc",
                icon: "work_diary",
                href: "/work-diary",
                disabled: true,
              },
              {
                title: "Dự án",
                icon: "project",
                href: "/project",
                disabled: true,
              },
              {
                title: "Đánh giá",
                icon: "evaluate",
                href: "/evaluate",
                disabled: true,
              },
              {
                title: "Bảo trì",
                icon: "maintenance",
                href: "/maintenance",
                disabled: true,
              },
            ].map((item, index) =>
              item?.disabled ? (
                <div
                  key={index}
                  className="flex flex-col items-center gap-1 sm:gap-2"
                >
                  <NextImage
                    src={`/${item.icon}.png`}
                    alt={item.title}
                    className="h-[60px] w-[60px] sm:h-[80px] sm:w-[80px] md:h-[100px] md:w-[100px]"
                  />
                  <span className="text-xs sm:text-sm font-medium text-center text-white">
                    {item.title}
                  </span>
                </div>
              ) : (
                <Link href={item.href} key={index}>
                  <div className="flex flex-col items-center gap-1 sm:gap-2">
                    <NextImage
                      src={`/${item.icon}.png`}
                      alt={item.title}
                      className="h-[60px] w-[60px] sm:h-[80px] sm:w-[80px] md:h-[100px] md:w-[100px]"
                    />
                    <span className="text-xs sm:text-sm font-medium text-center text-white">
                      {item.title}
                    </span>
                  </div>
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
