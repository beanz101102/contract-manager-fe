"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { ArrowLeft, CalendarIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import {
  EmployeeFormData,
  departmentConfigs,
  positionConfigs,
} from "@/types/api"
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

const employeeSchema = z.object({
  code: z.string().min(1, "Mã nhân viên là bắt buộc"),
  fullName: z.string().min(1, "Họ và tên là bắt buộc"),
  birthPlace: z.string().min(1, "Nơi sinh là bắt buộc"),
  address: z.string().min(1, "Địa chỉ là bắt buộc"),
  gender: z.enum(["Nam", "Nữ", "Khác"], {
    required_error: "Vui lòng chọn giới tính",
  }),
  birthDate: z.string().min(1, "Ngày sinh là bắt buộc"),
  idNumber: z.string().min(1, "Số CCCD là bắt buộc"),
  issueDate: z.string().min(1, "Ngày cấp là bắt buộc"),
  issuePlace: z.string().min(1, "Nơi cấp là bắt buộc"),
  phone: z.string().min(1, "Số điện thoại là bắt buộc"),
  email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ"),
  department: z.string().min(1, "Phòng ban là bắt buộc"),
  position: z.string().min(1, "Chức vụ là bắt buộc"),
  account: z.string().min(1, "Tài khoản là bắt buộc"),
  password: z
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .min(1, "Mật khẩu là bắt buộc"),
})

type EmployeeFormValues = z.infer<typeof employeeSchema>

