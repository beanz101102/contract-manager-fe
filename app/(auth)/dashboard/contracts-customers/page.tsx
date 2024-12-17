"use client"

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import dayjs from "dayjs"
import html2canvas from "html2canvas-pro"
import jsPDF from "jspdf"
import { Download, Search } from "lucide-react"
import { useRef, useState } from "react"

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
import { useContracts } from "@/hooks/useContracts"
import { useUsers } from "@/hooks/useUsers"
import { useReactToPrint } from 'react-to-print'

export default function ContractsCustomers() {
  const [startDate, setStartDate] = useState<Date>(
    new Date(new Date().getFullYear(), 0, 1)
  )
  const [endDate, setEndDate] = useState<Date>(new Date())
  const [searchTerm, setSearchTerm] = useState("")
  const [open, setOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const targetRef = useRef<HTMLDivElement>(null)
  const [imagesLoaded, setImagesLoaded] = useState(false)

  const { useListUsers } = useUsers()
  const { data: customersData, isLoading } = useListUsers(
    ["customer"],
    1,
    10,
    searchTerm,
    null
  )
  const customers = customersData?.users || []

  const { useCustomerReport } = useContracts()
  const { data } = useCustomerReport({
    startTime: startDate?.getTime() || 0,
    endTime: endDate?.getTime() || 0,
    status: "cancelled",
    customerId: selectedCustomer?.id,
  })
  const reportData = data || []

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
      const padding = 5

      // Tính toán kích thước PDF dựa trên tỷ lệ canvas
      const pdfWidth = 297 // Chiều rộng tối đa (A4 landscape)
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width + 2 * padding

      // Khởi tạo PDF với kích thước tùy chỉnh
      const pdf = new jsPDF({
        orientation: pdfWidth > pdfHeight ? "l" : "p",
        unit: "mm",
        format: [pdfWidth + 2 * padding, pdfHeight],
      })

      // Thêm ảnh với padding
      pdf.addImage(
        imgData,
        "PNG",
        padding,
        padding,
        pdfWidth,
        pdfHeight - 2 * padding
      )
      pdf.save("bao-cao-hop-dong-khach-hang.pdf")
    } catch (error) {
      console.error("Error generating PDF:", error)
    }
  }

  const handlePrint = useReactToPrint({
    contentRef: targetRef,
    documentTitle: 'bao-cao-hop-dong-khach-hang',
    // pageStyle: `
    //   @page {
    //     size: 420mm 297mm;
    //     margin: 10mm;
    //     scale: 1;
    //   }
    //   @page :even {
    //     display: none;
    //   }
    //   @media print {
    //     html, body {
    //       width: 420mm;
    //       height: 150mm;
    //     }
    //     body {
    //       transform: scale(1);
    //       transform-origin: top left;
    //     }
    //   }
    // `,
  });

  return (
    <div className="container mx-auto p-4 bg-gray-50/30 min-h-screen">
      <Card className="border-0 shadow-md bg-white">
        <CardHeader className="flex flex-row items-center justify-between border-b bg-gray-50/50 pb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Báo cáo hợp đồng khách hàng
          </h1>
          <Button onClick={() => handlePrint()}>
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
                        variant="outline2"
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

                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">Khách hàng</span>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline2"
                        className="h-10 w-[200px] justify-between bg-white hover:bg-gray-50 border-gray-200 text-left font-normal"
                        role="combobox"
                      >
                        {selectedCustomer
                          ? selectedCustomer.fullName
                          : "Chọn khách hàng"}
                        <Search className="ml-2 h-4 w-4 shrink-0 text-gray-400" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0 bg-white border border-gray-200 shadow-lg">
                      <Command className="border-none bg-white">
                        <CommandInput
                          placeholder="Tìm kiếm khách hàng..."
                          value={searchTerm}
                          onValueChange={setSearchTerm}
                          className="border-none focus:ring-0"
                        />
                        <CommandEmpty className="py-4 text-sm text-gray-500 text-center">
                          {isLoading ? "Đang tải..." : "Không tìm thấy khách hàng"}
                        </CommandEmpty>
                        <CommandList>
                          <CommandGroup heading="Gợi ý" className="text-sm text-gray-700">
                              <CommandItem
                                key={'all customers'}
                                value={'Toàn bộ'}
                                className="hover:bg-gray-50 cursor-pointer py-3 px-4"
                                onSelect={() => {
                                  setSelectedCustomer(null)
                                  setOpen(false)
                                }}
                              >
                                <span className="text-gray-700">
                                  Toàn bộ
                                </span>
                              </CommandItem>
                            {customers?.map((customer: any) => (
                              <CommandItem
                                key={customer?.id}
                                value={customer?.fullName}
                                className="hover:bg-gray-50 cursor-pointer py-3 px-4"
                                onSelect={() => {
                                  setSelectedCustomer(customer)
                                  setOpen(false)
                                }}
                              >
                                <span className="text-gray-700">
                                  {customer?.fullName}
                                </span>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex items-start gap-6 bg-gray-50/50 p-6 rounded-lg">
                <img
                  src="/img/logo.png"
                  alt="Company Logo"
                  style={{ width: '150px', height: '60px', objectFit: 'contain' }}
                  fetchPriority="high"
                  onLoad={() => setImagesLoaded(true)}
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
                        Tên khách hàng
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        Bị hủy
                      </TableHead>

                      <TableHead className="font-semibold text-gray-700">
                        Đã đăng ký
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        Đã hoàn thành
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        Tổng số hợp đồng
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportData?.map((row, index) => (
                      <TableRow
                        key={row.customerId}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <TableCell className="  text-gray-600">
                          {index + 1}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {row.customerName}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {row.statistics.cancelled.count}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {row.statistics.draft.count}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {row.statistics.completed.count}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {row.statistics.cancelled?.count +
                            row.statistics.draft?.count +
                            row.statistics.completed?.count}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="text-right mt-4 text-gray-600">
                <p>Hà Nội, Ngày {dayjs().format("D [tháng] M [năm] YYYY")}</p>
              </div>
              <div className="flex justify-between mt-4 px-8">
                <div className="text-center">
                  <p className="font-medium text-gray-800">Người phê duyệt</p>
                  <p className="text-sm text-gray-500">(Ký và ghi rõ họ tên)</p>
                </div>
                <div className="text-center">
                  <p className="font-medium text-gray-800">Người tạo báo cáo</p>
                  <p className="text-sm text-gray-500">(Ký và ghi rõ họ tên)</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
