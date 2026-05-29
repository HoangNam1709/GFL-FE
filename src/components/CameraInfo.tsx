import type { XitecLog } from '../types';

interface CameraInfoProps {
  data: XitecLog;
}

export default function CameraInfo({ data }: CameraInfoProps) {
  return (
    <div style={{ background: '#1a1a1a', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
      <h3 style={{ color: '#ff9900', marginTop: 0 }}>📸 2. CỦA BÊN ĐỐI TÁC GỬI VỀ</h3>
      <p style={{ margin: '5px 0' }}>Biển số xe nhận diện:</p>
      <h2
        style={{
          margin: '0 0 15px 0',
          backgroundColor: '#fff',
          color: '#000',
          textAlign: 'center',
          padding: '5px',
          borderRadius: '4px',
        }}
      >
        {data.bienSoXe}
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
        <div>
          <p style={{ margin: '2px 0' }}>Ảnh xe chụp từ Cam:</p>
          <img
            src={data.anhBienSo}
            alt="Xe"
            style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }}
          />
        </div>
        <div>
          <p style={{ margin: '2px 0' }}>Ảnh mặt tài xế trên Cam:</p>
          <img
            src={data.anhMatTaiXe}
            alt="Tai xe cam"
            style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }}
          />
        </div>
      </div>
    </div>
  );
}
