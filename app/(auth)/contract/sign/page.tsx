"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import dayjs from "dayjs"
import { atom, useAtom } from "jotai"
import { Download, Pencil } from "lucide-react"
import InfiniteScroll from "react-infinite-scroll-component"

import { ContractList, mapiContractStatus } from "@/types/api"
import { useContracts } from "@/hooks/useContracts"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import DetailContract from "@/components/DetailContract"
import { PaginationDemo } from "@/components/Pagination"
import EditRequestModal from "@/components/modals/EditRequestModal"

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
  const [isOpen, setIsOpen] = useState(false)
  const [contractId, setContractId] = useState<number | null>(null)

  useEffect(() => {
    if (contracts) {
      setContractList(contracts.contracts)
    }
  }, [contracts, page])

  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([])
  const [isOpenEditModal, setIsOpenEditModal] = useState(false)

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
            className="bg-[#C1C1C1] rounded text-white hover:bg-[#a1a1a1]"
            onClick={() => setIsOpenEditModal(true)}
          >
            <Pencil className="w-4 h-4" /> Yêu cầu sửa
          </Button>
          <Button className="bg-[#C1C1C1] rounded text-white hover:bg-[#a1a1a1]">
            <Download className="w-4 h-4" /> Tải
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
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
                      disabled={contract.signedUserIds.includes(user?.id || 0)}
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
                      <div
                        onClick={() => {
                          setContractId(contract.id)
                          setIsOpen(true)
                        }}
                      >
                        <NextImage
                          src="/eye.png"
                          alt="eye"
                          className="w-6 h-6 opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                        />
                      </div>
                      <Link href={`/contract/sign/${contract.id}`}>
                        <Button>Ký hợp đồng</Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {contractList?.length > 0 && (
          <div className="flex justify-end mt-4 w-fit  ml-auto">
            <PaginationDemo
              currentPage={page}
              totalPages={contracts?.totalPages ?? 1}
              onChangePage={setPage}
            />
          </div>
        )}
      </div>

      <EditRequestModal
        isOpen={isOpenEditModal}
        onOpenChange={setIsOpenEditModal}
        selectedEmployees={selectedEmployees}
      />
      <DetailContract
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        id={contractId || 0}
      />
    </div>
  )
}
