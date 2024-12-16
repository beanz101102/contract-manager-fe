"use client"

import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js"
import { Pie } from "react-chartjs-2"

import { mapiContractStatus } from "@/types/api"
import { useContracts } from "@/hooks/useContracts"
import { Loading } from "@/components/ui/loading"

ChartJS.register(ArcElement, Tooltip, Legend)

export default function DashboardPage() {
  const { useContractStatistics } = useContracts()
  const { data: statistics, isLoading } = useContractStatistics()

  if (isLoading) {
    return <Loading />
  }

  if (!statistics || statistics.total === 0) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Thống kê hợp đồng</h2>
        <div className="text-center py-12">
          <p className="text-gray-500">Chưa có hợp đồng nào được tạo</p>
        </div>
      </div>
    )
  }

  const chartData = {
    labels: [
      mapiContractStatus.draft.label,
      mapiContractStatus.pending_approval.label,
      mapiContractStatus.ready_to_sign.label,
      mapiContractStatus.cancelled.label,
      mapiContractStatus.completed.label,
      mapiContractStatus.rejected.label,
    ],
    datasets: [
      {
        data: [
          statistics.details.draft.count,
          statistics.details.pending_approval.count,
          statistics.details.ready_to_sign.count,
          statistics.details.cancelled.count,
          statistics.details.completed.count,
          statistics.details.rejected.count,
        ],
        backgroundColor: [
          mapiContractStatus.draft.color.backgroundColor,
          mapiContractStatus.pending_approval.color.backgroundColor,
          mapiContractStatus.ready_to_sign.color.backgroundColor,
          mapiContractStatus.cancelled.color.backgroundColor,
          mapiContractStatus.completed.color.backgroundColor,
          "#F3F4F6",
        ],
        borderColor: [
          mapiContractStatus.draft.color.color,
          mapiContractStatus.pending_approval.color.color,
          mapiContractStatus.ready_to_sign.color.color,
          mapiContractStatus.cancelled.color.color,
          mapiContractStatus.completed.color.color,
          "#4B5563",
        ],
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Thống kê hợp đồng</h2>

      {/* Total Contracts Card */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-600">Tổng số hợp đồng</p>
        <p className="text-2xl font-bold text-blue-800">{statistics.total}</p>
      </div>

      {/* Pie Chart */}
      <div className="w-full max-w-md mx-auto">
        <Pie data={chartData} />
      </div>

      {/* Status Grid */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(statistics.details).map(([status, data]) => (
          <div
            key={status}
            className="p-3 rounded-lg"
            style={{
              backgroundColor:
                status === "rejected"
                  ? "#F3F4F6"
                  : mapiContractStatus[
                      status as keyof typeof mapiContractStatus
                    ]?.color.backgroundColor,
            }}
          >
            <p
              className="text-sm"
              style={{
                color:
                  status === "rejected"
                    ? "#4B5563"
                    : mapiContractStatus[
                        status as keyof typeof mapiContractStatus
                      ]?.color.color,
              }}
            >
              {
                mapiContractStatus[status as keyof typeof mapiContractStatus]
                  ?.label
              }
            </p>
            <p
              className="text-lg font-semibold"
              style={{
                color:
                  status === "rejected"
                    ? "#4B5563"
                    : mapiContractStatus[
                        status as keyof typeof mapiContractStatus
                      ]?.color.color,
              }}
            >
              {data.count} ({data.percentage || "0%"})
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
