import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"

import { api } from "@/lib/axios"
import {
  EmployeeFormData
} from "@/types/api"
import { User } from "@/types/auth"

export const useUsers = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  // Get list users
  const useListUsers = (
    role?: ("admin" | "employee" | "customer" | "manager" | "")[] | null,
    page: number = 1,
    limit: number = 10,
    text?: string,
    departmentId?: number | null
  ) => {
    return useQuery({
      queryKey: ["users", role, page, limit, text, departmentId],
      queryFn: async () => {
        const payload = {
          role,
          page,
          limit,
          text,
          departmentId,
        }
        const response = await api.post<{
          users: User[]
          total: number
          lastPage: number
          page: number
        }>("/api/user/listUsers", payload)
        return response.data
      },
      refetchInterval: 10000,
    })
  }

  // Get user details
  const useUserDetails = (id: number) => {
    return useQuery({
      queryKey: ["user", id],
      queryFn: async () => {
        const response = await api.post<User>("/api/user/details", { id })
        return response.data
      },
      enabled: !!id,
      refetchInterval: 10000,
    })
  }

  // Add user
  const useAddUser = () => {
    return useMutation({
      mutationFn: async (payload: EmployeeFormData) => {
        const response = await api.post("/api/user/addUsers", payload)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["users"] })
        toast.success("Thêm người dùng thành công")
        router.push("/employees")
      },
      onError: (error: any) => {
        const errorMessage = error.response?.data?.message
        if (errorMessage && errorMessage.toLowerCase().includes("duplicate")) {
          toast.error("Thông tin đã tồn tại trong hệ thống, vui lòng kiểm tra lại thông tin của bạn")
        } else {
          toast.error(errorMessage)
        }
      },
    })
  }

  // Update user
  const useUpdateUser = () => {
    return useMutation({
      mutationFn: async (payload: EmployeeFormData) => {
        const response = await api.post("/api/user/update", payload)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["users"] })
        toast.success("Cập nhật thông tin thành công")
        router.push("/employees")
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message
        if (errorMessage && errorMessage.toLowerCase().includes("duplicate")) {
          toast.error("Lỗi trùng thông tin, hãy kiểm tra lại thông tin tạo user")
        } else {
          toast.error(errorMessage)
        }
      },
    })
  }

  // Delete user
  const useDeleteUser = (onDone: () => void) => {
    return useMutation({
      mutationFn: async (id: number[]) => {
        const response = await api.post("/api/user/delete", { id })
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["users"] })
        toast.success("Xóa người dùng thành công")
        onDone()
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message)
      },
    })
  }

  return {
    useListUsers,
    useUserDetails,
    useAddUser,
    useUpdateUser,
    useDeleteUser,
  }
}
