import { useEffect, useRef } from 'react';

interface Props {
  color: string;
  bpm: number;
  combo: number;
  active: boolean;
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

export default function ConcertBg({ color, bpm, combo, active }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    color, bpm, combo, active,
    beat: 0,
    lastBeat: 0,
    particles: [] as Particle[],
    smokeParticles: [] as SmokeParticle[],
    crowdPeople: [] as CrowdPerson[],
    spotlights: [] as Spotlight[],
    lasers: [] as Laser[],
    frame: 0,
  });

  // Sync props into ref
  useEffect(() => {
    stateRef.current.color = color;
    stateRef.current.bpm = bpm;
    stateRef.current.combo = combo;
    stateRef.current.active = active;
  }, [color, bpm, combo, active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initScene();
    };

    // ─── TYPES ───────────────────────────────────────────────────
    interface Particle {
      x: number; y: number; vx: number; vy: number;
      life: number; maxLife: number; size: number; color: string;
    }
    interface SmokeParticle {
      x: number; y: number; vx: number; vy: number;
      life: number; maxLife: number; radius: number; opacity: number;
    }
    interface CrowdPerson {
      x: number; baseY: number;
      bodyH: number; headR: number; width: number;
      phase: number; speed: number; armUp: boolean; armPhase: number;
      phoneLight: boolean; phoneBrightness: number;
      shade: number;
    }
    interface Spotlight {
      x: number; angle: number; angleTarget: number;
      speed: number; width: number; length: number;
      color: string; opacity: number; phase: number;
    }
    interface Laser {
      x1: number; y1: number; x2: number; y2: number;
      color: string; opacity: number; phase: number; speed: number;
    }

    // ─── INIT ─────────────────────────────────────────────────────
    function initScene() {
      const s = stateRef.current;
      const W = canvas.width, H = canvas.height;
      const rgb = hexToRgb(s.color);
      const colStr = `rgb(${rgb.r},${rgb.g},${rgb.b})`;

      // Crowd
      s.crowdPeople = Array.from({ length: 55 }, (_, i) => ({
        x: (i / 55) * W * 1.05 - W * 0.025 + (Math.random() - 0.5) * 20,
        baseY: H * 0.79 + Math.random() * H * 0.06,
        bodyH: 28 + Math.random() * 28,
        headR: 7 + Math.random() * 6,
        width: 12 + Math.random() * 10,
        phase: Math.random() * Math.PI * 2,
        speed: 0.8 + Math.random() * 1.2,
        armUp: Math.random() > 0.45,
        armPhase: Math.random() * Math.PI * 2,
        phoneLight: Math.random() > 0.55,
        phoneBrightness: Math.random(),
        shade: 0.3 + Math.random() * 0.5,
      }));

      // Spotlights — varied colors
      const spotColors = [colStr, '#FFD700', '#FF006E', '#00FFFF', '#BF5FFF', '#39FF14'];
      s.spotlights = Array.from({ length: 7 }, (_, i) => ({
        x: W * (0.08 + i * 0.14),
        angle: -0.3 + Math.random() * 0.6,
        angleTarget: -0.5 + Math.random() * 1.0,
        speed: 0.008 + Math.random() * 0.012,
        width: 18 + Math.random() * 22,
        length: H * (0.55 + Math.random() * 0.25),
        color: spotColors[i % spotColors.length],
        opacity: 0.55 + Math.random() * 0.35,
        phase: Math.random() * Math.PI * 2,
      }));

      // Lasers
      s.lasers = Array.from({ length: 6 }, (_, i) => {
        const lColors = [colStr, '#FF006E', '#00FFFF', '#39FF14', '#FFD700', '#BF5FFF'];
        return {
          x1: W * Math.random(), y1: 0,
          x2: W * Math.random(), y2: H * 0.8,
          color: lColors[i % lColors.length],
          opacity: 0, phase: Math.random() * Math.PI * 2, speed: 0.02 + Math.random() * 0.03,
        };
      });

      s.smokeParticles = [];
      s.particles = [];
    }

    // ─── SPAWN HELPERS ────────────────────────────────────────────
    function spawnSmoke(W: number, H: number) {
      const s = stateRef.current;
      if (s.smokeParticles.length > 18) return;
      s.smokeParticles.push({
        x: W * 0.1 + Math.random() * W * 0.8,
        y: H * 0.78,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -(0.4 + Math.random() * 0.6),
        life: 1, maxLife: 1,
        radius: 30 + Math.random() * 50,
        opacity: 0.06 + Math.random() * 0.07,
      });
    }

    function spawnBeatParticles(W: number, H: number, col: string) {
      const s = stateRef.current;
      const count = s.combo > 20 ? 20 : s.combo > 10 ? 12 : 6;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = 2 + Math.random() * 5;
        s.particles.push({
          x: W * 0.5, y: H * 0.5,
          vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd,
          life: 1, maxLife: 1,
          size: 2 + Math.random() * 4,
          color: col,
        });
      }
    }

    // ─── DRAW ─────────────────────────────────────────────────────
    function draw(ts: number) {
      const s = stateRef.current;
      const W = canvas.width, H = canvas.height;
      if (!W || !H) { rafId = requestAnimationFrame(draw); return; }

      const rgb = hexToRgb(s.color);
      const colStr = `rgb(${rgb.r},${rgb.g},${rgb.b})`;
      const beatMs = 60000 / s.bpm;
      const isHype = s.combo >= 20;
      const isMega = s.combo >= 50;

      // Beat detection
      if (s.active && ts - s.lastBeat > beatMs) {
        s.lastBeat = ts;
        s.beat = 1;
        spawnBeatParticles(W, H, colStr);
      } else {
        s.beat = Math.max(0, s.beat - 0.08);
      }

      // Spawn smoke
      if (s.active && s.frame % 30 === 0) spawnSmoke(W, H);
      s.frame++;

      // ── BACKGROUND ──────────────────────────────────────────────
      ctx.fillStyle = '#050508';
      ctx.fillRect(0, 0, W, H);

      // Ambient stage glow
      const stageGrad = ctx.createRadialGradient(W / 2, H, 0, W / 2, H, W * 0.8);
      stageGrad.addColorStop(0, `rgba(${rgb.r},${rgb.g},${rgb.b},${0.12 + s.beat * 0.18})`);
      stageGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = stageGrad;
      ctx.fillRect(0, 0, W, H);

      // Beat flash
      if (s.beat > 0.5) {
        ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${(s.beat - 0.5) * 0.08})`;
        ctx.fillRect(0, 0, W, H);
      }

      // ── GRID LINES (subtle stage floor) ──────────────────────────
      ctx.save();
      ctx.globalAlpha = 0.04;
      ctx.strokeStyle = colStr;
      ctx.lineWidth = 0.5;
      const floorY = H * 0.8;
      for (let gx = 0; gx < W; gx += W / 12) {
        ctx.beginPath();
        ctx.moveTo(W / 2, floorY * 0.3);
        ctx.lineTo(gx, floorY);
        ctx.stroke();
      }
      for (let row = 0; row < 5; row++) {
        const gy = floorY + row * (H - floorY) / 5;
        ctx.beginPath();
        ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
      }
      ctx.restore();

      // ── SMOKE ────────────────────────────────────────────────────
      s.smokeParticles = s.smokeParticles.filter(p => p.life > 0);
      for (const p of s.smokeParticles) {
        p.x += p.vx; p.y += p.vy; p.vy *= 0.99;
        p.life -= 0.004; p.radius += 0.5;
        const alpha = p.opacity * p.life;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        grad.addColorStop(0, `rgba(200,200,220,${alpha})`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(p.x - p.radius, p.y - p.radius, p.radius * 2, p.radius * 2);
      }

      // ── LASERS ───────────────────────────────────────────────────
      if (s.active) {
        for (const l of s.lasers) {
          l.phase += l.speed;
          l.opacity = (Math.sin(l.phase) * 0.5 + 0.5) * (isHype ? 0.5 : 0.22);
          if (l.opacity < 0.02) continue;
          // Reposition occasionally
          if (Math.sin(l.phase * 0.3) > 0.98) {
            l.x1 = W * Math.random(); l.x2 = W * Math.random();
          }
          ctx.save();
          ctx.globalAlpha = l.opacity;
          ctx.strokeStyle = l.color;
          ctx.lineWidth = 1.5;
          ctx.shadowColor = l.color;
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.moveTo(l.x1, l.y1);
          ctx.lineTo(l.x2, l.y2);
          ctx.stroke();
          ctx.restore();
        }
      }

      // ── SPOTLIGHTS ───────────────────────────────────────────────
      const t = ts / 1000;
      for (const sp of s.spotlights) {
        // Wander angle
        if (Math.abs(sp.angle - sp.angleTarget) < 0.01) {
          sp.angleTarget = -0.55 + Math.random() * 1.1;
        }
        sp.angle += (sp.angleTarget - sp.angle) * sp.speed * (isHype ? 3 : 1);

        const endX = sp.x + Math.sin(sp.angle) * sp.length;
        const endY = sp.length * Math.cos(Math.abs(sp.angle));
        const halfW = sp.width * (1 + s.beat * 0.3);
        const opacity = sp.opacity * (s.active ? 1 : 0.25) * (0.7 + 0.3 * Math.sin(t * sp.speed * 60 + sp.phase));

        const grad = ctx.createLinearGradient(sp.x, 0, endX, endY);
        grad.addColorStop(0, sp.color.replace('rgb', 'rgba').replace(')', `,${opacity})`));
        grad.addColorStop(0.5, sp.color.replace('rgb', 'rgba').replace(')', `,${opacity * 0.4})`));
        grad.addColorStop(1, 'transparent');

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(sp.x - halfW / 2, 0);
        ctx.lineTo(sp.x + halfW / 2, 0);
        ctx.lineTo(endX + halfW * 2, endY);
        ctx.lineTo(endX - halfW * 2, endY);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.globalAlpha = 1;
        ctx.fill();
        // Lens flare dot
        ctx.beginPath();
        ctx.arc(sp.x, 4, 5 + s.beat * 3, 0, Math.PI * 2);
        ctx.fillStyle = sp.color.replace('rgb', 'rgba').replace(')', ',0.9)');
        ctx.shadowColor = sp.color;
        ctx.shadowBlur = 20 + s.beat * 15;
        ctx.fill();
        ctx.restore();
      }

      // ── STAGE LIGHT BAR ───────────────────────────────────────────
      const barColors = [colStr, '#FFD700', '#FF006E', '#00FFFF', '#39FF14', '#BF5FFF', '#FF8800', '#ffffff', '#FF006E', '#00FFFF'];
      ctx.save();
      ctx.fillStyle = 'rgba(10,10,20,0.8)';
      ctx.fillRect(0, 0, W, 14);
      for (let i = 0; i < 10; i++) {
        const bx = W * (i / 10) + W / 20;
        const blink = Math.sin(t * (3 + i) * s.bpm / 60 * Math.PI) > 0;
        ctx.beginPath();
        ctx.arc(bx, 7, 5, 0, Math.PI * 2);
        ctx.fillStyle = blink ? barColors[i] : 'rgba(30,30,50,1)';
        ctx.shadowColor = blink ? barColors[i] : 'transparent';
        ctx.shadowBlur = blink ? 14 : 0;
        ctx.fill();
        if (blink) {
          const beamGrad = ctx.createLinearGradient(bx, 14, bx, H * 0.45);
          beamGrad.addColorStop(0, barColors[i].replace('rgb', 'rgba').replace(')', ',0.15)'));
          beamGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = beamGrad;
          ctx.fillRect(bx - 6, 14, 12, H * 0.45);
        }
      }
      ctx.restore();

      // ── CROWD ────────────────────────────────────────────────────
      const now = ts / 1000;
      for (const person of s.crowdPeople) {
        const sway = Math.sin(now * person.speed + person.phase) * (isHype ? 7 : 4) * (s.active ? 1 : 0.3);
        const bounce = Math.abs(Math.sin(now * person.speed * 2 + person.phase)) * (isHype ? 5 : 2) * (s.active ? 1 : 0);
        const py = person.baseY - bounce;
        const px = person.x + sway;

        // Shadow
        ctx.save();
        ctx.globalAlpha = 0.15 * person.shade;
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.ellipse(px, person.baseY + 4, person.width * 0.6, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Body
        const brightness = person.shade * (s.active ? (0.5 + s.beat * 0.4) : 0.25);
        ctx.save();
        ctx.globalAlpha = brightness;
        ctx.fillStyle = `rgb(${Math.round(rgb.r * 0.4)},${Math.round(rgb.g * 0.4)},${Math.round(rgb.b * 0.4)})`;
        ctx.beginPath();
        ctx.roundRect(px - person.width / 2, py - person.bodyH, person.width, person.bodyH, 3);
        ctx.fill();
        // Head
        ctx.beginPath();
        ctx.arc(px, py - person.bodyH - person.headR, person.headR, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${Math.round(rgb.r * 0.5)},${Math.round(rgb.g * 0.5)},${Math.round(rgb.b * 0.5)})`;
        ctx.fill();
        ctx.restore();

        // Arms
        if (person.armUp && s.active) {
          const armSway = Math.sin(now * person.speed * 1.5 + person.armPhase) * 18;
          ctx.save();
          ctx.globalAlpha = brightness * 0.9;
          ctx.strokeStyle = `rgb(${Math.round(rgb.r * 0.5)},${Math.round(rgb.g * 0.5)},${Math.round(rgb.b * 0.5)})`;
          ctx.lineWidth = 3;
          ctx.lineCap = 'round';
          // Left arm
          ctx.beginPath();
          ctx.moveTo(px - person.width / 2, py - person.bodyH * 0.7);
          ctx.lineTo(px - person.width / 2 - 10 - armSway * 0.3, py - person.bodyH - 18 + armSway * 0.5);
          ctx.stroke();
          // Right arm
          ctx.beginPath();
          ctx.moveTo(px + person.width / 2, py - person.bodyH * 0.7);
          ctx.lineTo(px + person.width / 2 + 10 + armSway * 0.3, py - person.bodyH - 18 - armSway * 0.5);
          ctx.stroke();
          ctx.restore();
        }

        // Phone / lighter lights
        if (person.phoneLight && s.active) {
          const flicker = 0.6 + 0.4 * Math.sin(now * 3 + person.phase);
          ctx.save();
          ctx.globalAlpha = person.phoneBrightness * flicker * 0.9;
          ctx.shadowColor = '#ffffff';
          ctx.shadowBlur = 12;
          ctx.fillStyle = '#ffffff';
          const lx = px + (Math.random() > 0.5 ? -person.width / 2 - 8 : person.width / 2 + 8);
          const ly = py - person.bodyH - person.headR * 2 - 6;
          ctx.fillRect(lx - 2, ly - 4, 4, 8);
          // Tiny beam upward
          const lGrad = ctx.createLinearGradient(lx, ly - 4, lx, ly - 40);
          lGrad.addColorStop(0, 'rgba(255,255,255,0.25)');
          lGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = lGrad;
          ctx.fillRect(lx - 2, ly - 40, 4, 36);
          ctx.restore();
        }
      }

      // ── BEAT PARTICLES ───────────────────────────────────────────
      s.particles = s.particles.filter(p => p.life > 0);
      for (const p of s.particles) {
        p.x += p.vx; p.y += p.vy; p.vy += 0.05;
        p.life -= 0.025;
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // ── HYPE: confetti burst from top ────────────────────────────
      if (isMega && s.active && s.frame % 4 === 0) {
        const confColors = [colStr, '#FFD700', '#FF006E', '#00FFFF', '#39FF14'];
        for (let i = 0; i < 3; i++) {
          s.particles.push({
            x: Math.random() * W, y: -10,
            vx: (Math.random() - 0.5) * 4, vy: 1 + Math.random() * 3,
            life: 1, maxLife: 1, size: 3 + Math.random() * 4,
            color: confColors[Math.floor(Math.random() * confColors.length)],
          });
        }
      }

      // ── MEGA STROBE ──────────────────────────────────────────────
      if (isMega && s.active && Math.sin(t * s.bpm / 60 * Math.PI * 2) > 0.92) {
        ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},0.06)`;
        ctx.fillRect(0, 0, W, H);
      }

      // ── VIGNETTE ─────────────────────────────────────────────────
      const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.85);
      vig.addColorStop(0, 'transparent');
      vig.addColorStop(1, 'rgba(0,0,0,0.55)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      rafId = requestAnimationFrame(draw);
    }

    let rafId: number;
    resize();
    window.addEventListener('resize', resize);
    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
}
