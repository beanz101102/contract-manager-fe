"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import NextImage from "@/components/ui/next-img"
import LayoutApp from "@/components/layouts/LayoutApp"

export default function SignatureSuccess() {
  const router = useRouter()

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-sm">
          <div className="flex flex-col items-center text-center space-y-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
            <h1 className="text-2xl font-semibold text-gray-900">
              Ký hợp đồng thành công!
            </h1>
            <p className="text-gray-600">
              Cảm ơn bạn đã ký hợp đồng. Bạn sẽ nhận được email xác nhận trong
              thời gian sớm nhất.
            </p>
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center gap-2 hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
              Quay lại
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
