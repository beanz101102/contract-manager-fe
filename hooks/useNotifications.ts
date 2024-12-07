import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { api } from "@/lib/axios"

const useNotifications = () => {
  const queryClient = useQueryClient()
  const useGetNotifications = (userId: number) => {
    return useQuery<Notification[]>({
      queryKey: ["notifications", userId],
      queryFn: async () => {
        const response = await api.post<Notification[]>(`/api/notifications`, {
          userId,
        })
        return response.data
      },
      refetchInterval: 5000,
    })
  }

  const useMarkAsRead = () => {
    return useMutation({
      mutationFn: async (notificationId: number) => {
        const response = await api.put(
          `/api/notifications/${notificationId}/read`
        )
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["notifications"] })
      },
    })
  }

  const useMarkAllAsRead = (onDone?: () => void) => {
    return useMutation({
      mutationFn: async (userId: number) => {
        const response = await api.post(`/api/notifications/read-all`, {
          userId,
        })
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["notifications"] })
        onDone?.()
      },
    })
  }

  return {
    useGetNotifications,
    useMarkAsRead,
    useMarkAllAsRead,
  }
}

export default useNotifications
