"use client"

import { useState } from "react"
import { Download, Send, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import NextImage from "@/components/ui/next-img"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Contract = {
  id: string
  contractNumber: string
  creationDate: string
  status: "Hoàn thành" | "Tạo mới"
  department: string
  clientCode: string
}

const contracts: Contract[] = [
  {
    id: "1",
    contractNumber: "22/07/2023/HD-BE/BN",
    creationDate: "22/07/2023",
    status: "Hoàn thành",
    department: "Phòng pháp lý",
    clientCode: "KH000",
  },
  {
    id: "2",
    contractNumber: "22/07/2023/HD-NA/MN",
    creationDate: "22/07/2023",
    status: "Tạo mới",
    department: "Phòng nhân sự",
    clientCode: "KH000",
  },
  // Add more contract data here...
]

export default function IndividualManagement() {
  const [searchTerm, setSearchTerm] = useState("")

  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([])

  const filteredContracts = contracts.filter((contract) =>
    contract.contractNumber.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEmployees(
        filteredContracts.map((contract, index) => index.toString())
      )
    } else {
      setSelectedEmployees([])
    }
  }

  const handleSelectOne = (employeeId: string) => {
    setSelectedEmployees((prev) =>
      prev.includes(employeeId)
        ? prev.filter((id) => id !== employeeId)
        : [...prev, employeeId]
    )
  }

  return (
    <div className="w-full py-6 bg-white rounded-[10px]">
      <h1 className="text-2xl font-bold mb-4 border-b border-b-[#675D5D] px-6 pb-6">
        Cá nhân quản lý
      </h1>
      <div className="px-6">
        <div className="flex justify-between mb-4 ">
          <div className="relative">
            <Input
              type="text"
              placeholder="Mã/ Số hợp đồng"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white rounded"
              style={{
                border: "1px solid #D9D9D9",
              }}
            />
          </div>
          <div className="flex gap-2">
            <Button className="bg-[#4BC5BE] rounded text-white hover:bg-[#2ea39d]">
              + Thêm mới
            </Button>
            <Button className="bg-[#C1C1C1] rounded text-white hover:bg-[#a1a1a1]">
              <Send className="w-4 h-4" />
              Gửi duyệt
            </Button>
            <Button className="bg-[#F3949E] rounded text-white hover:bg-[#a4434d]">
              <Trash2 className="w-4 h-4" />
              Xóa
            </Button>
            <Button className="bg-[#C1C1C1] rounded text-white hover:bg-[#a1a1a1]">
              <Download className="w-4 h-4" />
              Tải
            </Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-[#F5F5F5]">
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={
                    selectedEmployees.length === filteredContracts.length
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="w-[50px] text-black text-lg font-semibold">
                STT
              </TableHead>
              <TableHead className="text-black text-lg font-semibold">
                Số hợp đồng
              </TableHead>
              <TableHead className="text-black text-lg font-semibold">
                Ngày tạo hợp đồng
              </TableHead>
              <TableHead className="text-black text-lg">Trạng thái</TableHead>
              <TableHead className="text-black text-lg font-semibold">
                Phòng ban
              </TableHead>
              <TableHead className="text-black text-lg font-semibold">
                Mã khách
              </TableHead>
              <TableHead className="text-black text-lg font-semibold">
                Thao tác
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContracts.map((contract, index) => (
              <TableRow key={contract.id} className="hover:bg-[#F5F5F5]">
                <TableCell>
                  <Checkbox
                    checked={selectedEmployees.includes(index.toString())}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handleSelectOne(index.toString())
                      } else {
                        handleSelectOne(index.toString())
                      }
                    }}
                  />
                </TableCell>
                <TableCell className="text-black text-lg font-semibold">
                  {index + 1}
                </TableCell>
                <TableCell className="text-black text-lg font-semibold">
                  {contract.contractNumber}
                </TableCell>
                <TableCell className="text-black text-lg font-semibold">
                  {contract.creationDate}
                </TableCell>
                <TableCell className="text-black text-lg font-semibold">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      contract.status === "Hoàn thành"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {contract.status}
                  </span>
                </TableCell>
                <TableCell className="text-black text-lg font-semibold">
                  {contract.department}
                </TableCell>
                <TableCell className="text-black text-lg font-semibold">
                  {contract.clientCode}
                </TableCell>
                <TableCell>
                  <div className="flex gap-3 items-center">
                    <NextImage src="/eye.png" alt="eye" className="w-[24px]" />
                    <NextImage
                      src="/mail.png"
                      alt="mail"
                      className="w-[24px]"
                    />
                    <NextImage
                      src="/edit.png"
                      alt="edit"
                      className="w-[24px]"
                    />
                    <NextImage
                      src="/setting.png"
                      alt="setting"
                      className="w-[24px]"
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between mt-4">
          <div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>

          <div className="flex items-center gap-2">
            <span>Chọn số bản ghi trên 1 trang:</span>
            <Select defaultValue="10">
              <SelectTrigger className="w-[70px] rounded">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent className="rounded border none text-black">
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span>Tổng số bản ghi: 48</span>
          </div>
        </div>
      </div>
    </div>
  )
}
