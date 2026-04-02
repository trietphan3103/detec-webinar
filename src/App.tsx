/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Stethoscope, 
  FileText, 
  CheckCircle, 
  Globe, 
  Share2, 
  Star, 
  AlertCircle, 
  Menu, 
  X,
  ChevronRight,
  Clock,
  Users,
  Award,
  ShieldCheck,
  Play,
  ArrowRight,
  Sparkles,
  TrendingUp,
  DollarSign
} from 'lucide-react';

// --- Components ---

const Logo = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg 
    viewBox="0 0 400 500" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
  >
    {/* Graduation Cap */}
    <path 
      d="M140 50 L260 110 L140 170 L20 110 Z" 
      fill="#1E3A8A" 
    />
    <path 
      d="M140 130 C140 130 140 160 140 160 C140 176.569 126.569 190 110 190 C93.4315 190 80 176.569 80 160 L80 130" 
      stroke="#1E3A8A" 
      strokeWidth="20" 
      strokeLinecap="round"
    />
    <path 
      d="M260 110 C260 110 260 140 260 140" 
      stroke="#1E3A8A" 
      strokeWidth="8" 
      strokeLinecap="round"
    />
    <circle cx="260" cy="150" r="10" fill="#1E3A8A" />
    
    {/* Tooth Shape */}
    <path 
      d="M80 220 C80 220 120 180 180 180 C240 180 280 220 280 220 C340 220 380 280 380 380 C380 480 300 500 300 500 C300 500 280 400 240 300 C200 200 160 200 120 300 C80 400 60 500 60 500 C60 500 -20 480 -20 380 C-20 280 20 220 80 220 Z" 
      fill="url(#toothGradient)" 
    />
    
    <defs>
      <linearGradient id="toothGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#1E40AF" />
      </linearGradient>
    </defs>
  </svg>
);

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Tổng quan', href: '#market' },
    { label: 'Công nghệ', href: '#expert-story' },
    { label: 'Chuyên gia', href: '#speakers' },
    { label: 'Đồng hành toàn diện', href: '#ecosystem' },
    { label: 'Khách hàng điển hình', href: '#cases' },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200/20 py-3' : 'bg-transparent py-5'}`}>
      <div className="flex items-center justify-between px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex items-center">
          <img
            src={isScrolled ? 'https://smartveneer.vn/wp-content/uploads/smartveneer-logo.svg' : 'https://smartveneer.vn/wp-content/uploads/smartveneer-white-logo.svg'}
            alt="SmartVeneer"
            className="h-10"
          />
        </div>
        
        <div className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <a 
              key={item.label} 
              href={item.href} 
              className={`text-base font-semibold transition-all hover:opacity-80 ${isScrolled ? 'text-slate-600 hover:text-primary' : 'text-white/80 hover:text-white'}`}
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <a
            href="#registration"
            className="hidden sm:inline-flex bg-primary hover:bg-primary-light text-white px-7 py-2.5 rounded-full text-base font-bold transition-all shadow-lg shadow-primary/20 active:scale-95"
          >
            Đăng ký ngay
          </a>
          <img
            src={isScrolled ? '/images/detec-logo.svg' : '/images/detec-white-logo.svg'}
            alt="DETEC"
            className={`h-7 hidden lg:block ${isScrolled ? 'opacity-90' : 'opacity-80'}`}
          />
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu className={isScrolled ? 'text-slate-900' : 'text-white'} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white border-b border-slate-100 p-6 flex flex-col gap-4 md:hidden"
          >
            {navItems.map((item) => (
              <a 
                key={item.label} 
                href={item.href} 
                className="text-slate-600 font-semibold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2026-04-10T20:00:00').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-8">
      {[
        { label: 'Ngày', value: timeLeft.days },
        { label: 'Giờ', value: timeLeft.hours },
        { label: 'Phút', value: timeLeft.minutes },
        { label: 'Giây', value: timeLeft.seconds }
      ].map((item) => (
        <div key={item.label} className="glass-card px-2 sm:px-5 py-3 sm:py-4 rounded-xl text-center">
          <span className="block text-xl sm:text-3xl font-bold text-white">{String(item.value).padStart(2, '0')}</span>
          <span className="text-xs uppercase tracking-widest text-primary-light font-bold mt-1 block">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

const SpeakerCard = ({ name, role, roleBullets, description, image, quote, imagePosition, objectPositionStyle }: { name: string, role?: string, roleBullets?: string[], description: string | string[], image: string, quote?: string, imagePosition?: string, objectPositionStyle?: string }) => (
  <motion.div
    whileHover={{ y: -6 }}
    className="bg-white p-5 sm:p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col w-full"
  >
    <div className="aspect-square rounded-xl overflow-hidden mb-6 shrink-0">
      <img src={image} alt={name} className={`w-full h-full object-cover ${imagePosition || 'object-top'}`} style={objectPositionStyle ? { objectPosition: objectPositionStyle } : undefined} referrerPolicy="no-referrer" />
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-1">{name}</h3>
    {roleBullets ? (
      <ul className="text-sm text-primary font-semibold mb-2 space-y-0.5">
        {roleBullets.map((item, i) => (
          <li key={i} className="flex items-start gap-1.5"><span className="mt-1 shrink-0">•</span><span>{item}</span></li>
        ))}
      </ul>
    ) : (
      <p className="text-sm text-primary font-semibold mb-2">{role}</p>
    )}
    {Array.isArray(description) ? (
      <ul className="text-primary text-sm font-semibold mb-4 flex-grow space-y-0.5">
        {(description as string[]).map((item, i) => (
          <li key={i} className="flex items-start gap-1.5"><span className="mt-1 shrink-0">•</span><span>{item}</span></li>
        ))}
      </ul>
    ) : (
      <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-grow">{description}</p>
    )}
    {quote && (
      <blockquote className="border-l-2 border-primary/40 pl-4 mt-auto">
        <p className="text-slate-600 text-sm leading-relaxed italic">{quote}</p>
      </blockquote>
    )}
  </motion.div>
);

const caseImages = [
  { src: '/images/case-qa-01.jpg', label: 'Kết quả thực tế ca 1' },
  { src: '/images/case-qa-02.jpg', label: 'Kết quả thực tế ca 2' },
  { src: '/images/case-qa-03.jpg', label: 'Kết quả thực tế ca 3' },
  { src: '/images/case-artboard-1.jpg', label: 'Kết quả thực tế ca 4' },
  { src: '/images/case-artboard-2.jpg', label: 'Kết quả thực tế ca 5' },
  { src: '/images/case-artboard-new.png', label: 'Kết quả thực tế ca 6' },
];

const Lightbox = ({ index, onClose, onPrev, onNext }: { index: number, onClose: () => void, onPrev: () => void, onNext: () => void }) => (
  <div
    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
    onClick={onClose}
  >
    <button onClick={onClose} className="absolute top-4 right-4 text-white text-3xl font-bold w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full">✕</button>
    <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-3xl font-bold w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-full">‹</button>
    <img
      key={index}
      src={caseImages[index].src}
      alt={caseImages[index].label}
      className="max-w-4xl w-full max-h-[85vh] object-contain rounded-2xl"
      onClick={(e) => e.stopPropagation()}
    />
    <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-3xl font-bold w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-full">›</button>
    <p className="absolute bottom-6 text-white/60 text-sm">{caseImages[index].label} · {index + 1}/{caseImages.length}</p>
  </div>
);

const AgendaItem = ({ time, title, description, highlight, gold, index }: { time: string, title: string, description: string, highlight?: boolean, gold?: boolean, index: number }) => (
  <motion.div
    initial={{ opacity: 0, x: -30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay: index * 0.08 }}
    className={`relative flex flex-col md:flex-row md:items-center gap-2 md:gap-6 p-4 md:p-6 rounded-xl md:rounded-2xl transition-all duration-300 cursor-default overflow-hidden ${
      gold
        ? 'border border-[#eaca8b]/60 shadow-lg shadow-[#eaca8b]/10'
        : highlight
        ? 'bg-gradient-to-r from-primary/30 to-primary/10 border border-primary/50 shadow-lg shadow-primary/20'
        : 'glass-card border-white/5 hover:bg-white/5'
    }`}
    style={gold ? { background: 'linear-gradient(135deg, rgba(234,202,139,0.15) 0%, rgba(234,202,139,0.05) 100%)' } : {}}
  >
    {highlight && (
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    )}
    {gold && (
      <motion.div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(90deg, rgba(234,202,139,0.08) 0%, transparent 100%)' }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      />
    )}
    {highlight && (
      <span className="absolute top-3 right-4 text-xs font-black uppercase tracking-widest text-primary bg-primary/20 px-2 py-1 rounded-full">
        ⭐ Điểm nhấn
      </span>
    )}
    {gold && (
      <span className="absolute top-3 right-4 text-xs font-black uppercase tracking-widest px-2 py-1 rounded-full" style={{ color: '#eaca8b', background: 'rgba(234,202,139,0.15)' }}>
        🎁 Exclusive
      </span>
    )}
    <span className={`font-headline font-black text-base sm:text-xl md:w-40 shrink-0 relative`} style={{ color: gold ? '#eaca8b' : highlight ? '#396ecd' : '#8acdff' }}>{time}</span>
    <div className="relative">
      <h4 className={`font-bold mb-1.5 relative ${gold ? 'text-sm sm:text-base' : highlight ? 'text-sm sm:text-base text-white' : 'text-sm text-white/90'}`} style={gold ? { color: '#eaca8b' } : {}}>{title}</h4>
      <p className={`text-xs sm:text-sm leading-relaxed relative ${highlight ? 'text-blue-200' : 'text-slate-400'}`} style={gold ? { color: 'rgba(234,202,139,0.7)' } : {}}>{description}</p>
    </div>
  </motion.div>
);

// --- Video Gallery ---

const fmt = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

const VideoPlayer = ({ src, allRefs, index, aspectRatio = '16/9', width }: { src: string; allRefs: React.MutableRefObject<(HTMLVideoElement | null)[]>; index: number; aspectRatio?: string; width?: number }) => {
  const vidRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetHide = () => {
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => { if (playing) setShowControls(false); }, 2500);
  };

  const togglePlay = () => {
    const vid = vidRef.current;
    if (!vid) return;
    if (vid.paused) {
      allRefs.current.forEach((v, i) => { if (i !== index && v && !v.paused) v.pause(); });
      vid.play();
    } else {
      vid.pause();
    }
    resetHide();
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const vid = vidRef.current;
    if (!vid || !vid.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    vid.currentTime = ((e.clientX - rect.left) / rect.width) * vid.duration;
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const vid = vidRef.current;
    if (!vid) return;
    vid.muted = !vid.muted;
    setMuted(vid.muted);
  };

  const fullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    vidRef.current?.requestFullscreen?.();
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow-xl bg-black group"
      style={{ aspectRatio, ...(width ? { width } : {}) }}
      onMouseMove={resetHide}
      onMouseLeave={() => { if (playing) setShowControls(false); }}
      onClick={togglePlay}
    >
      <video
        ref={el => { vidRef.current = el; allRefs.current[index] = el; }}
        src={src}
        preload="metadata"
        className="w-full h-full object-cover"
        onPlay={() => setPlaying(true)}
        onPause={() => { setPlaying(false); setShowControls(true); }}
        onEnded={() => { setPlaying(false); setShowControls(true); setProgress(0); setCurrent(0); }}
        onTimeUpdate={() => {
          const vid = vidRef.current;
          if (!vid) return;
          setCurrent(vid.currentTime);
          setProgress(vid.duration ? (vid.currentTime / vid.duration) * 100 : 0);
        }}
        onLoadedMetadata={() => { if (vidRef.current) setDuration(vidRef.current.duration); }}
      />

      {/* Big play button when paused */}
      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div
            className="relative z-10 flex items-center justify-center rounded-full shadow-2xl transition-transform duration-200 group-hover:scale-110"
            style={{ width: 64, height: 64, background: 'linear-gradient(135deg,#1843e2,#396ecd)', boxShadow: '0 0 0 10px rgba(24,67,226,0.2)' }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="white" style={{ marginLeft: 4 }}>
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      {/* Control bar */}
      <div
        className="absolute bottom-0 left-0 right-0 px-4 pb-3 pt-8 transition-opacity duration-300"
        style={{
          opacity: showControls ? 1 : 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)',
          pointerEvents: showControls ? 'auto' : 'none',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Progress bar */}
        <div
          className="w-full h-1 rounded-full mb-3 cursor-pointer relative"
          style={{ background: 'rgba(255,255,255,0.25)' }}
          onClick={seek}
        >
          <div className="absolute left-0 top-0 h-full rounded-full" style={{ width: `${progress}%`, background: 'linear-gradient(to right,#1843e2,#8acdff)' }} />
          <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full shadow" style={{ left: `calc(${progress}% - 6px)`, background: '#fff' }} />
        </div>

        {/* Buttons row */}
        <div className="flex items-center gap-3">
          {/* Play/pause */}
          <button className="text-white hover:text-[#8acdff] transition-colors" onClick={togglePlay}>
            {playing ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>

          {/* Time */}
          <span className="text-white/80 text-xs font-mono tabular-nums">{fmt(current)} / {fmt(duration)}</span>

          <div className="flex-1" />

          {/* Mute */}
          <button className="text-white hover:text-[#8acdff] transition-colors" onClick={toggleMute}>
            {muted ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zm-15.07-9.4L2 4.03 5 7H3v10h4l5 5v-6.83l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06A8.99 8.99 0 0 0 18 20.94l2 2 1.27-1.27L4.93 2.6 3.43 2.6zM12 4L9.91 6.09 12 8.18V4z"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
            )}
          </button>

          {/* Fullscreen */}
          <button className="text-white hover:text-[#8acdff] transition-colors" onClick={fullscreen}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const VideoGallery = () => {
  const allRefs = useRef<(HTMLVideoElement | null)[]>([]);
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {['https://pub-8f89a714743846798b60962aa11734dd.r2.dev/video2.mp4', 'https://pub-8f89a714743846798b60962aa11734dd.r2.dev/video1.mp4', 'https://pub-8f89a714743846798b60962aa11734dd.r2.dev/video3.mp4'].map((src, i) => (
        <VideoPlayer key={src} src={src} allRefs={allRefs} index={i} />
      ))}
    </div>
  );
};

const R2_BASE = 'https://pub-8f89a714743846798b60962aa11734dd.r2.dev';
const PORTRAIT_VIDEOS = [
  `${R2_BASE}/testimonial-anh-ngoc.mov`,
  `${R2_BASE}/ms-julie-usa.mp4`,
  `${R2_BASE}/testimonial-co-binh-nga.mov`,
  `${R2_BASE}/testimonial-kh-bqt.mov`,
];

const PortraitVideoGallery = () => {
  const allRefs = useRef<(HTMLVideoElement | null)[]>([]);
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {PORTRAIT_VIDEOS.map((src, i) => (
        <div key={src} className="w-full">
          <VideoPlayer src={src} allRefs={allRefs} index={i} aspectRatio="9/16" />
        </div>
      ))}
    </div>
  );
};

// --- Main App ---

declare global { interface Window { fbq?: (...args: unknown[]) => void } }

const ZALO_URL = import.meta.env.VITE_ZALO_URL || '#';

const SuccessPopup = () => {
  const [countdown, setCountdown] = useState(5);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (clicked) return;
    if (countdown === 0) {
      window.location.href = ZALO_URL;
      return;
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, clicked]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="bg-white rounded-3xl p-8 md:p-12 max-w-md w-full text-center shadow-2xl"
      >
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-3">Đăng ký thành công!</h2>
        <p className="text-slate-500 mb-8 leading-relaxed">
          Bạn đã đăng ký tham gia <strong>THE PIONEER 02</strong>.<br />
          Tham gia nhóm Zalo để nhận tài liệu và cập nhật mới nhất.
        </p>
        <a
          href={ZALO_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setClicked(true)}
          className="flex items-center justify-center gap-2 w-full bg-[#0068FF] hover:bg-[#0055CC] active:scale-95 text-white font-bold py-4 rounded-full text-base transition-all shadow-lg shadow-blue-200 mb-5"
        >
          <span>Tham gia nhóm Zalo nhận tài liệu</span>
          <ChevronRight className="w-4 h-4" />
        </a>
        {!clicked ? (
          <>
            <p className="text-slate-400 text-sm">
              Tự động chuyển hướng sau{' '}
              <span className="font-bold text-primary tabular-nums">{countdown}s</span>
            </p>
            <div className="mt-3 h-1 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 5, ease: 'linear' }}
              />
            </div>
          </>
        ) : (
          <p className="text-slate-400 text-sm">Hẹn gặp bạn trong nhóm Zalo! 👋</p>
        )}
      </motion.div>
    </motion.div>
  );
};

type FieldErrors = Partial<Record<'name' | 'phone' | 'email' | 'clinic' | 'location', string>>;

const validateForm = (data: { name: string; phone: string; email: string; clinic: string; location: string }): FieldErrors => {
  const errors: FieldErrors = {};
  if (!data.name.trim())
    errors.name = 'Vui lòng điền họ và tên';
  if (!/^(0|\+84)[0-9]{8,9}$/.test(data.phone.replace(/\s/g, '')))
    errors.phone = 'Số điện thoại chưa hợp lệ';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = 'Email chưa đúng định dạng';
  if (!data.clinic.trim())
    errors.clinic = 'Vui lòng điền tên phòng khám';
  if (!data.location.trim())
    errors.location = 'Vui lòng điền tỉnh / thành phố';
  return errors;
};

const FieldTooltip = ({ message }: { message: string }) => (
  <motion.p
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.15 }}
    className="text-xs text-red-500 text-right mt-1 pr-3"
  >
    .{message}
  </motion.p>
);

export default function App() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [zirconiaLightbox, setZirconiaLightbox] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    clinic: '',
    location: '',
    question: ''
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // --- Scroll depth tracking ---
  useEffect(() => {
    const milestones = [25, 50, 75, 90];
    const fired = new Set<number>();
    const onScroll = () => {
      const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      milestones.forEach(m => {
        if (!fired.has(m) && scrolled >= m) {
          fired.add(m);
          window.fbq?.('trackCustom', `ViewContentScroll${m}`);
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // --- Time on site tracking ---
  useEffect(() => {
    const timers = [
      setTimeout(() => window.fbq?.('trackCustom', 'TimeOnSite30s'), 30_000),
      setTimeout(() => window.fbq?.('trackCustom', 'TimeOnSite60s'), 60_000),
      setTimeout(() => window.fbq?.('trackCustom', 'TimeOnSite120s'), 120_000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const clearFieldError = (field: keyof FieldErrors) => {
    if (fieldErrors[field]) setFieldErrors(prev => { const n = {...prev}; delete n[field]; return n; });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFormStatus('loading');
    setFieldErrors({});
    setSubmitError('');

    const eventId = `lead-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const getCookie = (name: string) => document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`))?.[1] ?? '';

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          clinic_name: formData.clinic.trim(),
          city: formData.location.trim(),
          question: formData.question.trim(),
          eventId,
          fbc: getCookie('_fbc'),
          fbp: getCookie('_fbp'),
          userAgent: navigator.userAgent,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || 'Lỗi hệ thống');
      }
      // Browser-side pixel event — dedup với server event qua eventId
      window.fbq?.('trackCustom', 'FormSubmit', {}, { eventID: eventId });
      setFormStatus('success');
      setShowSuccess(true);
    } catch (err: unknown) {
      setFormStatus('error');
      setSubmitError(err instanceof Error ? err.message : 'Có lỗi xảy ra, vui lòng thử lại.');
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <AnimatePresence>{showSuccess && <SuccessPopup />}</AnimatePresence>
      <Navbar />

      {/* SECTION 1: HERO */}
      <section id="hero" className="relative pt-24 pb-12 md:pb-16 bg-background-dark overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full relative z-10 grid grid-cols-12 gap-y-8 md:gap-8 lg:gap-12 items-start">
          {/* LEFT COLUMN */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="col-span-12 lg:col-span-7"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-accent-sky to-primary text-white font-black text-xs md:text-sm tracking-wide uppercase mb-6 shadow-[0_0_30px_rgba(56,189,248,0.3)] border border-white/20 max-w-full">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
              </span>
              <span className="leading-snug">THE PIONEER 02 | Cập nhật xu hướng mới của phục hình thẩm mỹ</span>
            </div>

            <h1 className="text-white font-headline text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-2">
              Can Thiệp Tối Thiểu
            </h1>
            <p className="font-headline text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 bling-text italic">
              Hiệu Quả Tối Đa
            </p>

            <p className="text-slate-300 text-base md:text-lg mb-5 italic">
              Dành cho: Bác sĩ Răng Hàm Mặt · Chủ phòng khám · Người muốn nâng cấp giải pháp phục hình thẩm mỹ
            </p>

            {/* Event info row */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-6 text-base md:text-lg text-slate-200">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                Thứ Sáu, 10/04/2026
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-400" />
                20:00–22:00
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-accent-sky" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                Zoom Online
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-accent-beige" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Miễn phí
              </span>
            </div>

            <Countdown />

            <a
              href="#registration"
              className="bg-primary hover:bg-primary-light text-white px-8 py-3.5 md:py-4 rounded-full font-bold text-base md:text-lg transition-all shadow-lg shadow-primary/20 active:scale-95 inline-flex items-center gap-2 mb-6"
            >
              Đăng ký tham gia miễn phí <ArrowRight className="w-5 h-5" />
            </a>

          </motion.div>

          {/* RIGHT COLUMN — Speakers (desktop only) + QR (always) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="col-span-12 lg:col-span-5"
          >
            {/* 2x2 speaker grid — desktop only */}
            <div className="hidden lg:block">
              <p className="text-sm font-black tracking-[0.2em] text-slate-300 uppercase mb-5 text-center lg:text-right">Chuyên gia đồng hành</p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { name: 'Chuyên gia\nVũ Đề', role: 'Nhà sáng chế công nghệ SmartVeneer', image: '/images/speaker-vu-de-thumb.jpg', color: 'border-primary' },
                  { name: 'TTND.TS.BS\nLê Hưng', role: 'Nhà phát triển công nghệ SmartVeneer', image: '/images/speaker-le-hung-thumb.jpg', color: 'border-accent-beige' },
                  { name: 'Bà Trần\nKhánh Chi', role: 'Giám đốc Vận hành Dentisan', image: '/images/speaker-khanh-chi-thumb.jpg', color: 'border-emerald-400' },
                  { name: 'BS. Vương\nTiến Thịnh', role: 'Bác sĩ thực hành lâm sàng tại Nha khoa Dentisan', image: '/images/speaker-vuong-tin-thinh-thumb.jpg', color: 'border-accent-sky' },
                ].map((speaker) => (
                  <div key={speaker.name} className="flex flex-col items-center text-center gap-2.5 glass-card rounded-2xl px-3 py-5">
                    <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-[3px] ${speaker.color} shadow-lg`}>
                      <img src={speaker.image} alt={speaker.name} className="w-full h-full object-cover object-top" referrerPolicy="no-referrer" loading="eager" decoding="sync" style={{ imageRendering: '-webkit-optimize-contrast' }} />
                    </div>
                    <div>
                      <p className="text-white font-bold text-base leading-tight whitespace-pre-line">{speaker.name}</p>
                      <p className="text-slate-300 text-sm mt-1">{speaker.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* QR Code section — always visible */}
            <div className="glass-card rounded-2xl px-5 py-4 flex items-center gap-4">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-xl p-1.5 shrink-0">
                <img src="/images/qr-register.png" alt="QR Đăng ký" className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
              <div>
                <p className="text-white font-bold text-base mb-1">Quét để đăng ký</p>
                <p className="text-emerald-400 text-sm font-semibold mb-0.5">Hoàn toàn miễn phí</p>
                <p className="text-slate-300 text-sm">Link Zoom gửi qua email</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION: THỊ TRƯỜNG VIỆT NAM */}
      <section id="market" className="py-10 md:py-24 bg-background-dark relative overflow-hidden -mt-px">
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/8 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-accent-sky/5 blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary/10 text-accent-sky font-black text-xs tracking-wide uppercase mb-6 border border-primary/30">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-sky opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-sky"></span>
              </span>
              <span>Thị trường nha khoa Việt Nam</span>
            </div>
            <h2 className="font-headline text-2xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight max-w-4xl mx-auto mb-3 md:mb-5">
              "Đại dương xanh" tỷ đô —{' '}
              <span className="bling-text">Mỏ vàng chưa được khai phá hết</span>
            </h2>
            <p className="text-slate-400 text-sm md:text-lg leading-relaxed max-w-3xl mx-auto">
              Thị trường nha khoa thẩm mỹ Việt Nam đang ở giai đoạn "vàng" với nhu cầu tăng trưởng mạnh mẽ nhưng phần lớn các phòng khám chưa có giải pháp đủ tốt để nắm bắt được cơ hội này
            </p>
          </motion.div>

          {/* 3 stat cards — glass-card style */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-8">
            {[
              { value: '90%', label: 'Người Việt có vấn đề về răng miệng', sub: '', accent: 'from-accent-beige to-amber-300' },
              { value: '1:10.000', label: 'Tỷ lệ BS RHM / Người dân', sub: 'Thiếu hụt trầm trọng nguồn nhân lực nha khoa chất lượng', accent: 'from-primary-light to-accent-sky' },
              { value: '1,27 triệu', label: 'Khách hàng tiềm năng 45–65 tuổi', sub: 'Gặp nhiều vấn đề về răng miệng, sẵn sàng chi trả nhưng chưa được khai thác', accent: 'from-accent-sky to-primary-light' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="glass-card rounded-2xl px-5 py-5 md:px-8 md:py-10 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-primary/10 blur-3xl pointer-events-none transition-all duration-500 group-hover:bg-primary/20" />
                <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-accent-sky/5 blur-2xl pointer-events-none" />
                <p className={`relative z-10 text-3xl md:text-5xl lg:text-6xl font-black mb-2 md:mb-4 leading-none bg-gradient-to-r ${item.accent} bg-clip-text text-transparent`}>{item.value}</p>
                <p className="relative z-10 text-white text-base md:text-xl font-bold mb-1 md:mb-2">{item.label}</p>
                {item.sub && <p className="relative z-10 text-slate-400 text-xs md:text-base leading-relaxed">{item.sub}</p>}
              </motion.div>
            ))}
          </div>

          <p className="text-slate-500 text-xs text-right mb-10 italic">Nguồn: Viện Răng Hàm Mặt Trung ương</p>

          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <button
              className="bg-primary hover:bg-primary-light text-white px-10 py-4 rounded-full font-bold text-sm md:text-base transition-all shadow-lg shadow-primary/25 active:scale-95 cursor-pointer"
              onClick={() => document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Tìm hiểu ngay giải pháp →
            </button>
          </motion.div>
        </div>
      </section>

      {/* SECTION: EXPERT STORY */}
      <section id="expert-story" className="py-10 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-12 gap-y-8 md:gap-x-16 items-center">
            <div className="col-span-12 lg:col-span-6 flex items-center">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl w-full aspect-[16/9] md:aspect-[4/5]">
                <img src="/images/expert-vu-de-story.jpg" alt="Chuyên gia Vũ Đề" className="w-full h-full object-cover object-center" />
              </div>
            </div>
            <div className="col-span-12 lg:col-span-6">
              <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
                SmartVeneer — Công nghệ độc quyền thay đổi cuộc chơi phục hình thẩm mỹ
              </h2>
              <p className="text-slate-600 text-base leading-relaxed mb-6">
                Gần <strong className="text-slate-900">30 năm</strong> kinh nghiệm phục hình răng, tiếp thu thực tiễn từ gần <strong className="text-slate-900">50 quốc gia</strong> và thấu hiểu sâu sắc nhóm khách hàng trung niên, chuyên gia Vũ Đề đã tìm ra một công nghệ giúp phòng khám <strong className="text-slate-900">khai thác đúng tệp khách hàng tiềm năng</strong>, đồng thời mở ra hướng đi mới trong phục hình thẩm mỹ bảo tồn, ít xâm lấn.
              </p>
              <div className="bg-primary/5 border-l-4 border-primary px-6 py-4 rounded-r-2xl mb-8">
                <p className="text-slate-700 text-base leading-relaxed">
                  Miếng dán bảo tồn SmartVeneer giúp <strong className="text-slate-900">cải thiện hình thể, màu sắc răng</strong>, các bệnh lý về vấn đề răng miệng, khắc phục được nhiều điểm hạn chế về <strong className="text-slate-900">khả năng cản màu, tính bền vững và độ an toàn</strong> so với phương pháp can thiệp thẩm mỹ khác trên thị trường.
                </p>
              </div>
              <button
                className="bg-primary hover:bg-primary-light text-white px-8 py-3 md:py-4 rounded-full font-bold text-sm md:text-base transition-all shadow-lg shadow-primary/20 active:scale-95"
                onClick={() => document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Đăng ký tham gia để tìm hiểu công nghệ này →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: SPEAKERS */}
      <section className="py-10 md:py-20 bg-slate-50" id="speakers">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
              Chuyên gia đồng hành trong buổi tối 10/04
            </h2>
            <p className="text-slate-500 text-base md:text-lg">Những người trực tiếp phát triển và ứng dụng giải pháp SmartVeneer trong thực tế</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <SpeakerCard
              name="Nhà sáng lập Hệ sinh thái DETEC Vũ Đề"
              roleBullets={["Chủ tịch Hội đồng quản trị DETEC Group", "Nhà sáng chế công nghệ SmartVeneer", "Chuyên gia Công nghệ & Kỹ thuật Lab"]}
              description=""
              image="/images/speaker-vu-de.jpg"
            />
            <SpeakerCard
              name="Thầy thuốc nhân dân, Tiến sĩ, Bác sĩ Lê Hưng"
              roleBullets={["Nhà phát triển công nghệ SmartVeneer", "Chuyên gia Cao cấp Phục hình Răng bảo tồn"]}
              description={["Chủ tịch Hội đồng chuyên môn DETEC", "Giám đốc chuyên môn Nha khoa Dr. Lê Hưng & Cộng sự", "Nguyên Giám đốc Bệnh viện Đa khoa Đống Đa"]}
              image="/images/speaker-le-hung.jpg"
              objectPositionStyle="35% 15%"
            />
            <SpeakerCard
              name="Bà Trần Khánh Chi"
              role="Giám đốc vận hành nha khoa Dentisan"
              description="Người trực tiếp đưa SmartVeneer vào vận hành tại phòng khám, chia sẻ quy trình vận hành, chi phí chuyển đổi khách hàng được tối ưu nhờ công nghệ mới."
              image="/images/speaker-khanh-chi.jpg"
            />
            <SpeakerCard
              name="Bác sĩ Vương Tiến Thịnh"
              role="Bác sĩ thực hành lâm sàng tại nha khoa Dentisan"
              description="Bác sĩ đang triển khai SmartVeneer tại phòng khám, chia sẻ những kinh nghiệm thực tế, giúp rút ngắn thời gian thử nghiệm và nhanh chóng chuẩn hóa quy trình."
              image="/images/speaker-vuong-tin-thinh.jpg"
            />
          </div>
        </div>
      </section>

      {/* SECTION 5: AGENDA */}
      <section className="py-10 md:py-20 bg-background-dark text-white" id="agenda">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="text-center mb-6 md:mb-20">
            <h2 className="font-headline text-xl sm:text-3xl md:text-4xl font-extrabold mb-3 md:mb-4 bg-gradient-to-r from-white via-[#eaca8b] to-white bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(234,202,139,0.5)]">
              Lộ trình 2 tiếng thay đổi tư duy và tương lai phát triển của phòng khám
            </h2>
            <p className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm text-white/80 text-sm md:text-base font-medium px-4 py-2 md:px-5 md:py-2.5 rounded-full mt-2">
              📧 Zoom link gửi qua email trước 18:00 ngày 10/04
            </p>
          </div>
          <div className="space-y-2 md:space-y-4">
            <AgendaItem index={0} time="20:00–20:15" title="Đón tiếp & Kết nối" description="" />
            <AgendaItem index={1} time="20:15–20:40" title="Bức tranh thị trường và nỗi đau phòng khám" description="" />
            <AgendaItem index={2} time="20:40–21:10" title="Công nghệ giải phóng bàn tay bác sĩ" description="" highlight />
            <AgendaItem index={3} time="21:10–21:25" title="Bài toán vận hành công nghệ mới tại phòng khám" description="" highlight />
            <AgendaItem index={4} time="21:25–21:40" title="Chuyện nghề thực chiến từ bác sĩ đang triển khai" description="" />
            <AgendaItem index={5} time="21:40–22:00" title="Giải pháp đồng hành toàn diện - Hỏi đáp - Quà tặng đặc biệt" description="" gold />
          </div>
          <div className="mt-8 md:mt-16 flex justify-center">
            <button
              className="bg-primary hover:bg-primary-light text-white px-8 py-3 md:py-4 rounded-full font-bold text-sm md:text-base transition-all shadow-lg shadow-primary/20 active:scale-95"
              onClick={() => document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Đăng ký giữ chỗ ngay →
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 6: DETEC ECOSYSTEM */}
      <section className="py-16 md:py-24 bg-white overflow-hidden relative" id="ecosystem">
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">

          <motion.div
            className="mb-12 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-black text-xs uppercase tracking-wide mb-6 border border-primary/20">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Hệ sinh thái DETEC
            </div>
            <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight max-w-3xl mb-3">
              Giải pháp đồng hành toàn diện từ DETEC
            </h2>
            <p className="text-slate-500 text-base md:text-lg italic">
              "Bạn không chỉ có công nghệ, mà có cả hệ sinh thái giúp bạn triển khai thành công"
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {[
              {
                label: 'Hỗ trợ chuyên môn',
                icon: (
                  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 2a8 8 0 100 16A8 8 0 0010 2z" stroke="currentColor" strokeWidth="1.8"/>
                  </svg>
                ),
                title: 'Được hướng dẫn kỹ thuật online/offline và qua các case lâm sàng thực tế',
                sub: 'Không phải tự thử sai',
              },
              {
                label: 'Sản phẩm sẵn sàng ứng dụng',
                icon: (
                  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                    <rect x="3" y="3" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.8"/>
                    <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
                title: 'Cung cấp sản phẩm đã xử lý theo công nghệ SmartVeneer',
                sub: 'Bác sĩ tập trung điều trị, không lo vật liệu',
              },
              {
                label: 'Hỗ trợ marketing và chốt ca',
                icon: (
                  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                    <path d="M3 10h14M10 3l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
                title: 'Đồng hành truyền thông và tài liệu marketing, giúp xác định đúng khách hàng và tăng tỉ lệ chuyển đổi',
                sub: 'Không chỉ làm được, mà còn chốt được',
              },
              {
                label: 'Đồng hành dài hạn',
                icon: (
                  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                    <path d="M10 2v16M2 10h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.8"/>
                  </svg>
                ),
                title: 'Chính sách bảo hành rõ ràng cùng cộng đồng chuyên môn luôn đồng hành',
                sub: 'Hỗ trợ bác sĩ phát triển bền vững',
              },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-[24px] bg-slate-50 border border-slate-200 px-7 py-7 relative overflow-hidden group hover:border-primary/30 hover:shadow-lg transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-5">
                  {item.icon}
                </div>
                <div className="inline-flex items-center bg-primary/10 text-primary text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full mb-3 border border-primary/15">{item.label}</div>
                <p className="text-slate-900 font-semibold text-base md:text-lg leading-snug mb-3">{item.title}</p>
                <p className="text-primary text-sm md:text-base font-bold flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7l4 4 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {item.sub}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <button
              className="bg-primary hover:bg-primary-light text-white px-10 py-4 rounded-full font-bold text-base md:text-lg transition-all shadow-lg shadow-primary/20 active:scale-95 cursor-pointer"
              onClick={() => document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Tìm hiểu ngay cách triển khai →
            </button>
          </motion.div>

        </div>
      </section>

      {/* SECTION 6: SOCIAL PROOF — Các con số ấn tượng */}
      <section className="py-10 md:py-20 bg-slate-950 relative overflow-hidden">
        {/* Glow orbs */}
        <div className="absolute top-0 left-1/3 w-80 h-80 bg-primary/30 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#8acdff]/20 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="font-headline text-2xl sm:text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight max-w-3xl mx-auto">
              Con số ấn tượng và bảo chứng từ bác sĩ, Chủ phòng khám
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {[
              { value: '1.000+', label: 'Ca lâm sàng', accent: 'from-accent-beige to-amber-300' },
              { value: '100+', label: 'Phòng khám đối tác', accent: 'from-primary-light to-accent-sky' },
              { value: '', label: 'Phát triển bởi hệ sinh thái nha khoa DETEC gần <strong>30 năm</strong> kinh nghiệm', accent: 'from-accent-sky to-primary-light' },
              { value: '', label: 'Học hỏi và tiếp thu kỹ thuật gần <strong>50 quốc gia</strong>', accent: 'from-emerald-400 to-accent-sky' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.4 }}
                className="glass-card rounded-2xl p-6 text-center group hover:border-white/20 transition-all duration-300"
              >
                {stat.value && <span className={`block text-4xl md:text-5xl font-black mb-3 leading-none bg-gradient-to-r ${stat.accent} bg-clip-text text-transparent`}>{stat.value}</span>}
                <span className={`${stat.value ? 'text-sm md:text-base text-slate-300' : 'text-sm md:text-base text-slate-200 font-semibold'} leading-snug [&_strong]:text-white [&_strong]:font-black [&_strong]:text-lg [&_strong]:md:text-xl`} dangerouslySetInnerHTML={{ __html: stat.label }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: VIDEO BÁC SĨ VÀ CHỦ PK */}
      <section className="py-10 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
              Bác sĩ và Chủ phòng khám chia sẻ
            </h2>
          </div>
          <VideoGallery />
        </div>
      </section>

      {/* SECTION 8: KHÁCH HÀNG ĐIỂN HÌNH */}
      <section className="py-14 md:py-20 bg-slate-50" id="testimonials">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900">
              Khách hàng nói gì sau điều trị?
            </h2>
          </div>

          <div className="max-w-[280px] mx-auto mb-10">
            <VideoPlayer src={PORTRAIT_VIDEOS[3]} allRefs={{ current: [] } as React.MutableRefObject<(HTMLVideoElement | null)[]>} index={0} aspectRatio="9/16" />
          </div>

          <div className="text-center">
            <button
              className="bg-primary hover:bg-primary-light text-white px-8 py-3 md:py-4 rounded-full font-bold text-sm md:text-base transition-all shadow-lg shadow-primary/20 active:scale-95 cursor-pointer"
              onClick={() => document.getElementById('cases')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Xem thêm hàng nghìn ca phục hình thành công →
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 9: FORM ĐĂNG KÝ */}
      <section className="py-10 md:py-20 bg-white" id="registration">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-12 gap-y-8 md:gap-x-8 lg:gap-x-16 items-center">
          <div className="col-span-12 lg:col-span-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-bold px-4 py-2 rounded-full mb-6">
              🎓 Webinar chuyên môn · Miễn phí 100%
            </div>
            <h2 className="font-headline text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
              Giữ chỗ ngay,<br/>
              <span className="text-primary">trước khi hết slot</span>
            </h2>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-6 md:mb-10">
              Chỉ 1 buổi tối, bạn sẽ hiểu rõ SmartVeneer từ lâm sàng đến kinh doanh, từ những chuyên gia đang triển khai thực tế.
            </p>
            <div className="space-y-4 mb-10">
              {[
                '✅ Zoom link gửi qua email trước 18:00 ngày 10/04',
                '✅ Tài liệu chuyên môn độc quyền qua Zalo',
                '✅ 50 phần quà đặc biệt cho người đăng ký sớm',
              ].map((item, i) => (
                <p key={i} className="text-slate-700 font-medium text-base">{item}</p>
              ))}
            </div>
            <div className="flex justify-around gap-2 p-4 md:p-8 bg-primary/5 rounded-3xl border border-primary/10">
              {[
                { label: 'Ngày', value: '10/04' },
                { label: 'Giờ bắt đầu', value: '20:00' },
                { label: 'Nền tảng', value: 'Zoom' }
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <span className="block text-2xl font-black text-primary">{stat.value}</span>
                  <span className="text-xs uppercase font-bold text-slate-500 mt-1 block">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-12 lg:col-span-6">
            <div className="bg-white p-5 sm:p-8 md:p-12 rounded-[24px] md:rounded-[40px] shadow-2xl shadow-primary/10 border border-slate-100">
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-5 md:mb-8">Đăng ký tham gia webinar</h3>
              <form className="space-y-3 md:space-y-5" onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <input
                      className={`w-full bg-slate-50 border rounded-full px-4 py-3 text-sm md:text-base text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${fieldErrors.name ? 'border-red-300 bg-red-50/30' : 'border-slate-100'}`}
                      placeholder="Họ và tên *"
                      type="text"
                      value={formData.name}
                      onChange={e => { setFormData({...formData, name: e.target.value}); clearFieldError('name'); }}
                    />
                    <AnimatePresence>{fieldErrors.name && <FieldTooltip message={fieldErrors.name} />}</AnimatePresence>
                  </div>
                  <div>
                    <input
                      className={`w-full bg-slate-50 border rounded-full px-4 py-3 text-sm md:text-base text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${fieldErrors.phone ? 'border-red-300 bg-red-50/30' : 'border-slate-100'}`}
                      placeholder="Số điện thoại *"
                      type="tel"
                      value={formData.phone}
                      onChange={e => { setFormData({...formData, phone: e.target.value}); clearFieldError('phone'); }}
                    />
                    <AnimatePresence>{fieldErrors.phone && <FieldTooltip message={fieldErrors.phone} />}</AnimatePresence>
                  </div>
                </div>
                <div>
                  <input
                    className={`w-full bg-slate-50 border rounded-full px-4 py-3 text-sm md:text-base text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${fieldErrors.email ? 'border-red-300 bg-red-50/30' : 'border-slate-100'}`}
                    placeholder="Email *"
                    type="email"
                    value={formData.email}
                    onChange={e => { setFormData({...formData, email: e.target.value}); clearFieldError('email'); }}
                  />
                  <AnimatePresence>{fieldErrors.email && <FieldTooltip message={fieldErrors.email} />}</AnimatePresence>
                </div>
                <div>
                  <input
                    className={`w-full bg-slate-50 border rounded-full px-4 py-3 text-sm md:text-base text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${fieldErrors.clinic ? 'border-red-300 bg-red-50/30' : 'border-slate-100'}`}
                    placeholder="Tên phòng khám / cơ sở *"
                    type="text"
                    value={formData.clinic}
                    onChange={e => { setFormData({...formData, clinic: e.target.value}); clearFieldError('clinic'); }}
                  />
                  <AnimatePresence>{fieldErrors.clinic && <FieldTooltip message={fieldErrors.clinic} />}</AnimatePresence>
                </div>
                <div>
                  <input
                    className={`w-full bg-slate-50 border rounded-full px-4 py-3 text-sm md:text-base text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${fieldErrors.location ? 'border-red-300 bg-red-50/30' : 'border-slate-100'}`}
                    placeholder="Tỉnh / Thành phố *"
                    type="text"
                    value={formData.location}
                    onChange={e => { setFormData({...formData, location: e.target.value}); clearFieldError('location'); }}
                  />
                  <AnimatePresence>{fieldErrors.location && <FieldTooltip message={fieldErrors.location} />}</AnimatePresence>
                </div>
                <div>
                  <textarea
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm md:text-base text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                    placeholder="Câu hỏi cho diễn giả (không bắt buộc)"
                    rows={3}
                    value={formData.question}
                    onChange={e => setFormData({...formData, question: e.target.value})}
                  />
                </div>
                {submitError && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl px-4 py-3">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}
                <button
                  className="w-full bg-primary hover:bg-primary-light text-white font-bold py-3 md:py-4 rounded-full text-sm md:text-base transition-all shadow-lg shadow-primary/20 mt-2 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  type="submit"
                  disabled={formStatus === 'loading'}
                >
                  {formStatus === 'loading' ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Đang xử lý...
                    </>
                  ) : (
                    'Đăng ký tham gia webinar'
                  )}
                </button>
                <p className="text-center text-sm text-slate-500 font-medium">
                  Thông tin của bạn được bảo mật theo tiêu chuẩn HIPAA & GDPR.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 10: KHO HÌNH ẢNH */}
      <section className="py-10 md:py-20 bg-slate-50" id="cases">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
              Hàng nghìn ca phục hình đã được thực hiện thành công
            </h2>
            <div className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-base mt-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Kết quả đã được chứng minh từ thực tế
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {caseImages.map((item, i) => (
              <div
                key={item.label}
                className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group relative"
                onClick={() => setLightboxIndex(i)}
              >
                <img src={item.src} alt={item.label} className="w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-slate-800 text-sm font-bold px-4 py-2 rounded-full">🔍 Xem lớn</span>
                </div>
              </div>
            ))}
            {lightboxIndex !== null && (
              <Lightbox
                index={lightboxIndex}
                onClose={() => setLightboxIndex(null)}
                onPrev={() => setLightboxIndex((lightboxIndex - 1 + caseImages.length) % caseImages.length)}
                onNext={() => setLightboxIndex((lightboxIndex + 1) % caseImages.length)}
              />
            )}
          </div>

          {/* Portrait videos */}
          <div className="mt-10 md:mt-16 max-w-5xl mx-auto">
            {(() => {
              const vRefs = { current: [] as (HTMLVideoElement | null)[] };
              return (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {PORTRAIT_VIDEOS.slice(0, 3).map((src, i) => (
                    <div key={src}>
                      <VideoPlayer src={src} allRefs={vRefs as React.MutableRefObject<(HTMLVideoElement | null)[]>} index={i} aspectRatio="9/16" />
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* SECTION 12: ĐỐI TÁC PHÒNG KHÁM */}
      <section className="py-16 md:py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8">

          <motion.div
            className="text-center mb-10 md:mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-3">
              Nhiều phòng khám đã bắt đầu<br className="hidden md:block" /> ứng dụng trong thực tế
            </h2>
          </motion.div>

          {/* Clinic logos - 2-row marquee */}
          <style>{`
            @keyframes marqueeLeft { from { transform: translateX(0); } to { transform: translateX(-50%); } }
            @keyframes marqueeRight { from { transform: translateX(-50%); } to { transform: translateX(0); } }
          `}</style>
          <motion.div
            className="w-full overflow-hidden mb-6"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {(() => {
              const logos = [
                { name: 'NCS+', logo: '/images/logo-ncs.png' },
                { name: 'HTC Dental', logo: '/images/logo-htc-dental.png' },
                { name: 'DR Lê Hưng & Cộng Sự', logo: '/images/logo-dr-le-hung.png' },
                { name: 'Nha Khoa Minh Châu', logo: '/images/logo-minh-chau.png' },
                { name: 'AMAX Triệu Nụ Cười', logo: '/images/logo-amax.png' },
                { name: 'Nha Khoa We Smile', logo: '/images/logo-we-smile.png' },
                { name: 'Hai Danh Dental Beauty', logo: '/images/logo-hai-danh.png' },
                { name: 'Nha Khoa Tinh An', logo: '/images/logo-tinh-an.png' },
                { name: 'Nha Khoa Nghi Sơn', logo: '/images/logo-nghi-son.png' },
                { name: 'TL Dental', logo: '/images/logo-tl-dental.png' },
                { name: 'Dentisan Lab', logo: '/images/logo-dentisan.png' },
                { name: 'Toàn Tiến Dental', logo: '/images/logo-toan-tien.png' },
                { name: 'Ai Đây', logo: '/images/logo-ai-day.png' },
              ];
              const row1 = logos;
              const row2 = [...logos].reverse();
              return [
                { items: row1, dir: 'marqueeLeft', dur: '28s' },
                { items: row2, dir: 'marqueeRight', dur: '22s' },
              ].map((row, ri) => (
                <div key={ri} className="overflow-hidden mb-3">
                  <div
                    className="flex gap-4 items-center w-max"
                    style={{ animation: `${row.dir} ${row.dur} linear infinite` }}
                  >
                    {[...row.items, ...row.items].map((item, i) => (
                      <div
                        key={`${ri}-${i}`}
                        className="w-24 h-24 rounded-full border-2 border-slate-200 bg-white flex items-center justify-center shrink-0 overflow-hidden p-3 shadow-sm hover:border-primary/40 hover:shadow-md transition-all"
                      >
                        <img src={item.logo} alt={item.name} className="w-full h-full object-contain rounded-full" />
                      </div>
                    ))}
                  </div>
                </div>
              ));
            })()}
          </motion.div>

          <p className="text-center text-primary font-semibold text-base md:text-lg">và rất nhiều phòng khám trên toàn quốc...</p>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background-dark py-10 px-4 md:px-8 border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          <div>
            <div className="text-base font-bold text-white mb-3">SMARTVENEER</div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Công nghệ dán răng bảo tồn bằng vi chốt cơ học
            </p>
          </div>
          <div>
            <h5 className="text-white font-bold mb-3 uppercase text-xs tracking-widest">Liên hệ</h5>
            <p className="text-slate-400 text-sm leading-relaxed">
              605 đường Quang Trung, P. Kiến Hưng, Hà Nội.<br/>
              Email: smartveneer@detec.vn<br/>
              Facebook: fb.com/DanSinhHocSmartVeneer
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-0 pt-8 mt-10 border-t border-white/10 text-center">
          <p className="text-sm text-slate-500">© 2026 SmartVeneer. All rights reserved. Professional use only.</p>
        </div>
      </footer>
    </div>
  );
}
