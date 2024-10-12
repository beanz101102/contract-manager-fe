"use client"

import { useState } from "react"
import { Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
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
  // Add more employee data here...
]

export default function EmployeeList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [department, setDepartment] = useState("all")

  const filteredEmployees = employees.filter(
    (employee) =>
      (employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.code.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (department === "all" || employee.department === department)
  )

  return (
    <div className="p-6 bg-white rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Danh sách nhân viên</h1>
      <div className="flex justify-between mb-4">
        <div className="flex gap-2">
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Phòng ban" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="Phòng pháp lý">Phòng pháp lý</SelectItem>
              <SelectItem value="Phòng nhân sự">Phòng nhân sự</SelectItem>
              <SelectItem value="Phòng hành chính">Phòng hành chính</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative">
            <Input
              type="text"
              placeholder="Mã/ Tên nhân viên"
              value={searchTerm}
              style={{
                border: "1px solid #0000004D",
              }}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
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
        <div className="flex gap-2">
          <Button className="bg-teal-500 hover:bg-teal-600">+ Thêm mới</Button>
          <Button variant="destructive">X Xóa</Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">STT</TableHead>
            <TableHead>Mã nhân viên</TableHead>
            <TableHead>Tên nhân viên</TableHead>
            <TableHead>Phòng ban</TableHead>
            <TableHead>Chức vụ</TableHead>
            <TableHead>Ngày sinh</TableHead>
            <TableHead>Giới tính</TableHead>
            <TableHead>Số CCCD</TableHead>
            <TableHead>Số điện thoại</TableHead>
            <TableHead>Địa chỉ email</TableHead>
            <TableHead>Tài khoản và mật khẩu</TableHead>
            <TableHead>Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredEmployees.map((employee, index) => (
            <TableRow key={employee.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{employee.code}</TableCell>
              <TableCell>{employee.name}</TableCell>
              <TableCell>{employee.department}</TableCell>
              <TableCell>{employee.position}</TableCell>
              <TableCell>{employee.dateOfBirth}</TableCell>
              <TableCell>{employee.gender}</TableCell>
              <TableCell>{employee.idNumber}</TableCell>
              <TableCell>{employee.phoneNumber}</TableCell>
              <TableCell>{employee.email}</TableCell>
              <TableCell>{employee.account}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            {"<"}
          </Button>
          <Button variant="outline" size="sm">
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <Button variant="outline" size="sm">
            4
          </Button>
          <Button variant="outline" size="sm">
            5
          </Button>
          <Button variant="outline" size="sm">
            {">"}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span>Chọn số bản ghi trên 1 trang:</span>
          <Select defaultValue="10">
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
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
