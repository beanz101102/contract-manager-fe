"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, CalendarIcon } from "lucide-react"

import { Gender, departmentConfigs } from "@/types/api"
import { useUsers } from "@/hooks/useUsers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function EditEmployeeInformationForm() {
  const router = useRouter()

  const { id } = useParams()
  const { useUserDetails } = useUsers()
  const { data: user } = useUserDetails(Number(id))

  const [formData, setFormData] = useState({
    code: "",
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

  useEffect(() => {
    if (user) {
      console.log("user?.gender", user?.gender)
      setFormData({
        code: user.code || "",
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

  const { mutate: updateUser } = useUpdateUser()

  const handleUpdateUser = () => {
    updateUser({
      code: formData.code,
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
      department:
        departmentConfigs.find((config) => config.label === formData.department)
          ?.value || 0,
      position: formData.position,
      passwordHash: formData.passwordHash,
      role: "employee",
      id: user?.id,
    })
  }

  return (
    <Card className="w-full bg-white rounded-[10px] border-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-b-[#675D5D]">
        <CardTitle className="text-2xl font-bold text-black">
          Chỉnh sửa thông tin nhân viên
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
            onClick={handleUpdateUser}
            className="bg-[#4BC5BE] hover:bg-[#2ea39d] rounded text-white font-semibold"
          >
            Lưu thông tin
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form className="space-y-4 mt-10">
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
                  <Label className="text-black" htmlFor="employeeCode">
                    Mã nhân viên (*)
                  </Label>
                  <Input
                    id="employeeCode"
                    value={formData.code}
                    onChange={handleInputChange("code")}
                    style={{
                      border: "1px solid #0000004D",
                    }}
                    className="bg-white rounded text-black"
                    placeholder="Mã nhân viên"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-black" htmlFor="fullName">
                    Họ và tên (*)
                  </Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange("fullName")}
                    style={{
                      border: "1px solid #0000004D",
                    }}
                    className="bg-white rounded text-black"
                    placeholder="Họ và tên"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-black" htmlFor="birthPlace">
                    Nơi sinh
                  </Label>
                  <Input
                    value={formData.placeOfBirth}
                    onChange={handleInputChange("placeOfBirth")}
                    className="bg-white rounded text-black"
                    id="birthPlace"
                    placeholder="Nơi sinh"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-black" htmlFor="address">
                Địa chỉ
              </Label>
              <Input
                style={{
                  border: "1px solid #0000004D",
                }}
                className="bg-white rounded text-black"
                id="address"
                value={formData.address}
                onChange={handleInputChange("address")}
                placeholder="Địa chỉ"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-black" htmlFor="gender">
                Giới tính (*)
              </Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleSelectChange("gender")(value)}
              >
                <SelectTrigger className="rounded text-black" id="gender">
                  <SelectValue placeholder="Chọn giới tính" />
                </SelectTrigger>
                <SelectContent
                  style={{
                    border: "1px solid #0000004D",
                  }}
                  className="rounded text-black"
                >
                  <SelectItem value="Nam">Nam</SelectItem>
                  <SelectItem value="Nữ">Nữ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-black" htmlFor="birthDate">
                Ngày sinh
              </Label>
              <div className="relative">
                <Input
                  value={formData.dateOfBirth}
                  onChange={handleInputChange("dateOfBirth")}
                  className="bg-white rounded text-black"
                  id="birthDate"
                  placeholder="dd/mm/yyyy"
                  type="date"
                />
                <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-black" htmlFor="idNumber">
                Số CCCD (*)
              </Label>
              <Input
                value={formData.idNumber}
                onChange={handleInputChange("idNumber")}
                className="bg-white rounded text-black"
                id="idNumber"
                placeholder="Số CCCD"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-black" htmlFor="issueDate">
                Ngày cấp
              </Label>
              <div className="relative">
                <Input
                  value={formData.idIssueDate}
                  onChange={handleInputChange("idIssueDate")}
                  className="bg-white rounded text-black"
                  id="issueDate"
                  placeholder="dd/mm/yyyy"
                  type="date"
                />
                <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-black" htmlFor="issuePlace">
                Nơi cấp
              </Label>
              <Input
                value={formData.idIssuePlace}
                onChange={handleInputChange("idIssuePlace")}
                className="bg-white rounded text-black"
                id="issuePlace"
                placeholder="Nơi cấp"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-black" htmlFor="phone">
                Số điện thoại
              </Label>
              <Input
                value={formData.phoneNumber}
                onChange={handleInputChange("phoneNumber")}
                className="bg-white rounded text-black"
                id="phone"
                placeholder="Số điện thoại"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-black" htmlFor="email">
                Email (*)
              </Label>
              <Input
                value={formData.email}
                onChange={handleInputChange("email")}
                className="bg-white rounded text-black"
                id="email"
                type="email"
                placeholder="Email"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-black" htmlFor="department">
                Phòng ban (*)
              </Label>
              <Select
                value={formData.department}
                onValueChange={(value) =>
                  handleSelectChange("department")(value)
                }
              >
                <SelectTrigger className="rounded text-black" id="department">
                  <SelectValue placeholder="Chọn phòng ban" />
                </SelectTrigger>
                <SelectContent
                  style={{
                    border: "1px solid #0000004D",
                  }}
                  className="rounded text-black"
                >
                  {departmentConfigs?.map((department) => (
                    <SelectItem value={department.label.toString()}>
                      {department.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-black" htmlFor="position">
                Chức vụ (*)
              </Label>
              <Input
                value={formData.position}
                onChange={handleInputChange("position")}
                className="bg-white rounded text-black"
                id="position"
                placeholder="Chức vụ"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-black" htmlFor="account">
                Tài khoản (*)
              </Label>
              <Input
                value={formData.username}
                onChange={handleInputChange("username")}
                className="bg-white rounded text-black"
                id="account"
                placeholder="Tài khoản"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-black" htmlFor="password">
                Mật khẩu (*)
              </Label>
              <Input
                value={formData.passwordHash}
                onChange={handleInputChange("passwordHash")}
                className="bg-white rounded text-black"
                id="password"
                type="password"
                placeholder="Mật khẩu"
              />
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
