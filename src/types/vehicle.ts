export interface XitecLog {
  id: string;          // Khớp với "id" từ API CCCD
  name: string;        // Khớp với "name" từ API CCCD
  birth?: string;      // Thêm trường ngày sinh nếu cần dùng
  place?: string
  nationalId: string;
  driverName: string;
  nationalIdImage: string;
  licensePlate: string;
  licensePlateImage: string;
  driverFaceImage: string;
  entryTime: string;
}


export interface ApiResponseCCCD {
  status: string;
  message: string;
  data: {
    session: any;
    vehicle: any;
    person: {
      cccd_number: string;
      full_name: string;
      birth: string;
      sex: string | null;
      place: string;
      cccd_face_image_url: string;
      cccd_original_image_url: string;
    };
  };
}