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
    <div className="p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Chữ ký cá nhân</h1>

      <div className="flex justify-between items-center mb-4">
        <Button
          className="bg-[#4BC5BE] rounded text-white hover:bg-[#2ea39d]"
          onClick={() => setIsOpenDigitalSignature(true)}
        >
          <Plus className="w-4 h-4" /> Thêm mới
        </Button>
      </div>

      <InfiniteScroll
        dataLength={listSignature?.length}
        next={() => setPage(page + 1)}
        hasMore={hasMore}
        loader={null}
      >
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-[#F5F5F5]">
              <TableHead className="w-[50px] text-black text-lg font-semibold">
                STT
              </TableHead>
              <TableHead className="text-black text-lg font-semibold">
                Ngày tạo
              </TableHead>

              <TableHead className="text-black text-lg font-semibold">
                Phòng ban
              </TableHead>
              <TableHead className="text-black text-lg font-semibold">
                Chức vụ
              </TableHead>
              <TableHead className="text-black text-lg font-semibold">
                Chữ ký
              </TableHead>
              <TableHead className="w-[100px] text-black text-lg font-semibold">
                Thao tác
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listSignature.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={6}
                  className="text-center py-10 hover:bg-transparent"
                >
                  <div className="flex flex-col items-center gap-3">
                    <NextImage
                      src="/empty-state.png"
                      alt="No data"
                      className="w-[200px] h-[200px] opacity-50"
                    />
                    <p className="text-gray-500 text-lg">
                      Không có dữ liệu chữ ký
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              listSignature.map((sig, index) => (
                <TableRow key={sig.id}>
                  <TableCell className="text-black text-lg font-semibold">
                    {index + 1}
                  </TableCell>
                  <TableCell className="text-black text-lg font-semibold">
                    {dayjs(sig.createdAt).format("DD/MM/YYYY")}
                  </TableCell>
                  <TableCell className="text-black text-lg font-semibold">
                    {sig.user.department.departmentName}
                  </TableCell>
                  <TableCell className="text-black text-lg font-semibold">
                    {sig.user.position}
                  </TableCell>
                  <TableCell>
                    <NextImage
                      src={`http://localhost:8000${sig?.signatureImagePath}`}
                      alt="Signature"
                      className="w-14 h-14"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-3">
                      <NextImage src="/eye.png" className="w-6" alt="eye" />
                      <div
                        onClick={() => deleteSignature(sig.id)}
                        className="cursor-pointer"
                      >
                        <NextImage
                          className="w-6"
                          src="/trash.png"
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
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Chữ ký cá nhân
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="creation-date">Ngày tạo</Label>
              <Input
                id="creation-date"
                type="date"
                defaultValue="2024-07-25"
                className="bg-white"
              />
            </div>
            <div>
              <Label htmlFor="department">Phòng ban</Label>
              <Input
                id="department"
                placeholder="Phòng ban"
                className="bg-white"
              />
            </div>
          </div> */}

          {/* 
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="position">Vị trí</Label>
              <Input id="position" placeholder="Vị trí" className="bg-white" />
            </div>
            <div>
              <Label htmlFor="signature-type">Loại chữ ký</Label>
              <Select>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="digital">Chữ ký số</SelectItem>
                  <SelectItem value="electronic">Chữ ký điện tử</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div> */}

          {/* <div>
            <Label>Chữ ký</Label>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                className="bg-teal-500 hover:bg-teal-600 text-white"
              >
                Tải lên chữ ký
              </Button>
              <Button
                variant="outline"
                className="bg-teal-500 hover:bg-teal-600 text-white"
              >
                Ký trực tiếp
              </Button>
              <Button
                variant="outline"
                className="bg-teal-500 hover:bg-teal-600 text-white"
              >
                Dấu công ty
              </Button>
            </div>
          </div> */}

          <div>
            <Label htmlFor="signature-upload">Tải lên chữ ký</Label>
            <div className="mt-2">
              <label
                htmlFor="signature-upload"
                className="flex flex-col items-center justify-center w-full h-32 
                  border-2 border-dashed border-gray-300 rounded-lg 
                  cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
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
            <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg flex items-center">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Xem trước chữ ký</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSignature(null)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center justify-center h-28 overflow-hidden">
                <img
                  src={URL.createObjectURL(signature)}
                  alt="Signature Preview"
                  className="max-w-full max-h-full w-auto h-auto object-contain"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button
              onClick={() => {
                addSignature({
                  userId: user?.id as number,
                  signatureImagePath: signature as File,
                })
              }}
              className="bg-teal-500 hover:bg-teal-600 text-white"
            >
              Lưu chữ ký
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
