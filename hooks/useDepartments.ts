import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"

import { Department } from "@/types/api"
import { api } from "@/lib/axios"

export const useDepartments = () => {
  const queryClient = useQueryClient()

  const useListDepartments = () => {
    return useQuery({
      queryKey: ["departments"],
      queryFn: async () => {
        const response = await api.post<Department[]>("/api/department")
        return response.data
      },
    })
  }

  const useAddDepartment = () => {
    return useMutation({
      mutationFn: async (payload: Omit<Department, "id">) => {
        const response = await api.post(
          "/api/department/addDepartment",
          payload
        )
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["departments"] })
        toast.success("Thêm phòng ban thành công")
      },
      onError: (error: any) => {
        toast.error("Lỗi khi thêm phòng ban: " + error.message)
      },
    })
  }

  return {
    useListDepartments,
    useAddDepartment,
  }
}
