"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import AppPDF from "@/src/App"
import { ArrowLeft, Download, Send } from "lucide-react"

import { useContracts } from "@/hooks/useContracts"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function ContractForm() {
  const [isSaveFile, setIsSaveFile] = useState(false)
  const params = useParams()
  const { useContractDetail } = useContracts()
  const router = useRouter()
  const { data } = useContractDetail(Number(params.id))
  const [feedback, setFeedback] = useState("")

  const { useSignContract } = useContracts()
  const { mutate: signContract } = useSignContract()
  const { user } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [otp, setOtp] = useState("")
  const { useSendOtp } = useContracts()
  const { mutate: sendOtp } = useSendOtp()
  const { useFeedbackContract } = useContracts()
  const { mutate: feedbackContract } = useFeedbackContract()

  const handleFeedback = (content: string) => {
    feedbackContract({
      contractId: Number(params.id),
      name: user?.fullName ?? "",
      content: content,
      tag: "feedback",
    })
  }

  useEffect(() => {
    if (file) {
      setIsSaveFile(true)
    } else {
      setIsSaveFile(false)
    }
  }, [file])

  const handleSign = () => {
    setShowOtpModal(true)
    sendOtp({ email: user?.email ?? "" })
  }

  const handleConfirmSign = () => {
    signContract({
      contractId: Number(params.id),
      signerId: user?.id ?? 0,
      file: file ?? new File([], ""),
      otp: otp,
    })
    setShowOtpModal(false)
    setOtp("")
  }

  const handleDownload = async () => {
    try {
      if (file) {
        // Download the signed file
        const url = URL.createObjectURL(file)
        const a = document.createElement("a")
        a.href = url
        a.download = `signed_contract_${params.id}.pdf` // You can customize the filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      } else if (data?.pdfFilePath) {
        // Download the original PDF
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}${data.pdfFilePath}`
        )
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `contract_${params.id}.pdf` // You can customize the filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error("Error downloading file:", error)
      // You might want to add some error handling here
    }
  }

  useEffect(() => {
    return () => {
      setFeedback("")
    }
  }, [])

  return (
    <>
      <div className="flex flex-col md:flex-row min-h-screen">
        <div className="w-full md:w-[30%] min-h-[auto] md:min-h-screen bg-white p-4 md:p-6 border-b md:border-r">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2 mb-4 md:mb-8 hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
            Quay lại
          </Button>

          <div className="space-y-6 md:space-y-8">
            <div className="flex items-center gap-3 md:gap-4">
              <span className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <i className="text-primary text-lg md:text-xl font-semibold">
                  i
                </i>
              </span>
              <h2 className="font-semibold text-lg md:text-xl">
                Thông tin hợp đồng
              </h2>
            </div>

            <Card className="p-4 md:p-8 bg-white border-gray-200">
              <div className="space-y-4 md:space-y-6">
                <div className="grid gap-1.5 md:gap-2">
                  <Label className="text-sm font-medium text-gray-600">
                    Ngày lập
                  </Label>
                  <div className="text-sm md:text-base text-gray-900">
                    25/07/2024
                  </div>
                </div>

                <div className="grid gap-1.5 md:gap-2">
                  <Label className="text-sm font-medium text-gray-600">
                    Công ty
                  </Label>
                  <div className="text-sm md:text-base text-gray-900">
                    CÔNG TY CỔ PHẦN PHÁT TRIỂN BẤT ĐỘNG SẢN PHÁT ĐẠT
                  </div>
                </div>

                <div className="grid gap-1.5 md:gap-2">
                  <Label className="text-sm font-medium text-gray-600">
                    Mã số thuế
                  </Label>
                  <div className="text-sm md:text-base text-gray-900">
                    0314955586
                  </div>
                </div>

                <div className="grid gap-1.5 md:gap-2">
                  <Label className="text-sm font-medium text-gray-600">
                    Ghi chú
                  </Label>
                  <Textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="min-h-[100px] md:min-h-[120px] resize-none bg-white border-gray-200 text-gray-900 focus:border-primary focus:ring-primary text-sm md:text-base"
                    placeholder="Nhập ghi chú..."
                  />
                </div>
              </div>
            </Card>
          </div>

          <div className="flex flex-col gap-3 md:gap-4 mt-6 md:mt-8">
            <Button
              className="w-full py-4 md:py-6 text-sm md:text-base font-medium"
              onClick={() => handleFeedback(feedback)}
              disabled={feedback?.trim() === ""}
            >
              <Send className="mr-2 md:mr-3 h-4 w-4 md:h-5 md:w-5" />
              Gửi phản hồi
            </Button>
            <Button
              className="w-full py-4 md:py-6 text-sm md:text-base font-medium"
              onClick={handleDownload}
            >
              <Download className="mr-2 md:mr-3 h-4 w-4 md:h-5 md:w-5" />
              Tải về
            </Button>
            <Button
              className="w-full py-4 md:py-6 text-sm md:text-base font-medium"
              onClick={handleSign}
              disabled={!isSaveFile}
            >
              Xác nhận ký
            </Button>
          </div>
        </div>
        <div className="flex-1 bg-gray-50 w-full md:w-[70%] min-h-screen">
          <AppPDF
            url={`${process.env.NEXT_PUBLIC_API_URL}${data?.pdfFilePath}`}
            setFile={setFile}
          />
        </div>
      </div>

      <Dialog open={showOtpModal} onOpenChange={setShowOtpModal}>
        <DialogContent className="sm:max-w-[425px] p-4 md:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl">
              Xác nhận ký hợp đồng
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-sm md:text-base">Mã OTP</Label>
              <Input
                type="text"
                placeholder="Nhập mã OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="text-sm md:text-base"
              />
            </div>

            <div className="text-xs md:text-sm text-gray-500">
              Mã OTP đã được gửi đến email của bạn.
              <Button
                variant="link"
                className="px-1 text-primary text-xs md:text-sm"
                onClick={() => sendOtp({ email: user?.email ?? "" })}
              >
                Gửi lại mã
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-2 md:gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowOtpModal(false)
                setOtp("")
              }}
              className="text-sm md:text-base"
            >
              Hủy
            </Button>
            <Button
              onClick={handleConfirmSign}
              className="text-sm md:text-base"
            >
              Xác nhận
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
