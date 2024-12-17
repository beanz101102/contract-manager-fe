"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import AppPDF from "@/src/App"
import { ArrowLeft, Download, Send } from "lucide-react"

import { useContracts } from "@/hooks/useContracts"
import { useUsers } from "@/hooks/useUsers"
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
import NextImage from "@/components/ui/next-img"
import { Textarea } from "@/components/ui/textarea"

export default function ContractForm() {
  const params = useParams()
  const [isSaveFile, setIsSaveFile] = useState(false)

  const { useContractDetail } = useContracts()
  const router = useRouter()
  const { data } = useContractDetail(Number(params.id))
  const searchParams = useSearchParams()
  const tokenUser = Number(searchParams.get("token")?.split("kh_")[1] ?? 0)
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [otp, setOtp] = useState("")
  const { useSendOtp } = useContracts()
  const { mutate: sendOtp } = useSendOtp()
  const { useSignContract } = useContracts()
  const { mutate: signContract } = useSignContract()
  const [file, setFile] = useState<File | null>(null)
  const { useUserDetails } = useUsers()
  const { data: userDetails } = useUserDetails(tokenUser)

  const handleSign = () => {
    setShowOtpModal(true)
    sendOtp({ email: userDetails?.email ?? "" })
  }

  const handleConfirmSign = () => {
    signContract({
      contractId: Number(params.id),
      signerId: tokenUser ?? 0,
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

  const [feedback, setFeedback] = useState("")

  useEffect(() => {
    if (file) {
      setIsSaveFile(true)
    } else {
      setIsSaveFile(false)
    }
  }, [file])

  useEffect(() => {
    return () => {
      setFeedback("")
    }
  }, [])

  const { useFeedbackContract } = useContracts()
  const { mutate: feedbackContract } = useFeedbackContract()

  const handleFeedback = (content: string) => {
    feedbackContract({
      contractId: Number(params.id),
      name: userDetails?.fullName ?? "",
      content: content,
      tag: "feedback",
    })
  }

  return (
    <>
      <div className="flex flex-col flex-1 overflow-hidden">
        <div
          className="h-[100px] w-full flex items-center px-5"
          style={{
            background: "linear-gradient(90deg, #36989D 0%, #3C5F60 100%)",
          }}
        >
          <div className="flex items-center justify-center cursor-pointer">
            <NextImage
              src="/img/logo.png"
              alt="logo"
              width={32}
              height={32}
              className="w-[160px]"
            />
          </div>
          <p className="text-white text-3xl pl-10 font-bold hidden lg:block">
            CÔNG TY CP PHÁT TRIỂN BĐS PHÁT ĐẠT
          </p>
        </div>
      </div>
      <div className="flex min-h-screen">
        <div className="w-[30%] min-h-screen bg-white p-6 border-r">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2 mb-8 hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
            Quay lại
          </Button>

          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <i className="text-primary text-xl font-semibold">i</i>
              </span>
              <h2 className="font-semibold text-xl">Thông tin hợp đồng</h2>
            </div>

            <Card className="p-8 bg-white border-gray-200">
              <div className="space-y-6">
                <div className="grid gap-2">
                  <Label className="text-sm font-medium text-gray-600">
                    Ngày lập
                  </Label>
                  <div className="text-base text-gray-900">25/07/2024</div>
                </div>

                <div className="grid gap-2">
                  <Label className="text-sm font-medium text-gray-600">
                    Công ty
                  </Label>
                  <div className="text-base text-gray-900">
                    CÔNG TY CỔ PHẦN PHÁT TRIỂN BẤT ĐỘNG SẢN PHÁT ĐẠT
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label className="text-sm font-medium text-gray-600">
                    Mã số thuế
                  </Label>
                  <div className="text-base text-gray-900">0314955586</div>
                </div>

                <div className="grid gap-2">
                  <Label className="text-sm font-medium text-gray-600">
                    Ghi chú
                  </Label>
                  <Textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="min-h-[120px] resize-none bg-white border-gray-200 text-gray-900 focus:border-primary focus:ring-primary"
                    placeholder="Nhập ghi chú..."
                  />
                </div>
              </div>
            </Card>
          </div>

          <div className="flex flex-col gap-4 mt-8">
            <Button
              className="w-full py-6 text-base font-medium"
              onClick={() => handleFeedback(feedback)}
              disabled={feedback?.trim() === ""}
            >
              <Send className="mr-3 h-5 w-5" />
              Gửi phản hồi
            </Button>
            <Button
              className="w-full py-6 text-base font-medium"
              onClick={handleDownload}
            >
              <Download className="mr-3 h-5 w-5" />
              Tải về
            </Button>
            <Button
              className="w-full py-6 text-base font-medium"
              onClick={handleSign}
              disabled={!isSaveFile}
            >
              Xác nhận ký
            </Button>
          </div>
        </div>
        <div className="flex-1 bg-gray-50 w-[70%]">
          <AppPDF
            url={`${process.env.NEXT_PUBLIC_API_URL}${data?.pdfFilePath}`}
            setFile={setFile}
          />
        </div>
        <Dialog open={showOtpModal} onOpenChange={setShowOtpModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xác nhận ký hợp đồng</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Mã OTP</Label>
                <Input
                  type="text"
                  placeholder="Nhập mã OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>

              <div className="text-sm text-gray-500">
                Mã OTP đã được gửi đến email của bạn.
                <Button
                  variant="link"
                  className="px-1 text-primary"
                  onClick={() => sendOtp({ email: userDetails?.email ?? "" })}
                >
                  Gửi lại mã
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowOtpModal(false)
                  setOtp("")
                }}
              >
                Hủy
              </Button>
              <Button onClick={handleConfirmSign}>Xác nhận</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
