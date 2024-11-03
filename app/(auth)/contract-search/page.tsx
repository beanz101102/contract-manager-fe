"use client"

import { useState } from "react"

import { Badge } from "@/components/ui/badge"
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
const contracts = [
  {
    id: 1,
    number: "22/07/2023/HD-BE/BN",
    date: "22/07/2023",
    status: "Hoàn thành",
    department: "Phòng pháp lý",
    customerCode: "KH0005",
    customerInfo: "Nguyễn Thanh Thành 0867352637",
  },
  {
    id: 2,
    number: "22/07/2023/HD-NA/MN",
    date: "22/07/2023",
    status: "Đã ký",
    department: "Phòng nhân sự",
    customerCode: "KH0007",
    customerInfo: "Phạm Nguyên Thanh 0973647283",
  },
  {
    id: 3,
    number: "22/07/2023/HD-HM/MN",
    date: "22/07/2023",
    status: "Đã hủy",
    department: "Phòng pháp lý",
    customerCode: "KH0034",
    customerInfo: "Nguyễn Thanh Thành 0867352637",
  },
  {
    id: 4,
    number: "22/07/2023/HD-KA/MN",
    date: "22/07/2023",
    status: "Hoàn thành",
    department: "Phòng hành chính",
    customerCode: "KH0015",
    customerInfo: "Phạm Nguyên Thanh 0973647283",
  },
  {
    id: 5,
    number: "22/07/2023/HD-DH/BN",
    date: "22/07/2023",
    status: "Hoàn thành",
    department: "Phòng hành chính",
    customerCode: "KH0047",
    customerInfo: "Nguyễn Thanh Thành 0867352637",
  },
  {
    id: 6,
    number: "22/07/2023/HD-NH/MN",
    date: "22/07/2023",
    status: "Đã ký",
    department: "Phòng pháp lý",
    customerCode: "KH0014",
    customerInfo: "Phạm Nguyên Thanh 0973647283",
  },
  {
    id: 7,
    number: "22/07/2023/HD-KC/BN",
    date: "22/07/2023",
    status: "Hoàn thành",
    department: "Phòng pháp lý",
    customerCode: "KH0305",
    customerInfo: "Nguyễn Thanh Thành 0867352637",
  },
  {
    id: 8,
    number: "22/07/2023/HD-PH/MN",
    date: "22/07/2023",
    status: "Đã ký",
    department: "Phòng hành chính",
    customerCode: "KH0107",
    customerInfo: "Phạm Nguyên Thanh 0973647283",
  },
]

export default function ContractSearch() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(10)

  const filteredContracts = contracts.filter((contract) =>
    contract.number.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const indexOfLastEntry = currentPage * entriesPerPage
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage
  const currentEntries = filteredContracts.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  )

  const pageNumbers = []
  for (
    let i = 1;
    i <= Math.ceil(filteredContracts.length / entriesPerPage);
    i++
  ) {
    pageNumbers.push(i)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Hoàn thành":
        return <Badge className="bg-teal-100 text-teal-800">Hoàn thành</Badge>
      case "Đã ký":
        return <Badge className="bg-blue-100 text-blue-800">Đã ký</Badge>
      case "Đã hủy":
        return <Badge className="bg-red-100 text-red-800">Đã hủy</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="bg-white rounded-[10px] px-6 py-6">
      <h1 className="text-2xl font-bold border-b border-[#675D5D] pb-6 mb-4">
        Tra cứu hợp đồng
      </h1>
      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Số hợp đồng"
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
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-[#F5F5F5]">
            <TableHead className="font-semibold text-lg text-black">
              STT
            </TableHead>
            <TableHead className="font-semibold text-lg text-black">
              Số hợp đồng
            </TableHead>
            <TableHead className="font-semibold text-lg text-black">
              Ngày tạo hợp đồng
            </TableHead>
            <TableHead className="font-semibold text-lg text-black">
              Trạng thái
            </TableHead>
            <TableHead className="font-semibold text-lg text-black">
              Phòng ban
            </TableHead>
            <TableHead className="font-semibold text-lg text-black">
              Mã khách hàng
            </TableHead>
            <TableHead className="font-semibold text-lg text-black">
              Thông tin khách hàng
            </TableHead>
            <TableHead className="font-semibold text-lg text-black">
              Thao tác
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentEntries.map((contract, index) => (
            <TableRow key={contract.id} className="hover:bg-[#F5F5F5]">
              <TableCell className="text-black text-lg">
                {indexOfFirstEntry + index + 1}
              </TableCell>
              <TableCell className="text-black text-lg">
                {contract.number}
              </TableCell>
              <TableCell className="text-black text-lg">
                {contract.date}
              </TableCell>
              <TableCell className="text-black text-lg">
                {getStatusBadge(contract.status)}
              </TableCell>
              <TableCell className="text-black text-lg">
                {contract.department}
              </TableCell>
              <TableCell className="text-black text-lg">
                {contract.customerCode}
              </TableCell>
              <TableCell className="text-black text-lg">
                {contract.customerInfo}
              </TableCell>
              <TableCell className="text-black text-lg">
                <NextImage
                  src="/eye.png"
                  alt="eye"
                  className="w-[24px] h-[24px]"
                />
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
