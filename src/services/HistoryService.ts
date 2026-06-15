// src/services/historyService.ts
import axiosInstance from '../configs/axios';
import type { HistoryLogItem, PaginationInfo } from '../pages/HistoryLog/types';

// Định nghĩa kiểu dữ liệu cho object nhận về từ Backend
export interface HistoryApiResponse {
  status: 'SUCCESS' | 'ERROR';
  data: HistoryLogItem[];
  pagination: PaginationInfo;
}

export interface FetchHistoryParams {
  page: number;
  limit: number;
  gate_id?: string;
  date?: string;
  search?: string;
}

export const historyService = {
  getHistoryLogs: async (params: FetchHistoryParams): Promise<HistoryApiResponse> => {
    // Gọi qua instance chung, chỉ cần truyền phần đuôi endpoint
    const response = await axiosInstance.get<HistoryApiResponse>('/api/v1/access/history', { 
      params 
    });
    return response.data;
  }
};