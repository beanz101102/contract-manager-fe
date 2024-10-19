"use client"

import { useState } from "react"
import { Eye, Filter } from "lucide-react"

import { Badge } from "@/components/ui/badge"
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
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Tra cứu hợp đồng</h1>
      <div className="flex justify-between items-center mb-4">
        <div className="relative flex-1 max-w-sm">
          <Input
            type="text"
            placeholder="Mã/ Số hợp đồng"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10 py-2"
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
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>STT</TableHead>
            <TableHead>Số hợp đồng</TableHead>
            <TableHead>Ngày tạo hợp đồng</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Phòng ban</TableHead>
            <TableHead>Mã khách hàng</TableHead>
            <TableHead>Thông tin khách hàng</TableHead>
            <TableHead>Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentEntries.map((contract, index) => (
            <TableRow key={contract.id}>
              <TableCell>{indexOfFirstEntry + index + 1}</TableCell>
              <TableCell>{contract.number}</TableCell>
              <TableCell>{contract.date}</TableCell>
              <TableCell>{getStatusBadge(contract.status)}</TableCell>
              <TableCell>{contract.department}</TableCell>
              <TableCell>{contract.customerCode}</TableCell>
              <TableCell>{contract.customerInfo}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
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
        <div>Tổng số bản ghi: {filteredContracts.length}</div>
      </div>
    </div>
  )
}
