import Link from "next/link"
import { Building2, FileText, List, User, UserPlus, Users } from "lucide-react"

import { ScrollArea } from "@/components/ui/scroll-area"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion"
import NextImage from "../ui/next-img"

export default function SidebarMenu() {
  return (
    <div className="flex flex-col h-screen bg-white border-r w-[280px]">
      <div className="py-3 px-4 border-b">
        <div className="flex items-center justify-center">
          <NextImage
            src="/img/logo.png"
            alt="logo"
            width={32}
            height={32}
            className="w-[160px]"
          />
        </div>
      </div>
      <ScrollArea className="flex-grow px-2 py-1">
        <nav>
          <DropdownMenu />
        </nav>
      </ScrollArea>
    </div>
  )
}

function DropdownMenu() {
  return (
    <div className="w-full">
      <Accordion type="multiple" className="w-full">
        <AccordionItem value="dashboard" className="border-none">
          <AccordionTrigger className="hover:bg-gray-100 rounded-lg px-3 py-2 text-gray-700">
            <span className="flex items-center">
              <List className="mr-2 h-5 w-5" />
              <span className="text-sm font-medium">Dashboard</span>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-1 px-2">
              <Link href="/dashboard">
                <li className="text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md px-4 py-2 transition-colors">
                  Tổng quan
                </li>
              </Link>
              {/* <Link href="/dashboard/contracts">
                <li className="text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md px-4 py-2 transition-colors">
                  Thống kê hợp đồng
                </li>
              </Link>
              <Link href="/dashboard/reports">
                <li className="text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md px-4 py-2 transition-colors">
                  Báo cáo chi tiết
                </li>
              </Link> */}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="contract" className="border-none">
          <AccordionTrigger className="hover:bg-gray-100 rounded-lg px-3 py-2 text-gray-700">
            <span className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              <span className="text-sm font-medium">Hợp đồng</span>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-1 px-2">
              <Link href="/contract-search">
                <li className="text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md px-4 py-2 transition-colors">
                  Tra cứu hợp đồng
                </li>
              </Link>
              <Link href="/individual-management">
                <li className="text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md px-4 py-2 transition-colors">
                  Cá nhân quản lý
                </li>
              </Link>
              <Link href="/contract-approval">
                <li className="text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md px-4 py-2 transition-colors">
                  Duyệt hợp đồng
                </li>
              </Link>
              <Link href="/contract-signing">
                <li className="text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md px-4 py-2 transition-colors">
                  Ký hợp đồng
                </li>
              </Link>
              <Link href="/contract-approval-flow">
                <li className="text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md px-4 py-2 transition-colors">
                  Luồng duyệt hợp đồng
                </li>
              </Link>
              <Link href="/personal-signature">
                <li className="text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md px-4 py-2 transition-colors">
                  Chữ ký cá nhân
                </li>
              </Link>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="employee" className="border-none">
          <AccordionTrigger className="hover:bg-gray-100 rounded-lg px-3 py-2 text-gray-700">
            <span className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              <span className="text-sm font-medium">Quản lý nhân viên</span>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-1 px-2">
              <Link href="/employee-list">
                <li className="text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md px-4 py-2 transition-colors">
                  Danh sách nhân viên
                </li>
              </Link>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="customer" className="border-none">
          <AccordionTrigger className="hover:bg-gray-100 rounded-lg px-3 py-2 text-gray-700">
            <span className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              <span className="text-sm font-medium">Quản lý khách hàng</span>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-1 px-2">
              <Link href="/customer-list">
                <li className="text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md px-4 py-2 transition-colors">
                  Danh sách khách hàng
                </li>
              </Link>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="department" className="border-none">
          <AccordionTrigger className="hover:bg-gray-100 rounded-lg px-3 py-2 text-gray-700">
            <span className="flex items-center">
              <Building2 className="mr-2 h-5 w-5" />
              <span className="text-sm font-medium">Quản lý phòng ban</span>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-1 px-2">
              <Link href="/department">
                <li className="text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md px-4 py-2 transition-colors">
                  Danh sách phòng ban
                </li>
              </Link>
              <Link href="/department/create">
                <li className="text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md px-4 py-2 transition-colors">
                  Tạo phòng ban mới
                </li>
              </Link>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
