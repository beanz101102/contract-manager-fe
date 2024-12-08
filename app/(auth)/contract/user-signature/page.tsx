"use client"

import React, { ChangeEvent, useEffect, useRef, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import dayjs from "dayjs"
import { atom, useAtom } from "jotai"
import { Eye, Plus, Trash2 } from "lucide-react"
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
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isOpenPreview, setIsOpenPreview] = useState(false)

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

      <ImagePreviewDialog
        previewImage={previewImage}
        isOpen={isOpenPreview}
        onOpenChange={setIsOpenPreview}
      />
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
                      {sig.user?.department?.departmentName}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {sig.user?.position}
                    </TableCell>
                    <TableCell>
                      <div
                        className="cursor-pointer"
                        onClick={() => {
                          setPreviewImage(
                            `${process.env.NEXT_PUBLIC_API_URL}${sig?.signatureImagePath}`
                          )
                          setIsOpenPreview(true)
                        }}
                      >
                        <NextImage
                          src={`${process.env.NEXT_PUBLIC_API_URL}${sig?.signatureImagePath}`}
                          alt="Signature"
                          className="w-16 h-16 object-contain hover:opacity-80 transition-opacity"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-4">
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
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stampImage, setStampImage] = useState<File | null>(null)
  const [finalSignature, setFinalSignature] = useState<File | null>(null)
  const { useAddSignature } = useUserSignatures()
  const [isDrawing, setIsDrawing] = useState(false)
  const [lastX, setLastX] = useState(0)
  const [lastY, setLastY] = useState(0)

  const { mutate: addSignature } = useAddSignature(() => {
    onOpenChange(false)
    resetForm()
  })

  const resetForm = () => {
    setStampImage(null)
    setFinalSignature(null)
    clearCanvas()
  }

  // Xử lý upload ảnh dấu
  const handleStampUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File quá lớn. Vui lòng chọn file nhỏ hơn 2MB")
        return
      }
      if (!file.type.startsWith("image/")) {
        alert("Vui lòng chọn file ảnh")
        return
      }
      setStampImage(file)
      drawStampToCanvas(file)
    }
  }

  // Vẽ ảnh dấu lên canvas
  const drawStampToCanvas = (stampFile: File) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx || !canvas) return

    const img = new Image()
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      // Vẽ ảnh dấu ở giữa canvas
      const scale =
        Math.min(canvas.width / img.width, canvas.height / img.height) * 0.8
      const x = (canvas.width - img.width * scale) / 2
      const y = (canvas.height - img.height * scale) / 2
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale)
    }
    img.src = URL.createObjectURL(stampFile)
  }

  // Xử lý upload ảnh chữ ký và vẽ đè lên ảnh dấu
  const handleSignatureUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && stampImage) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File quá lớn. Vui lòng chọn file nhỏ hơn 2MB")
        return
      }
      if (!file.type.startsWith("image/")) {
        alert("Vui lòng chọn file ảnh")
        return
      }

      const img = new Image()
      img.onload = () => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext("2d")
        if (ctx && canvas) {
          // Tính toán kích thước chữ ký
          const signatureWidth = canvas.width * 0.8
          const scale = signatureWidth / img.width
          const signatureHeight = img.height * scale

          // Đặt vị trí ở góc phải dưới, cách mép 20px
          const padding = 20
          const x = canvas.width - signatureWidth - padding
          const y = canvas.height - signatureHeight - padding

          // Vẽ chữ ký tại vị trí đã tính
          ctx.drawImage(img, x, y, signatureWidth, signatureHeight)

          // Lưu kết quả
          canvas.toBlob((blob) => {
            if (blob) {
              const finalFile = new File([blob], "combined-signature.png", {
                type: "image/png",
              })
              setFinalSignature(finalFile)
            }
          })
        }
      }
      img.src = URL.createObjectURL(file)
    }
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (stampImage) {
        drawStampToCanvas(stampImage) // Vẽ lại ảnh dấu sau khi xóa
      }
    }
  }

  // Thiết lập canvas cho vẽ
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (ctx) {
      ctx.strokeStyle = "#000000"
      ctx.lineWidth = 2
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
    }
  }, [])

  // Xử lý bắt đầu vẽ bằng chuột
  const handleStartDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (canvas) {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setLastX(x)
      setLastY(y)
    }
  }

  // Xử lý vẽ khi di chuyển chuột
  const handleDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (ctx && canvas) {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      ctx.beginPath()
      ctx.moveTo(lastX, lastY)
      ctx.lineTo(x, y)
      ctx.stroke()

      setLastX(x)
      setLastY(y)
    }
  }

  // Xử lý kết thúc vẽ
  const handleEndDrawing = () => {
    setIsDrawing(false)
    // Lưu chữ ký khi kết thúc vẽ
    const canvas = canvasRef.current
    if (canvas) {
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "signature.png", { type: "image/png" })
          setFinalSignature(file)
        }
      })
    }
  }

  // Xử lý bắt đầu vẽ trên thiết bị cảm ứng
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const canvas = canvasRef.current
    if (canvas) {
      const rect = canvas.getBoundingClientRect()
      const touch = e.touches[0]
      const x = touch.clientX - rect.left
      const y = touch.clientY - rect.top
      setLastX(x)
      setLastY(y)
      setIsDrawing(true)
    }
  }

  // Xử lý vẽ trên thiết bị cảm ứng
  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    if (!isDrawing) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (ctx && canvas) {
      const rect = canvas.getBoundingClientRect()
      const touch = e.touches[0]
      const x = touch.clientX - rect.left
      const y = touch.clientY - rect.top

      ctx.beginPath()
      ctx.moveTo(lastX, lastY)
      ctx.lineTo(x, y)
      ctx.stroke()

      setLastX(x)
      setLastY(y)
    }
  }

  // Xử lý kết thúc vẽ trên thiết bị cảm ứng
  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    handleEndDrawing()
  }

  useEffect(() => {
    clearCanvas()
  }, [stampImage])

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-6">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Chữ ký cá nhân
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Upload ảnh dấu */}
          <div>
            <Label className="text-gray-700 font-medium mb-2 block">
              Tải lên ảnh dấu
            </Label>
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100">
              {stampImage ? (
                <img
                  src={URL.createObjectURL(stampImage)}
                  alt="Stamp preview"
                  className="h-full object-contain p-2"
                />
              ) : (
                <div className="text-center p-4">
                  <Plus className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500">Tải lên ảnh dấu</p>
                </div>
              )}
              <Input
                type="file"
                className="hidden"
                onChange={handleStampUpload}
                accept="image/*"
              />
            </label>
          </div>

          {stampImage && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Label className="text-gray-700 font-medium">
                  Chọn cách ký:
                </Label>
                <Input
                  type="file"
                  className="flex-1"
                  onChange={handleSignatureUpload}
                  accept="image/*"
                  placeholder="Tải lên ảnh chữ ký"
                />
                <span className="text-gray-500">hoặc</span>
                <Button variant="outline" onClick={clearCanvas}>
                  Ký trực tiếp
                </Button>
              </div>

              {/* Canvas để hiển thị và ký */}
              <div className="border-2 border-dashed border-gray-300 p-4 rounded-xl">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={350}
                  className="border rounded-lg bg-white cursor-crosshair"
                  onMouseDown={handleStartDrawing}
                  onMouseMove={handleDrawing}
                  onMouseUp={handleEndDrawing}
                  onMouseLeave={handleEndDrawing}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                />
                <p className="mt-2 text-sm text-gray-500 text-center">
                  Có thể tải lên ảnh chữ ký hoặc ký trực tiếp lên ảnh dấu
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={resetForm}>
              Làm mới
            </Button>
            <Button
              onClick={() => {
                if (finalSignature) {
                  addSignature({
                    userId: user?.id as number,
                    signatureImagePath: finalSignature,
                  })
                }
              }}
              disabled={!finalSignature}
              className="bg-teal-500 hover:bg-teal-600"
            >
              Lưu chữ ký
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const ImagePreviewDialog = ({
  isOpen,
  onOpenChange,
  previewImage,
}: {
  previewImage: string | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-6">
        <DialogHeader>
          <DialogTitle>Xem chữ ký</DialogTitle>
        </DialogHeader>
        {previewImage && (
          <div className="flex justify-center w-[320px] h-[320px] mx-auto">
            <NextImage
              src={previewImage}
              alt="Signature Preview"
              className="w-[320px] h-[320px] object-contain"
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
