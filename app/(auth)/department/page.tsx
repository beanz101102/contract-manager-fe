"use client"

import { useDepartment } from "@/hooks/useDepartment"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function DepartmentPage() {
  const { useListDepartments } = useDepartment()
  const { data: departments, isLoading } = useListDepartments()

  return (
    <div className="p-6">
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
