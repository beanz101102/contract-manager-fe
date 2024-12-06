"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { atom, useAtom } from "jotai"
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
import { Loading } from "@/components/ui/loading"
import NextImage from "@/components/ui/next-img"
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
import ApprovalWorkflowModal from "@/components/ApprovalWorkflowModal"

const listApprovalFlows = atom<ApprovalFlowsList[]>([])

export default function ContractApprovalFlow() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isOpenApprovalWorkflow, setIsOpenApprovalWorkflow] = useState(false)
  const [selectedFlow, setSelectedFlow] = useState<ApprovalFlowsList | null>(
    null
  )
  const [isOpenViewModal, setIsOpenViewModal] = useState(false)
  const [isOpenEditModal, setIsOpenEditModal] = useState(false)
  const { user } = useAuth()

  const { useListApprovalFlows, useDeleteApprovalFlow } = useApprovalFlows()
  const { data, isLoading } = useListApprovalFlows(searchTerm)
  const [approvalFlows, setApprovalFlows] = useAtom(listApprovalFlows)
  const { mutate: deleteApprovalFlow } = useDeleteApprovalFlow()

  useEffect(() => {
    setApprovalFlows(data || [])
  }, [data, setApprovalFlows])

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
            <Search className="h-5 w-5 text-white" />
          </div>
        </div>

        {(user?.role === "admin" || user?.role === "manager") && (
          <Button
            className="bg-[#4BC5BE] hover:bg-[#3DA8A2] rounded-md text-white font-medium px-4 py-2 transition-colors"
            onClick={() => setIsOpenApprovalWorkflow(true)}
          >
            <Plus className="w-4 h-4 mr-2" /> Thêm mới
          </Button>
        )}
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
                      <div
                        className="cursor-pointer"
                        onClick={() => {
                          setSelectedFlow(step)
                          setIsOpenViewModal(true)
                        }}
                      >
                        <NextImage
                          src="/eye.png"
                          alt="eye"
                          className="w-6 h-6 opacity-80 hover:opacity-100 transition-opacity"
                        />
                      </div>
                      <div
                        className="cursor-pointer"
                        onClick={() => {
                          setSelectedFlow(step)
                          setIsOpenEditModal(true)
                        }}
                      >
                        <NextImage
                          src="/edit.png"
                          alt="edit"
                          className="w-6 h-6 opacity-80 hover:opacity-100 transition-opacity"
                        />
                      </div>
                      <div
                        className="cursor-pointer"
                        onClick={() => {
                          deleteApprovalFlow(step.id)
                        }}
                      >
                        <NextImage
                          src="/trash.png"
                          className="w-6 h-6 opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                          alt="trash"
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

      <ApprovalWorkflowModal
        isOpen={isOpenEditModal}
        onOpenChange={setIsOpenEditModal}
        mode="edit"
        initialData={selectedFlow}
      />

      <ViewApprovalWorkflowModal
        isOpen={isOpenViewModal}
        onOpenChange={setIsOpenViewModal}
        data={selectedFlow}
      />
    </div>
  )
}

const ViewApprovalWorkflowModal = ({
  isOpen,
  onOpenChange,
  data,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  data: ApprovalFlowsList | null
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-6">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-xl font-semibold">
            Chi tiết luồng duyệt
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <Label className="text-sm font-medium block mb-2">
              Tên luồng duyệt
            </Label>
            <p className="text-gray-700">{data?.name}</p>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-4">Danh sách bước duyệt</h3>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[80px] text-center">STT</TableHead>
                  <TableHead>Phòng/Ban</TableHead>
                  <TableHead>Người duyệt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.steps?.map((step, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-center">
                      {step.stepOrder}
                    </TableCell>
                    <TableCell>{step.department?.departmentName}</TableCell>
                    <TableCell>{step.approver?.fullName}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <DialogFooter className="border-t pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-300 hover:bg-gray-100"
          >
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}