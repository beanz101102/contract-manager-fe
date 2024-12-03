"use client"

import { format } from "date-fns"
import html2canvas from "html2canvas-pro"
import jsPDF from "jspdf"
import { CalendarIcon, Download } from "lucide-react"
import * as React from "react"
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loading } from "@/components/ui/loading"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useContracts } from "@/hooks/useContracts"

// Helper function to generate months array
const generateMonthsArray = () => {
  const months = []
  for (let i = 0; i < 12; i++) {
    months.push({
      month: `Tháng ${i + 1}`,
      contracts: 0,
      completed: 0,
    })
  }
  return months
}

export default function ContractDashboard() {
  const [status, setStatus] = React.useState<string>("all")
  const [date, setDate] = React.useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), 0, 1), // Start of current year
    to: new Date(), // Current time
  })

  const { useAdvancedStatistics } = useContracts()
  const { data, isLoading } = useAdvancedStatistics({
    startTime: date.from.getTime(),
    endTime: date.to.getTime(),
    status: status === "all" ? undefined : status,
  })

  const pieData = React.useMemo(() => {
    if (!data) return []
    return [
      {
        name: "hoàn thành",
        value: data?.summary?.byStatus?.completed ?? 0,
        color: "#4ade80",
      },
      {
        name: "chờ duyệt",
        value: data?.summary?.byStatus?.pending_approval ?? 0,
        color: "#facc15",
      },
      {
        name: "Bị hủy",
        value: data?.summary?.byStatus?.cancelled ?? 0,
        color: "#f87171",
      },
    ]
  }, [data])

  // Transform API data for line/bar chart
  const chartData = React.useMemo(() => {
    if (!data?.monthlyTrend) return generateMonthsArray()

    // Create base array with 12 months
    const monthsData = generateMonthsArray()

    // Map API data to corresponding months
    data.monthlyTrend.forEach((item) => {
      // Parse month from "YYYY-MM" format
      const [year, month] = item.month.split("-")
      const monthNumber = parseInt(month) - 1 // Convert to 0-based index

      if (monthNumber >= 0 && monthNumber < 12) {
        monthsData[monthNumber] = {
          month: `Tháng ${monthNumber + 1}`,
          contracts: item.count,
          completed: 0,
        }
      }
    })

    return monthsData
  }, [data])
  const targetRef = React.useRef<HTMLDivElement>(null)

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
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width + (2 * padding)
      
      // Khởi tạo PDF với kích thước tùy chỉnh
      const pdf = new jsPDF({
        orientation: pdfWidth > pdfHeight ? 'l' : 'p',
        unit: 'mm',
        format: [pdfWidth + (2 * padding), pdfHeight]
      })

      // Thêm ảnh với padding
      pdf.addImage(
        imgData, 
        "PNG", 
        padding, 
        padding, 
        pdfWidth, 
        pdfHeight - (2 * padding)
      )
      pdf.save("bao-cao-hop-dong.pdf")
    } catch (error) {
      console.error("Error generating PDF:", error)
    }
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="p-6 bg-white rounded-[10px] shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Báo cáo thống kê hợp đồng</h1>
        <Button onClick={generatePDF}>
          <Download className="mr-2 h-4 w-4" />
          Xuất báo cáo
        </Button>
      </div>
      <div ref={targetRef}>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <div className="grid gap-4 mb-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Thời gian
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date.from ? (
                          date.to ? (
                            <>
                              {format(date.from, "MM/dd/yyyy")} -{" "}
                              {format(date.to, "MM/dd/yyyy")}
                            </>
                          ) : (
                            format(date.from, "MM/dd/yyyy")
                          )
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date.from}
                        selected={{ from: date.from, to: date.to }}
                        onSelect={(range) =>
                          setDate({ from: range?.from!, to: range?.to! })
                        }
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* <div>
                  <label className="block text-sm font-medium mb-2">
                    Trạng thái
                  </label>
                  <Select
                    defaultValue="all"
                    onValueChange={(value) => setStatus(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="completed">Đã hoàn thành</SelectItem>
                      <SelectItem value="pending">Đang ký</SelectItem>
                      <SelectItem value="cancelled">Bị hủy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Người tạo
                  </label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="Select creator" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Khách hàng
                  </label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                    </SelectContent>
                  </Select>
                </div> */}
              </div>
            </div>
          </div>

          <Card className="bg-white rounded-[10px] shadow-lg">
            <CardHeader>
              <CardTitle className="text-black">
                Thống kê trạng thái hợp đồng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) =>
                        `${name} (${(percent * 100).toFixed(1)}%)`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white rounded-[10px] shadow-lg mt-6">
          <CardHeader>
            <CardTitle className="text-black">
              Thống kê hợp đồng theo năm
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="contracts"
                    name="Count of số hợp đồng"
                    fill="#60a5fa"
                  />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    name="SoLuongHopDongHoanThanhTheoThang"
                    stroke="#2563eb"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
