"use client"

import { ArrowLeft, CalendarIcon } from "lucide-react"

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
  return (
    <Card className="w-full bg-white !rounded-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">
          Sửa thông tin nhân viên
        </CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
          </Button>
          <Button className="bg-teal-500 hover:bg-teal-600">
            Lưu thông tin
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
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
                  <Label htmlFor="employeeCode">Mã nhân viên (*)</Label>
                  <Input id="employeeCode" placeholder="Mã nhân viên" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerCode">Mã khách hàng</Label>
                  <Input id="customerCode" placeholder="Mã khách hàng" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Họ và tên (*)</Label>
                  <Input id="fullName" placeholder="Họ và tên" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthPlace">Nơi sinh</Label>
                  <Input id="birthPlace" placeholder="Nơi sinh" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address">Địa chỉ</Label>
              <Input id="address" placeholder="Địa chỉ" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Giới tính (*)</Label>
              <Select>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Chọn giới tính" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Nam</SelectItem>
                  <SelectItem value="female">Nữ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="birthDate">Ngày sinh</Label>
              <div className="relative">
                <Input id="birthDate" placeholder="dd/mm/yyyy" />
                <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="idNumber">Số CCCD (*)</Label>
              <Input id="idNumber" placeholder="Số CCCD" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issueDate">Ngày cấp</Label>
              <div className="relative">
                <Input id="issueDate" placeholder="dd/mm/yyyy" />
                <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="issuePlace">Nơi cấp</Label>
              <Input id="issuePlace" placeholder="Nơi cấp" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input id="phone" placeholder="Số điện thoại" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email (*)</Label>
              <Input id="email" type="email" placeholder="Email" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Phòng ban (*)</Label>
              <Select>
                <SelectTrigger id="department">
                  <SelectValue placeholder="Chọn phòng ban" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hr">Nhân sự</SelectItem>
                  <SelectItem value="it">IT</SelectItem>
                  <SelectItem value="finance">Tài chính</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Chức vụ (*)</Label>
              <Input id="position" placeholder="Chức vụ" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="account">Tài khoản (*)</Label>
              <Input id="account" placeholder="Tài khoản" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu (*)</Label>
              <Input id="password" type="password" placeholder="Mật khẩu" />
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
