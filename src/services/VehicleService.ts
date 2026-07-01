import axios from "axios";

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
    "http://localhost:8000/mock/aibox/lpr-event",
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