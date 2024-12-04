"use client"

import { useAuth } from "@/contexts/auth-context"
import { Building2, User } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const ProfilePage = () => {
  const { user } = useAuth()

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Chưa cập nhật"
    return new Date(dateString).toLocaleDateString("vi-VN")
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-white shadow-sm">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl text-gray-800">
            Thông tin cá nhân
          </CardTitle>
          <CardDescription>Thông tin chi tiết của nhân viên</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b">
            <div className="p-4 bg-blue-50 rounded-full">
              <User size={40} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {user?.fullName}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <Building2 size={16} className="text-gray-500" />
                <p className="text-gray-600">
                  {user?.department?.departmentName}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-6">
            <InfoItem
              label="Mã nhân viên"
              value={user?.code || "Chưa cập nhật"}
            />
            <InfoItem
              label="Chức vụ"
              value={user?.position || "Chưa cập nhật"}
            />
            <InfoItem label="Vai trò" value={user?.role || "Chưa cập nhật"} />
            <InfoItem
              label="Giới tính"
              value={user?.gender || "Chưa cập nhật"}
            />
            <InfoItem label="Email" value={user?.email || "Chưa cập nhật"} />
            <InfoItem
              label="Số điện thoại"
              value={user?.phoneNumber || "Chưa cập nhật"}
            />
            <InfoItem
              label="Ngày sinh"
              value={formatDate(user?.dateOfBirth || null)}
            />
            <InfoItem
              label="Nơi sinh"
              value={user?.placeOfBirth || "Chưa cập nhật"}
            />
            <InfoItem
              label="Địa chỉ"
              value={user?.address || "Chưa cập nhật"}
            />
            <InfoItem
              label="Số CMND/CCCD"
              value={user?.idNumber || "Chưa cập nhật"}
            />
            <InfoItem
              label="Ngày cấp"
              value={formatDate(user?.idIssueDate || null)}
            />
            <InfoItem
              label="Nơi cấp"
              value={user?.idIssuePlace || "Chưa cập nhật"}
            />
          </div>

          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Thông tin phòng ban
            </h3>
            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
              <InfoItem
                label="Tên phòng ban"
                value={user?.department?.departmentName || "Chưa cập nhật"}
              />
              <InfoItem
                label="Mô tả"
                value={user?.department?.description || "Chưa cập nhật"}
              />
              <InfoItem
                label="Ngày tạo"
                value={formatDate(user?.department?.createdAt || null)}
              />
              <InfoItem
                label="Ngày cập nhật"
                value={formatDate(user?.department?.updatedAt || null)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <label className="text-sm font-medium text-gray-600">{label}</label>
    <p className="mt-1 text-gray-800">{value}</p>
  </div>
)

export default ProfilePage
