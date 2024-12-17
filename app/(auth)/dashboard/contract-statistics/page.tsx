"use client"

import * as React from "react"
import { format } from "date-fns"
import html2canvas from "html2canvas-pro"
import jsPDF from "jspdf"
import {
  CalendarIcon,
  CarrotIcon,
  Check,
  ChevronDown,
  Download,
} from "lucide-react"
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

import { cn } from "@/lib/utils"
import { useContracts } from "@/hooks/useContracts"
import { useUsers } from "@/hooks/useUsers"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Loading } from "@/components/ui/loading"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
  const [creatorId, setCreatorId] = React.useState<string>("all")
  const [customerId, setCustomerId] = React.useState<string>("all")

  const { useAdvancedStatistics } = useContracts()
  const { useListUsers } = useUsers()
  const { data: creators } = useListUsers(
    ["employee", "manager", "admin"],
    1,
    100
  )
  const { data: customers } = useListUsers(["customer"], 1, 100)
  const { data, isLoading } = useAdvancedStatistics({
    startTime: date.from.getTime(),
    endTime: date.to.getTime(),
    status: status === "all" ? undefined : status,
    createdById: creatorId === "all" ? undefined : Number(creatorId),
    customerId: customerId === "all" ? undefined : Number(customerId),
  })

  const pieData = React.useMemo(() => {
    if (!data) return []
    const summaryData = {
      completed: data?.summary?.byStatus?.completed ?? 0,
      pending_approval: data?.summary?.byStatus?.pending_approval ?? 0,
      rejected: data?.summary?.byStatus?.rejected ?? 0,
      draft: data?.summary?.byStatus?.draft ?? 0,
      ready_to_sign: data?.summary?.byStatus?.ready_to_sign ?? 0,
      cancelled: data?.summary?.byStatus?.cancelled ?? 0,
    }

    return [
      {
        name: summaryData?.completed !== 0 ? "Hoàn thành" : "",
        value: summaryData?.completed ?? 0,
        color: "#4ade80", // green
      },
      {
        name: summaryData?.pending_approval !== 0 ? "Chờ duyệt" : "",
        value: summaryData?.pending_approval ?? 0,
        color: "#facc15", // yellow
      },
      {
        name: summaryData?.rejected !== 0 ? "Từ chối" : "",
        value: summaryData?.rejected ?? 0,
        color: "#f43f5e", // rose
      },
      {
        name: summaryData?.draft !== 0 ? "Mới" : "",
        value: summaryData?.draft ?? 0,
        color: "#94a3b8", // slate
      },
      {
        name: summaryData?.ready_to_sign !== 0 ? "Sẵn sàng ký" : "",
        value: summaryData?.ready_to_sign ?? 0,
        color: "#60a5fa", // blue
      },
      {
        name: summaryData?.cancelled !== 0 ? "Đã hủy" : "",
        value: summaryData?.cancelled ?? 0,
        color: "#f87171", // red
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
        <div className="grid gap-6 md:grid-cols-3">
          <div className='col-span-1'>
            <div className="grid gap-4 mb-6">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Thời gian
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline2"
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

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Trạng thái
                  </label>
                  <Select
                    value={status}
                    onValueChange={(value) => setStatus(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="draft">Mới</SelectItem>
                      <SelectItem value="completed">Đã hoàn thành</SelectItem>
                      <SelectItem value="pending_approval">Đợi duyệt</SelectItem>
                      <SelectItem value="ready_to_sign">Đợi ký</SelectItem>
                      <SelectItem value="rejected">Yêu cầu sửa</SelectItem>
                      <SelectItem value="cancelled">Bị hủy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Người tạo
                  </label>
                  <Select
                    value={creatorId}
                    onValueChange={(value) => setCreatorId(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select creator" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      {creators?.users?.map((creator) => (
                        <SelectItem
                          key={creator.id}
                          value={creator.id.toString()}
                        >
                          {creator.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Khách hàng
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between bg-white border-gray-300 text-gray-700"
                      >
                        {customerId === "all"
                          ? "Tất cả"
                          : customers?.users?.find(
                              (customer) =>
                                customer.id.toString() === customerId
                            )?.fullName || "Chọn khách hàng"}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput
                          placeholder="Tìm kiếm khách hàng..."
                          className="h-9"
                        />
                        <CommandEmpty>Không tìm thấy khách hàng</CommandEmpty>
                        <CommandList>
                          <CommandGroup>
                            <CommandItem
                              onSelect={() => setCustomerId("all")}
                              className="cursor-pointer"
                            >
                              {customerId === "all" && (
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    "text-green-500"
                                  )}
                                />
                              )}
                              <p className="text-sm text-gray-700">Tất cả</p>
                            </CommandItem>
                            {customers?.users && customers.users.length > 0 ? (
                              customers.users.map((customer) => (
                                <CommandItem
                                  key={customer.id}
                                  onSelect={() =>
                                    setCustomerId(customer.id.toString())
                                  }
                                  className="cursor-pointer"
                                >
                                  {customerId === customer.id.toString() && (
                                    <Check
                                      className={cn(
                                        "mr-2 h-4  w-4",
                                        "text-green-500"
                                      )}
                                    />
                                  )}
                                  <p className="text-sm text-gray-700">
                                    {customer.fullName}
                                  </p>
                                </CommandItem>
                              ))
                            ) : (
                              <CommandItem className="cursor-not-allowed opacity-50">
                                Không có khách hàng
                              </CommandItem>
                            )}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </div>

          <Card className="bg-white rounded-[10px] shadow-lg col-span-2">
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
                      label={({ name, percent, value }) =>
                        `${name}(${value}) - ${(percent * 100).toFixed(1)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color}>{entry.value}</Cell>
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
                  <Bar dataKey="contracts" name="Số hợp đồng" fill="#60a5fa" />
                  {/* <Line
                    type="monotone"
                    dataKey="completed"
                    name="Số lượng hợp đồng theo tháng"
                    stroke="#2563eb"
                  /> */}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
