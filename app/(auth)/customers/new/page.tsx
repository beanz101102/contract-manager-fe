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
import { useDepartment } from "@/hooks/useDepartment"
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
  const { useListDepartments } = useDepartment()
  const { data: departments } = useListDepartments()

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
      department: departments?.[0]?.id,
      dateOfBirth: data.birthDate || null,
      placeOfBirth: data.birthPlace,
      idIssueDate: data.issueDate || null,
      idIssuePlace: data.issuePlace || null,
      phoneNumber: data.phone,
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
    <div className="container max-w-[1200px] mx-auto p-4 md:p-6">
      <Card className="bg-white rounded-lg shadow-lg border-none">
        <CardHeader className="space-y-0 p-4 md:p-6 border-b">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-xl md:text-2xl font-bold text-gray-900">
              Thêm mới khách hàng
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="flex items-center bg-gray-50 text-gray-600 border-none h-10"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
              </Button>
              <Button
                onClick={handleSubmit(onSubmit)}
                className="bg-teal-500 hover:bg-teal-600 text-white h-10"
              >
                Lưu thông tin
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 md:p-6">
          <div className="space-y-6">
            {/* Profile Section */}
            <div className="grid grid-cols-1 md:grid-cols-[200px,1fr] gap-6">
              <div className="w-32 md:w-full mx-auto">
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
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

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700">Họ và tên (*)</Label>
                    <Input
                      {...register("fullName")}
                      className="bg-white border-gray-300"
                      placeholder="Họ và tên"
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700">Nơi sinh (*)</Label>
                    <Input
                      {...register("birthPlace")}
                      className="bg-white border-gray-300"
                      placeholder="Nơi sinh"
                    />
                    {errors.birthPlace && (
                      <p className="text-red-500 text-sm">
                        {errors.birthPlace.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="space-y-6 p-4 md:p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Thông tin cá nhân
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-700">Địa chỉ (*)</Label>
                  <Input
                    {...register("address")}
                    className="bg-white border-gray-300"
                    placeholder="Địa chỉ"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm">
                      {errors.address.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700">Giới tính (*)</Label>
                  <Select
                    onValueChange={(value) =>
                      setValue("gender", value as "Nam" | "Nữ" | "Khác")
                    }
                  >
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nam">Nam</SelectItem>
                      <SelectItem value="Nữ">Nữ</SelectItem>
                      <SelectItem value="Khác">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && (
                    <p className="text-red-500 text-sm">
                      {errors.gender.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700">Ngày sinh (*)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-white border-gray-300",
                          !birthDate && "text-gray-500"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {birthDate
                          ? format(birthDate, "dd/MM/yyyy")
                          : "Chọn ngày"}
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
                    <p className="text-red-500 text-sm">
                      {errors.birthDate.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700">Số CCCD (*)</Label>
                  <Input
                    {...register("idNumber")}
                    className="bg-white border-gray-300"
                    placeholder="Số CCCD"
                  />
                  {errors.idNumber && (
                    <p className="text-red-500 text-sm">
                      {errors.idNumber.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700">Ngày cấp (*)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-white border-gray-300",
                          !issueDate && "text-gray-500"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {issueDate
                          ? format(issueDate, "dd/MM/yyyy")
                          : "Chọn ngày"}
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
                    <p className="text-red-500 text-sm">
                      {errors.issueDate.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700">Nơi cấp (*)</Label>
                  <Input
                    {...register("issuePlace")}
                    className="bg-white border-gray-300"
                    placeholder="Nơi cấp"
                  />
                  {errors.issuePlace && (
                    <p className="text-red-500 text-sm">
                      {errors.issuePlace.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="space-y-6 p-4 md:p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Thông tin liên hệ
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-700">Số điện thoại (*)</Label>
                  <Input
                    {...register("phone")}
                    className="bg-white border-gray-300"
                    placeholder="Số điện thoại"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700">Email (*)</Label>
                  <Input
                    {...register("email")}
                    className="bg-white border-gray-300"
                    type="email"
                    placeholder="Email"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
