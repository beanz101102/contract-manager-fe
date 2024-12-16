import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"

import {
  AdvancedStatistics,
  Contract,
  ContractList,
  ContractStatistics,
  ContractsInRange,
  CustomerReport,
  DetailContract,
} from "@/types/api"
import { api } from "@/lib/axios"

interface AddContractPayload {
  contractNumber: number | string
  customer: number
  contractType: string
  createdBy: number
  signersCount: number
  note: string
  file: File | null
}

interface UpdateContractPayload {
  id: number
  contractNumber: number | string
  customer: number
  contractType: string
  approvalTemplateId: number
  note: string
  signers: any[]
  createdById: number
  file: File | null
}

export const useContracts = () => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAuth()
  // Get all contracts
  const useAllContracts = (
    contractNumber?: string,
    page: number = 1,
    limit: number = 10,
    customerId?: number | null,
    createdById?: number | null,
    status?:
      | "draft"
      | "pending_approval"
      | "rejected"
      | "ready_to_sign"
      | "completed"
  ) => {
    return useQuery({
      queryKey: [
        "contracts",
        contractNumber,
        page,
        limit,
        customerId,
        createdById,
        status,
      ],
      queryFn: async () => {
        const params = new URLSearchParams()
        if (contractNumber) {
          params.append("contractNumber", contractNumber)
        }
        if (customerId) {
          params.append("customerId", customerId.toString())
        }
        if (createdById) {
          params.append("createdById", createdById.toString())
        }
        if (status) {
          params.append("status", status)
        }
        params.append("page", page.toString())
        params.append("limit", limit.toString())

        const response = await api.post<{
          data: ContractList[]
          totalPages: number
        }>(`/api/contract?${params}`)
        return {
          contracts: response.data.data,
          totalPages: response.data.totalPages,
        }
      },
      refetchInterval: 5000,
    })
  }

  // Get contract detail
  const useContractDetail = (id: number) => {
    return useQuery({
      queryKey: ["contract", id],
      queryFn: async () => {
        const response = await api.post<DetailContract>(
          "/api/contract/detail",
          {
            id,
          }
        )
        return response.data
      },
      enabled: !!id,
      refetchInterval: 5000,
    })
  }

  // Add contract
  const useAddContract = (onSuccess: () => void) => {
    return useMutation({
      mutationFn: async (payload: AddContractPayload) => {
        const formData = new FormData()

        // Append file separately
        if (payload.file) {
          formData.append("file", payload.file)
        }

        // Remove file from payload and append remaining fields
        const { file, ...rest } = payload
        Object.entries(rest).forEach(([key, value]) => {
          formData.append(key, value.toString())
        })

        const response = await api.post("/api/contract/addContract", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        })
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["contracts"] })
        toast.success("Thêm hợp đồng thành công")
        onSuccess()
      },
      onError: (error: any) => {
        toast.error(error.response.data.message)
      },
    })
  }

  // Update contract status
  const useUpdateContractStatus = () => {
    return useMutation({
      mutationFn: async ({
        id,
        status,
      }: {
        id: number
        status: "signed" | "pending" | "rejected"
      }) => {
        const response = await api.post("/api/contract/success", {
          id,
          status,
        })
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["contracts"] })
        toast.success("Cập nhật trạng thái hợp đồng thành công")
      },
      onError: (error) => {
        toast.error("Lỗi khi cập nhật trạng thái: " + error.message)
      },
    })
  }

  // Get contract count
  const useContractCount = () => {
    return useQuery({
      queryKey: ["contracts-count"],
      queryFn: async () => {
        const response = await api.post("/api/contract/count")
        return response.data
      },
      refetchInterval: 5000,
    })
  }

  // Delete contracts in bulk
  const useBulkDeleteContracts = () => {
    return useMutation({
      mutationFn: async (ids: number[]) => {
        const response = await api.post("/api/contract/bulk-delete", { ids })
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["contracts"] })
        toast.success("Xóa hợp đồng thành công")
      },
      onError: (error: any) => {
        toast.error(error.response.data.message)
      },
    })
  }

  // Get contract signatures
  const useContractSignatures = (contractId: number) => {
    return useQuery({
      queryKey: ["contract-signatures", contractId],
      queryFn: async () => {
        const response = await api.post("/api/contract_signature/find", {
          contractId,
        })
        return response.data
      },
      enabled: !!contractId,
      refetchInterval: 5000,
    })
  }

  const useSubmitContractForApproval = () => {
    return useMutation({
      mutationFn: async (payload: {
        contractIds: number[]
        userId: number
      }) => {
        const response = await api.post("/api/contract/submit", {
          contractIds: payload.contractIds,
          userId: payload.userId,
        })
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["contracts"] })
        toast.success("Gửi duyệt hợp đồng thành công")
        router.push("/contract/review")
      },
      onError: (error: any) => {
        toast.error(error.response.data.message)
      },
    })
  }

  const useApproveContract = (onSuccess?: () => void) => {
    return useMutation({
      mutationFn: async (payload: {
        contracts: Array<{
          contractId: number
          comments?: string
        }>
        status: "approved" | "rejected"
        approverId: number
      }) => {
        const response = await api.post("/api/contract/approve", payload)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["contracts"] })
        toast.success("Duyệt hợp đồng thành công")
        onSuccess?.()
      },
      onError: (error: any) => {
        toast.error(error.response.data.message)
      },
    })
  }

  const useSignContract = () => {
    return useMutation({
      mutationFn: async (payload: {
        contractId: number
        signerId: number
        file: File
        otp: string
      }) => {
        const formData = new FormData()
        formData.append("file", payload.file)
        formData.append("contractId", payload.contractId.toString())
        formData.append("signerId", payload.signerId.toString())
        formData.append("otp", payload.otp)

        const response = await api.post("/api/contract/sign", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["contracts"] })
        toast.success("Ký hợp đồng thành công")
        if (pathname.includes("client-signature")) {
          router.push(pathname + "/success")
        } else {
          router.push(`/contract/personal`)
        }
      },
      onError: (error: any) => {
        toast.error(error.response.data.message)
      },
    })
  }

  const useCancelContract = () => {
    return useMutation({
      mutationFn: async (payload: {
        contractIds: number[]
        reason: string
        userId: number
      }) => {
        const response = await api.post("/api/contract/cancel", payload)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["contracts"] })
        toast.success("Hủy hợp đồng thành công")
      },
      onError: (error: any) => {
        toast.error(error.response.data.message)
      },
    })
  }

  const useContractStatistics = () => {
    return useQuery({
      queryKey: ["contract-statistics"],
      queryFn: async () => {
        const response = await api.post<ContractStatistics>(
          "/api/contract/statistics",
          {
            userId: user?.id,
          }
        )
        return response.data
      },
      refetchInterval: 5000,
    })
  }

  const useUpdateContract = () => {
    return useMutation({
      mutationFn: async (payload: UpdateContractPayload) => {
        const formData = new FormData()
        Object.entries(payload).forEach(([key, value]) => {
          if (value instanceof File) {
            formData.append(key, value)
          } else {
            formData.append(key, String(value))
          }
        })

        const response = await api.post("/api/contract/update", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["contracts"] })
        toast.success("Cập nhật hợp đồng thành công")
      },
      onError: (error: any) => {
        toast.error(error.response.data.message)
      },
    })
  }

  // contracts-in-range
  const useContractsInRange = (payload: {
    startTime: number
    endTime: number
    status: string
  }) => {
    return useQuery({
      queryKey: ["contracts-in-range", payload],
      queryFn: async () => {
        const params = new URLSearchParams({
          startTime: payload.startTime.toString(),
          endTime: payload.endTime.toString(),
          status: payload.status,
        }).toString()

        const response = await api.get<{
          data: { contracts: ContractsInRange[] }
        }>(`/api/contract/contracts-in-range?${params}`)
        return response.data?.data?.contracts
      },
    })
  }

  // customer-report
