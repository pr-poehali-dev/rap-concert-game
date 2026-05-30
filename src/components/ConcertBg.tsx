import { useEffect, useRef } from 'react';

interface Props {
  color: string;
  bpm: number;
  combo: number;
  active: boolean;
}

export default function ConcertBg({ color, bpm, combo, active }: Props) {
  const beatMs = Math.round(60000 / bpm);
  const isHype = combo >= 20;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">

      {/* === STAGE FLOOR GLOW === */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '35%',
          background: `linear-gradient(to top, ${color}18 0%, transparent 100%)`,
          transition: 'opacity 0.3s',
        }}
      />

      {/* === SPOTLIGHTS === */}
      {[
        { x: 10, delay: 0, dur: beatMs * 2 },
        { x: 30, delay: beatMs * 0.5, dur: beatMs * 3 },
        { x: 50, delay: beatMs * 0.25, dur: beatMs * 1.5 },
        { x: 70, delay: beatMs * 0.75, dur: beatMs * 2.5 },
        { x: 90, delay: beatMs * 0.1, dur: beatMs * 2 },
      ].map((s, i) => (
        <div
          key={i}
          className="absolute top-0"
          style={{
            left: `${s.x}%`,
            width: '2px',
            height: '60%',
            background: `linear-gradient(to bottom, ${color}cc 0%, ${color}44 50%, transparent 100%)`,
            transformOrigin: 'top center',
            animation: `spotlight-swing ${s.dur}ms ease-in-out ${s.delay}ms infinite alternate`,
            filter: `blur(1px) drop-shadow(0 0 8px ${color})`,
            opacity: active ? (isHype ? 1 : 0.7) : 0.3,
            transition: 'opacity 0.5s',
          }}
        />
      ))}

      {/* === WIDE SPOTLIGHT CONES === */}
      {[
        { left: '5%', skew: '20deg', delay: '0ms' },
        { left: '40%', skew: '-10deg', delay: `${beatMs * 0.5}ms` },
        { left: '75%', skew: '15deg', delay: `${beatMs}ms` },
      ].map((c, i) => (
        <div
          key={i}
          className="absolute top-0"
          style={{
            left: c.left,
            width: '20%',
            height: '65%',
            background: `linear-gradient(to bottom, ${color}08 0%, transparent 100%)`,
            clipPath: 'polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)',
            animation: `spotlight-swing ${beatMs * 4}ms ease-in-out ${c.delay} infinite alternate`,
            opacity: active ? 0.8 : 0.2,
            transition: 'opacity 0.5s',
          }}
        />
      ))}

      {/* === CROWD SILHOUETTES === */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: '22%' }}
      >
        {/* Crowd row — SVG silhouette */}
        <svg
          viewBox="0 0 800 120"
          preserveAspectRatio="none"
          className="w-full h-full"
          style={{ opacity: 0.25 }}
        >
          {/* Generate crowd bumps */}
          {Array.from({ length: 40 }).map((_, i) => {
            const x = i * 20 + (i % 3) * 3;
            const h = 40 + (i % 5) * 14 + (i % 7) * 6;
            const w = 14 + (i % 4) * 3;
            return (
              <g key={i}>
                {/* Body */}
                <ellipse cx={x + 10} cy={120 - h / 2} rx={w / 2} ry={h / 2} fill={color} />
                {/* Head */}
                <circle cx={x + 10} cy={120 - h - 8} r={8 + (i % 3) * 2} fill={color} />
                {/* Arms up occasionally */}
                {i % 4 === 0 && (
                  <>
                    <line x1={x + 3} y1={120 - h + 10} x2={x - 8} y2={120 - h - 15} stroke={color} strokeWidth="3" strokeLinecap="round" />
                    <line x1={x + 17} y1={120 - h + 10} x2={x + 28} y2={120 - h - 15} stroke={color} strokeWidth="3" strokeLinecap="round" />
                  </>
                )}
              </g>
            );
          })}
        </svg>

        {/* Crowd sway animation overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, ${color}15, transparent)`,
            animation: `crowd-sway ${beatMs * 2}ms ease-in-out infinite alternate`,
          }}
        />
      </div>

      {/* === STAGE LIGHTS BAR (top) === */}
      <div className="absolute top-0 left-0 right-0 flex gap-6 px-4 pt-1 justify-center">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: [color, '#FFD700', '#FF006E', '#00FFFF', '#39FF14', '#BF5FFF', '#FF8800', '#fff'][i % 8],
              boxShadow: `0 0 10px ${[color, '#FFD700', '#FF006E', '#00FFFF', '#39FF14', '#BF5FFF', '#FF8800', '#fff'][i % 8]}`,
              animation: `stage-blink ${beatMs}ms ease-in-out ${i * (beatMs / 8)}ms infinite`,
            }}
          />
        ))}
      </div>

      {/* === SMOKE / FOG === */}
      {[
        { x: '10%', delay: '0s', dur: '6s' },
        { x: '40%', delay: '2s', dur: '8s' },
        { x: '70%', delay: '4s', dur: '7s' },
        { x: '85%', delay: '1s', dur: '5s' },
      ].map((s, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: s.left ?? s.x,
            bottom: '20%',
            width: '25%',
            height: '30%',
            background: `radial-gradient(ellipse at center, rgba(255,255,255,0.04) 0%, transparent 70%)`,
            animation: `smoke-rise ${s.dur} ease-out ${s.delay} infinite`,
            borderRadius: '50%',
            filter: 'blur(20px)',
          }}
        />
      ))}

      {/* === BEAT FLASH === */}
      {active && (
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 50% 100%, ${color}12 0%, transparent 60%)`,
            animation: `beat-flash ${beatMs}ms ease-out infinite`,
          }}
        />
      )}

      {/* === HYPE MODE — extra strobes === */}
      {isHype && active && (
        <>
          <div
            className="absolute inset-0"
            style={{
              background: `${color}08`,
              animation: `strobe ${beatMs * 0.5}ms step-end infinite`,
            }}
          />
          {/* Corner flares */}
          {['top-0 left-0', 'top-0 right-0'].map((pos, i) => (
            <div
              key={i}
              className={`absolute ${pos} w-32 h-32`}
              style={{
                background: `radial-gradient(circle at ${i === 0 ? '0% 0%' : '100% 0%'}, ${color}33 0%, transparent 70%)`,
                animation: `pulse-neon ${beatMs}ms ease-in-out ${i * beatMs * 0.5}ms infinite`,
              }}
            />
          ))}
        </>
      )}

      {/* === LASER LINES === */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: active ? 0.15 : 0.05 }}>
        {[
          { x1: '0%', y1: '0%', x2: '100%', y2: '80%' },
          { x1: '100%', y1: '0%', x2: '0%', y2: '80%' },
          { x1: '50%', y1: '0%', x2: '20%', y2: '80%' },
          { x1: '50%', y1: '0%', x2: '80%', y2: '80%' },
        ].map((l, i) => (
          <line
            key={i}
            x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
            stroke={color}
            strokeWidth="1"
            strokeDasharray="4 20"
            style={{
              animation: `laser-fade ${beatMs * 2}ms ease-in-out ${i * beatMs * 0.25}ms infinite alternate`,
            }}
          />
        ))}
      </svg>

    </div>
  );
}
