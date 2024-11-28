"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import dayjs from "dayjs"
import { atom, useAtom } from "jotai"
import { Check, Download, Pencil } from "lucide-react"
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

const contractListAtom = atom<ContractList[]>([])

export default function ContractSigning() {
  const [searchTerm, setSearchTerm] = useState("")
  const { useAllContracts } = useContracts()
  const [page, setPage] = useState(1)
  const { user } = useAuth()
  const { data: contracts, isLoading } = useAllContracts(
    searchTerm,
    page,
    10,
    null,
    user?.id,
    "ready_to_sign"
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
  const [isOpenSignModal, setIsOpenSignModal] = useState(false)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEmployees(
        contractList
          ?.filter(
            (contract) => !contract.signedUserIds.includes(user?.id || 0)
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

  return (
    <div className="bg-white rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-4">Ký hợp đồng</h1>
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
            onClick={() => {
              if (selectedEmployees.length > 0) {
                setIsOpenSignModal(true)
              }
            }}
            disabled={selectedEmployees.length === 0}
          >
            <Check className="w-4 h-4" /> Ký hợp đồng
          </Button>
          <Button className="bg-[#C1C1C1] rounded text-white hover:bg-[#a1a1a1]">
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
                          !contract.signedUserIds.includes(user?.id || 0)
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
                    <TableCell>
                      <Checkbox
                        checked={selectedEmployees.includes(contract.id)}
                        onCheckedChange={() => handleSelectOne(contract.id)}
                        disabled={contract.signedUserIds.includes(
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
                            contract.signedUserIds.includes(user?.id || 0)
                              ? "signed_by_me"
                              : "waiting_for_sign"
                          ].color,
                        }}
                      >
                        {
                          mapiContractStatus[
                            contract.signedUserIds.includes(user?.id || 0)
                              ? "signed_by_me"
                              : "waiting_for_sign"
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
                        <NextImage
                          src="/eye.png"
                          alt="eye"
                          className="w-6 h-6 opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </InfiniteScroll>
      </div>

      <SignContractModal
        isOpen={isOpenSignModal}
        onOpenChange={setIsOpenSignModal}
        selectedContracts={contractList?.filter((c) =>
          selectedEmployees.includes(c.id)
        )}
      />
    </div>
  )
}

const SignContractModal = ({
  isOpen,
  onOpenChange,
  selectedContracts,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  selectedContracts?: ContractList[]
}) => {
  const { useSignContract } = useContracts()
  const { mutate: signContract } = useSignContract()
  const { user } = useAuth()

  const handleSign = () => {
    signContract({
      contracts: selectedContracts?.map((c) => c.id) ?? [],
      signerId: user?.id ?? 0,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-6">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-xl font-semibold">
            Xác nhận ký hợp đồng
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-gray-600 mb-4">
            Bạn có chắc chắn muốn ký {selectedContracts?.length} hợp đồng sau:
          </p>
          <div className="max-h-[200px] overflow-y-auto">
            {selectedContracts?.map((contract, index) => (
              <div
                key={contract.id}
                className="py-2 px-3 bg-gray-50 rounded mb-2 flex justify-between"
              >
                <span>{contract.contractNumber}</span>
                <span className="text-gray-500">
                  {dayjs(contract.createdAt).format("DD/MM/YYYY")}
                </span>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="border-t pt-4">
          <div className="flex justify-end gap-2">
            <Button
              className="bg-[#4BC5BE] hover:bg-[#2ea39d] text-white"
              onClick={handleSign}
            >
              Xác nhận
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-300 hover:bg-gray-100"
            >
              Hủy
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
