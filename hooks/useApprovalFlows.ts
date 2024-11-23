import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"

import { ApprovalFlow } from "@/types/api"
import { api } from "@/lib/axios"

export const useApprovalFlows = () => {
  const queryClient = useQueryClient()

  const useListApprovalFlows = () => {
    return useQuery({
      queryKey: ["approval-flows"],
      queryFn: async () => {
        const response = await api.post<ApprovalFlow[]>("/api/approval_flow")
        return response.data
      },
    })
  }

  const useAddApprovalFlow = () => {
    return useMutation({
      mutationFn: async (payload: Omit<ApprovalFlow, "approvalStatus">) => {
        const response = await api.post("/api/approval_flow/add", payload)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["approval-flows"] })
        toast.success("Thêm luồng duyệt thành công")
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
