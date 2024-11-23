import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"

import { AddUserPayload, UpdateUserPayload, UserDetail } from "@/types/api"
import { api } from "@/lib/axios"

export const useUsers = () => {
  const queryClient = useQueryClient()

  // Get list users
  const useListUsers = () => {
    return useQuery({
      queryKey: ["users"],
      queryFn: async () => {
        const response = await api.post<UserDetail[]>("/api/user/listUsers")
        return response.data
      },
    })
  }

  // Get user details
  const useUserDetails = (id: number) => {
    return useQuery({
      queryKey: ["user", id],
      queryFn: async () => {
        const response = await api.post<UserDetail>("/api/user/details", { id })
        return response.data
      },
      enabled: !!id,
    })
  }

  // Add user
  const useAddUser = () => {
    return useMutation({
      mutationFn: async (payload: AddUserPayload) => {
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
      mutationFn: async (payload: UpdateUserPayload) => {
        const response = await api.post("/api/user/update", payload)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["users"] })
        toast.success("Cập nhật thông tin thành công")
      },
      onError: (error) => {
        toast.error("Lỗi khi cập nhật: " + error.message)
      },
    })
  }

  // Delete user
  const useDeleteUser = () => {
    return useMutation({
      mutationFn: async (id: number) => {
        const response = await api.post("/api/user/delete", { id })
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["users"] })
        toast.success("Xóa người dùng thành công")
      },
      onError: (error: any) => {
        toast.error("Lỗi khi xóa người dùng: " + error.message)
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
