interface HeaderProps {
  onSimulate: () => void;
}

export default function Header({ onSimulate }: HeaderProps) {
  return (
    <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '2px solid #ff9900', paddingBottom: '10px' }}>
      <h2 style={{ color: '#ff9900', margin: 0 }}>
        HỆ THỐNG GIÁM SÁT XE RA VÀO VÃNG LAI - ĐANG DEMO
      </h2>
      <button
        onClick={onSimulate}
        style={{
          marginTop: '10px',
          padding: '8px 16px',
          backgroundColor: '#ffffff',
          color: '#000000',
          border: 'none',
          borderRadius: '4px',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        🚨 BẤM VÀO ĐÂY ĐỂ GIẢ LẬP CÓ XE ĐẾN CỔNG
      </button>
    </div>
  );
}
