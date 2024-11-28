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
import { Loading } from "@/components/ui/loading"
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
  const { data: employees, isLoading } = useListUsers(
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

  console.log("isLoading", isLoading)

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
    <div className="p-8 bg-white rounded-xl shadow-sm">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Danh sách nhân viên
      </h1>
      <div className="flex justify-between mb-6">
        <div className="flex gap-4">
          <div className="flex items-center gap-3">
            <p className="text-sm font-medium text-gray-700">Phòng ban</p>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger className="w-[200px] rounded-md bg-white border-gray-300 hover:border-gray-400 transition-colors">
                <SelectValue placeholder="Phòng ban" />
              </SelectTrigger>
              <SelectContent className="rounded-md">
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
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-[42px] w-[280px] rounded-md bg-white border-[#4BC5BE] focus:ring-2 focus:ring-[#4BC5BE]/20"
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
        <div className="flex gap-3">
          <Link href="/employee-registration">
            <Button className="bg-[#4BC5BE] hover:bg-[#3DA8A2] rounded-md text-white font-medium px-4 py-2 transition-colors">
              <Plus className="w-4 h-4 mr-2" /> Thêm mới
            </Button>
          </Link>
          <Button
            className="bg-[#F3949E] hover:bg-[#E07983] rounded-md text-white font-medium px-4 py-2 transition-colors"
            disabled={selectedEmployees.length === 0}
            onClick={() => deleteUser(selectedEmployees)}
          >
            <Trash2 className="w-4 h-4 mr-2" /> Xóa
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <InfiniteScroll
          dataLength={listUsersEmployees?.length}
          next={() => setPage(page + 1)}
          hasMore={hasMore}
          loader={null}
          className="min-w-full"
        >
          <Table className="min-w-[1200px] w-full">
            <TableHeader>
              <TableRow className="hover:bg-gray-50 bg-gray-100">
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={
                      selectedEmployees.length === listUsersEmployees?.length &&
                      listUsersEmployees?.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="w-[60px] text-gray-700 font-semibold">
                  STT
                </TableHead>
                <TableHead className="text-gray-700 font-semibold">
                  Mã nhân viên
                </TableHead>
                <TableHead className="text-gray-700 font-semibold">
                  Tên nhân viên
                </TableHead>
                <TableHead className="text-gray-700 font-semibold">
                  Phòng ban
                </TableHead>
                <TableHead className="text-gray-700 font-semibold">
                  Chức vụ
                </TableHead>
                <TableHead className="text-gray-700 font-semibold">
                  Ngày sinh
                </TableHead>
                <TableHead className="text-gray-700 font-semibold">
                  Giới tính
                </TableHead>
                <TableHead className="text-gray-700 font-semibold">
                  Số CCCD
                </TableHead>
                <TableHead className="text-gray-700 font-semibold">
                  Số điện thoại
                </TableHead>
                <TableHead className="text-gray-700 font-semibold">
                  Địa chỉ email
                </TableHead>
                <TableHead className="text-gray-700 font-semibold">
                  Tài khoản và mật khẩu
                </TableHead>
                <TableHead className="text-gray-700 font-semibold">
                  Thao tác
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listUsersEmployees.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={12} className="text-center py-16">
                    <div className="flex flex-col items-center gap-4">
                      {isLoading ? (
                        <Loading />
                      ) : (
                        <>
                          <NextImage
                            src="/empty-state.png"
                            alt="No data"
                            className="w-[240px] h-[240px] opacity-40"
                          />
                          <p className="text-gray-500 text-base">
                            Không có dữ liệu nhân viên
                          </p>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                listUsersEmployees.map((employee, index) => (
                  <TableRow
                    key={employee.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
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
                    <TableCell className="text-gray-700 text-base">
                      {index + 1}
                    </TableCell>
                    <TableCell className="text-gray-700 text-base">
                      {employee.code}
                    </TableCell>
                    <TableCell className="text-gray-700 text-base">
                      {employee.fullName}
                    </TableCell>
                    <TableCell className="text-gray-700 text-base">
                      {employee?.department?.departmentName}
                    </TableCell>
                    <TableCell className="text-gray-700 text-base">
                      {employee?.position}
                    </TableCell>
                    <TableCell className="text-gray-700 text-base">
                      {employee.dateOfBirth}
                    </TableCell>
                    <TableCell className="text-gray-700 text-base">
                      {employee.gender}
                    </TableCell>
                    <TableCell className="text-gray-700 text-base">
                      {employee.idNumber}
                    </TableCell>
                    <TableCell className="text-gray-700 text-base">
                      {employee.phoneNumber}
                    </TableCell>
                    <TableCell className="text-gray-700 text-base">
                      {employee.email}
                    </TableCell>
                    <TableCell className="text-gray-700 text-base">
                      {employee.email}
                      <br />
                      *************
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-3">
                        <Link
                          href={`/edit-employee-information/${employee.id}`}
                        >
                          <NextImage
                            src="/edit.png"
                            alt="edit"
                            className="w-6 h-6 opacity-80 hover:opacity-100 transition-opacity"
                          />
                        </Link>
                        <div
                          onClick={() => deleteUser([employee.id])}
                          className="cursor-pointer"
                        >
                          <NextImage
                            src="/trash.png"
                            alt="trash"
                            className="w-6 h-6 opacity-80 hover:opacity-100 transition-opacity"
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
    </div>
  )
}
