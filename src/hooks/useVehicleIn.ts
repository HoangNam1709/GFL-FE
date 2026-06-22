import { useState, useRef } from 'react';
import type { ChangeEvent, SyntheticEvent } from 'react';
import axios from 'axios';
import type { XitecLog } from '../types/vehicle'; // Bạn kiểm tra lại đường dẫn import loại này cho đúng
import { useNavigate } from 'react-router-dom';

const API_URL = "http://127.0.0.1:8000/ocr/cccd";

export function useVehicleIn() {
  const [vehicleData, setVehicleData] = useState<XitecLog | null>(null);
  const [printHistory, setPrintHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const handleUpdateVehicleField = (field: keyof XitecLog, value: string) => {
    if (vehicleData) {
      setVehicleData({ ...vehicleData, [field]: value });
    }
  };

  const handleUploadImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    const formData = new FormData();
    formData.append('image', file);

    try {
      setIsLoading(true);
      console.log("Đang tải file ảnh lên Backend để xử lý OCR...");

      const response = await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log("OCR response:", response.data);
      const cccdApiData = response.data?.data;
      if (response.data && cccdApiData) {
        setVehicleData({
          id: cccdApiData?.id || "Không rõ",
          name: cccdApiData?.name || "Không rõ",
          birth: cccdApiData?.birth || "",
          place: cccdApiData?.place || "",
          nationalId: cccdApiData?.id || "",
          driverName: cccdApiData?.name || "",
          nationalIdImage: imageUrl,
          licensePlate: "29C-777.77",
          licensePlateImage: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=400",
          driverFaceImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
          entryTime: new Date().toLocaleString('vi-VN')
        });

        if (response.data.status !== "SUCCESS") {
          console.warn("OCR trả về data nhưng status khác SUCCESS:", response.data.status);
          alert(`Backend trả về trạng thái ${response.data.status}, nhưng vẫn nhận được dữ liệu CCCD.`);
        } else {
          console.log("Xử lý OCR dữ liệu CCCD thành công!");
        }
      } else {
        console.warn("OCR response không có data:", response.data);
        alert(`Backend không trả về dữ liệu OCR hợp lệ. Trạng thái: ${response.data?.status || 'unknown'}`);
      }
    } catch (error) {
      console.error("❌ Lỗi thực tế xuất hiện:", error);
      if (axios.isAxiosError(error)) {
        console.error("Chi tiết lỗi mạng:", error.response?.data || error.message);
      }
      alert("Hệ thống gặp lỗi xử lý dữ liệu hoặc nghẽn mạng CORS!");
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handlePrintCard = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!vehicleData) return;


    // 1. Tạo chuỗi log mới
    const newLog = `[IN THẺ] Xe: ${vehicleData.licensePlate} - Tài xế: ${vehicleData.name} - Thời gian: ${vehicleData.entryTime}`;

    // 2. Lấy danh sách log cũ từ localStorage ra (nếu có), rồi thêm log mới vào đầu mảng
    const existingLogs = JSON.parse(localStorage.getItem('vehicle_logs') || '[]');
    const updatedLogs = [newLog, ...existingLogs];

    // 3. Lưu mảng mới ngược lại vào localStorage
    localStorage.setItem('vehicle_logs', JSON.stringify(updatedLogs));

    const printHtml = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>In Thẻ Giấy Cổng Vào</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #000; }
            .card { border: 2px solid #000; padding: 16px; width: 320px; display: flex; justify-content: space-between; }
            .value { font-weight: bold; font-size: 16px; margin-bottom: 6px; }
          </style>
        </head>
        <body>
          <div class="card">
            <div>
              <div class="value">Số CCCD: ${vehicleData.id}</div>
              <div class="value">Tài xế: ${vehicleData.name}</div>
              <div class="value">Biển số: ${vehicleData.licensePlate}</div>
              <div class="value">Vào lúc: ${vehicleData.entryTime}</div>
            </div>
            <div style="width: 35%; text-align: center;">
              <img src="${vehicleData.driverFaceImage}" style="width: 100%; border: 1px solid #000;" />
            </div>
          </div>
        </body>
      </html>
    `;

    const w = window.open('', '_blank');
    if (w) {
      w.document.open(); w.document.write(printHtml); w.document.close(); w.focus();
      setTimeout(() => { w.print(); }, 300);
    }

    setPrintHistory([
      `[IN THẺ] Xe: ${vehicleData.licensePlate} - Tài xế: ${vehicleData.name} - Thời gian: ${vehicleData.entryTime}`,
      ...printHistory,
    ]);
    
    alert("Xác nhận xe vào và lưu lịch sử thành công!");
    setVehicleData(null);

    navigate('/log-history');
  };

  // Trả về toàn bộ dữ liệu và hàm xử lý để phía giao diện bốc ra dùng
  return {
    vehicleData,
    printHistory,
    isLoading,
    fileInputRef,
    handleUpdateVehicleField,
    handleUploadImageClick,
    handleFileChange,
    handlePrintCard,
  };
}