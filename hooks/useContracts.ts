import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"

import { Contract } from "@/types/api"
import { api } from "@/lib/axios"

interface AddContractPayload {
  contractNumber: number
  customer: number
  contractType: string
  signersCount: number
  note: string
}

export const useContracts = () => {
  const queryClient = useQueryClient()

  // Get all contracts
  const useAllContracts = () => {
    return useQuery({
      queryKey: ["contracts"],
      queryFn: async () => {
        const response = await api.post<Contract[]>("/api/contract")
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
  const useAddContract = () => {
    return useMutation({
      mutationFn: async (payload: AddContractPayload) => {
        const response = await api.post("/api/contract/addContract", payload)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["contracts"] })
        toast.success("Thêm hợp đồng thành công")
      },
      onError: (error) => {
        toast.error("Lỗi khi thêm hợp đồng: " + error.message)
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
  }
}
