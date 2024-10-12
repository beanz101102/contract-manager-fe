"use client"

import { useState } from "react"
import { Eye, Filter } from "lucide-react"

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
  {
    id: "3",
    contractNumber: "22/07/2023/HD-HM/MN",
    creationDate: "22/07/2023",
    department: "Phòng pháp lý",
    customerCode: "KH0034",
    customerInfo: {
      name: "Nguyễn Thanh Thành",
      phone: "0867352637",
    },
  },
  {
    id: "4",
    contractNumber: "22/07/2023/HD-KA/MN",
    creationDate: "22/07/2023",
    department: "Phòng hành chính",
    customerCode: "KH0015",
    customerInfo: {
      name: "Phạm Nguyễn Thanh",
      phone: "0973647283",
    },
  },
  {
    id: "5",
    contractNumber: "22/07/2023/HD-DH/BN",
    creationDate: "22/07/2023",
    department: "Phòng hành chính",
    customerCode: "KH0047",
    customerInfo: {
      name: "Nguyễn Thanh Thành",
      phone: "0867352637",
    },
  },
  {
    id: "6",
    contractNumber: "22/07/2023/HD-NH/MN",
    creationDate: "22/07/2023",
    department: "Phòng pháp lý",
    customerCode: "KH0014",
    customerInfo: {
      name: "Phạm Nguyễn Thanh",
      phone: "0973647283",
    },
  },
  {
    id: "7",
    contractNumber: "22/07/2023/HD-KC/BN",
    creationDate: "22/07/2023",
    department: "Phòng pháp lý",
    customerCode: "KH0305",
    customerInfo: {
      name: "Nguyễn Thanh Thành",
      phone: "0867352637",
    },
  },
  {
    id: "8",
    contractNumber: "22/07/2023/HD-PH/MN",
    creationDate: "22/07/2023",
    department: "Phòng hành chính",
    customerCode: "KH0107",
    customerInfo: {
      name: "Phạm Nguyễn Thanh",
      phone: "0973647283",
    },
  },
]

export default function ContractApproval() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredContracts = contracts.filter((contract) =>
    contract.contractNumber.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="bg-white rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-4">Duyệt hợp đồng</h1>
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
          <Button className="bg-teal-500 hover:bg-teal-600">
            ✓ Duyệt hợp đồng
          </Button>
          <Button
            variant="outline"
            className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
          >
            Yêu cầu sửa
          </Button>
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
            <TableHead>Phòng ban</TableHead>
            <TableHead>Mã khách hàng</TableHead>
            <TableHead>Thông tin khách hàng</TableHead>
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
              <TableCell>{contract.department}</TableCell>
              <TableCell>{contract.customerCode}</TableCell>
              <TableCell>
                <div>{contract.customerInfo.name}</div>
                <div>{contract.customerInfo.phone}</div>
              </TableCell>
              <TableCell>
                <Button variant="outline" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
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
