"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
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

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Danh sách khách hàng</h1>
      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Mã/ Tên khách hàng"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-64"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
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
        <div className="space-x-2">
          <Link href="/create-customer-information">
            <Button className="bg-teal-500 hover:bg-teal-600 text-white">
              + Thêm mới
            </Button>
          </Link>
          <Button variant="destructive">Xóa</Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox />
            </TableHead>
            <TableHead>STT</TableHead>
            <TableHead>Mã khách hàng</TableHead>
            <TableHead>Tên khách hàng</TableHead>
            <TableHead>Ngày sinh</TableHead>
            <TableHead>Giới tính</TableHead>
            <TableHead>Số CCCD</TableHead>
            <TableHead>Số điện thoại</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Địa chỉ</TableHead>
            <TableHead>Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentEntries.map((customer, index) => (
            <TableRow key={customer.id}>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell>{indexOfFirstEntry + index + 1}</TableCell>
              <TableCell>{customer.code}</TableCell>
              <TableCell>{customer.name}</TableCell>
              <TableCell>{customer.birthDate}</TableCell>
              <TableCell>{customer.gender}</TableCell>
              <TableCell>{customer.idNumber}</TableCell>
              <TableCell>{customer.phone}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{customer.address}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-2">
          <span>Chọn số bản ghi trên 1 trang:</span>
          <Select
            value={entriesPerPage.toString()}
            onValueChange={(value) => setEntriesPerPage(Number(value))}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            &lt;
          </Button>
          {pageNumbers.map((number) => (
            <Button
              key={number}
              variant={currentPage === number ? "default" : "outline"}
              onClick={() => setCurrentPage(number)}
            >
              {number}
            </Button>
          ))}
          <Button
            variant="outline"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, pageNumbers.length))
            }
            disabled={currentPage === pageNumbers.length}
          >
            &gt;
          </Button>
        </div>
        <div>Tổng số bản ghi: {filteredCustomers.length}</div>
      </div>
    </div>
  )
}
