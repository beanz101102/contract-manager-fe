"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import dayjs from "dayjs"
import { atom, useAtom } from "jotai"
import { Download, Plus, Send, Trash2 } from "lucide-react"
import InfiniteScroll from "react-infinite-scroll-component"

import { ContractList, mapiContractStatus2 } from "@/types/api"
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

const contractListAtom = atom<ContractList[]>([])

export default function ContractSearch() {
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()
  const { useAllContracts, useBulkDeleteContracts } = useContracts()
  const [page, setPage] = useState(1)
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [contractId, setContractId] = useState(0)
  const userId = user?.position === 'Giám đốc' ? null : user?.id;
  const { data: contracts, isLoading } = useAllContracts(
    searchTerm,
    page,
    10,
    null,
    userId, // view all contracts for Giám đốc
    "completed"
  )

  const [contractList, setContractList] = useAtom(contractListAtom)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    if (contracts) {
      setContractList(contracts.contracts)
    }
  }, [contracts, page])

  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEmployees(
        contractList?.map((contract, index) => contract?.id) || []
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

  const { mutate: bulkDeleteContracts } = useBulkDeleteContracts()

  const handleBulkDelete = () => {
    bulkDeleteContracts(selectedEmployees)
  }

  return (
    <div className="p-4 md:p-8 bg-white rounded-xl shadow-sm">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800">
        Cá nhân quản lý
      </h1>

      <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-4 md:mb-6">
        <div className="relative w-full md:w-[280px]">
          <Input
            type="text"
            placeholder="Mã/Số hợp đồng"
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
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-[1200px] w-full">
          <TableHeader>
            <TableRow className="hover:bg-gray-50 bg-gray-100">
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
                <TableCell colSpan={8} className="text-center py-12 md:py-16">
                  <div className="flex flex-col items-center gap-3">
                    {isLoading ? (
                      <Loading />
                    ) : (
                      <>
                        <NextImage
                          src="/empty-state.png"
                          alt="No data"
                          className="w-[160px] h-[160px] md:w-[200px] md:h-[200px] opacity-50"
                        />
                        <p className="text-gray-500 text-base md:text-lg">
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
                  <TableCell className="text-gray-700 text-sm md:text-base">
                    {index + 1}
                  </TableCell>
                  <TableCell className="text-gray-700 text-sm md:text-base">
                    {contract.contractNumber}
                  </TableCell>
                  <TableCell className="text-gray-700 text-sm md:text-base">
                    {dayjs(contract.createdAt).format("DD/MM/YYYY")}
                  </TableCell>
                  <TableCell>
                    <span
                      className="px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium"
                      style={{
                        ...mapiContractStatus2[
                          contract.status as keyof typeof mapiContractStatus2
                        ].color,
                      }}
                    >
                      {
                        mapiContractStatus2[
                          contract.status as keyof typeof mapiContractStatus2
                        ].label
                      }
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-700 text-sm md:text-base">
                    {contract.createdBy?.department?.departmentName}
                  </TableCell>
                  <TableCell className="text-gray-700 text-sm md:text-base">
                    {contract.customer.code}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 md:gap-3 items-center">
                      <div
                        onClick={() => {
                          setContractId(contract.id)
                          setIsOpen(true)
                        }}
                        className="cursor-pointer"
                      >
                        <NextImage
                          src="/eye.png"
                          alt="eye"
                          className="w-5 h-5 md:w-6 md:h-6 opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                        />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {contractList?.length > 0 && (
          <div className="flex justify-center md:justify-end mt-4 w-full md:w-fit md:ml-auto">
            <PaginationDemo
              currentPage={page}
              totalPages={contracts?.totalPages ?? 1}
              onChangePage={setPage}
            />
          </div>
        )}
      </div>
      <DetailContract
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        id={contractId}
      />
    </div>
  )
}
