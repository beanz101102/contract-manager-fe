"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CalendarIcon } from "lucide-react"

import { EmployeeFormData, departmentConfigs } from "@/types/api"
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

export default function CustomerInformationForm() {
  const router = useRouter()
  const { useAddUser } = useUsers()
  const { mutate: addUser } = useAddUser()

  const [code, setCode] = useState("CUS001")
  const [fullName, setFullName] = useState("Trần Thị B")
  const [birthPlace, setBirthPlace] = useState("Hồ Chí Minh")
  const [address, setAddress] = useState("456 Đường XYZ, Quận ABC, Hồ Chí Minh")
  const [gender, setGender] = useState<"Nam" | "Nữ" | "Khác">("Nữ")
  const [birthDate, setBirthDate] = useState("1995-05-15")
  const [idNumber, setIdNumber] = useState("079123456789")
  const [issueDate, setIssueDate] = useState("2021-03-15")
  const [issuePlace, setIssuePlace] = useState("Cục Cảnh sát")
  const [phone, setPhone] = useState("0987654321")
  const [email, setEmail] = useState("tranthib@example.com")

  const handleSubmit = () => {
    const payload = {
      code: code || "",
      fullName: fullName || "",
      placeOfBirth: birthPlace || "",
      address: address || "",
      gender: gender || "",
      dateOfBirth: birthDate || null,
      idNumber: idNumber || "",
      idIssueDate: issueDate || null,
      idIssuePlace: issuePlace || null,
      phoneNumber: phone || "",
      email: email || "",
      department: 1,
      role: "customer",
      position: "Khách hàng",
      passwordHash: "",
    } as EmployeeFormData

    console.log("payload", payload)

    addUser(payload, {
      onSuccess: () => {
        router.push("/customer-list")
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
            onClick={handleSubmit}
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
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    style={{ border: "1px solid #0000004D" }}
                    className="bg-white rounded text-black"
                    placeholder="Mã khách hàng"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-black" htmlFor="fullName">
                    Họ và tên (*)
                  </Label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{
                      border: "1px solid #0000004D",
                    }}
                    className="bg-white rounded text-black"
                    id="fullName"
                    placeholder="Họ và tên"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-black" htmlFor="birthPlace">
                    Nơi sinh
                  </Label>
                  <Input
                    value={birthPlace}
                    onChange={(e) => setBirthPlace(e.target.value)}
                    style={{
                      border: "1px solid #0000004D",
                    }}
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
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={{
                  border: "1px solid #0000004D",
                }}
                className="bg-white rounded text-black"
                id="address"
                placeholder="Địa chỉ"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-black" htmlFor="gender">
                Giới tính (*)
              </Label>
              <Select
                value={gender}
                onValueChange={(value) =>
                  setGender(value as "Nam" | "Nữ" | "Khác")
                }
              >
                <SelectTrigger
                  style={{ border: "1px solid #0000004D" }}
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
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-black" htmlFor="birthDate">
                Ngày sinh
              </Label>
              <div className="relative">
                <Input
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  style={{
                    border: "1px solid #0000004D",
                  }}
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
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                style={{
                  border: "1px solid #0000004D",
                }}
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
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  style={{
                    border: "1px solid #0000004D",
                  }}
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
                value={issuePlace}
                onChange={(e) => setIssuePlace(e.target.value)}
                style={{
                  border: "1px solid #0000004D",
                }}
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
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{
                  border: "1px solid #0000004D",
                }}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  border: "1px solid #0000004D",
                }}
                className="bg-white rounded text-black"
                id="email"
                type="email"
                placeholder="Email"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
