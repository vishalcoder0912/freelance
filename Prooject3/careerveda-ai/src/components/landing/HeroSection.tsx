"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, ArrowRight, Play, Zap } from "lucide-react";

const METRICS = [
  { label: "AI Resume Score", value: 94, unit: "", color: "#6C63FF" },
  { label: "Career Match", value: 92, unit: "%", color: "#00D4FF" },
  { label: "Interview Readiness", value: 87, unit: "%", color: "#7CFFB2" },
  { label: "Salary Potential", value: 28, unit: " LPA", color: "#F59E0B" },
];

function NeuralCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    canvas.addEventListener("mousemove", onMouse);

    const N = 80;
    const nodes = Array.from({ length: N }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
      hue: Math.random() * 60 + 220,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      });

      // Draw edges
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.3;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(108,99,255,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw mouse connections
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      nodes.forEach((n) => {
        const dx = n.x - mx;
        const dy = n.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 160) {
          const alpha = (1 - dist / 160) * 0.6;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(mx, my);
          ctx.strokeStyle = `rgba(0,212,255,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      });

      // Draw nodes
      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${n.hue},80%,70%,0.8)`;
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-60"
    />
  );
}

function AnimatedCounter({ target, unit, color }: { target: number; unit: string; color: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return (
    <span style={{ color }} className="font-bold text-2xl tabular-nums">
      {val}{unit}
    </span>
  );
}

const skillNodes = [
  { label: "AI/ML", x: "15%", y: "20%", color: "#6C63FF" },
  { label: "Cloud", x: "80%", y: "15%", color: "#00D4FF" },
  { label: "DevOps", x: "85%", y: "70%", color: "#7CFFB2" },
  { label: "UI/UX", x: "10%", y: "75%", color: "#F59E0B" },
  { label: "Data", x: "45%", y: "10%", color: "#6C63FF" },
  { label: "Security", x: "90%", y: "42%", color: "#EF4444" },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden grid-bg">
      <NeuralCanvas />

      {/* Floating skill nodes */}
      {skillNodes.map((node, i) => (
        <motion.div
          key={node.label}
          className="absolute hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-card text-xs font-semibold pointer-events-none"
          style={{ left: node.x, top: node.y, borderColor: `${node.color}30`, color: node.color }}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: node.color }} />
          {node.label}
        </motion.div>
      ))}

      {/* Content */}
      <div className="container-cv relative z-10 pt-24 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-[rgba(108,99,255,0.3)] mb-8"
          >
            <Zap size={14} className="text-[#7CFFB2]" />
            <span className="text-sm text-[#94A3B8]">
              World&apos;s First{" "}
              <span className="text-white font-semibold">AI Career Operating System</span>
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-6"
          >
            Become{" "}
            <span className="gradient-text-primary">Irreplaceable</span>.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-[#94A3B8] max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            The AI Career OS that analyzes your potential, builds your roadmap, coaches your interviews, and places you in your dream role — all in one intelligent platform.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link
              href="/dashboard"
              className="group flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] rounded-2xl text-white font-semibold hover:opacity-90 transition-all shadow-2xl shadow-[rgba(108,99,255,0.4)] hover:shadow-[rgba(108,99,255,0.6)] hover:-translate-y-0.5"
            >
              <Sparkles size={18} />
              Start Career Analysis
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="flex items-center gap-2 px-6 py-3.5 rounded-2xl glass-card border border-[rgba(255,255,255,0.1)] text-white font-semibold hover:border-[rgba(108,99,255,0.4)] transition-all">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#00D4FF] flex items-center justify-center">
                <Play size={10} fill="white" />
              </div>
              Watch Demo
            </button>
          </motion.div>

          {/* Live Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {METRICS.map((m) => (
              <div
                key={m.label}
                className="glass-card p-4 rounded-2xl text-center animated-border relative overflow-hidden"
              >
                <div
                  className="absolute inset-0 opacity-5 rounded-2xl"
                  style={{ background: `radial-gradient(circle, ${m.color}, transparent)` }}
                />
                <AnimatedCounter target={m.value} unit={m.unit} color={m.color} />
                <p className="text-xs text-[#94A3B8] mt-1">{m.label}</p>
                <div className="mt-2 h-1 rounded-full bg-[rgba(255,255,255,0.05)] overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: m.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${m.value}%` }}
                    transition={{ duration: 1.5, delay: 0.8 }}
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050816] to-transparent pointer-events-none" />
    </section>
  );
}
