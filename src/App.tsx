import React, { useState } from 'react';
import type { XitecLog } from './types';
import Header from './components/Header';
import CccdInfo from './components/CccdInfo';
import CameraInfo from './components/CameraInfo';
import CardPrintForm from './components/CardPrintForm';
import HistoryLog from './components/HistoryLog';

export default function App() {
  // 2. Giả lập dữ liệu khi hệ thống bắt đầu chạy (Chưa có xe nào)
  const [duLieuXe, setDuLieuXe] = useState<XitecLog | null>(null);
  const [maTheQuet, setMaTheQuet] = useState<string>('');
  const [lichSuIn, setLichSuIn] = useState<string[]>([]);

  // 3. Hàm bấm nút GIẢ LẬP để giả vờ như có xe vừa đi qua Camera và quét CCCD
  const giaLapXeDenCổng = () => {
    setDuLieuXe({
      idCccd: "001096001234",
      tenTaiXe: "NGUYỄN VĂN A",
      anhCccd: "https://media.istockphoto.com/id/1396606504/vi/anh/t%C3%A0i-x%E1%BA%BF-xe-t%E1%BA%A3i-h%E1%BA%A1nh-ph%C3%BAc-v%E1%BB%9Bi-c%C3%A1nh-tay-khoanh-nh%C3%ACn-v%C3%A0o-m%C3%A1y-%E1%BA%A3nh.jpg?s=612x612&w=0&k=20&c=cko9PfrdZRaVw0QdYrwsK5IE6LAIJDfcYG2xnKKen1M=", // Ảnh mặt CCCD
      bienSoXe: "29C-777.77",
      anhBienSo: "https://vulinhauto.com/wp-content/uploads/2023/03/Thiet-ke-chua-co-ten-32.png", // Ảnh xe/biển số
      anhMatTaiXe: "https://media.istockphoto.com/id/1396633199/vi/anh/t%C3%A0i-x%E1%BA%BF-xe-t%E1%BA%A3i-h%E1%BA%A1nh-ph%C3%BAc-nh%C3%ACn-qua-c%E1%BB%ADa-s%E1%BB%95-b%C3%AAn-trong-khi-l%C3%A1i-xe-t%E1%BA%A3i-c%E1%BB%A7a-m%C3%ACnh.jpg?s=612x612&w=0&k=20&c=Y4A-e07VixMwM--j0QoPFTlYm4B26Oo8jZGyKrXQbhA=" // Ảnh tài xế trên cabin
    });
  };

  // 4. Hàm xử lý khi bảo vệ bấm nút "XÁC NHẬN & IN THẺ"
  const handleInThe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!duLieuXe || !maTheQuet) {
      alert("Vui lòng kích hoạt xe đến và nhập/quẹt mã thẻ trước!");
      return;
    }
    
    // Thêm vào danh sách lịch sử in để demo
    setLichSuIn([`Thẻ: ${maTheQuet} - Xe: ${duLieuXe.bienSoXe} - Khách: ${duLieuXe.tenTaiXe}`, ...lichSuIn]);
    
    // Gọi lệnh in của máy tính
    window.print();
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#121212', color: '#ffffff', minHeight: '100vh' , margin: '0'}}>
      
      <Header onSimulate={giaLapXeDenCổng} />

      {!duLieuXe ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#888888' }}>
          <h3>Chờ tín hiệu xe từ Camera đối tác và máy quét CCCD...</h3>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
          <CccdInfo data={duLieuXe} />
          <CameraInfo data={duLieuXe} />
          <CardPrintForm
            data={duLieuXe}
            maTheQuet={maTheQuet}
            onMaTheQuetChange={setMaTheQuet}
            onSubmit={handleInThe}
          />
        </div>
      )}

      <HistoryLog history={lichSuIn} />

    </div>
  );
}