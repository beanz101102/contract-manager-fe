"use client"

import React, { ChangeEvent, useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import dayjs from "dayjs"
import { atom, useAtom } from "jotai"
import { Eye, Filter, Plus, Trash2 } from "lucide-react"
import InfiniteScroll from "react-infinite-scroll-component"

import { SignatureList } from "@/types/api"
import { useUserSignatures } from "@/hooks/useUserSignatures"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
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

const listSignatureAtom = atom<SignatureList[]>([])

const SignatureManagementInterface = () => {
  const [isOpenDigitalSignature, setIsOpenDigitalSignature] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const { useListSignatures, useDeleteSignature } = useUserSignatures()
  const { data: signaturesData } = useListSignatures()
  const [listSignature, setListSignature] = useAtom(listSignatureAtom)
  const { mutate: deleteSignature } = useDeleteSignature(() => {
    setPage(1)
  })

  useEffect(() => {
    setHasMore((signaturesData || [])?.length >= 10)
    if (page === 1) {
      setListSignature(signaturesData || [])
    } else {
      setListSignature((prev) => [...prev, ...(signaturesData || [])])
    }
  }, [signaturesData])

  return (
    <div className="p-8 bg-white rounded-xl shadow-lg max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Chữ ký cá nhân</h1>
        <Button
          className="bg-teal-500 hover:bg-teal-600 transition-colors duration-200 rounded-lg px-4 py-2 text-white font-medium"
          onClick={() => setIsOpenDigitalSignature(true)}
        >
          <Plus className="w-4 h-4 mr-2" /> Thêm mới
        </Button>
      </div>

      <InfiniteScroll
        dataLength={listSignature?.length}
        next={() => setPage(page + 1)}
        hasMore={hasMore}
        loader={null}
      >
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-[50px] text-gray-700 font-semibold">
                  STT
                </TableHead>
                <TableHead className="text-gray-700 font-semibold">
                  Ngày tạo
                </TableHead>
                <TableHead className="text-gray-700 font-semibold">
                  Phòng ban
                </TableHead>
                <TableHead className="text-gray-700 font-semibold">
                  Chức vụ
                </TableHead>
                <TableHead className="text-gray-700 font-semibold">
                  Chữ ký
                </TableHead>
                <TableHead className="w-[100px] text-gray-700 font-semibold">
                  Thao tác
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listSignature.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-16">
                    <div className="flex flex-col items-center gap-4">
                      <NextImage
                        src="/empty-state.png"
                        alt="No data"
                        className="w-[180px] h-[180px] opacity-40"
                      />
                      <p className="text-gray-500 text-base">
                        Không có dữ liệu chữ ký
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                listSignature.map((sig, index) => (
                  <TableRow
                    key={sig.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <TableCell className="text-gray-700">{index + 1}</TableCell>
                    <TableCell className="text-gray-700">
                      {dayjs(sig.createdAt).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {sig.user.department.departmentName}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {sig.user.position}
                    </TableCell>
                    <TableCell>
                      <NextImage
                        src={`http://localhost:8000${sig?.signatureImagePath}`}
                        alt="Signature"
                        className="w-16 h-16 object-contain"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-4">
                        <button className="text-gray-600 hover:text-gray-900 transition-colors">
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deleteSignature(sig.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </InfiniteScroll>

      <DigitalSignatureModal
        isOpen={isOpenDigitalSignature}
        onOpenChange={setIsOpenDigitalSignature}
      />
    </div>
  )
}

export default SignatureManagementInterface

const DigitalSignatureModal = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}) => {
  const { user } = useAuth()
  const [signature, setSignature] = useState<File | null>(null)
  const { useAddSignature } = useUserSignatures()
  const { mutate: addSignature } = useAddSignature(() => {
    onOpenChange(false)
    setSignature(null)
  })

  const handleSignatureUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSignature(file)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-6">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Chữ ký cá nhân
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Label
              htmlFor="signature-upload"
              className="text-gray-700 font-medium mb-2 block"
            >
              Tải lên chữ ký
            </Label>
            <div className="mt-2">
              <label
                htmlFor="signature-upload"
                className="flex flex-col items-center justify-center w-full h-40
                  border-2 border-dashed border-gray-300 rounded-xl
                  cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-200"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Nhấp để tải lên</span> hoặc
                    kéo thả file
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG (Tối đa 2MB)</p>
                </div>
                <Input
                  id="signature-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleSignatureUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {signature && (
            <div className="border-2 border-dashed border-gray-300 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-700 font-medium">
                  Xem trước chữ ký
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSignature(null)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center justify-center h-32 bg-white rounded-lg overflow-hidden">
                <img
                  src={URL.createObjectURL(signature)}
                  alt="Signature Preview"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button
              onClick={() => {
                addSignature({
                  userId: user?.id as number,
                  signatureImagePath: signature as File,
                })
              }}
              className="bg-teal-500 hover:bg-teal-600 transition-colors duration-200 px-6 py-2 text-white font-medium rounded-lg"
            >
              Lưu chữ ký
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
