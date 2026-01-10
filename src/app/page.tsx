'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Layers, Cpu, Shield, ExternalLink, Github, Twitter, Zap, Box, Code2, Check, Copy, Activity, Smartphone
} from 'lucide-react';

// --- CORRECCIÓN 1: Definimos qué es una Partícula para que TypeScript no se queje ---
type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

// --- NUEVO COMPONENTE: FONDO DE ORGANISMO VIVO (CANVAS) ---
const OrganismBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Usamos refs para valores que cambian rápido
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  
  // --- CORRECCIÓN 2: Usamos el tipo 'Particle[]' en lugar de 'any[]' ---
  const particlesRef = useRef<Particle[]>([]);
  
  // --- CORRECCIÓN 3: Inicializamos con null para evitar error de undefined ---
  const requestRef = useRef<number | null>(null);

  // Configuración del enjambre
  const particleCount = 300; 
  const particleSize = 1.5; 
  const particleColor = 'rgba(16, 185, 129, 0.8)'; 
  const mouseInfluenceRadius = 300; 
  const attractionStrength = 0.05; 
  const friction = 0.96; 
  const wanderStrength = 0.1; 

  // Inicializar partículas
  const initParticles = (width: number, height: number) => {
    particlesRef.current = [];
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 2, 
        vy: (Math.random() - 0.5) * 2, 
      });
    }
  };

  // Bucle de animación principal
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // EFECTO ESTELA
    ctx.fillStyle = 'rgba(2, 6, 23, 0.2)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Actualizar y dibujar cada partícula
    particlesRef.current.forEach(p => {
      // 1. Física del Mouse (Imán)
      if (mouseRef.current.active) {
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseInfluenceRadius) {
          const force = (mouseInfluenceRadius - distance) / mouseInfluenceRadius;
          const angle = Math.atan2(dy, dx);
          p.vx += Math.cos(angle) * force * attractionStrength;
          p.vy += Math.sin(angle) * force * attractionStrength;
        }
      }

      // 2. Comportamiento aleatorio
      p.vx += (Math.random() - 0.5) * wanderStrength;
      p.vy += (Math.random() - 0.5) * wanderStrength;

      // 3. Fricción
      p.vx *= friction;
      p.vy *= friction;

      // 4. Actualizar posición
      p.x += p.vx;
      p.y += p.vy;

      // 5. Rebotar en bordes
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      // 6. Dibujar
      ctx.beginPath();
      ctx.arc(p.x, p.y, particleSize, 0, Math.PI * 2);
      ctx.fillStyle = particleColor;
      ctx.fill();
    });

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };
    
    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    handleResize();
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
      style={{
         backgroundImage: `linear-gradient(rgba(16, 185, 129, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.05) 1px, transparent 1px)`,
         backgroundSize: '50px 50px',
         backgroundBlendMode: 'overlay'
      }}
    />
  );
};
// ---------------------------------------------------------------


