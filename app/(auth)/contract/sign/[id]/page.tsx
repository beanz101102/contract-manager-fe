"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import AppPDF from "@/src/App"
import { ArrowLeft, Download, Send } from "lucide-react"

import { useContracts } from "@/hooks/useContracts"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function ContractForm() {
  const params = useParams()
  const { useContractDetail } = useContracts()
  const { data } = useContractDetail(Number(params.id))

  const { useSignContract } = useContracts()
  const { mutate: signContract } = useSignContract()
  const { user } = useAuth()
  const [file, setFile] = useState<File | null>(null)

  const handleSign = () => {
    signContract({
      contractId: Number(params.id),
      signerId: user?.id ?? 0,
      file: file ?? new File([], ""),
    })
  }

  console.log("file", file)

  return (
    <div className="flex min-h-screen">
      <div className="w-[30%] min-h-screen bg-white p-6 border-r">
        <Button
          variant="ghost"
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
                  className="min-h-[120px] resize-none bg-white border-gray-200 text-gray-900 focus:border-primary focus:ring-primary"
                  placeholder="Nhập ghi chú..."
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-4 mt-8">
          <Button className="w-full py-6 text-base font-medium">
            <Send className="mr-3 h-5 w-5" />
            Gửi phản hồi
          </Button>
          <Button className="w-full py-6 text-base font-medium">
            <Download className="mr-3 h-5 w-5" />
            Tải về
          </Button>
          <Button
            className="w-full py-6 text-base font-medium"
            onClick={handleSign}
          >
            Xác nhận ký
          </Button>
        </div>
      </div>
      <div className="flex-1 bg-gray-50 w-[70%]">
        <AppPDF
          url={`http://localhost:8000${data?.pdfFilePath}`}
          setFile={setFile}
        />
      </div>
    </div>
  )
}
