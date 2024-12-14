"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Plus, Search, X } from "lucide-react"

import { ApprovalFlowStep, ApprovalFlowsList } from "@/types/api"
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const ApprovalWorkflowModal = ({
  isOpen,
  onOpenChange,
  mode = "create",
  initialData = null,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  mode?: "create" | "edit"
  initialData?: ApprovalFlowsList | null
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

  useEffect(() => {
    return () => {
      setApprovalSteps([
        {
          step: 1,
          approvalType: "",
          department: "",
          approver: null,
        },
      ])
      setOpenUserSelect({})
      setSearchTerm("")
      setName("")
    }
  }, [isOpen])

  const { useListUsers } = useUsers()
  const { data, isLoading } = useListUsers(null, 1, 20, searchTerm, null)
  const users = data?.users?.filter((user) => user.role !== "customer") || []

  const { useAddApprovalFlow, useUpdateApprovalFlow } = useApprovalFlows()

  const { mutate: addApprovalFlow } = useAddApprovalFlow(() => {
    onOpenChange(false)
  })

  const { mutate: updateApprovalFlow } = useUpdateApprovalFlow(() => {
    onOpenChange(false)
  })

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setName(initialData.name)
      setApprovalSteps(
        initialData.steps.map((step: any) => ({
          step: step.stepOrder,
          approvalType: "",
          department: step.department?.departmentName || "",
          departmentId: step.department?.id,
          approver: step.approver,
        }))
      )
    }
  }, [mode, initialData])

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
      return newSteps.map((step, index) => ({
        ...step,
        step: index + 1,
      }))
    })
  }

  const { user } = useAuth()

  const handleSaveApprovalFlow = () => {
    const payload = {
      name,
      id: user?.id || 0,
      steps: approvalSteps.map((step: any) => ({
        departmentId: step.departmentId ?? step.approver?.department?.id,
        approverId: step.approver?.id,
        stepOrder: step.step,
      })) as ApprovalFlowStep[],
    }

    if (mode === "edit" && initialData) {
      updateApprovalFlow({ ...payload, id: initialData.id })
    } else {
      addApprovalFlow(payload)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-6">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-xl font-semibold">
            {mode === "edit" ? "Chỉnh sửa luồng duyệt" : "Thêm mới luồng duyệt"}
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
                      {step.approver?.department?.departmentName ||
                        step?.department ||
                        "--"}
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
                            variant="outline2"
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
              {mode === "edit" ? "Cập nhật" : "Lưu lại"}
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-300 hover:bg-gray-100"
            >
              Đóng
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ApprovalWorkflowModal
