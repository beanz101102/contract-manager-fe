"use client"

import { useEffect, useState } from "react"
import { atom, useAtom } from "jotai"
import { Eye, Filter, Pencil, Plus, Search, X } from "lucide-react"

import { ApprovalFlowsList } from "@/types/api"
import { User } from "@/types/auth"
import { useApprovalFlows } from "@/hooks/useApprovalFlows"
import { useUsers } from "@/hooks/useUsers"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
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

const listApprovalFlows = atom<ApprovalFlowsList[]>([])

export default function ContractApprovalFlow() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isOpenApprovalWorkflow, setIsOpenApprovalWorkflow] = useState(false)
  const { useListApprovalFlows } = useApprovalFlows()
  const { data } = useListApprovalFlows()

  const [approvalFlows, setApprovalFlows] = useAtom(listApprovalFlows)

  useEffect(() => {
    setApprovalFlows(data || [])
  }, [data])

  // const filteredSteps = approvalFlows.filter((step) =>
  //   step.name.toLowerCase().includes(searchTerm.toLowerCase())
  // )

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
          {approvalFlows?.map((step, index) => (
            <TableRow key={step.id} className="hover:bg-[#F5F5F5]">
              <TableCell className="text-black text-lg font-semibold">
                {index + 1}
              </TableCell>
              <TableCell className="text-black text-lg font-semibold">
                {step.action}
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
  const [openUserSelect, setOpenUserSelect] = useState<{
    [key: number]: boolean
  }>({})
  const [searchTerm, setSearchTerm] = useState("")

  const [approvalSteps, setApprovalSteps] = useState<
    Array<{
      step: number
      approvalType: string
      department: string
      approver: User | null
    }>
  >([
    {
      step: 1,
      approvalType: "",
      department: "",
      approver: null,
    },
  ])

  const { useListUsers } = useUsers()
  const { data, isLoading } = useListUsers("employee", 1, 10, searchTerm, null)
  const users = data?.users || []

  const handleAddStep = () => {
    setApprovalSteps((prev) => [
      ...prev,
      {
        step: prev.length + 1,
        approvalType: "",
        department: "",
        approver: null,
      },
    ])
  }

  const handleRemoveStep = (stepIndex: number) => {
    setApprovalSteps((prev) => {
      const newSteps = prev.filter((_, index) => index !== stepIndex)
      // Cập nhật lại số thứ tự các bước
      return newSteps.map((step, index) => ({
        ...step,
        step: index + 1,
      }))
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-6">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-xl font-semibold flex items-center">
            Cấu hình luồng duyệt
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="workflow-name"
                className="text-sm font-medium block mb-2"
              >
                Tên luồng duyệt <span className="text-red-500">(*)</span>
              </Label>
              <Input
                id="workflow-name"
                placeholder="Nhập tên luồng duyệt"
                className="w-full bg-white"
              />
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Danh sách bước duyệt</h3>
              <Button
                variant="outline"
                className="bg-teal-500 hover:bg-teal-600 text-white"
                onClick={handleAddStep}
              >
                <Plus className="mr-2 h-4 w-4" /> Thêm bước duyệt
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[80px] text-center">STT</TableHead>
                  <TableHead className="w-[200px]">Loại duyệt</TableHead>
                  <TableHead className="w-[200px]">Phòng/Ban</TableHead>
                  <TableHead>Người duyệt</TableHead>
                  <TableHead className="w-[100px] text-center">
                    Thao tác
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {approvalSteps.map((step, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-center font-medium">
                      {step.step}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={step.approvalType}
                        onValueChange={(value) => {
                          setApprovalSteps((prev) =>
                            prev.map((s, i) =>
                              i === index ? { ...s, approvalType: value } : s
                            )
                          )
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại duyệt" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="approve">Phê duyệt</SelectItem>
                          <SelectItem value="review">Xem xét</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={step.department}
                        onValueChange={(value) => {
                          setApprovalSteps((prev) =>
                            prev.map((s, i) =>
                              i === index ? { ...s, department: value } : s
                            )
                          )
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn phòng ban" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="legal">Pháp chế</SelectItem>
                          <SelectItem value="hr">Nhân sự</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Popover
                        open={openUserSelect[index]}
                        onOpenChange={(open) => {
                          setOpenUserSelect((prev) => ({
                            ...prev,
                            [index]: open,
                          }))
                        }}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between bg-white"
                          >
                            {step.approver?.fullName || "Chọn người duyệt"}
                            <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[400px] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Tìm kiếm người duyệt..."
                              value={searchTerm}
                              onValueChange={setSearchTerm}
                            />
                            <CommandEmpty>
                              {isLoading
                                ? "Đang tải..."
                                : "Không tìm thấy người duyệt"}
                            </CommandEmpty>
                            <CommandList>
                              <CommandGroup heading="Danh sách người duyệt">
                                {users?.map((user: User) => (
                                  <CommandItem
                                    key={user.id}
                                    value={user.fullName}
                                    onSelect={() => {
                                      setApprovalSteps((prev) =>
                                        prev.map((s, i) =>
                                          i === index
                                            ? { ...s, approver: user }
                                            : s
                                        )
                                      )
                                      setOpenUserSelect((prev) => ({
                                        ...prev,
                                        [index]: false,
                                      }))
                                    }}
                                  >
                                    {user.fullName}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleRemoveStep(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <DialogFooter className="border-t pt-4">
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Lưu lại
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-300 hover:bg-gray-100"
            >
              Thoát
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
