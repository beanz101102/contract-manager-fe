"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { format } from "date-fns"
import { ArrowLeft, CalendarIcon } from "lucide-react"

import { Gender, departmentConfigs } from "@/types/api"
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

export default function EditCustomerInformationForm() {
  const router = useRouter()

  const { id } = useParams()
  const { useUserDetails } = useUsers()
  const { data: user } = useUserDetails(Number(id))
  const { useListDepartments } = useDepartment()
  const { data: departments } = useListDepartments()

  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    dateOfBirth: "",
    placeOfBirth: "",
    address: "",
    idNumber: "",
    idIssueDate: "",
    idIssuePlace: "",
    phoneNumber: "",
    email: "",
    position: "",
    username: "",
    passwordHash: "",
    department: "",
  })

  const [birthDate, setBirthDate] = useState<Date>()
  const [issueDate, setIssueDate] = useState<Date>()

  useEffect(() => {
    if (user) {
      console.log("user?.gender", user?.gender)
      setFormData({
        fullName: user.fullName || "",
        gender: user?.gender || "",
        dateOfBirth: user.dateOfBirth || "",
        placeOfBirth: user.placeOfBirth || "",
        address: user.address || "",
        idNumber: user.idNumber || "",
        idIssueDate: user.idIssueDate || "",
        idIssuePlace: user.idIssuePlace || "",
        phoneNumber: user.phoneNumber || "",
        email: user.email || "",
        position: user.position || "",
        username: user.username || "",
        department: user.department?.departmentName || "",
        passwordHash: user.passwordHash || "",
      })
      setBirthDate(user.dateOfBirth ? new Date(user.dateOfBirth) : undefined)
      setIssueDate(user.idIssueDate ? new Date(user.idIssueDate) : undefined)
    }
  }, [user])

  const handleInputChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }))
    }

  const handleSelectChange =
    (field: keyof typeof formData) => (value: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }

  const { useUpdateUser } = useUsers()

  const { mutate: updateUser } = useUpdateUser(true)

  const handleUpdateUser = () => {
    updateUser({
      username: formData.username,
      fullName: formData.fullName,
      placeOfBirth: formData.placeOfBirth,
      address: formData.address,
      gender: formData.gender as Gender,
      dateOfBirth: formData.dateOfBirth || undefined,
      idNumber: formData.idNumber,
      idIssueDate: formData.idIssueDate || undefined,
      idIssuePlace: formData.idIssuePlace || undefined,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      department: departments?.[0]?.id || 0,
      position: formData.position,
      passwordHash: formData.passwordHash,
      role: "customer",
      id: user?.id,
    })
  }

  const onBirthDateChange = (date: Date | undefined) => {
    setBirthDate(date)
    setFormData((prev) => ({
      ...prev,
      dateOfBirth: date ? format(date, "yyyy-MM-dd") : "",
    }))
  }

  const onIssueDateChange = (date: Date | undefined) => {
    setIssueDate(date)
    setFormData((prev) => ({
      ...prev,
      idIssueDate: date ? format(date, "yyyy-MM-dd") : "",
    }))
  }

  return (
    <div className="container max-w-[1200px] mx-auto p-4 md:p-6">
      <Card className="bg-white rounded-lg shadow-lg border-none">
        <CardHeader className="space-y-0 p-4 md:p-6 border-b">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-xl md:text-2xl font-bold text-gray-900">
              Chỉnh sửa thông tin khách hàng
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
                onClick={handleUpdateUser}
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
                      value={formData.fullName}
                      onChange={handleInputChange("fullName")}
                      className="bg-white border-gray-300"
                      placeholder="Họ và tên"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700">Nơi sinh</Label>
                    <Input
                      value={formData.placeOfBirth}
                      onChange={handleInputChange("placeOfBirth")}
                      className="bg-white border-gray-300"
                      placeholder="Nơi sinh"
                    />
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
                  <Label className="text-gray-700">Địa chỉ</Label>
                  <Input
                    value={formData.address}
                    onChange={handleInputChange("address")}
                    className="bg-white border-gray-300"
                    placeholder="Địa chỉ"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700">Giới tính (*)</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) =>
                      handleSelectChange("gender")(value)
                    }
                  >
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nam">Nam</SelectItem>
                      <SelectItem value="Nữ">Nữ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700">Ngày sinh</Label>
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
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700">Số CCCD (*)</Label>
                  <Input
                    value={formData.idNumber}
                    onChange={handleInputChange("idNumber")}
                    className="bg-white border-gray-300"
                    placeholder="Số CCCD"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700">Ngày cấp</Label>
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
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700">Nơi cấp</Label>
                  <Input
                    value={formData.idIssuePlace}
                    onChange={handleInputChange("idIssuePlace")}
                    className="bg-white border-gray-300"
                    placeholder="Nơi cấp"
                  />
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
                  <Label className="text-gray-700">Số điện thoại</Label>
                  <Input
                    value={formData.phoneNumber}
                    onChange={handleInputChange("phoneNumber")}
                    className="bg-white border-gray-300"
                    placeholder="Số điện thoại"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700">Email (*)</Label>
                  <Input
                    value={formData.email}
                    onChange={handleInputChange("email")}
                    className="bg-white border-gray-300"
                    type="email"
                    placeholder="Email"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700">Chức vụ (*)</Label>
                  <Input
                    value={formData.position}
                    disabled
                    onChange={handleInputChange("position")}
                    className="bg-white border-gray-300"
                    placeholder="Chức vụ"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
