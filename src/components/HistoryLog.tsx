interface HistoryLogProps {
  history: string[];
}

export default function HistoryLog({ history }: HistoryLogProps) {
  return (
    <div style={{ marginTop: '40px', background: '#1a1a1a', padding: '15px', borderRadius: '8px' }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#aaa' }}>📜 Lịch sử liên kết hệ thống (Thay thế hoàn toàn sổ giấy):</h4>
      {history.length === 0 ? (
        <p style={{ color: '#555', margin: 0 }}>Chưa có lượt xe nào được tạo.</p>
      ) : (
        <ul style={{ paddingLeft: '20px', margin: 0, color: '#2e7d32', fontWeight: 'bold' }}>
          {history.map((item, index) => (
            <li key={index} style={{ marginBottom: '5px' }}>
              {item} ➔ Đã lưu vào DB thành công!
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
