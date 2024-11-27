"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import dayjs from "dayjs"
import { atom, useAtom } from "jotai"
import { Download, Send, Trash2 } from "lucide-react"
import InfiniteScroll from "react-infinite-scroll-component"

import { ContractList } from "@/types/api"
import { useContracts } from "@/hooks/useContracts"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
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

export default function IndividualManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()
  const { useAllContracts, useBulkDeleteContracts } = useContracts()
  const [page, setPage] = useState(1)
  const { data: contracts } = useAllContracts(searchTerm, page, 10)

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
    <div className="w-full py-6 bg-white rounded-[10px]">
      <h1 className="text-2xl font-bold mb-4 border-b border-b-[#675D5D] px-6 pb-6">
        Cá nhân quản lý
      </h1>
      <div className="px-6">
        <div className="flex justify-between mb-4 ">
          <div className="relative">
            <Input
              type="text"
              placeholder="Mã/Số hợp đồng"
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
              onClick={() => router.push("/add-contract")}
            >
              + Thêm mới
            </Button>
            <Button className="bg-[#C1C1C1] rounded text-white hover:bg-[#a1a1a1]">
              <Send className="w-4 h-4" />
              Gửi duyệt
            </Button>
            <Button
              className="bg-[#F3949E] rounded text-white hover:bg-[#a4434d]"
              onClick={handleBulkDelete}
            >
              <Trash2 className="w-4 h-4" />
              Xóa
            </Button>
            <Button className="bg-[#C1C1C1] rounded text-white hover:bg-[#a1a1a1]">
              <Download className="w-4 h-4" />
              Tải
            </Button>
          </div>
        </div>
        <InfiniteScroll
          dataLength={contractList?.length || 0}
          next={() => setPage(page + 1)}
          hasMore={hasMore}
          loader={null}
        >
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-[#F5F5F5]">
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedEmployees.length === contracts?.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="w-[50px] text-black text-lg font-semibold">
                  STT
                </TableHead>
                <TableHead className="text-black text-lg font-semibold">
                  Số hợp đồng
                </TableHead>
                <TableHead className="text-black text-lg font-semibold">
                  Ngày tạo hợp đồng
                </TableHead>
                <TableHead className="text-black text-lg">Trạng thái</TableHead>
                <TableHead className="text-black text-lg font-semibold">
                  Phòng ban
                </TableHead>
                <TableHead className="text-black text-lg font-semibold">
                  Mã khách
                </TableHead>
                <TableHead className="text-black text-lg font-semibold">
                  Thao tác
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contractList?.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={8}
                    className="text-center py-10 hover:bg-transparent"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <NextImage
                        src="/empty-state.png"
                        alt="No data"
                        className="w-[200px] h-[200px] opacity-50"
                      />
                      <p className="text-gray-500 text-lg">
                        Không có dữ liệu hợp đồng
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                contractList?.map((contract, index) => (
                  <TableRow key={contract.id} className="hover:bg-[#F5F5F5]">
                    <TableCell>
                      <Checkbox
                        checked={selectedEmployees.includes(contract.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleSelectOne(contract.id)
                          } else {
                            handleSelectOne(contract.id)
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell className="text-black text-lg font-semibold">
                      {index + 1}
                    </TableCell>
                    <TableCell className="text-black text-lg font-semibold">
                      {contract.contractNumber}
                    </TableCell>
                    <TableCell className="text-black text-lg font-semibold">
                      {dayjs(contract.createdAt).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell className="text-black text-lg font-semibold">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          contract.status === "new"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {contract.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-black text-lg font-semibold">
                      {contract.createdBy.fullName}
                    </TableCell>
                    <TableCell className="text-black text-lg font-semibold">
                      {contract.customer.code}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-3 items-center">
                        <NextImage
                          src="/eye.png"
                          alt="eye"
                          className="w-[24px]"
                        />
                        <NextImage
                          src="/mail.png"
                          alt="mail"
                          className="w-[24px]"
                        />
                        <NextImage
                          src="/edit.png"
                          alt="edit"
                          className="w-[24px]"
                        />
                        <NextImage
                          src="/setting.png"
                          alt="setting"
                          className="w-[24px]"
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
    </div>
  )
}
