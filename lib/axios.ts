import axios from "axios"

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    return Promise.reject(error)
  }
)

// Tạo các helper function
export const api = {
  get: <T>(url: string, config = {}) => {
    return axiosInstance.get<T>(url, config)
  },

  post: <T>(url: string, data?: any, config = {}) => {
    return axiosInstance.post<T>(url, data, config)
  },

  put: <T>(url: string, data?: any, config = {}) => {
    return axiosInstance.put<T>(url, data, config)
  },

  delete: <T>(url: string, config = {}) => {
    return axiosInstance.delete<T>(url, config)
  },

  patch: <T>(url: string, data?: any, config = {}) => {
    return axiosInstance.patch<T>(url, data, config)
  },
}

export default axiosInstance
