"use client"

import { useState } from "react"
import { Eye, FileText, Filter, Mail, Pencil } from "lucide-react"

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

type Contract = {
  id: string
  contractNumber: string
  creationDate: string
  status: "Hoàn thành" | "Tạo mới"
  department: string
  clientCode: string
}

const contracts: Contract[] = [
  {
    id: "1",
    contractNumber: "22/07/2023/HD-BE/BN",
    creationDate: "22/07/2023",
    status: "Hoàn thành",
    department: "Phòng pháp lý",
    clientCode: "KH000",
  },
  {
    id: "2",
    contractNumber: "22/07/2023/HD-NA/MN",
    creationDate: "22/07/2023",
    status: "Tạo mới",
    department: "Phòng nhân sự",
    clientCode: "KH000",
  },
  // Add more contract data here...
]

export default function IndividualManagement() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredContracts = contracts.filter((contract) =>
    contract.contractNumber.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="mx-auto p-6 bg-white rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Cá nhân quản lý</h1>
      <div className="flex justify-between mb-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Mã/ Số hợp đồng"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-8"
          />
          <Filter className="h-5 w-5 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <div className="flex gap-2">
          <Button className="bg-teal-500 hover:bg-teal-600">+ Thêm mới</Button>
          <Button variant="outline">Gửi duyệt</Button>
          <Button variant="destructive">X Xóa</Button>
          <Button variant="outline">↓ Tải</Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Input type="checkbox" className="w-4 h-4" />
            </TableHead>
            <TableHead className="w-[50px]">STT</TableHead>
            <TableHead>Số hợp đồng</TableHead>
            <TableHead>Ngày tạo hợp đồng</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Phòng ban</TableHead>
            <TableHead>Mã khách</TableHead>
            <TableHead>Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredContracts.map((contract, index) => (
            <TableRow key={contract.id}>
              <TableCell>
                <Input type="checkbox" className="w-4 h-4" />
              </TableCell>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{contract.contractNumber}</TableCell>
              <TableCell>{contract.creationDate}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    contract.status === "Hoàn thành"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {contract.status}
                </span>
              </TableCell>
              <TableCell>{contract.department}</TableCell>
              <TableCell>{contract.clientCode}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <FileText className="h-4 w-4" />
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
          <Button
            variant="outline"
            size="sm"
            className="bg-teal-500 text-white"
          >
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
