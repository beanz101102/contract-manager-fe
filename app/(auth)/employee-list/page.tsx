"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { atom, useAtom } from "jotai"
import { Plus, Trash2 } from "lucide-react"
import InfiniteScroll from "react-infinite-scroll-component"

import { departmentConfigs } from "@/types/api"
import { User } from "@/types/auth"
import { useUsers } from "@/hooks/useUsers"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import NextImage from "@/components/ui/next-img"
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

const listUsersEmployeesAtom = atom<User[]>([])

export default function EmployeeList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [department, setDepartment] = useState("all")
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)

  const { useListUsers, useDeleteUser } = useUsers()
  const { data: employees } = useListUsers(
    "employee",
    1,
    10,
    searchTerm,
    departmentConfigs?.find((d) => d.label === department)?.value || null
  )
  const { mutate: deleteUser } = useDeleteUser(() => {
    setSelectedEmployees([])
    setPage(1)
  })

  const [listUsersEmployees, setListUsersEmployees] = useAtom(
    listUsersEmployeesAtom
  )

  const filteredEmployees = employees?.users || []

  useEffect(() => {
    setHasMore(filteredEmployees?.length >= 10)
    if (page === 1) {
      setListUsersEmployees(filteredEmployees)
    } else {
      setListUsersEmployees([...listUsersEmployees, ...filteredEmployees])
    }
  }, [filteredEmployees])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEmployees(filteredEmployees.map((emp, index) => emp.id))
    } else {
      setSelectedEmployees([])
    }
  }

  const handleSelectOne = (employeeId: number) => {
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
                {departmentConfigs.map((department) => (
                  <SelectItem key={department.value} value={department.label}>
                    {department.label}
                  </SelectItem>
                ))}
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
          <Button
            className="bg-[#F3949E] hover:bg-[#a4434d] rounded text-white font-semibold"
            disabled={selectedEmployees.length === 0}
            onClick={() => deleteUser(selectedEmployees)}
          >
            <Trash2 className="w-4 h-4" /> Xóa
          </Button>
        </div>
      </div>
      <InfiniteScroll
        dataLength={listUsersEmployees?.length}
        next={() => setPage(page + 1)}
        hasMore={hasMore}
        loader={null}
      >
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-[#F5F5F5]">
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={
                    selectedEmployees.length === listUsersEmployees?.length &&
                    listUsersEmployees?.length > 0
                  }
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
            {listUsersEmployees.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={12}
                  className="text-center py-10 hover:bg-transparent"
                >
                  <div className="flex flex-col items-center gap-3">
                    <NextImage
                      src="/empty-state.png"
                      alt="No data"
                      className="w-[200px] h-[200px] opacity-50"
                    />
                    <p className="text-gray-500 text-lg">
                      Không có dữ liệu nhân viên
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              listUsersEmployees.map((employee, index) => (
                <TableRow key={employee.id} className="hover:bg-[#F5F5F5]">
                  <TableCell>
                    <Checkbox
                      checked={selectedEmployees.includes(employee.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleSelectOne(employee.id)
                        } else {
                          handleSelectOne(employee.id)
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
                    {employee.fullName}
                  </TableCell>
                  <TableCell className="text-black font-semibold text-lg">
                    {employee?.department?.departmentName}
                  </TableCell>
                  <TableCell className="text-black font-semibold text-lg">
                    {employee?.position}
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
                    {employee.email}
                    <br />
                    *************
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link href={`/edit-employee-information/${employee.id}`}>
                        <NextImage
                          src="/edit.png"
                          alt="edit"
                          className="w-[26px] h-[26px]"
                        />
                      </Link>
                      <div
                        onClick={() => deleteUser([employee.id])}
                        className="cursor-pointer"
                      >
                        <NextImage
                          src="/trash.png"
                          alt="trash"
                          className="w-[26px] h-[26px]"
                        />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </InfiniteScroll>
    </div>
  )
}
