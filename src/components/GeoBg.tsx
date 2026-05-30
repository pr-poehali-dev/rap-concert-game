const shapes = [
  { type: 'triangle', size: 300, x: 10, y: 5, color: '#FFD700', delay: 0, dur: 8 },
  { type: 'hex', size: 200, x: 80, y: 15, color: '#00FFFF', delay: 2, dur: 12 },
  { type: 'diamond', size: 150, x: 50, y: 60, color: '#FF006E', delay: 1, dur: 10 },
  { type: 'triangle', size: 400, x: 90, y: 70, color: '#39FF14', delay: 3, dur: 15 },
  { type: 'hex', size: 120, x: 20, y: 80, color: '#BF5FFF', delay: 0.5, dur: 9 },
  { type: 'circle', size: 500, x: 60, y: 20, color: '#FFD700', delay: 1.5, dur: 20 },
  { type: 'diamond', size: 80, x: 5, y: 45, color: '#00FFFF', delay: 2.5, dur: 7 },
  { type: 'triangle', size: 180, x: 75, y: 90, color: '#FF006E', delay: 4, dur: 11 },
];

export default function GeoBg() {
  return (
    <div className="geo-bg">
      {shapes.map((s, i) => (
        <div
          key={i}
          className="geo-shape"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            animation: `float-geo ${s.dur}s ease-in-out ${s.delay}s infinite`,
          }}
        >
          {s.type === 'triangle' && (
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
              <polygon points="50,5 95,95 5,95" fill="none" stroke={s.color} strokeWidth="1" />
            </svg>
          )}
          {s.type === 'hex' && (
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
              <polygon points="50,5 95,27 95,73 50,95 5,73 5,27" fill="none" stroke={s.color} strokeWidth="1" />
            </svg>
          )}
          {s.type === 'diamond' && (
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
              <polygon points="50,5 95,50 50,95 5,50" fill="none" stroke={s.color} strokeWidth="1" />
            </svg>
          )}
          {s.type === 'circle' && (
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
              <circle cx="50" cy="50" r="45" fill="none" stroke={s.color} strokeWidth="0.5" strokeDasharray="4 8" />
            </svg>
          )}
        </div>
      ))}
      <div className="scanline" />
    </div>
  );
}