export default function EmployeeRegistrationForm() {
  const router = useRouter()
  const { useAddUser } = useUsers()
  const { mutate: addUser } = useAddUser()
  const { useListDepartments } = useDepartment()
  const { data: departments } = useListDepartments()
  const { user } = useAuth()
  const [birthDate, setBirthDate] = useState<Date>()
  const [issueDate, setIssueDate] = useState<Date>()

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      code: "",
      fullName: "",
      birthPlace: "",
      address: "",
      gender: undefined,
      birthDate: "",
      idNumber: "",
      issueDate: "",
      issuePlace: "",
      phone: "",
      email: "",
      department: "",
      position: "",
      account: "",
      password: "",
    },
  })

  const onBirthDateChange = (date: Date | undefined) => {
    setBirthDate(date)
    form.setValue("birthDate", date ? format(date, "yyyy-MM-dd") : "")
  }

  const onIssueDateChange = (date: Date | undefined) => {
    setIssueDate(date)
    form.setValue("issueDate", date ? format(date, "yyyy-MM-dd") : "")
  }

  const onSubmit = (values: EmployeeFormValues) => {
    const payload = {
      ...values,
      dateOfBirth: values.birthDate || null,
      placeOfBirth: values.birthPlace,
      idIssueDate: values.issueDate || null,
      idIssuePlace: values.issuePlace || null,
      phoneNumber: values.phone,
      username: values.account,
      passwordHash: values.password,
      department:
        departments?.find((dept) => dept.departmentName === values.department)
          ?.id || 0,
      role:
        positionConfigs.find((pos) => pos.value === values.position)?.value ||
        "",
    } as EmployeeFormData

    addUser(payload, {
      onSuccess: () => {
        router.push("/employees")
      },
    })
  }

  return (
    <div className="container max-w-[1200px] mx-auto p-4 md:p-6">
      <Card className="bg-white rounded-lg shadow-lg border-none">
        <CardHeader className="space-y-0 p-4 md:p-6 border-b">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-xl md:text-2xl font-bold text-gray-900">
              Tạo mới nhân viên
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
                onClick={form.handleSubmit(onSubmit)}
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
                    <Label className="text-gray-700">Mã nhân viên (*)</Label>
                    <Input
                      {...form.register("code")}
                      className={cn("bg-white border-gray-300", {
                        "border-red-500": form.formState.errors.code,
                      })}
                      placeholder="Mã nhân viên"
                    />
                    {form.formState.errors.code && (
                      <p className="text-red-500 text-sm">
                        {form.formState.errors.code.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700">Họ và tên (*)</Label>
                    <Input
                      {...form.register("fullName")}
                      className="bg-white border-gray-300"
                      placeholder="Họ và tên"
                    />
                    {form.formState.errors.fullName && (
                      <p className="text-red-500 text-sm">
                        {form.formState.errors.fullName.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700">Nơi sinh (*)</Label>
                    <Input
                      {...form.register("birthPlace")}
                      className="bg-white border-gray-300"
                      placeholder="Nơi sinh"
                    />
                    {form.formState.errors.birthPlace && (
                      <p className="text-red-500 text-sm">
                        {form.formState.errors.birthPlace.message}
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
                    {...form.register("address")}
                    className="bg-white border-gray-300"
                    placeholder="Địa chỉ"
                  />
                  {form.formState.errors.address && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.address.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700">Giới tính (*)</Label>
                  <Select
                    onValueChange={(value) =>
                      form.setValue("gender", value as "Nam" | "Nữ" | "Khác")
                    }
                    value={form.watch("gender")}
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
                  {form.formState.errors.gender && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.gender.message}
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
                          "w-full justify-start text-left font-normal bg-white",
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
                  {form.formState.errors.birthDate && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.birthDate.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700">Số CCCD (*)</Label>
                  <Input
                    {...form.register("idNumber")}
                    className="bg-white border-gray-300"
                    placeholder="Số CCCD"
                  />
                  {form.formState.errors.idNumber && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.idNumber.message}
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
                          "w-full justify-start text-left font-normal bg-white",
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
                  {form.formState.errors.issueDate && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.issueDate.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700">Nơi cấp (*)</Label>
                  <Input
                    {...form.register("issuePlace")}
                    className="bg-white border-gray-300"
                    placeholder="Nơi cấp"
                  />
                  {form.formState.errors.issuePlace && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.issuePlace.message}
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
                    {...form.register("phone")}
                    className="bg-white border-gray-300"
                    placeholder="Số điện thoại"
                  />
                  {form.formState.errors.phone && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.phone.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700">Email (*)</Label>
                  <Input
                    {...form.register("email")}
                    className="bg-white border-gray-300"
                    type="email"
                    placeholder="Email"
                  />
                  {form.formState.errors.email && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Work Information Section */}
            <div className="space-y-6 p-4 md:p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Thông tin công việc
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-700">Phòng ban (*)</Label>
                  <Select
                    onValueChange={(value) =>
                      form.setValue("department", value)
                    }
                    value={form.watch("department")}
                  >
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue placeholder="Chọn phòng ban" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments?.map((dept) => (
                        <SelectItem key={dept.id} value={dept.departmentName}>
                          {dept.departmentName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.department && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.department.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700">Chức vụ (*)</Label>
                  <Select
                    onValueChange={(value) => form.setValue("position", value)}
                    value={form.watch("position")}
                  >
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue placeholder="Chọn chức vụ" />
                    </SelectTrigger>
                    <SelectContent>
                      {positionConfigs
                        .filter((pos) => {
                          if (user?.role === "admin") return true
                          if (user?.role === "manager")
                            return pos.value === "employee"
                          return false
                        })
                        .map((pos) => (
                          <SelectItem key={pos.value} value={pos.value}>
                            {pos.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.position && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.position.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700">Tài khoản (*)</Label>
                  <Input
                    {...form.register("account")}
                    className="bg-white border-gray-300"
                    placeholder="Tài khoản"
                  />
                  {form.formState.errors.account && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.account.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700">Mật khẩu (*)</Label>
                  <Input
                    {...form.register("password")}
                    className="bg-white border-gray-300"
                    type="password"
                    placeholder="Mật khẩu"
                  />
                  {form.formState.errors.password && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.password.message}
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
