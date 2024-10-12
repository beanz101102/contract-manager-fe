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

export default function PersonalInfoForm() {
  return (
    <div
      className="p-4 bg-white rounded-lg "
      style={{
        boxShadow: "0px 4px 4px 0px #00000040",
      }}
    >
      <div className="py-4 border-b border-slate-800">
        <div className="text-2xl text-black font-bold">Thông tin cá nhân</div>
      </div>

      <div className="flex gap-6 mt-4">
        <div className="w-[200px] h-[200px] bg-red-500">Avatar</div>
        <Card className="w-full bg-white border-none">
          <CardContent className="mt-6 grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employeeId">Mã nhân viên</Label>
                <Input id="employeeId" placeholder="NV0001" />
              </div>
              <div>
                <Label htmlFor="fullName">Họ và tên</Label>
                <Input id="fullName" placeholder="Trần Ngọc Tân" />
              </div>
            </div>
            <div>
              <Label htmlFor="address">Địa chỉ</Label>
              <Input
                id="address"
                placeholder="52 Hoàng Mai, Hai Bà Trưng, Hà Nội"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="gender">Giới tính</Label>
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
              <div>
                <Label htmlFor="dob">Ngày sinh</Label>
                <Input id="dob" type="date" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="idNumber">Số CMND</Label>
                <Input id="idNumber" placeholder="019084000314" />
              </div>
              <div>
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input id="phone" placeholder="0864213056" />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="abc@gmail.com" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="department">Phòng ban</Label>
                <Select>
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Chọn phòng ban" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="accounting">Kế toán</SelectItem>
                    <SelectItem value="hr">Nhân sự</SelectItem>
                    <SelectItem value="it">IT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="position">Chức vụ</Label>
                <Input id="position" placeholder="Nhân viên" />
              </div>
            </div>
            <Button className="mt-4">Lưu thông tin</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
