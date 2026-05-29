import type { XitecLog } from '../types';

interface CccdInfoProps {
  data: XitecLog;
}

export default function CccdInfo({ data }: CccdInfoProps) {
  return (
    <div style={{ background: '#1a1a1a', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
      <h3 style={{ color: '#ff9900', marginTop: 0 }}>🪪 1. DỮ LIỆU OCR CCCD</h3>
      <div style={{ textAlign: 'center', marginBottom: '15px' }}>
        <p style={{ margin: '5px 0' }}>Ảnh mặt trên CCCD:</p>
        <img
          src={data.anhCccd}
          alt="Mat CCCD"
          style={{ width: '120px', height: '120px', borderRadius: '4px', objectFit: 'cover', border: '2px solid #ff9900' }}
        />
      </div>
      <p><strong>Số CCCD:</strong> {data.idCccd}</p>
      <p>
        <strong>Họ và Tên:</strong>{' '}
        <span style={{ color: '#ff9900', fontWeight: 'bold' }}>{data.tenTaiXe}</span>
      </p>
    </div>
  );
}
