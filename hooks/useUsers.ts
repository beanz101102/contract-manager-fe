import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"

import {
  AddUserPayload,
  EmployeeFormData,
  UpdateUserPayload,
  UserDetail,
} from "@/types/api"
import { User } from "@/types/auth"
import { api } from "@/lib/axios"

export const useUsers = () => {
  const queryClient = useQueryClient()

  // Get list users
  const useListUsers = (
    role?: "admin" | "employee" | "customer",
    page: number = 1,
    limit: number = 10,
    text?: string,
    departmentId?: number | null
  ) => {
    return useQuery({
      queryKey: ["users", role, page, limit, text, departmentId],
      queryFn: async () => {
        const params = new URLSearchParams()
        if (role) params.append("role", role)
        params.append("page", page.toString())
        params.append("limit", limit.toString())
        if (text) params.append("text", text)
        if (departmentId) params.append("departmentId", departmentId.toString())
        const response = await api.post<{
          users: User[]
          total: number
          lastPage: number
          page: number
        }>(`/api/user/listUsers?${params.toString()}`)
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
      },
      onError: (error) => {
        toast.error("Lỗi khi thêm người dùng: " + error.message)
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
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message)
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
