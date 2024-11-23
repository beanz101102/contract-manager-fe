import { useQuery } from "@tanstack/react-query"

import { UserSignature } from "@/types/api"
import { api } from "@/lib/axios"

export const useUserSignatures = () => {
  const useListSignatures = () => {
    return useQuery({
      queryKey: ["user-signatures"],
      queryFn: async () => {
        const response = await api.post<UserSignature[]>("/api/user_signature")
        return response.data
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
  }
}
