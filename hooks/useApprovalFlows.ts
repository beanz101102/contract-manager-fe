import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"

import { ApprovalFlow, ApprovalFlowsList } from "@/types/api"
import { api } from "@/lib/axios"

export const useApprovalFlows = () => {
  const queryClient = useQueryClient()

  const useListApprovalFlows = (name?: string) => {
    return useQuery({
      queryKey: ["approval-flows", name],
      queryFn: async () => {
        const params = new URLSearchParams()
        if (name) {
          params.append("name", name)
        }
        const response = await api.post<ApprovalFlowsList[]>(
          `/api/approval_flow?${params}`
        )
        return response.data
      },
      refetchInterval: 10000,
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
        toast.error("Lỗi khi thêm luồng duyệt: " + error.message)
      },
    })
  }

  const useUpdateApprovalFlow = () => {
    return useMutation({
      mutationFn: async (payload: ApprovalFlow) => {
        const response = await api.post("/api/approval_flow/update", payload)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["approval-flows"] })
        toast.success("Cập nhật luồng duyệt thành công")
      },
      onError: (error: any) => {
        toast.error("Lỗi khi cập nhật luồng duyệt: " + error.message)
      },
    })
  }

  return {
    useListApprovalFlows,
    useAddApprovalFlow,
    useUpdateApprovalFlow,
  }
}
