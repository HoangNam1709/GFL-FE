// src/pages/HistoryLog/types.ts

export interface PlateInfo {
  number: string | null;
  plate_image_url: string | null;
  frame_image_url: string | null;
  driver_face_image_url: string | null;
  confidence: number | null; 
}

export interface PersonInfo {
  cccd_number: string;
  full_name: string;
  cccd_face_image_url: string | null;
  cccd_original_image_url: string | null;
  live_face_image_url: string | null;
  live_face_source: string;
  birth: string; 
  sex: string;   
  place: string | null;
}

export interface TicketInfo {
  ticket_id: string;   
  ticket_code: string;
  status: string;
  front_image_url: string;
  back_image_url: string;
  qr_image_url: string; 
  barcode_image_url: string;
}

export interface FaceCompareInfo {
  source: string;
  score: number;
  threshold: number;
  result: 'MATCH' | 'MISMATCH' | string;
}

export interface HistoryLogItem {
  session_id: string;
  session_code: string;
  event_uid: string;
  person_event_uid: string;
  vehicle_event_uid: string | null;
  session_type: string;
  status: 'CHECKED_IN' | 'CHECKED_OUT';
  link_policy: string;
  organization_id: string;
  location_id: string;
  gate_id: string;
  gate_name: string;
  detected_at: string;
  created_at: string;
  updated_at: string;
  checked_in_at: string | null;
  checked_out_at: string | null;
  plate: PlateInfo;
  person: PersonInfo | null;
  ticket: TicketInfo | null;
  face_compare: FaceCompareInfo | null;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}