const useCustomerReport = (payload: {
  startTime: number
  endTime: number
  status: string
  customerId?: number // Thêm customerId vào payload
}) => {
  return useQuery({
    queryKey: ["customer-report", payload],
    queryFn: async () => {
      const params = new URLSearchParams({
        startTime: payload.startTime.toString(),
        endTime: payload.endTime.toString(),
        status: payload.status,
      })
      
      // Thêm customerId vào params nếu có
      if (payload.customerId) {
        params.append("customerId", payload.customerId.toString())
      }

      const response = await api.get<{
        data: { customers: CustomerReport[] }
      }>(`/api/contract/customer-report?${params}`)
      return response.data?.data?.customers
    },
  })
}

  const useAdvancedStatistics = (payload: {
    startTime?: number
    endTime?: number
    status?: string
    createdById?: number
    customerId?: number
  }) => {
    return useQuery({
      queryKey: ["advanced-statistics", payload],
      queryFn: async () => {
        const params = new URLSearchParams()
        Object.entries(payload).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, value.toString())
          }
        })
        const response = await api.get<AdvancedStatistics>(
          `/api/contract/advanced-statistics?${params}`
        )
        return response.data
      },
    })
  }

  const useSendOtp = () => {
    return useMutation({
      mutationFn: async (payload: { email: string }) => {
        const response = await api.post("/api/contract/send-otp", payload)
        return response.data
      },
      onSuccess: () => {
        toast.success("Gửi OTP thành công")
      },
      onError: (error: any) => {
        toast.error(error.response.data.message)
      },
    })
  }

  const useFeedbackContract = (isNoToast?: boolean) => {
    return useMutation({
      mutationFn: async (payload: {
        contractId: number
        name: string
        content: string
        tag: "revision_request" | "feedback"
      }) => {
        const response = await api.post("/api/contract/add-feedback", payload)
        return response.data
      },
      onSuccess: () => {
        if (!isNoToast) {
          toast.success("Gửi phản hồi thành công")
        }
      },
      onError: (error: any) => {
        if (!isNoToast) {
          toast.error(error.response.data.message)
        }
      },
    })
  }

  const useListFeedbackContract = (contractId: number) => {
    return useQuery({
      queryKey: ["get-feedback", contractId],
      queryFn: async () => {
        const response = await api.post(`/api/contract/get-feedback`, {
          contractId,
        })
        return response.data
      },
    })
  }

  return {
    useAllContracts,
    useContractDetail,
    useAddContract,
    useUpdateContractStatus,
    useContractCount,
    useContractSignatures,
    useBulkDeleteContracts,
    useSubmitContractForApproval,
    useApproveContract,
    useSignContract,
    useCancelContract,
    useContractStatistics,
    useUpdateContract,
    useContractsInRange,
    useCustomerReport,
    useAdvancedStatistics,
    useSendOtp,
    useFeedbackContract,
    useListFeedbackContract,
  }
}
