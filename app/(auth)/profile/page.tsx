"use client"

import { useAuth } from "@/contexts/auth-context"
import { Building2, User } from "lucide-react"

import { useUsers } from "@/hooks/useUsers"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const ProfilePage = () => {
  const { user: userAuth } = useAuth()
  const { useUserDetails } = useUsers()
  const { data: user } = useUserDetails(userAuth?.id || 0)
  console.log("user", user)

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Chưa cập nhật"
    return new Date(dateString).toLocaleDateString("vi-VN")
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Card className="bg-white shadow-md rounded-xl overflow-hidden">
        <CardHeader className="border-b bg-gray-50/50 pb-6">
          <div className="flex items-center gap-6 mb-4">
            <div className="p-5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm">
              <User size={32} className="text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-800 mb-1">
                Thông tin cá nhân
              </CardTitle>
              <CardDescription className="text-gray-500">
                Xem và quản lý thông tin chi tiết của nhân viên
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg border mt-4">
            <Building2 size={20} className="text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Phòng ban</p>
              <p className="font-medium text-gray-900">
                {user?.department?.departmentName || "Chưa cập nhật"}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
            <InfoItem
              label="Mã nhân viên"
              value={user?.code}
              icon="identification"
            />
            <InfoItem
              label="Chức vụ"
              value={user?.position || "Chưa cập nhật"}
              icon="briefcase"
            />
            <InfoItem label="Vai trò" value={user?.role} icon="shield" />
            <InfoItem label="Giới tính" value={user?.gender} icon="user" />
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

          <div className="mt-12 pt-8 border-t">
            <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Building2 size={20} className="text-blue-500" />
              Thông tin phòng ban
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
              <InfoItem
                label="Tên phòng ban"
                value={user?.department?.departmentName || "Chưa cập nhật"}
                icon="building"
              />
              <InfoItem
                label="Mô tả"
                value={user?.department?.description || "Chưa cập nhật"}
                icon="file-text"
              />
              <InfoItem
                label="Ngày tạo"
                value={formatDate(user?.department?.createdAt || null)}
                icon="calendar"
              />
              <InfoItem
                label="Ngày cập nhật"
                value={formatDate(user?.department?.updatedAt || null)}
                icon="refresh-cw"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const InfoItem = ({
  label,
  value,
  icon,
}: {
  label: string
  value?: string
  icon?: string
}) => (
  <div className="group">
    <label className="text-sm font-medium text-gray-500 mb-1.5 block">
      {label}
    </label>
    <p className="text-gray-900 bg-gray-50 group-hover:bg-gray-100 transition-colors rounded-lg px-4 py-3 border">
      {value || "Chưa cập nhật"}
    </p>
  </div>
)

export default ProfilePage
