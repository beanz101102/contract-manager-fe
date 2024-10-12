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
            className="pl-8 pr-8"
          />
          <Filter className="h-5 w-5 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <Button
          className="bg-teal-500 hover:bg-teal-600"
          onClick={() => setIsOpenApprovalWorkflow(true)}
        >
          + Thêm mới
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">STT</TableHead>
            <TableHead>Tên luồng duyệt</TableHead>
            <TableHead className="w-[100px]">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSteps.map((step, index) => (
            <TableRow key={step.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{step.name}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Pencil className="h-4 w-4" />
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
