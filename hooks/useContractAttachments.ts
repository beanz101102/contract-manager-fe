import { useQuery } from "@tanstack/react-query"

import { ContractAttachment } from "@/types/api"
import { api } from "@/lib/axios"

export const useContractAttachments = () => {
  const useListAttachments = () => {
    return useQuery({
      queryKey: ["contract-attachments"],
      queryFn: async () => {
        const response = await api.post<ContractAttachment[]>(
          "/api/contract_attachment"
        )
        return response.data
      },
    })
  }

  const useAttachmentDetail = (id: number) => {
    return useQuery({
      queryKey: ["contract-attachment", id],
      queryFn: async () => {
        const response = await api.post<ContractAttachment>(
          "/api/contract_attachment/detail",
          { id }
        )
        return response.data
      },
      enabled: !!id,
    })
  }

  return {
    useListAttachments,
    useAttachmentDetail,
  }
}
