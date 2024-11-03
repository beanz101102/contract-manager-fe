"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Trash2 } from "lucide-react"

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

// Mock data for demonstration
const customers = [
  {
    id: 1,
    code: "NV001",
    name: "Nguyễn Thanh Thành",
    birthDate: "02/03/2000",
    gender: "Nam",
    idNumber: "01232501245",
    phone: "0867352637",
    email: "avd@gmail.com",
    address: "203, Giải Phóng, Bắc Từ Liêm, Hà Nội",
  },
  {
    id: 2,
    code: "NV005",
    name: "Phạm Nguyên Thanh",
    birthDate: "02/03/2000",
    gender: "Nữ",
    idNumber: "01232501245",
    phone: "0973647283",
    email: "avd@gmail.com",
    address: "203, Giải Phóng, Bắc Từ Liêm, Hà Nội",
  },
  // Add more mock data as needed
]

export default function CustomerList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(10)

  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([])

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEmployees(
        filteredCustomers.map((customer, index) => index.toString())
      )
    } else {
      setSelectedEmployees([])
    }
  }

  const handleSelectOne = (customerId: string) => {
    setSelectedEmployees((prev) =>
      prev.includes(customerId)
        ? prev.filter((id) => id !== customerId)
        : [...prev, customerId]
    )
  }

  const indexOfLastEntry = currentPage * entriesPerPage
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage
  const currentEntries = filteredCustomers.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  )

  const pageNumbers = []
  for (
    let i = 1;
    i <= Math.ceil(filteredCustomers.length / entriesPerPage);
    i++
  ) {
    pageNumbers.push(i)
  }

  return (
    <div className="mx-auto p-6 bg-white rounded-[10px]">
      <h1 className="text-2xl font-bold mb-4">Danh sách khách hàng</h1>
      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Mã/ Tên nhân viên"
            value={searchTerm}
            style={{
              border: "1px solid #4BC5BE",
            }}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-[40px] bg-white rounded"
          />
          <div className="absolute top-1/2 transform -translate-y-1/2 h-[40px] w-[40px] flex items-center justify-center bg-[#4BC5BE] rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        <div className="space-x-2">
          <Link href="/create-customer-information">
            <Button className="bg-[#4BC5BE] hover:bg-[#2ea39d] rounded text-white font-semibold">
              <Plus className="w-4 h-4" /> Thêm mới
            </Button>
          </Link>
          <Button className="bg-[#F3949E] hover:bg-[#a4434d] rounded text-white font-semibold">
            <Trash2 className="w-4 h-4" /> Xóa
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-[#F5F5F5]">
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedEmployees.length === filteredCustomers.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead className="text-black font-semibold text-lg">
              STT
            </TableHead>
            <TableHead className="text-black font-semibold text-lg">
              Mã khách hàng
            </TableHead>
            <TableHead className="text-black font-semibold text-lg">
              Tên khách hàng
            </TableHead>
            <TableHead className="text-black font-semibold text-lg">
              Ngày sinh
            </TableHead>
            <TableHead className="text-black font-semibold text-lg">
              Giới tính
            </TableHead>
            <TableHead className="text-black font-semibold text-lg">
              Số CCCD
            </TableHead>
            <TableHead className="text-black font-semibold text-lg">
              Số điện thoại
            </TableHead>
            <TableHead className="text-black font-semibold text-lg">
              Email
            </TableHead>
            <TableHead className="text-black font-semibold text-lg">
              Địa chỉ
            </TableHead>
            <TableHead className="text-black font-semibold text-lg">
              Thao tác
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentEntries.map((customer, index) => (
            <TableRow key={customer.id} className="hover:bg-[#F5F5F5]">
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
              <TableCell className="text-black font-semibold text-lg">
                {indexOfFirstEntry + index + 1}
              </TableCell>
              <TableCell className="text-black font-semibold text-lg">
                {customer.code}
              </TableCell>
              <TableCell className="text-black font-semibold text-lg">
                {customer.name}
              </TableCell>
              <TableCell className="text-black font-semibold text-lg">
                {customer.birthDate}
              </TableCell>
              <TableCell className="text-black font-semibold text-lg">
                {customer.gender}
              </TableCell>
              <TableCell className="text-black font-semibold text-lg">
                {customer.idNumber}
              </TableCell>
              <TableCell className="text-black font-semibold text-lg">
                {customer.phone}
              </TableCell>
              <TableCell className="text-black font-semibold text-lg">
                {customer.email}
              </TableCell>
              <TableCell className="text-black font-semibold text-lg">
                {customer.address}
              </TableCell>
              <TableCell className="text-black font-semibold text-lg">
                <div className="flex space-x-3 justify-center items-center">
                  <NextImage src="/eye.png" alt="eye" className="w-[26px] " />
                  <NextImage src="/edit.png" alt="edit" className="w-[26px]" />
                  <NextImage
                    src="/trash.png"
                    alt="trash"
                    className="w-[26px]"
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
  )
}
