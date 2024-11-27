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
    <div className="mx-auto p-6 bg-white rounded-[10px]">
      <h1 className="text-2xl font-bold mb-4">Danh sách khách hàng</h1>
      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Mã/ Tên khách hàng"
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
          <Button
            onClick={() => deleteUser(selectedEmployees)}
            className="bg-[#F3949E] hover:bg-[#a4434d] rounded text-white font-semibold"
          >
            <Trash2 className="w-4 h-4" /> Xóa
          </Button>
        </div>
      </div>
      <InfiniteScroll
        dataLength={listUsersCustomers?.length}
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
                    selectedEmployees.length === listUsersCustomers.length
                  }
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
            {listUsersCustomers.length === 0 ? (
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
                      Không có dữ liệu khách hàng
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              listUsersCustomers.map((customer, index) => (
                <TableRow key={customer.id} className="hover:bg-[#F5F5F5]">
                  <TableCell>
                    <Checkbox
                      checked={selectedEmployees.includes(customer.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleSelectOne(customer.id)
                        } else {
                          handleSelectOne(customer.id)
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell className="text-black font-semibold text-lg">
                    {index + 1}
                  </TableCell>
                  <TableCell className="text-black font-semibold text-lg">
                    {customer.code}
                  </TableCell>
                  <TableCell className="text-black font-semibold text-lg">
                    {customer.fullName}
                  </TableCell>
                  <TableCell className="text-black font-semibold text-lg">
                    {customer.dateOfBirth}
                  </TableCell>
                  <TableCell className="text-black font-semibold text-lg">
                    {customer.gender}
                  </TableCell>
                  <TableCell className="text-black font-semibold text-lg">
                    {customer.idNumber}
                  </TableCell>
                  <TableCell className="text-black font-semibold text-lg">
                    {customer.phoneNumber}
                  </TableCell>
                  <TableCell className="text-black font-semibold text-lg">
                    {customer.email}
                  </TableCell>
                  <TableCell className="text-black font-semibold text-lg">
                    {customer.address}
                  </TableCell>
                  <TableCell className="text-black font-semibold text-lg">
                    <div className="flex space-x-3 justify-center items-center">
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
                          className="w-[26px]"
                        />
                      </div>
                      <div
                        onClick={() => deleteUser([customer.id])}
                        className="cursor-pointer"
                      >
                        <NextImage
                          src="/trash.png"
                          alt="trash"
                          className="w-[26px]"
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
