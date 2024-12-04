"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { ArrowLeft, CalendarIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { EmployeeFormData, departmentConfigs } from "@/types/api"
import { cn } from "@/lib/utils"
import { useUsers } from "@/hooks/useUsers"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

// Add validation schema
const customerSchema = z.object({
  code: z.string().min(1, "Mã khách hàng là bắt buộc"),
  fullName: z.string().min(1, "Họ và tên là bắt buộc"),
  birthPlace: z.string().min(1, "Nơi sinh là bắt buộc"),
  address: z.string().min(1, "Địa chỉ là bắt buộc"),
  gender: z.enum(["Nam", "Nữ", "Khác"], {
    required_error: "Giới tính là bắt buộc",
  }),
  birthDate: z.string().min(1, "Ngày sinh là bắt buộc"),
  idNumber: z.string().min(1, "Số CCCD là bắt buộc"),
  issueDate: z.string().min(1, "Ngày cấp là bắt buộc"),
  issuePlace: z.string().min(1, "Nơi cấp là bắt buộc"),
  phone: z.string().min(1, "Số điện thoại là bắt buộc"),
  email: z.string().email("Email không hợp lệ").min(1, "Email là bắt buộc"),
})

type CustomerFormData = z.infer<typeof customerSchema>

export default function CustomerInformationForm() {
  const router = useRouter()
  const { useAddUser } = useUsers()
  const { mutate: addUser } = useAddUser()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
  })

  const [birthDate, setBirthDate] = useState<Date>()
  const [issueDate, setIssueDate] = useState<Date>()

  const onSubmit = (data: CustomerFormData) => {
    const payload = {
      ...data,
      department: 1,
      role: "customer",
      position: "Khách hàng",
      passwordHash: "",
    } as unknown as EmployeeFormData

    addUser(payload, {
      onSuccess: () => {
        router.push("/customers")
      },
    })
  }

  const onBirthDateChange = (date: Date | undefined) => {
    setBirthDate(date)
    setValue("birthDate", date ? format(date, "yyyy-MM-dd") : "")
  }

  const onIssueDateChange = (date: Date | undefined) => {
    setIssueDate(date)
    setValue("issueDate", date ? format(date, "yyyy-MM-dd") : "")
  }

  return (
    <Card className="w-full bg-white rounded-[10px] border-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-b-[#675D5D]">
        <CardTitle className="text-2xl font-bold text-black">
          Thêm mới khách hàng
        </CardTitle>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center bg-[#F3F6F9] text-[#AAAAAA] font-semibold border-none h-[40px] rounded text-lg"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            className="bg-[#4BC5BE] hover:bg-[#2ea39d] rounded text-white font-semibold"
          >
            Lưu thông tin
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mt-10">
          <div className="flex space-x-4">
            <div className="w-1/3">
              <div className="w-32 h-32 bg-gray-200 rounded-md flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>
            <div className="w-2/3 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-black" htmlFor="code">
                    Mã khách hàng (*)
                  </Label>
                  <Input
                    {...register("code")}
                    style={{
                      border: errors.code
                        ? "1px solid red"
                        : "1px solid #0000004D",
                    }}
                    className="bg-white rounded text-black"
                    placeholder="Mã khách hàng"
                  />
                  {errors.code && (
                    <span className="text-red-500 text-sm">
                      {errors.code.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-black" htmlFor="fullName">
                    Họ và tên (*)
                  </Label>
                  <Input
                    {...register("fullName")}
                    style={{
                      border: "1px solid #0000004D",
                    }}
                    className="bg-white rounded text-black"
                    id="fullName"
                    placeholder="Họ và tên"
                  />
                  {errors.fullName && (
                    <p className="text-red-500">{errors.fullName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-black" htmlFor="birthPlace">
                    Nơi sinh (*)
                  </Label>
                  <Input
                    {...register("birthPlace")}
                    style={{
                      border: errors.birthPlace
                        ? "1px solid red"
                        : "1px solid #0000004D",
                    }}
                    className="bg-white rounded text-black"
                    id="birthPlace"
                    placeholder="Nơi sinh"
                  />
                  {errors.birthPlace && (
                    <p className="text-red-500">{errors.birthPlace.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-black" htmlFor="address">
                Địa chỉ (*)
              </Label>
              <Input
                {...register("address")}
                style={{
                  border: errors.address
                    ? "1px solid red"
                    : "1px solid #0000004D",
                }}
                className="bg-white rounded text-black"
                id="address"
                placeholder="Địa chỉ"
              />
              {errors.address && (
                <p className="text-red-500">{errors.address.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-black" htmlFor="gender">
                Giới tính (*)
              </Label>
              <Select
                onValueChange={(value) =>
                  setValue("gender", value as "Nam" | "Nữ" | "Khác")
                }
              >
                <SelectTrigger
                  style={{
                    border: errors.gender
                      ? "1px solid red"
                      : "1px solid #0000004D",
                  }}
                  className="rounded text-black"
                >
                  <SelectValue placeholder="Chọn giới tính" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nam">Nam</SelectItem>
                  <SelectItem value="Nữ">Nữ</SelectItem>
                  <SelectItem value="Khác">Khác</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <span className="text-red-500 text-sm">
                  {errors.gender.message}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-black" htmlFor="birthDate">
                Ngày sinh (*)
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline2"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !birthDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {birthDate ? format(birthDate, "dd/MM/yyyy") : "Chọn ngày"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={birthDate}
                    onSelect={onBirthDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.birthDate && (
                <p className="text-red-500">{errors.birthDate.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-black" htmlFor="idNumber">
                Số CCCD (*)
              </Label>
              <Input
                {...register("idNumber")}
                style={{
                  border: "1px solid #0000004D",
                }}
                className="bg-white rounded text-black"
                id="idNumber"
                placeholder="Số CCCD"
              />
              {errors.idNumber && (
                <p className="text-red-500">{errors.idNumber.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-black" htmlFor="issueDate">
                Ngày cấp (*)
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline2"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !issueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {issueDate ? format(issueDate, "dd/MM/yyyy") : "Chọn ngày"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={issueDate}
                    onSelect={onIssueDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.issueDate && (
                <p className="text-red-500">{errors.issueDate.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-black" htmlFor="issuePlace">
                Nơi cấp (*)
              </Label>
              <Input
                {...register("issuePlace")}
                style={{
                  border: errors.issuePlace
                    ? "1px solid red"
                    : "1px solid #0000004D",
                }}
                className="bg-white rounded text-black"
                id="issuePlace"
                placeholder="Nơi cấp"
              />
              {errors.issuePlace && (
                <p className="text-red-500">{errors.issuePlace.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-black" htmlFor="phone">
                Số điện thoại (*)
              </Label>
              <Input
                {...register("phone")}
                style={{
                  border: "1px solid #0000004D",
                }}
                className="bg-white rounded text-black"
                id="phone"
                placeholder="Số điện thoại"
              />
              {errors.phone && (
                <p className="text-red-500">{errors.phone.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-black" htmlFor="email">
                Email (*)
              </Label>
              <Input
                {...register("email")}
                style={{
                  border: "1px solid #0000004D",
                }}
                className="bg-white rounded text-black"
                id="email"
                type="email"
                placeholder="Email"
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
