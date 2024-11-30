"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/dist/client/router"
import { useAuth } from "@/contexts/auth-context"
import { TabsList } from "@radix-ui/react-tabs"
import dayjs from "dayjs"
import { atom, useAtom } from "jotai"
import { Check, Download, Info, Pencil } from "lucide-react"
import toast from "react-hot-toast"
import InfiniteScroll from "react-infinite-scroll-component"

import { ContractList, mapiContractStatus } from "@/types/api"
import { useContracts } from "@/hooks/useContracts"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import DetailContract from "@/components/DetailContract"

const contractListAtom = atom<ContractList[]>([])

export default function ContractApproval() {
  const [searchTerm, setSearchTerm] = useState("")
  const { useAllContracts } = useContracts()
  const [page, setPage] = useState(1)
  const { user } = useAuth()
  const [contractId, setContractId] = useState(0)
  const { data: contracts, isLoading } = useAllContracts(
    searchTerm,
    page,
    10,
    null,
    user?.id,
    "pending_approval"
  )

  const [contractList, setContractList] = useAtom(contractListAtom)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    if (contracts) {
      setHasMore(contracts.length >= 10)
      if (page === 1) {
        setContractList(contracts)
      } else {
        setContractList((prev) => [...prev, ...contracts])
      }
    }
  }, [contracts, page])

  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEmployees(
        contractList
          ?.filter(
            (contract) => !contract.approvedUserIds.includes(user?.id || 0)
          )
          .map((contract) => contract.id) || []
      )
    } else {
      setSelectedEmployees([])
    }
  }

  const handleSelectOne = (employeeId: number) => {
    setSelectedEmployees((prev) =>
      prev.includes(employeeId)
        ? prev.filter((id) => id !== employeeId)
        : [...prev, employeeId]
    )
  }

  const [isOpen, setIsOpen] = useState(false)
  const [isOpenEditRequest, setIsOpenEditRequest] = useState(false)
  const [isOpenContractInfo, setIsOpenContractInfo] = useState(false)

  return (
    <>
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
        <div className="overflow-x-auto">
          <InfiniteScroll
            dataLength={contractList?.length || 0}
            next={() => setPage(page + 1)}
            hasMore={hasMore}
            loader={null}
            className="min-w-full"
          >
            <Table className="min-w-[1200px] w-full">
              <TableHeader>
                <TableRow className="hover:bg-gray-50 bg-gray-100">
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={
                        selectedEmployees.length ===
                        contractList?.filter(
                          (contract) =>
                            !contract.approvedUserIds.includes(user?.id || 0)
                        ).length
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="w-[60px] text-gray-700 font-semibold">
                    STT
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold">
                    Số hợp đồng
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold">
                    Ngày tạo hợp đồng
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold">
                    Trạng thái
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold">
                    Phòng ban
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold">
                    Mã khách
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold">
                    Thao tác
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contractList?.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={8} className="text-center py-16">
                      <div className="flex flex-col items-center gap-3">
                        {isLoading ? (
                          <Loading />
                        ) : (
                          <>
                            <NextImage
                              src="/empty-state.png"
                              alt="No data"
                              className="w-[200px] h-[200px] opacity-50"
                            />
                            <p className="text-gray-500 text-lg">
                              Không có dữ liệu hợp đồng
                            </p>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  contractList?.map((contract, index) => (
                    <TableRow
                      key={contract.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <DetailContract
                        id={contract.id}
                        isOpen={isOpenContractInfo}
                        onOpenChange={setIsOpenContractInfo}
                      />
                      <TableCell>
                        <Checkbox
                          checked={selectedEmployees.includes(contract.id)}
                          onCheckedChange={() => handleSelectOne(contract.id)}
                          disabled={contract.approvedUserIds.includes(
                            user?.id || 0
                          )}
                        />
                      </TableCell>
                      <TableCell className="text-gray-700 text-base">
                        {index + 1}
                      </TableCell>
                      <TableCell className="text-gray-700 text-base">
                        {contract.contractNumber}
                      </TableCell>
                      <TableCell className="text-gray-700 text-base">
                        {dayjs(contract.createdAt).format("DD/MM/YYYY")}
                      </TableCell>
                      <TableCell>
                        <span
                          className="px-3 py-1 rounded-full text-sm font-medium"
                          style={{
                            ...mapiContractStatus[
                              contract.approvedUserIds.includes(user?.id || 0)
                                ? "approved_by_me"
                                : "waiting_for_approval"
                            ].color,
                          }}
                        >
                          {
                            mapiContractStatus[
                              contract.approvedUserIds.includes(user?.id || 0)
                                ? "approved_by_me"
                                : "waiting_for_approval"
                            ].label
                          }
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-700 text-base">
                        {contract.createdBy?.department?.departmentName}
                      </TableCell>
                      <TableCell className="text-gray-700 text-base">
                        {contract.customer.code}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-3 items-center">
                          <div
                            onClick={() => {
                              setContractId(contract.id)
                              setIsOpenContractInfo(true)
                            }}
                            className="cursor-pointer"
                          >
                            <NextImage
                              src="/eye.png"
                              alt="eye"
                              className="w-6 h-6 opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                            />
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </InfiniteScroll>
        </div>
        <ModalConfirm
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          selectedEmployees={selectedEmployees}
        />
        <EditRequestModal
          isOpen={isOpenEditRequest}
          onOpenChange={setIsOpenEditRequest}
          selectedEmployees={selectedEmployees}
        />
      </div>
      <DetailContract
        isOpen={isOpenContractInfo}
        onOpenChange={setIsOpenContractInfo}
        id={contractId}
      />
    </>
  )
}

const ModalConfirm = ({
  isOpen,
  onOpenChange,
  selectedEmployees,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  selectedEmployees: number[]
}) => {
  const { user } = useAuth()
  const { useApproveContract } = useContracts()
  const { mutate: approveContract } = useApproveContract()
  const [contractComments, setContractComments] = useState<{
    [key: number]: string
  }>({})
  const [contractList] = useAtom(contractListAtom)

  const selectedContracts = contractList.filter((contract) =>
    selectedEmployees.includes(contract.id)
  )

  const handleApprove = () => {
    approveContract({
      contracts: selectedEmployees.map((id) => ({
        contractId: id,
        comments: contractComments[id] || "",
      })),
      status: "approved",
      approverId: user?.id || 0,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] !rounded-xl bg-white shadow-lg">
        <DialogHeader className="flex flex-col items-center pb-6 border-b">
          <div className="bg-emerald-100 rounded-full p-3 mb-4">
            <Info className="text-emerald-600 h-7 w-7" />
          </div>
          <DialogTitle className="text-2xl font-semibold text-gray-900">
            Xác nhận duyệt hợp đồng
          </DialogTitle>
          <p className="text-gray-500 mt-2 text-center">
            Vui lòng kiểm tra và nhập nhận xét cho các hợp đồng được chọn
          </p>
        </DialogHeader>

        <div className="max-h-[400px] overflow-y-auto my-6">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-gray-700 font-medium">STT</TableHead>
                <TableHead className="text-gray-700 font-medium">
                  Số hợp đồng
                </TableHead>
                <TableHead className="text-gray-700 font-medium">
                  Mã khách
                </TableHead>
                <TableHead className="text-gray-700 font-medium">
                  Nhận xét
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedContracts.map((contract, index) => (
                <TableRow key={contract.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-700">
                    {index + 1}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {contract.contractNumber}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {contract.customer.code}
                  </TableCell>
                  <TableCell className="w-[300px]">
                    <Input
                      placeholder="Nhập nhận xét cho hợp đồng này"
                      value={contractComments[contract.id] || ""}
                      onChange={(e) =>
                        setContractComments((prev) => ({
                          ...prev,
                          [contract.id]: e.target.value,
                        }))
                      }
                      className="bg-white border-gray-200 focus:border-emerald-500 focus:ring-emerald-200"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <DialogFooter className="flex justify-center gap-3 pt-6 border-t">
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="min-w-[120px] bg-white hover:bg-gray-50 border-gray-200"
          >
            Hủy bỏ
          </Button>
          <Button
            onClick={() => {
              handleApprove()
              onOpenChange(false)
            }}
            className="min-w-[120px] bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            Xác nhận duyệt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export const EditRequestModal = ({
  isOpen,
  onOpenChange,
  selectedEmployees,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  selectedEmployees: number[]
}) => {
  const { user } = useAuth()
  const { useApproveContract } = useContracts()
  const { mutate: rejectContract } = useApproveContract()
  const [reason, setReason] = useState("")
  const [contractList] = useAtom(contractListAtom)

  const handleReject = () => {
    rejectContract({
      contracts: selectedEmployees.map((id) => ({
        contractId: id,
        comments: reason,
      })),
      status: "rejected",
      approverId: user?.id || 0,
    })
    onOpenChange(false)
  }

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
              value={reason}
              onChange={(e) => setReason(e.target.value)}
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
          <Button
            className="bg-teal-500 hover:bg-teal-600 text-white"
            onClick={handleReject}
            disabled={!reason.trim()}
          >
            Gửi yêu cầu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
