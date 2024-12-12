import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"

import { SignatureList, UserSignature } from "@/types/api"
import { api } from "@/lib/axios"
import { useAuth } from "@/contexts/auth-context"

export const useUserSignatures = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  const useListSignatures = () => {
    return useQuery({
      queryKey: ["user-signatures", user?.id],
      queryFn: async () => {
        const params = new URLSearchParams()
        if (user?.id) {
          params.append("userId", user.id.toString())
        }
        const response = await api.post<SignatureList[]>(
          `/api/user_signature?${params}`
        )
        return response.data || []
      },
      enabled: !!user?.id,
    })
  }

  const useDeleteSignature = (onSuccess: () => void) => {
    return useMutation({
      mutationFn: async (id: number) => {
        const response = await api.post("/api/user_signature/delete", { id })
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["user-signatures"] })
        toast.success("Xóa chữ ký thành công")
        onSuccess()
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message)
      },
    })
  }

  const useAddSignature = (onSuccess: () => void) => {
    return useMutation({
      mutationFn: async (data: {
        userId: number
        signatureImagePath: File
      }) => {
        const formData = new FormData()
        formData.append("userId", data.userId.toString())
        formData.append("signatureImagePath", data.signatureImagePath)

        const response = await api.post<UserSignature>(
          "/api/user_signature/add",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["user-signatures"] })
        toast.success("Thêm chữ ký thành công")
        onSuccess()
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message)
      },
    })
  }

  const useSignatureDetail = (id: number) => {
    return useQuery({
      queryKey: ["user-signature", id],
      queryFn: async () => {
        const response = await api.post<UserSignature>(
          "/api/user_signature/detail",
          { id }
        )
        return response.data
      },
      enabled: !!id,
    })
  }

  return {
    useListSignatures,
    useSignatureDetail,
    useAddSignature,
    useDeleteSignature,
  }
}
