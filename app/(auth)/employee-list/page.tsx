"use client"

import { useState } from "react"
import Link from "next/link"
import { Pencil, Plus, Trash2 } from "lucide-react"

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

type Employee = {
  id: string
  code: string
  name: string
  department: string
  position: string
  dateOfBirth: string
  gender: string
  idNumber: string
  phoneNumber: string
  email: string
  account: string
}

const employees: Employee[] = [
  {
    id: "1",
    code: "NV001",
    name: "Nguyễn Thanh Thành",
    department: "Phòng pháp lý",
    position: "Phòng pháp lý",
    dateOfBirth: "02/03/2000",
    gender: "Nam",
    idNumber: "0123250124",
    phoneNumber: "0867352637",
    email: "avd@gmail.com",
    account: "avd@gmail.com",
  },
  {
    id: "1",
    code: "NV001",
    name: "Nguyễn Thanh Thành",
    department: "Phòng pháp lý",
    position: "Phòng pháp lý",
    dateOfBirth: "02/03/2000",
    gender: "Nam",
    idNumber: "0123250124",
    phoneNumber: "0867352637",
    email: "avd@gmail.com",
    account: "avd@gmail.com",
  },
  {
    id: "1",
    code: "NV001",
    name: "Nguyễn Thanh Thành",
    department: "Phòng pháp lý",
    position: "Phòng pháp lý",
    dateOfBirth: "02/03/2000",
    gender: "Nam",
    idNumber: "0123250124",
    phoneNumber: "0867352637",
    email: "avd@gmail.com",
    account: "avd@gmail.com",
  },
  {
    id: "1",
    code: "NV001",
    name: "Nguyễn Thanh Thành",
    department: "Phòng pháp lý",
    position: "Phòng pháp lý",
    dateOfBirth: "02/03/2000",
    gender: "Nam",
    idNumber: "0123250124",
    phoneNumber: "0867352637",
    email: "avd@gmail.com",
    account: "avd@gmail.com",
  },
]

export default function EmployeeList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [department, setDepartment] = useState("all")
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([])

  const filteredEmployees = employees.filter(
    (employee) =>
      (employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.code.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (department === "all" || employee.department === department)
  )

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEmployees(
        filteredEmployees.map((emp, index) => index.toString())
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
    <div className="p-6 bg-white rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Danh sách nhân viên</h1>
      <div className="flex justify-between mb-4">
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">Phòng ban</p>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger
                className="w-[180px] rounded"
                style={{
                  border: "1px solid #0000004D",
                }}
              >
                <SelectValue placeholder="Phòng ban" />
              </SelectTrigger>
              <SelectContent className="rounded border none text-black">
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="Phòng pháp lý">Phòng pháp lý</SelectItem>
                <SelectItem value="Phòng nhân sự">Phòng nhân sự</SelectItem>
                <SelectItem value="Phòng hành chính">
                  Phòng hành chính
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
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
        </div>
        <div className="flex gap-2">
          <Link href="/employee-registration">
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
                checked={selectedEmployees.length === filteredEmployees.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead className="w-[50px] text-black font-semibold text-lg">
              STT
            </TableHead>
            <TableHead className="text-black font-semibold text-lg">
              Mã nhân viên
            </TableHead>
            <TableHead className="text-black font-semibold text-lg">
              Tên nhân viên
            </TableHead>
            <TableHead className="text-black font-semibold text-lg">
              Phòng ban
            </TableHead>
            <TableHead className="text-black font-semibold text-lg">
              Chức vụ
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
              Địa chỉ email
            </TableHead>
            <TableHead className="text-black font-semibold text-lg">
              Tài khoản và mật khẩu
            </TableHead>
            <TableHead className="text-black font-semibold text-lg">
              Thao tác
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredEmployees.map((employee, index) => (
            <TableRow key={employee.id} className="hover:bg-[#F5F5F5]">
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
                {index + 1}
              </TableCell>
              <TableCell className="text-black font-semibold text-lg">
                {employee.code}
              </TableCell>
              <TableCell className="text-black font-semibold text-lg">
                {employee.name}
              </TableCell>
              <TableCell className="text-black font-semibold text-lg">
                {employee.department}
              </TableCell>
              <TableCell className="text-black font-semibold text-lg">
                {employee.position}
              </TableCell>
              <TableCell className="text-black font-semibold text-lg">
                {employee.dateOfBirth}
              </TableCell>
              <TableCell className="text-black font-semibold text-lg">
                {employee.gender}
              </TableCell>
              <TableCell className="text-black font-semibold text-lg">
                {employee.idNumber}
              </TableCell>
              <TableCell className="text-black font-semibold text-lg">
                {employee.phoneNumber}
              </TableCell>
              <TableCell className="text-black font-semibold text-lg">
                {employee.email}
              </TableCell>
              <TableCell className="text-black font-semibold text-lg">
                {employee.account}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Link href="/edit-employee-information">
                    <NextImage
                      src="/edit.png"
                      alt="edit"
                      className="w-[26px] h-[26px]"
                    />
                  </Link>
                  <NextImage
                    src="/trash.png"
                    alt="trash"
                    className="w-[26px] h-[26px]"
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
