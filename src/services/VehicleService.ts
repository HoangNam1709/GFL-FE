// VehicleService.ts
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "");

/**
 * API Đăng ký phương tiện (Hàm gốc của bạn)
 */
export async function submitVehicleRegistration(
  licensePlate: string,
  images: { plate: { file: File | null }; vehicle: { file: File | null } },
  organizationId?: string
) {
  if (!images.plate.file || !images.vehicle.file) {
    throw new Error("Vui lòng tải lên Ảnh Biển Số và Ảnh Toàn Xe!");
  }

  const cameraToken = localStorage.getItem("camera_token");
  const formDataToSend = new FormData();
  formDataToSend.append("event_uid", "");
  formDataToSend.append("plate_number", licensePlate);
  formDataToSend.append("plate_image", images.plate.file);
  formDataToSend.append("frame_image", images.vehicle.file);

  const response = await axios.post(
    `${API_BASE_URL}/mock/aibox/lpr-event`,
    formDataToSend,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        "X-Organization-ID": organizationId || "",
        Authorization: `Bearer ${cameraToken || ""}`,
      },
    },
  );

  if (response.status === 200 || response.data?.status === "SUCCESS") {
    const receivedData = response.data?.data || response.data;
    return {
      event_uid: receivedData.event_uid || response.data?.event_uid || ""
    };
  } else {
    throw new Error(response.data?.message || "Đăng ký xe thất bại.");
  }
}

// VehicleService.ts

/**
 * 🌟 ĐÃ SỬA: Lấy toàn bộ lịch sử từ /api/v1/access/history để tự đối soát ở Frontend
 * @param licensePlate Biển số xe cần kiểm tra
 * @returns true nếu phát hiện xe trùng và đang ở trong bến, false nếu hợp lệ
 */
// VehicleService.ts
export async function checkVehicleInsideStatus(licensePlate: string): Promise<boolean> {
  try {
    let userToken = localStorage.getItem("token") || "";
    if (userToken.startsWith("Bearer ")) {
      userToken = userToken.replace("Bearer ", "");
    }

    // Làm sạch biển số nhập vào: Bỏ khoảng trắng, bỏ dấu gạch ngang (-), bỏ dấu chấm (.) để khớp với BE
    const cleanTargetPlate = licensePlate.trim().toUpperCase().replace(/[-.]/g, "");

    const response = await axios.get(`${API_BASE_URL}/api/v1/access/history`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });

    const responseBody = response.data;
    const historyRecords = responseBody?.data || responseBody?.history || (Array.isArray(responseBody) ? responseBody : []);
    
    if (Array.isArray(historyRecords) && historyRecords.length > 0) {
      
      const isInside = historyRecords.some((record: any) => {
        // 🟢 ĐỌC ĐÚNG KEY TỪ LOG BACKEND TRẢ VỀ
        const backendPlateRaw = record.plate?.number || "";
        const cleanBackendPlate = backendPlateRaw.trim().toUpperCase().replace(/[-.]/g, "");
        
        const currentStatus = (record.status || "").trim().toUpperCase();

        // 1. So sánh biển số xe sau khi đã loại bỏ hoàn toàn ký tự đặc biệt
        const isSamePlate = cleanBackendPlate === cleanTargetPlate;
        
        // 2. Điều kiện xe đang ở trong bến: Trạng thái KHÔNG PHẢI là CHECKED_OUT
        // Bắt các trạng thái đang chờ xử lý như "WAITING_PERSON", "PENDING", "CHECKED_IN"...
        const isStillInside = isSamePlate && currentStatus !== "CHECKED_OUT" && currentStatus !== "";

        if (isSamePlate) {
          console.log(`=> Tìm thấy xe trùng ${backendPlateRaw} | Trạng thái BE: ${currentStatus} | Kết luận chặn: ${isStillInside}`);
        }

        return isStillInside;
      });

      return isInside;
    }
    
    return false;
  } catch (error) {
    console.error(">>> [Error checking vehicle status]:", error);
    return false; 
  }
}