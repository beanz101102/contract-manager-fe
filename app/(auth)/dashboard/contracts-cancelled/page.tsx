"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import dayjs from "dayjs"
import html2canvas from "html2canvas-pro"
import jsPDF from "jspdf"
import { Download } from "lucide-react"

import { useContracts } from "@/hooks/useContracts"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function ContractReport() {
  const [startDate, setStartDate] = useState<Date>(
    new Date(new Date().getFullYear(), 0, 1)
  )
  const [endDate, setEndDate] = useState<Date>(new Date())
  const targetRef = useRef<HTMLDivElement>(null)

  const { useContractsInRange } = useContracts()
  const { data } = useContractsInRange({
    startTime: startDate?.getTime() || 0,
    endTime: endDate?.getTime() || 0,
    status: "cancelled",
  })
  const contracts = data || []
  console.log("datadatadatadatadatadatadata", contracts)

  const generatePDF = async () => {
    const element = targetRef.current
    if (!element) return

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF("p", "mm", "a4")
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
      pdf.save("bao-cao-hop-dong.pdf")
    } catch (error) {
      console.error("Error generating PDF:", error)
    }
  }

  return (
    <div className="container mx-auto p-4 bg-gray-50/30 min-h-screen">
      <Card className="border-0 shadow-md bg-white">
        <CardHeader className="flex flex-row items-center justify-between border-b bg-gray-50/50 pb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Báo cáo hợp đồng hủy
          </h1>
          <Button onClick={generatePDF}>
            <Download className="mr-2 h-4 w-4" />
            Xuất báo cáo
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          <div ref={targetRef} className="bg-white p-6">
            <div className="mb-6 space-y-6">
              <div className="flex items-center gap-4">
                <span className="font-medium text-gray-700">Thời gian</span>
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="border-gray-200 hover:bg-gray-50 text-gray-700"
                      >
                        {startDate
                          ? dayjs(startDate).format("DD/MM/YYYY")
                          : "Từ ngày"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => setStartDate(date as Date)}
                        className="rounded-md border"
                      />
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="border-gray-200 hover:bg-gray-50 text-gray-700"
                      >
                        {endDate
                          ? dayjs(endDate).format("DD/MM/YYYY")
                          : "Đến ngày"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => setEndDate(date as Date)}
                        className="rounded-md border"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex items-start gap-6 bg-gray-50/50 p-6 rounded-lg">
                <Image
                  src="/img/logo.png"
                  alt="Company Logo"
                  width={150}
                  height={150}
                  className="object-contain"
                />
                <div className="space-y-2 text-gray-700">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Công ty Bất động sản Phát Đạt
                  </h2>
                  <p className="text-gray-600">
                    Địa chỉ: 39 Phạm Ngọc Thạch, Phường Võ Thị Sáu, Quận 3,
                    Thành phố Hồ Chí Minh
                  </p>
                  <p className="text-gray-600">Hotline: (028) 3898 6868</p>
                </div>
              </div>

              <div className="text-center space-y-2 py-6 border-b border-gray-100">
                <h3 className="text-xl font-bold uppercase text-gray-900">
                  Báo cáo hợp đồng hủy
                </h3>
                <p className="text-gray-600">
                  Từ ngày: {dayjs(startDate).format("DD/MM/YYYY")} Đến ngày:{" "}
                  {dayjs(endDate).format("DD/MM/YYYY")}
                </p>
              </div>

              <div className="rounded-lg overflow-hidden border border-gray-200">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-[100px] font-semibold text-gray-700">
                        STT
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        Mã hợp đồng
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        Tên nhân viên
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        Tên khách hàng
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        Lý do
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contracts?.map((row, index) => (
                      <TableRow
                        key={row.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <TableCell className="  text-gray-600">
                          {index + 1}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {row.contractNumber}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {row.createdBy.name}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {row.customer.name}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {row.cancelReason}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-between mt-12 px-8">
                <div className="text-center">
                  <p className="font-medium text-gray-800">Người phê duyệt</p>
                  <p className="text-sm text-gray-500">(Ký và ghi rõ họ tên)</p>
                </div>
                <div className="text-center">
                  <p className="font-medium text-gray-800">Người tạo báo cáo</p>
                  <p className="text-sm text-gray-500">(Ký và ghi rõ họ tên)</p>
                </div>
              </div>

              <div className="text-right mt-4 text-gray-600">
                <p>Hà Nội, Ngày {dayjs().format("D [tháng] M [năm] YYYY")}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
