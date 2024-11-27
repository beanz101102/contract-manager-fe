import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"

import { Contract, ContractList } from "@/types/api"
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

export const useContracts = () => {
  const queryClient = useQueryClient()

  // Get all contracts
  const useAllContracts = (
    contractNumber?: string,
    page: number = 1,
    limit: number = 10
  ) => {
    return useQuery({
      queryKey: ["contracts", contractNumber, page, limit],
      queryFn: async () => {
        const params = new URLSearchParams()
        if (contractNumber) {
          params.append("contractNumber", contractNumber)
        }
        params.append("page", page.toString())
        params.append("limit", limit.toString())

        const response = await api.post<ContractList[]>(
          `/api/contract?${params}`
        )
        return response.data
      },
    })
  }

  // Get contract detail
  const useContractDetail = (id: number) => {
    return useQuery({
      queryKey: ["contract", id],
      queryFn: async () => {
        const response = await api.post<Contract>("/api/contract/detail", {
          id,
        })
        return response.data
      },
      enabled: !!id,
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
  }
}
