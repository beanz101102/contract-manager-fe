"use client"

import React, { useState } from "react"
import { Eye, Filter, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
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

const SignatureManagementInterface = () => {
  const [isOpenDigitalSignature, setIsOpenDigitalSignature] = useState(false)

  const signatures = [
    {
      id: 1,
      date: "23/06/2024",
      type: "Ký trực tiếp",
      department: "Nhân sự",
      position: "Phó giám đốc",
      signature: "SM_signature.png",
    },
    {
      id: 2,
      date: "20/02/2022",
      type: "Ký trực tiếp",
      department: "Nhân sự",
      position: "Nhân viên",
      signature: "signature.png",
    },
  ]

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Chữ ký cá nhân</h1>

      <div className="flex justify-between items-center mb-4">
        <div className="flex-1 mr-4">
          <Input
            placeholder="Mã/ Số hợp đồng"
            style={{
              border: "1px solid #D9D9D9",
            }}
            className="bg-white rounded w-fit"
          />
        </div>

        <Button
          className="bg-[#4BC5BE] rounded text-white hover:bg-[#2ea39d]"
          onClick={() => setIsOpenDigitalSignature(true)}
        >
          <Plus className="w-4 h-4" /> Thêm mới
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-[#F5F5F5]">
            <TableHead className="w-[50px] text-black text-lg font-semibold">
              STT
            </TableHead>
            <TableHead className="text-black text-lg font-semibold">
              Ngày tạo
            </TableHead>
            <TableHead className="text-black text-lg font-semibold">
              Loại chữ ký
            </TableHead>
            <TableHead className="text-black text-lg font-semibold">
              Phòng ban
            </TableHead>
            <TableHead className="text-black text-lg font-semibold">
              Chức vụ
            </TableHead>
            <TableHead className="text-black text-lg font-semibold">
              Chữ ký
            </TableHead>
            <TableHead className="w-[100px] text-black text-lg font-semibold">
              Thao tác
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {signatures.map((sig, index) => (
            <TableRow key={sig.id}>
              <TableCell className="text-black text-lg font-semibold">
                {index + 1}
              </TableCell>
              <TableCell className="text-black text-lg font-semibold">
                {sig.date}
              </TableCell>
              <TableCell className="text-black text-lg font-semibold">
                {sig.type}
              </TableCell>
              <TableCell className="text-black text-lg font-semibold">
                {sig.department}
              </TableCell>
              <TableCell className="text-black text-lg font-semibold">
                {sig.position}
              </TableCell>
              <TableCell>
                <img
                  src={`/api/placeholder/100/50`}
                  alt="Signature"
                  className="max-h-12"
                />
              </TableCell>
              <TableCell>
                <div className="flex space-x-3">
                  <NextImage src="/eye.png" className="w-6" alt="eye" />
                  <NextImage className="w-6" src="/trash.png" alt="trash" />
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
      <DigitalSignatureModal
        isOpen={isOpenDigitalSignature}
        onOpenChange={setIsOpenDigitalSignature}
      />
    </div>
  )
}

export default SignatureManagementInterface

const DigitalSignatureModal = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}) => {
  const [signature, setSignature] = useState<string | null>(null)

  const handleSignatureUpload = (event: { target: { files: any[] } }) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setSignature(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Chữ ký cá nhân
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="creation-date">Ngày tạo</Label>
              <Input id="creation-date" type="date" defaultValue="2024-07-25" />
            </div>
            <div>
              <Label htmlFor="department">Phòng ban</Label>
              <Input id="department" placeholder="Phòng ban" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="position">Vị trí</Label>
              <Input id="position" placeholder="Vị trí" />
            </div>
            <div>
              <Label htmlFor="signature-type">Loại chữ ký</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="digital">Chữ ký số</SelectItem>
                  <SelectItem value="electronic">Chữ ký điện tử</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Chữ ký</Label>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                className="bg-teal-500 hover:bg-teal-600 text-white"
              >
                Tải lên chữ ký
              </Button>
              <Button
                variant="outline"
                className="bg-teal-500 hover:bg-teal-600 text-white"
              >
                Ký trực tiếp
              </Button>
              <Button
                variant="outline"
                className="bg-teal-500 hover:bg-teal-600 text-white"
              >
                Dấu công ty
              </Button>
            </div>
          </div>

          <div className="border-2 border-dashed border-gray-300 p-4 h-40 flex items-center justify-center">
            {signature ? (
              <img src={signature} alt="Signature" className="max-h-full" />
            ) : (
              <p className="text-gray-400">Chữ ký sẽ hiển thị ở đây</p>
            )}
          </div>

          <div className="flex justify-end">
            <Button className="bg-teal-500 hover:bg-teal-600 text-white">
              Lưu chữ ký
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
