import { FileText, List, User, UserPlus, Users } from "lucide-react"

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
          <DropdownMenu />
        </nav>
      </ScrollArea>
    </div>
  )
}

function DropdownMenu() {
  return (
    <div className="w-full max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <Accordion type="multiple" className="w-full">
        <AccordionItem value="contract">
          <AccordionTrigger className="text-lg font-medium">
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
                <line x1="9" y1="9" x2="10" y2="9" />
                <line x1="9" y1="13" x2="15" y2="13" />
                <line x1="9" y1="17" x2="15" y2="17" />
              </svg>
              Hợp đồng
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-2">
              <li className="pl-6">Tra cứu hợp đồng</li>
              <li className="pl-6">Cá nhân quản lý</li>
              <li className="pl-6">Duyệt hợp đồng</li>
              <li className="pl-6">Ký hợp đồng</li>
              <li className="pl-6">Lường duyệt hợp đồng</li>
              <li className="pl-6">Chữ ký cá nhân</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="employee">
          <AccordionTrigger className="text-lg font-medium">
            <span className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Quản lý nhân viên
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-2">
              <li className="pl-6 flex items-center">Danh sách nhân viên</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="customer">
          <AccordionTrigger className="text-lg font-medium">
            <span className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Quản lý khách hàng
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-2">
              <li className="pl-6 flex items-center">Danh sách khách hàng</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
