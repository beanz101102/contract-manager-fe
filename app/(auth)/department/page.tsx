"use client"

import { useEffect, useState } from "react"
import { Pencil, Trash2 } from "lucide-react"

import { DepartmentList } from "@/types/api"
import { useDepartment } from "@/hooks/useDepartment"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"

export default function DepartmentPage() {
  const { useListDepartments, useUpdateDepartment, useDeleteDepartment } =
    useDepartment()
  const { mutate: updateDepartment, isPending: isUpdating } =
    useUpdateDepartment()
  const { mutate: deleteDepartment, isPending: isDeleting } =
    useDeleteDepartment()
  const { data: departments, isLoading } = useListDepartments()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedDepartment, setSelectedDepartment] =
    useState<DepartmentList | null>(null)

  useEffect(() => {
    if (selectedDepartment) {
      setName(selectedDepartment.departmentName)
      setDescription(selectedDepartment.description)
    } else {
      setName("")
      setDescription("")
    }
  }, [selectedDepartment])

  return (
    <div className="p-6 bg-white rounded-md shadow-sm">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Danh sách phòng ban</h1>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>STT</TableHead>
            <TableHead>Tên phòng ban</TableHead>
            <TableHead>Mô tả</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead>Ngày cập nhật</TableHead>
            <TableHead>Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {departments?.map((dept, index) => (
            <TableRow key={dept.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell className="font-medium">
                {dept.departmentName}
              </TableCell>
              <TableCell>{dept.description}</TableCell>
              <TableCell>
                {new Date(dept.createdAt).toLocaleDateString("vi-VN")}
              </TableCell>
              <TableCell>
                {new Date(dept.updatedAt).toLocaleDateString("vi-VN")}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedDepartment(dept)
                      setIsEditModalOpen(true)
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedDepartment(dept)
                      setIsDeleteModalOpen(true)
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="bg-white">
          <DialogHeader className="border-b pb-3">
            <DialogTitle className="text-gray-900">
              Chỉnh sửa phòng ban
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Tên phòng ban
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white text-gray-900 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="grid gap-2">
              <label
                htmlFor="description"
                className="text-sm font-medium text-gray-700"
              >
                Mô tả
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-white text-gray-900 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <DialogFooter className="border-t pt-3">
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              className="text-gray-600 hover:text-gray-800"
            >
              Hủy
            </Button>
            <Button
              disabled={isUpdating}
              onClick={() =>
                updateDepartment({
                  departmentName: name,
                  description: description,
                  id: selectedDepartment?.id || 0,
                })
              }
              type="submit"
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="bg-white">
          <DialogHeader className="border-b pb-3">
            <DialogTitle className="text-gray-900">Xác nhận xóa</DialogTitle>
          </DialogHeader>
          <DialogDescription className="py-4 text-gray-600">
            Bạn có chắc chắn muốn xóa phòng ban "
            {selectedDepartment?.departmentName}" không? Hành động này không thể
            hoàn tác.
          </DialogDescription>
          <DialogFooter className="border-t pt-3">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              className="text-gray-600 hover:text-gray-800"
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              disabled={isDeleting}
              onClick={() =>
                deleteDepartment({ id: selectedDepartment?.id || 0 })
              }
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
