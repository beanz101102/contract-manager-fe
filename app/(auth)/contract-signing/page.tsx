"use client"

import { useState } from "react"
import { Check, Download, Eye, Filter, Pencil } from "lucide-react"

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

type Contract = {
  id: string
  contractNumber: string
  creationDate: string
  department: string
  customerCode: string
  customerInfo: {
    name: string
    phone: string
  }
}

const contracts: Contract[] = [
  {
    id: "1",
    contractNumber: "22/07/2023/HD-BE/BN",
    creationDate: "22/07/2023",
    department: "Phòng pháp lý",
    customerCode: "KH0005",
    customerInfo: {
      name: "Nguyễn Thanh Thành",
      phone: "0867352637",
    },
  },
  {
    id: "2",
    contractNumber: "22/07/2023/HD-NA/MN",
    creationDate: "22/07/2023",
    department: "Phòng nhân sự",
    customerCode: "KH0007",
    customerInfo: {
      name: "Phạm Nguyễn Thanh",
      phone: "0973647283",
    },
  },
  // Add more contract data here...
]

export default function ContractSigning() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedContracts, setSelectedContracts] = useState<string[]>([])

  const filteredContracts = contracts.filter((contract) =>
    contract.contractNumber.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelectAll = () => {
    setSelectedContracts(filteredContracts.map((contract) => contract.id))
  }

  const handleSelectOne = (contractId: string) => {
    setSelectedContracts((prev) =>
      prev.includes(contractId)
        ? prev.filter((id) => id !== contractId)
        : [...prev, contractId]
    )
  }

  return (
    <div className="bg-white rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-4">Ký hợp đồng</h1>
      <div className="flex justify-between mb-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Mã/ Số hợp đồng"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white rounded"
            style={{
              border: "1px solid #D9D9D9",
            }}
          />
        </div>
        <div className="flex gap-2">
          <Button className="bg-[#4BC5BE] rounded text-white hover:bg-[#2ea39d]">
            <Check className="w-4 h-4" /> Ký hợp đồng
          </Button>
          <Button className="bg-[#C1C1C1] rounded text-white hover:bg-[#a1a1a1]">
            <Pencil className="w-4 h-4" /> Yêu cầu sửa
          </Button>
          <Button className="bg-[#C1C1C1] rounded text-white hover:bg-[#a1a1a1]">
            <Download className="w-4 h-4" /> Tải
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-[#F5F5F5]">
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedContracts.length === filteredContracts.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead className="w-[50px] text-black text-lg font-semibold">
              STT
            </TableHead>
            <TableHead className="text-black text-lg font-semibold">
              Số hợp đồng
            </TableHead>
            <TableHead className="text-black text-lg font-semibold">
              Ngày tạo hợp đồng
            </TableHead>
            <TableHead className="text-black text-lg font-semibold">
              Phòng ban
            </TableHead>
            <TableHead className="text-black text-lg font-semibold">
              Mã khách hàng
            </TableHead>
            <TableHead className="text-black text-lg font-semibold">
              Thông tin khách hàng
            </TableHead>
            <TableHead className="text-black text-lg font-semibold">
              Thao tác
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredContracts.map((contract, index) => (
            <TableRow key={contract.id} className="hover:bg-[#F5F5F5]">
              <TableCell>
                <Checkbox
                  checked={selectedContracts.includes(contract.id)}
                  onCheckedChange={() => handleSelectOne(contract.id)}
                />
              </TableCell>
              <TableCell className="text-black text-lg font-semibold">
                {index + 1}
              </TableCell>
              <TableCell className="text-black text-lg font-semibold">
                {contract.contractNumber}
              </TableCell>
              <TableCell className="text-black text-lg font-semibold">
                {contract.creationDate}
              </TableCell>
              <TableCell className="text-black text-lg font-semibold">
                {contract.department}
              </TableCell>
              <TableCell className="text-black text-lg font-semibold">
                {contract.customerCode}
              </TableCell>
              <TableCell className="text-black text-lg font-semibold">
                <div>{contract.customerInfo.name}</div>
                <div>{contract.customerInfo.phone}</div>
              </TableCell>
              <TableCell>
                <NextImage src="/eye.png" alt="eye" className="w-6" />
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
