import { apiClient } from "@/lib/axios"
import type {
  DashboardMetricsResponse,
  DashboardMetricsData,
} from "../@types/dashboard"

export const dashboardApi = {
  getMetrics: async (): Promise<DashboardMetricsData> => {
    const response = await apiClient.get<DashboardMetricsResponse>(
      "/api/v1/admin/dashboard/metrics"
    )
    return response.data.data
  },
}
