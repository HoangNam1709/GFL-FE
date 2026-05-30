import type { ChangeEvent, FormEvent } from 'react';
import type { XitecLog } from '../types';

interface CardPrintFormProps { 
  data: XitecLog;
  cardCode: string;
  onCardCodeChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export default function CardPrintForm({ data, cardCode, onCardCodeChange, onSubmit }: CardPrintFormProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onCardCodeChange(event.target.value);
  };

  return (
    <div style={{ background: '#1a1a1a', padding: '15px', borderRadius: '8px', border: '1px solid #ff9900' }}>
      <h3 style={{ color: '#ff9900', marginTop: 0 }}>⚙️ 3. LIÊN KẾT & CẤP THẺ</h3>
      <form onSubmit={onSubmit}>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          <strong>Bước 1: Tít thẻ trắng vào đầu đọc:</strong>
          <input
            type="text"
            placeholder="Quẹt thẻ vào đây..."
            value={cardCode}
            onChange={handleChange}
            style={{
              width: '90%',
              padding: '10px',
              marginTop: '5px',
              borderRadius: '4px',
              border: '1px solid #555',
              backgroundColor: '#333',
              color: '#fff',
            }}
            autoFocus
          />
        </label>

        <div style={{ marginTop: '20px', padding: '10px', background: '#262626', borderRadius: '6px', border: '1px dashed #555' }}>
          <p style={{ margin: '0 0 5px 0', color: '#aaa', fontSize: '12px' }}>Hệ thống sẽ tự gộp dữ liệu:</p>
          <p style={{ fontSize: '13px', margin: '2px 0' }}>
            • Thẻ số: <span style={{ color: '#ff9900' }}>{cardCode || 'Chưa quẹt'}</span>
          </p>
          <p style={{ fontSize: '13px', margin: '2px 0' }}>
            • Sẽ đi cùng xe: <span style={{ color: '#ff9900' }}>{data.bienSoXe}</span>
          </p>
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            marginTop: '20px',
            padding: '12px',
            backgroundColor: '#ff9900',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            fontSize: '15px',
            cursor: 'pointer',
          }}
        >
          🖨️ BƯỚC 2: BẤM IN THẺ GIẤY
        </button>
      </form>
    </div>
  );
}
