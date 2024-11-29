import { useRouter } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"

import { Department, DepartmentList } from "@/types/api"
import { api } from "@/lib/axios"

export const useDepartment = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const useListDepartments = () => {
    return useQuery<DepartmentList[]>({
      queryKey: ["department"],
      queryFn: async () => {
        const response = await api.post<DepartmentList[]>("/api/department")
        return response.data
      },
    })
  }

  const useAddDepartment = () => {
    return useMutation({
      mutationFn: async (payload: Department) => {
        const response = await api.post(
          "/api/department/addDepartment",
          payload
        )
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["departments"] })
        toast.success("Thêm phòng ban thành công")
        router.push("/department")
      },
      onError: (error: any) => {
        toast.error(error.response.data.message)
      },
    })
  }

  return {
    useListDepartments,
    useAddDepartment,
  }
}