export default function Home() {
  const [copied, setCopied] = useState(false);
  const email = "dvalexx17@gmail.com";
  const [latency, setLatency] = useState<string | null>(null);
  const [isPinging, setIsPinging] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePingNetwork = () => {
    if (isPinging) return;
    setIsPinging(true);
    setLatency("..."); 
    
    setTimeout(() => {
      const isMicro = Math.random() > 0.5;
      const val = isMicro 
        ? `${Math.floor(Math.random() * 800) + 100}µs`
        : `${Math.floor(Math.random() * 30) + 2}ms`;
      
      setLatency(val);
      setIsPinging(false);
      setTimeout(() => setLatency(null), 3000);
    }, 400);
  };

  return (
    <main className="min-h-screen bg-[#020617] text-zinc-300 p-4 md:p-8 flex items-center justify-center font-mono selection:bg-emerald-500/30 relative overflow-hidden">
      
      <OrganismBackground />

      {/* Contenedor Principal con pointer-events-none para dejar pasar el mouse al fondo */}
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-4 h-auto md:h-[850px] relative z-10 pointer-events-none">

        {/* --- BLOCK 1: MAIN PROFILE --- */}
        <div className="md:col-span-2 md:row-span-2 bg-[#0b1120]/80 backdrop-blur-md border border-slate-800 rounded-xl p-8 flex flex-col justify-between hover:border-slate-600 transition-all group relative overflow-hidden shadow-2xl shadow-black/40 pointer-events-auto">
          
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
             <Code2 size={140} />
          </div>

          <div className="flex flex-col md:flex-row md:items-start gap-6 z-10">
            <div className="relative shrink-0">
              <div className="h-24 w-24 md:h-32 md:w-32 rounded-full border-2 border-slate-700 overflow-hidden shadow-xl shadow-black/50 group-hover:border-emerald-500/50 transition-all">
                 <img src="/mi-nft.png" alt="Alexx_17 NFT Profile" className="h-full w-full object-cover" />
              </div>
              <div className="absolute bottom-1 right-1 h-4 w-4 bg-[#0b1120] rounded-full flex items-center justify-center border border-slate-700">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              </div>
            </div>
            
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/30 border border-emerald-800/50 text-emerald-400 text-xs mb-4">
                Building on Solana
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tighter mb-2">Alexx_17</h1>
              <h2 className="text-lg text-slate-400 font-medium">Systems Engineer & Web3 Dev</h2>
            </div>
          </div>

          <div className="space-y-6 z-10 max-w-lg mt-4">
            <p className="text-sm md:text-base leading-relaxed text-slate-400">
              Developer focused on decentralized systems architecture. 
              Beyond code, I build infrastructure with an absolute priority on <span className="text-slate-100 font-bold decoration-emerald-600 underline underline-offset-4">security</span> and <span className="text-slate-100 font-bold decoration-emerald-600 underline underline-offset-4">scalability</span>.
              <br/><br/>
              <span className="text-xs text-slate-500">Crypto Enthusiast since 2021 // Native Builder.</span>
            </p>
            
            <div className="flex gap-3 pt-2">
              <a href="https://github.com/4lexand" target="_blank" className="p-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-600 rounded-lg transition-all text-white">
                <Github size={20} />
              </a>
              <a href="https://x.com/4lexx07" target="_blank" className="p-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-600 rounded-lg transition-all text-white">
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* --- BLOCK 2: LIVE DEPLOYMENTS --- */}
        <div className="md:col-span-1 md:row-span-2 bg-[#0b1120]/80 backdrop-blur-md border border-slate-800 rounded-xl p-6 flex flex-col hover:border-slate-600 transition-colors shadow-xl pointer-events-auto">
          <div className="flex items-center gap-2 mb-6 text-white border-b border-slate-800 pb-4">
            <Layers size={18} />
            <h3 className="font-bold">Live Deployments</h3>
          </div>

          <div className="space-y-3 overflow-y-auto pr-1 custom-scrollbar">
            {/* RollRush */}
            <a href="https://solana-dice-indol.vercel.app/" target="_blank" className="block group/card">
              <div className="p-4 rounded-lg bg-[#0f172a] border border-slate-800 group-hover/card:border-emerald-500/50 transition-all hover:shadow-lg hover:shadow-emerald-900/20">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-emerald-400 border border-emerald-900/50 bg-emerald-900/10 px-2 py-0.5 rounded">GAMING SPL</span>
                  <ExternalLink size={14} className="text-slate-500 group-hover/card:text-white transition-colors" />
                </div>
                <h4 className="text-white font-bold text-sm">RollRush</h4>
                <p className="text-xs text-slate-400 mt-2 leading-tight">High-frequency on-chain game. Verifiable randomness (VRF) and instant settlement.</p>
              </div>
            </a>

            {/* Aether-OS */}
            <a href="https://aether-dashboard-nu.vercel.app/" target="_blank" className="block group/card">
              <div className="p-4 rounded-lg bg-[#0f172a] border border-slate-800 group-hover/card:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-900/20">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-blue-400 border border-blue-900/50 bg-blue-900/10 px-2 py-0.5 rounded">INFRA / AI</span>
                  <ExternalLink size={14} className="text-slate-500 group-hover/card:text-white transition-colors" />
                </div>
                <h4 className="text-white font-bold text-sm">Aether-OS</h4>
                
                <p className="text-xs text-slate-400 mt-2 leading-tight flex flex-col gap-1">
                   <span className="inline-flex items-center gap-1 text-blue-300 font-medium">
                     <Smartphone size={12} /> Mobile Version 
                   </span>
                   <span>
                     Decentralized modular interface. Native integration for Solana Mobile Stack.
                   </span>
                </p>
              </div>
            </a>

            {/* Sleepand$Gn */}
            <a href="https://sleepandgn.com/" target="_blank" className="block group/card">
              <div className="p-4 rounded-lg bg-[#0f172a] border border-slate-800 group-hover/card:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-900/20">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-purple-400 border border-purple-900/50 bg-purple-900/10 px-2 py-0.5 rounded">TOKEN UI</span>
                  <ExternalLink size={14} className="text-slate-500 group-hover/card:text-white transition-colors" />
                </div>
                <h4 className="text-white font-bold text-sm">Sleepand$Gn</h4>
                <p className="text-xs text-slate-400 mt-2 leading-tight">Tokenomics portal, staking dashboard, and optimized airdrop claiming flow.</p>
              </div>
            </a>
          </div>
        </div>

        {/* --- BLOCK 3: TECH STACK --- */}
        <div className="bg-[#0b1120]/80 backdrop-blur-md border border-slate-800 rounded-xl p-6 flex flex-col justify-between hover:border-slate-600 transition-colors shadow-xl pointer-events-auto">
           <div className="flex items-center gap-2 text-white">
            <Cpu size={18} />
            <h3 className="font-bold">Core Stack</h3>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
             <div className="flex items-center justify-center p-3 rounded bg-[#0f172a] border border-slate-800 text-xs font-bold text-white hover:bg-slate-800 transition-colors">SOLANA</div>
             <div className="flex items-center justify-center p-3 rounded bg-[#0f172a] border border-slate-800 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">RUST</div>
             <div className="flex items-center justify-center p-3 rounded bg-[#0f172a] border border-slate-800 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">ANCHOR</div>
             <div className="flex items-center justify-center p-3 rounded bg-[#0f172a] border border-slate-800 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">UMI / MPLX</div>
             <div className="flex items-center justify-center p-3 rounded bg-[#0f172a] border border-slate-800 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors col-span-2">NEXT.JS / TS</div>
          </div>
        </div>

        {/* --- BLOCK 4: PHILOSOPHY --- */}
        <div className="md:col-span-2 bg-[#0b1120]/80 backdrop-blur-md border border-slate-800 rounded-xl p-8 flex flex-col justify-center hover:border-slate-600 transition-colors relative overflow-hidden shadow-xl pointer-events-auto">
          <div className="absolute -right-4 -bottom-4 opacity-5">
            <Shield size={120} />
          </div>
          <div className="flex items-center gap-3 mb-3">
            <Code2 className="text-indigo-400" size={24} />
            <h3 className="text-lg font-bold text-white">Engineering over Hype</h3>
          </div>
          <p className="text-sm text-slate-400 max-w-md">
            In a volatile ecosystem, solid architecture is the only real asset. 
            I specialize in secure design patterns, gas optimization, and fault-tolerant logic.
          </p>
          <div className="mt-6 flex gap-6 text-xs text-slate-500 font-mono uppercase tracking-widest">
            <span>// Audit_Ready</span>
            <span>// Gas_Optimized</span>
          </div>
        </div>

        {/* --- BLOCK 5: KPI / PERFORMANCE --- */}
        <div 
          onClick={handlePingNetwork}
          className="bg-gradient-to-br from-slate-900/90 to-[#020617]/90 backdrop-blur-md border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center hover:border-orange-500/50 transition-all cursor-pointer active:scale-95 group shadow-xl relative overflow-hidden pointer-events-auto"
        >
          {latency && <div className="absolute inset-0 bg-orange-500/10 animate-pulse pointer-events-none"></div>}
          
          <Zap size={32} className={`text-orange-500 mb-3 transition-transform ${latency ? 'scale-125' : 'group-hover:scale-110'}`} />
          
          <span className={`text-3xl font-bold transition-all ${latency ? 'text-orange-400' : 'text-white'}`}>
            {latency ? latency : "TPS"}
          </span>
          
          <span className="text-xs text-slate-500 mt-1 text-center flex items-center gap-1">
            {latency ? (
              <span className="text-orange-400 flex items-center animate-pulse">
                <Activity size={10} className="mr-1" /> Network Live
              </span>
            ) : (
              "Run Latency Test"
            )}
          </span>
        </div>

        {/* --- BLOCK 6: CONTACT --- */}
        <div 
          onClick={handleCopyEmail}
          className="bg-slate-100 text-black rounded-xl p-6 flex flex-col items-center justify-center hover:scale-[1.02] active:scale-95 transition-all cursor-pointer group relative shadow-xl hover:shadow-2xl pointer-events-auto"
        >
           <div className="mb-2 text-slate-800 group-hover:scale-110 transition-transform">
             {copied ? <Check size={28} className="text-green-600" /> : <Box size={28} className="group-hover:rotate-12 transition-transform" />}
           </div>
           
           <span className="font-bold text-lg">
             {copied ? "Email Copied!" : "Let's Build"}
           </span>
           
           <div className="mt-2 flex items-center gap-2 text-xs text-slate-600 border-t border-slate-300 pt-2 w-full justify-center">
             <span>{email}</span>
             {!copied && <Copy size={10} className="opacity-50" />}
           </div>
        </div>

      </div>
    </main>
  );
}