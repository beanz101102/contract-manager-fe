"use client"

import React, { useState } from "react"
import { TabsList } from "@radix-ui/react-tabs"
import { Check, Download, Eye, Filter, Info, Pencil } from "lucide-react"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

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
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenEditRequest, setIsOpenEditRequest] = useState(false)
  const [isOpenContractInfo, setIsOpenContractInfo] = useState(false)
  const filteredContracts = contracts.filter((contract) =>
    contract.contractNumber.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEmployees(
        filteredContracts.map((contract, index) => index.toString())
      )
    } else {
      setSelectedEmployees([])
    }
  }

  const handleSelectOne = (employeeId: string) => {
    setSelectedEmployees((prev) =>
      prev.includes(employeeId)
        ? prev.filter((id) => id !== employeeId)
        : [...prev, employeeId]
    )
  }

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
            className="bg-white rounded"
            style={{
              border: "1px solid #D9D9D9",
            }}
          />
        </div>
        <div className="flex gap-2">
          <Button
            className="bg-[#4BC5BE] rounded text-white hover:bg-[#2ea39d]"
            onClick={() => setIsOpen(true)}
          >
            <Check className="w-4 h-4" /> Duyệt hợp đồng
          </Button>
          <Button
            className="bg-[#C1C1C1] rounded text-white hover:bg-[#a1a1a1]"
            onClick={() => setIsOpenEditRequest(true)}
          >
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
                checked={selectedEmployees.length === filteredContracts.length}
                onCheckedChange={handleSelectAll}
              />{" "}
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
                  checked={selectedEmployees.includes(index.toString())}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleSelectOne(index.toString())
                    } else {
                      handleSelectOne(index.toString())
                    }
                  }}
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
                <div onClick={() => setIsOpenContractInfo(true)}>
                  <NextImage
                    src="/eye.png"
                    alt="eye"
                    className="w-[24px] h-[24px]"
                  />
                </div>
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
      <ModalConfirm isOpen={isOpen} onOpenChange={setIsOpen} />
      <EditRequestModal
        isOpen={isOpenEditRequest}
        onOpenChange={setIsOpenEditRequest}
      />
      <ContractInfoModal
        isOpen={isOpenContractInfo}
        onOpenChange={setIsOpenContractInfo}
      />
    </div>
  )
}

const ModalConfirm = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] !rounded-lg">
        <DialogHeader className="flex flex-col items-center">
          <div className="bg-teal-500 rounded-full p-2 mb-4">
            <Info className="text-white h-6 w-6" />
          </div>
          <DialogTitle className="text-xl font-semibold">Thông báo</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-center">
          Bạn chắc chắn muốn duyệt các hợp đồng đã chọn
        </DialogDescription>
        <DialogFooter className="sm:justify-center">
          <Button
            onClick={() => {
              onOpenChange(false)
              toast.success("Duyệt hợp đồng thành công")
            }}
            className="bg-teal-500 hover:bg-teal-600 text-white w-full sm:w-auto"
          >
            Duyệt hợp đồng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const EditRequestModal = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Yêu cầu sửa lại
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="reason" className="font-medium">
              Lý do yêu cầu <span className="text-red-500">(*)</span>
            </Label>
            <Textarea
              id="reason"
              placeholder="Nhập lý do yêu cầu sửa lại"
              className="min-h-[100px] bg-white !rounded-lg !border-1 !border-gray-300"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="file-upload" className="font-medium">
              Tệp đính kèm
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
              <Button
                variant="outline"
                className="w-full bg-teal-500 text-white hover:bg-teal-600"
              >
                Tệp đính kèm
              </Button>
              <p className="text-sm text-gray-500 mt-2 text-center">
                (pdf, doc, docx, xlsx, xls, png, jpg, jpeg)
              </p>
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-gray-100 hover:bg-gray-200 text-black"
          >
            Đóng
          </Button>
          <Button className="bg-teal-500 hover:bg-teal-600 text-white">
            Gửi yêu cầu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const ContractInfoModal = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}) => {
  const [activeTab, setActiveTab] = useState("info")

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="info" className="flex-1">
              Thông tin hợp đồng
            </TabsTrigger>
            <TabsTrigger value="view" className="flex-1">
              Xem hợp đồng
            </TabsTrigger>
          </TabsList>
          <TabsContent value="info" className="p-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Thông tin chung</h3>
                <div className="grid grid-cols-2 gap-2">
                  <p>Ngày tạo: 22/05/2024</p>
                  <p>Người tạo: Nguyễn Trúc Văn</p>
                  <p>Trạng thái: Đã hoàn thành</p>
                  <p>Diễn giải: Hợp đồng mua nhà chung cư</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold">Thông tin khác</h3>
                <div>
                  <p>Nhận xét:</p>
                  <Button variant="outline" className="mt-2">
                    Tệp đính kèm
                  </Button>
                </div>
              </div>
              <div>
                <h3 className="font-semibold">Quá trình xử lý</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>STT</TableHead>
                      <TableHead>Thao tác</TableHead>
                      <TableHead>Người thực hiện</TableHead>
                      <TableHead>Chức vụ</TableHead>
                      <TableHead>Phòng ban</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Ngày thực hiện</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>{/* Add table rows here */}</TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="view" className="p-4">
            <div className="bg-gray-100 p-4 h-[500px] flex items-center justify-center">
              Contract PDF Viewer Placeholder
            </div>
          </TabsContent>
        </Tabs>
        <div className="p-4 flex justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-gray-100 hover:bg-gray-200 text-black"
          >
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
