"use client"

import { useState } from "react"
import { Eye, Filter, Pencil, Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
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

type ApprovalStep = {
  id: string
  name: string
}

const approvalSteps: ApprovalStep[] = [
  { id: "1", name: "Pháp chế duyệt" },
  { id: "2", name: "Phòng nhân sự" },
  { id: "3", name: "Phòng giám đốc" },
  { id: "4", name: "Phòng kế toán" },
  { id: "5", name: "Phòng kinh doanh" },
]

export default function ContractApprovalFlow() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isOpenApprovalWorkflow, setIsOpenApprovalWorkflow] = useState(false)
  const filteredSteps = approvalSteps.filter((step) =>
    step.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="bg-white rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-4">Luồng duyệt hợp đồng</h1>
      <div className="flex justify-between mb-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Tên luồng duyệt"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white rounded"
            style={{
              border: "1px solid #D9D9D9",
            }}
          />
        </div>
        <Button
          className="bg-[#4BC5BE] rounded text-white hover:bg-[#2ea39d]"
          onClick={() => setIsOpenApprovalWorkflow(true)}
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
              Tên luồng duyệt
            </TableHead>
            <TableHead className="w-[200px] text-black text-lg font-semibold">
              Thao tác
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSteps.map((step, index) => (
            <TableRow key={step.id} className="hover:bg-[#F5F5F5]">
              <TableCell className="text-black text-lg font-semibold">
                {index + 1}
              </TableCell>
              <TableCell className="text-black text-lg font-semibold">
                {step.name}
              </TableCell>
              <TableCell className="w-[200px]">
                <div className="flex gap-2">
                  <NextImage className="w-6" src="/eye.png" alt="eye" />
                  <NextImage className="w-6" src="/edit.png" alt="pencil" />
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
      <ApprovalWorkflowModal
        isOpen={isOpenApprovalWorkflow}
        onOpenChange={setIsOpenApprovalWorkflow}
      />
    </div>
  )
}

const ApprovalWorkflowModal = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center justify-between">
            Cấu hình luồng duyệt
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="workflow-name" className="text-sm font-medium">
              Tên luồng duyệt <span className="text-red-500">(*)</span>
            </Label>
            <Input
              id="workflow-name"
              placeholder="Tên luồng duyệt"
              className="mt-1"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">BƯỚC</TableHead>
                <TableHead>LOẠI DUYỆT</TableHead>
                <TableHead>PHÒNG/BAN</TableHead>
                <TableHead>NGƯỜI DUYỆT</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Placeholder row - you would map over your actual data here */}
              <TableRow>
                <TableCell className="text-center">1</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button
            variant="outline"
            className="bg-teal-500 hover:bg-teal-600 text-white"
          >
            <Plus className="mr-2 h-4 w-4" /> Thêm bước duyệt
          </Button>
          <div>
            <Button
              variant="outline"
              className="mr-2 bg-blue-500 hover:bg-blue-600 text-white"
            >
              Lưu lại
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Thoát
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
