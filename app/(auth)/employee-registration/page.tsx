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

export default function EmployeeRegistrationForm() {
  const router = useRouter()
  const { useAddUser } = useUsers()
  const { mutate: addUser } = useAddUser()

  const [code, setCode] = useState("")
  const [fullName, setFullName] = useState("")
  const [birthPlace, setBirthPlace] = useState("")
  const [address, setAddress] = useState("")
  const [gender, setGender] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [idNumber, setIdNumber] = useState("")
  const [issueDate, setIssueDate] = useState("")
  const [issuePlace, setIssuePlace] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [department, setDepartment] = useState("")
  const [position, setPosition] = useState("")
  const [account, setAccount] = useState("")
  const [password, setPassword] = useState("")
  const [active, setActive] = useState(true)

  const handleSubmit = () => {
    const payload = {
      code,
      username: account,
      fullName,
      placeOfBirth: birthPlace,
      address,
      gender,
      dateOfBirth: birthDate || null,
      idNumber,
      idIssueDate: issueDate || null,
      idIssuePlace: issuePlace || null,
      phoneNumber: phone,
      email,
      department:
        departmentConfigs.find((config) => config.label === department)
          ?.value || 0,
      position,
      passwordHash: password,
      role: "employee",
    } as EmployeeFormData

    console.log("payload", payload)

    addUser(payload, {
      onSuccess: () => {
        router.push("/employee-list")
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
                    Mã nhân viên (*)
                  </Label>
                  <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    style={{ border: "1px solid #0000004D" }}
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-black" htmlFor="department">
                Phòng ban (*)
              </Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger
                  style={{ border: "1px solid #0000004D" }}
                  className="rounded text-black"
                >
                  <SelectValue placeholder="Chọn phòng ban" />
                </SelectTrigger>
                <SelectContent>
                  {departmentConfigs.map((department) => (
                    <SelectItem key={department.value} value={department.label}>
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
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                style={{
                  border: "1px solid #0000004D",
                }}
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
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                style={{
                  border: "1px solid #0000004D",
                }}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  border: "1px solid #0000004D",
                }}
                className="bg-white rounded text-black"
                id="password"
                type="password"
                placeholder="Mật khẩu"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-black" htmlFor="active">
                Trạng thái
              </Label>
              <Select
                value={active ? "active" : "inactive"}
                onValueChange={(value) => setActive(value === "active")}
              >
                <SelectTrigger
                  style={{ border: "1px solid #0000004D" }}
                  className="rounded text-black"
                >
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Kích hoạt</SelectItem>
                  <SelectItem value="inactive">Không kích hoạt</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
