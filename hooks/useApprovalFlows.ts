import { useAuth } from "@/contexts/auth-context"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"

import { ApprovalFlow, ApprovalFlowsList } from "@/types/api"
import { api } from "@/lib/axios"

export const useApprovalFlows = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  const useListApprovalFlows = (name?: string) => {
    return useQuery({
      queryKey: ["approval-flows", name, user?.id],
      queryFn: async () => {
        const params = new URLSearchParams()

        const response = await api.post<ApprovalFlowsList[]>(
          `/api/approval_flow`,
          {
            name,
            userId: user?.id,
          }
        )
        return response.data
      },
      refetchInterval: 5000,
    })
  }

  const useAddApprovalFlow = (onSuccess?: () => void) => {
    return useMutation({
      mutationFn: async (payload: Omit<ApprovalFlow, "approvalStatus">) => {
        const response = await api.post("/api/approval_flow/add", payload)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["approval-flows"] })
        toast.success("Thêm luồng duyệt thành công")
        onSuccess && onSuccess()
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message)
      },
    })
  }

  const useUpdateApprovalFlow = (onSuccess?: () => void) => {
    return useMutation({
      mutationFn: async (payload: ApprovalFlow & { id: number }) => {
        const response = await api.post("/api/approval_flow/update", payload)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["approval-flows"] })
        toast.success("Cập nhật luồng duyệt thành công")
        onSuccess && onSuccess()
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message)
      },
    })
  }

  const useDeleteApprovalFlow = (onSuccess?: () => void) => {
    return useMutation({
      mutationFn: async (id: number) => {
        const response = await api.post(`/api/approval_flow/delete`, { id })
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["approval-flows"] })
        toast.success("Xóa luồng duyệt thành công")
        onSuccess && onSuccess()
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message)
      },
    })
  }

  return {
    useListApprovalFlows,
    useAddApprovalFlow,
    useUpdateApprovalFlow,
    useDeleteApprovalFlow,
  }
}
