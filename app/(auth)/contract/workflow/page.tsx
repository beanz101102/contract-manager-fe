"use client"

import { useEffect, useState } from "react"
import { atom, useAtom } from "jotai"
import { Eye, Filter, Pencil, Plus, Search, X } from "lucide-react"

import { ApprovalFlow, ApprovalFlowStep, ApprovalFlowsList } from "@/types/api"
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
import { Loading } from "@/components/ui/loading"
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
  const { data, isLoading } = useListApprovalFlows(searchTerm)

  const [approvalFlows, setApprovalFlows] = useAtom(listApprovalFlows)

  useEffect(() => {
    setApprovalFlows(data || [])
  }, [data])

  return (
    <div className="p-8 bg-white rounded-xl shadow-sm">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Luồng duyệt hợp đồng
      </h1>

      <div className="flex justify-between mb-6">
        <div className="relative w-[280px]">
          <Input
            type="text"
            placeholder="Tên luồng duyệt"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-[42px] w-full rounded-md bg-white border-[#4BC5BE] focus:ring-2 focus:ring-[#4BC5BE]/20"
          />
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-[42px] w-[42px] flex items-center justify-center bg-[#4BC5BE] rounded-l-md">
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

        <Button
          className="bg-[#4BC5BE] hover:bg-[#3DA8A2] rounded-md text-white font-medium px-4 py-2 transition-colors"
          onClick={() => setIsOpenApprovalWorkflow(true)}
        >
          <Plus className="w-4 h-4 mr-2" /> Thêm mới
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-[800px] w-full">
          <TableHeader>
            <TableRow className="hover:bg-gray-50 bg-gray-100">
              <TableHead className="w-[80px] text-gray-700 font-semibold">
                STT
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Tên luồng duyệt
              </TableHead>
              <TableHead className="w-[200px] text-gray-700 font-semibold">
                Thao tác
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {approvalFlows?.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={3} className="text-center py-16">
                  <div className="flex flex-col items-center gap-4">
                    {isLoading ? (
                      <Loading />
                    ) : (
                      <>
                        <NextImage
                          src="/empty-state.png"
                          alt="No data"
                          className="w-[240px] h-[240px] opacity-40"
                        />
                        <p className="text-gray-500 text-base">
                          Không có dữ liệu luồng duyệt
                        </p>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              approvalFlows?.map((step, index) => (
                <TableRow
                  key={step.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="text-gray-700 text-base">
                    {index + 1}
                  </TableCell>
                  <TableCell className="text-gray-700 text-base">
                    {step.name}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-3">
                      <div className="cursor-pointer">
                        <NextImage
                          src="/eye.png"
                          alt="eye"
                          className="w-6 h-6 opacity-80 hover:opacity-100 transition-opacity"
                        />
                      </div>
                      <div className="cursor-pointer">
                        <NextImage
                          src="/edit.png"
                          alt="edit"
                          className="w-6 h-6 opacity-80 hover:opacity-100 transition-opacity"
                        />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
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
  const [name, setName] = useState("")

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

  const { useAddApprovalFlow } = useApprovalFlows()
  const { mutate: addApprovalFlow } = useAddApprovalFlow(() => {
    onOpenChange(false)
  })

  const handleSaveApprovalFlow = () => {
    addApprovalFlow({
      name,
      steps: approvalSteps.map((step) => ({
        departmentId: step.approver?.department?.id,
        approverId: step.approver?.id,
        stepOrder: step.step,
      })) as ApprovalFlowStep[],
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
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                    <TableCell>Trực tiếp</TableCell>
                    <TableCell>
                      {step.approver?.department?.departmentName || "--"}
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
              onClick={handleSaveApprovalFlow}
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
