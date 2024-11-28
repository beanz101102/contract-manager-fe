"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const listUsersCustomersAtom = atom<User[]>([])

export default function CustomerList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [department, setDepartment] = useState("all")
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const router = useRouter()

  const { useListUsers, useDeleteUser } = useUsers()
  const { data: employees } = useListUsers(
    "customer",
    1,
    10,
    searchTerm,
    departmentConfigs?.find((d) => d.label === department)?.value || null
  )
  const { mutate: deleteUser } = useDeleteUser(() => {
    setSelectedEmployees([])
    setPage(1)
  })

  const [listUsersCustomers, setListUsersCustomers] = useAtom(
    listUsersCustomersAtom
  )

  const filteredEmployees = employees?.users || []

  useEffect(() => {
    setHasMore(filteredEmployees?.length >= 10)
    if (page === 1) {
      setListUsersCustomers(filteredEmployees)
    } else {
      setListUsersCustomers([...listUsersCustomers, ...filteredEmployees])
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
        Danh sách khách hàng
      </h1>

      <div className="flex justify-between mb-6">
        <div className="relative w-[280px]">
          <Input
            type="text"
            placeholder="Mã/ Tên khách hàng"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-[42px] w-full rounded-md bg-white border-[#4BC5BE] focus:ring-2 focus:ring-[#4BC5BE]/20"
          />
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-[42px] w-[42px] flex items-center justify-center bg-[#4BC5BE] rounded-l-md">
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

        <div className="flex gap-3">
          <Link href="/create-customer-information">
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
          dataLength={listUsersCustomers?.length}
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
                      selectedEmployees.length === listUsersCustomers.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="text-gray-700 font-semibold">
                  STT
                </TableHead>
                <TableHead className="text-gray-700 font-semibold">
                  Mã khách hàng
                </TableHead>
                <TableHead className="text-gray-700 font-semibold">
                  Tên khách hàng
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
                  Email
                </TableHead>
                <TableHead className="text-gray-700 font-semibold">
                  Địa chỉ
                </TableHead>
                <TableHead className="text-gray-700 font-semibold">
                  Thao tác
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listUsersCustomers.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={11} className="text-center py-16">
                    <div className="flex flex-col items-center gap-4">
                      <NextImage
                        src="/empty-state.png"
                        alt="No data"
                        className="w-[240px] h-[240px] opacity-40"
                      />
                      <p className="text-gray-500 text-base">
                        Không có dữ liệu khách hàng
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                listUsersCustomers.map((customer, index) => (
                  <TableRow
                    key={customer.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedEmployees.includes(customer.id)}
                        onCheckedChange={() => handleSelectOne(customer.id)}
                      />
                    </TableCell>
                    <TableCell className="text-gray-700 text-base">
                      {index + 1}
                    </TableCell>
                    <TableCell className="text-gray-700 text-base">
                      {customer.code}
                    </TableCell>
                    <TableCell className="text-gray-700 text-base">
                      {customer.fullName}
                    </TableCell>
                    <TableCell className="text-gray-700 text-base">
                      {customer.dateOfBirth}
                    </TableCell>
                    <TableCell className="text-gray-700 text-base">
                      {customer.gender}
                    </TableCell>
                    <TableCell className="text-gray-700 text-base">
                      {customer.idNumber}
                    </TableCell>
                    <TableCell className="text-gray-700 text-base">
                      {customer.phoneNumber}
                    </TableCell>
                    <TableCell className="text-gray-700 text-base">
                      {customer.email}
                    </TableCell>
                    <TableCell className="text-gray-700 text-base">
                      {customer.address}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-3 justify-center">
                        <div
                          className="cursor-pointer"
                          onClick={() =>
                            router.push(
                              `/edit-customer-information/${customer.id}`
                            )
                          }
                        >
                          <NextImage
                            src="/edit.png"
                            alt="edit"
                            className="w-6 h-6 opacity-80 hover:opacity-100 transition-opacity"
                          />
                        </div>
                        <div
                          onClick={() => deleteUser([customer.id])}
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
