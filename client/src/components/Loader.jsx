// src/components/Loader.jsx
export default function Loader({ size = 20, text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div className="loader" style={{ width: size, height: size }} />
      {text && <span style={{ color: "var(--text2)", fontSize: 13 }}>{text}</span>}
    </div>
  );
}