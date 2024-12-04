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

// Thêm schema validation
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

  // Add state for dates
  const [birthDate, setBirthDate] = useState<Date>()
  const [issueDate, setIssueDate] = useState<Date>()

  // Update the dates when calendar selection changes
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
    <Card className="w-full bg-white rounded-[10px] border-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-b-[#675D5D]">
        <CardTitle className="text-2xl font-bold text-black">
          Tạo mới nhân viên
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
            onClick={form.handleSubmit(onSubmit)}
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
                    Mã nhân viên (*)
                  </Label>
                  <Input
                    {...form.register("code")}
                    style={{ border: "1px solid #0000004D" }}
                    className={cn("bg-white rounded text-black", {
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-black" htmlFor="fullName">
                    Họ và tên (*)
                  </Label>
                  <Input
                    {...form.register("fullName")}
                    style={{
                      border: "1px solid #0000004D",
                    }}
                    className="bg-white rounded text-black"
                    id="fullName"
                    placeholder="Họ và tên"
                  />
                  {form.formState.errors.fullName && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.fullName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-black" htmlFor="birthPlace">
                    Nơi sinh (*)
                  </Label>
                  <Input
                    {...form.register("birthPlace")}
                    style={{
                      border: "1px solid #0000004D",
                    }}
                    className="bg-white rounded text-black"
                    id="birthPlace"
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-black" htmlFor="address">
                Địa chỉ (*)
              </Label>
              <Input
                {...form.register("address")}
                style={{
                  border: "1px solid #0000004D",
                }}
                className="bg-white rounded text-black"
                id="address"
                placeholder="Địa chỉ"
              />
              {form.formState.errors.address && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.address.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-black" htmlFor="gender">
                Giới tính (*)
              </Label>
              <Select
                onValueChange={(value) =>
                  form.setValue("gender", value as "Nam" | "Nữ" | "Khác")
                }
                value={form.watch("gender")}
              >
                <SelectTrigger
                  style={{ border: "1px solid #0000004D" }}
                  className={cn("rounded text-black", {
                    "border-red-500": form.formState.errors.gender,
                  })}
                >
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
              {form.formState.errors.birthDate && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.birthDate.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-black" htmlFor="idNumber">
                Số CCCD (*)
              </Label>
              <Input
                {...form.register("idNumber")}
                style={{
                  border: "1px solid #0000004D",
                }}
                className="bg-white rounded text-black"
                id="idNumber"
                placeholder="Số CCCD"
              />
              {form.formState.errors.idNumber && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.idNumber.message}
                </p>
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
              {form.formState.errors.issueDate && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.issueDate.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-black" htmlFor="issuePlace">
                Nơi cấp (*)
              </Label>
              <Input
                {...form.register("issuePlace")}
                style={{
                  border: "1px solid #0000004D",
                }}
                className="bg-white rounded text-black"
                id="issuePlace"
                placeholder="Nơi cấp"
              />
              {form.formState.errors.issuePlace && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.issuePlace.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-black" htmlFor="phone">
                Số điện thoại (*)
              </Label>
              <Input
                {...form.register("phone")}
                style={{
                  border: "1px solid #0000004D",
                }}
                className="bg-white rounded text-black"
                id="phone"
                placeholder="Số điện thoại"
              />
              {form.formState.errors.phone && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.phone.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-black" htmlFor="email">
                Email (*)
              </Label>
              <Input
                {...form.register("email")}
                style={{
                  border: "1px solid #0000004D",
                }}
                className="bg-white rounded text-black"
                id="email"
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-black" htmlFor="department">
                Phòng ban (*)
              </Label>
              <Select
                onValueChange={(value) => form.setValue("department", value)}
                value={form.watch("department")}
              >
                <SelectTrigger
                  style={{ border: "1px solid #0000004D" }}
                  className={cn("rounded text-black", {
                    "border-red-500": form.formState.errors.department,
                  })}
                >
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
              <Label className="text-black" htmlFor="position">
                Chức vụ (*)
              </Label>
              <Select
                onValueChange={(value) => form.setValue("position", value)}
                value={form.watch("position")}
              >
                <SelectTrigger
                  style={{ border: "1px solid #0000004D" }}
                  className={cn("rounded text-black", {
                    "border-red-500": form.formState.errors.position,
                  })}
                >
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-black" htmlFor="account">
                Tài khoản (*)
              </Label>
              <Input
                {...form.register("account")}
                style={{
                  border: "1px solid #0000004D",
                }}
                className="bg-white rounded text-black"
                id="account"
                placeholder="Tài khoản"
              />
              {form.formState.errors.account && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.account.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-black" htmlFor="password">
                Mật khẩu (*)
              </Label>
              <Input
                {...form.register("password")}
                style={{
                  border: "1px solid #0000004D",
                }}
                className="bg-white rounded text-black"
                id="password"
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
      </CardContent>
    </Card>
  )
}
