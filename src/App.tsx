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
    { label: 'Diễn giả', href: '#speakers' },
    { label: 'Nội dung', href: '#agenda' },
    { label: 'Công nghệ', href: '#technology' }
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
    const targetDate = new Date('2026-04-03T20:00:00').getTime();

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

const SpeakerCard = ({ name, role, description, image, quote, imagePosition, objectPositionStyle }: { name: string, role: string, description: string, image: string, quote?: string, imagePosition?: string, objectPositionStyle?: string }) => (
  <motion.div
    whileHover={{ y: -6 }}
    className="bg-white p-5 sm:p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)]"
  >
    <div className="aspect-square rounded-xl overflow-hidden mb-6 shrink-0">
      <img src={image} alt={name} className={`w-full h-full object-cover ${imagePosition || 'object-top'}`} style={objectPositionStyle ? { objectPosition: objectPositionStyle } : undefined} referrerPolicy="no-referrer" />
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-1">{name}</h3>
    <p className="text-sm text-primary font-semibold mb-4">{role}</p>
    <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-grow">{description}</p>
    {quote && (
      <blockquote className="border-l-2 border-primary/40 pl-4 mt-auto">
        <p className="text-slate-600 text-sm leading-relaxed italic">{quote}</p>
      </blockquote>
    )}
  </motion.div>
);

const caseImages = [
  { src: '/images/profile-sv-2026.jpg', label: 'Profile SmartVeneer 2026' },
  { src: '/images/profile-sv-2026-1.jpg', label: 'Profile SmartVeneer 2026 (1)' },
  { src: '/images/profile-sv-2026-2.jpg', label: 'Profile SmartVeneer 2026 (2)' },
  { src: '/images/profile-sv-2026-3.jpg', label: 'Profile SmartVeneer 2026 (3)' },
  { src: '/images/profile-sv-2026-4.jpg', label: 'Profile SmartVeneer 2026 (4)' },
  { src: '/images/profile-sv-2026-5.jpg', label: 'Profile SmartVeneer 2026 (5)' },
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
    className={`relative flex flex-col md:flex-row md:items-center gap-6 p-6 rounded-2xl transition-all duration-300 cursor-default overflow-hidden ${
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
      <span className="absolute top-3 right-4 text-[10px] font-black uppercase tracking-widest text-primary bg-primary/20 px-2 py-1 rounded-full">
        ⭐ Điểm nhấn
      </span>
    )}
    {gold && (
      <span className="absolute top-3 right-4 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full" style={{ color: '#eaca8b', background: 'rgba(234,202,139,0.15)' }}>
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
      {['https://pub-8f89a714743846798b60962aa11734dd.r2.dev/video1.mp4', 'https://pub-8f89a714743846798b60962aa11734dd.r2.dev/video2.mp4', 'https://pub-8f89a714743846798b60962aa11734dd.r2.dev/video3.mp4'].map((src, i) => (
        <VideoPlayer key={src} src={src} allRefs={allRefs} index={i} />
      ))}
    </div>
  );
};

const CDN = 'https://pub-8f89a714743846798b60962aa11734dd.r2.dev';
const PORTRAIT_VIDEOS = [
  `${CDN}/video-trang.mp4`,
  `${CDN}/video-lizzie.mp4`,
  `${CDN}/video-julie.mp4`,
];

const PortraitVideoGallery = () => {
  const allRefs = useRef<(HTMLVideoElement | null)[]>([]);
  return (
    <div className="flex flex-col sm:flex-row gap-6 justify-center items-stretch">
      {PORTRAIT_VIDEOS.map((src, i) => (
        <div key={src} className="w-full sm:w-80 mx-auto">
          <VideoPlayer src={src} allRefs={allRefs} index={i} aspectRatio="9/16" />
        </div>
      ))}
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    clinic: '',
    location: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Cảm ơn bạn đã đăng ký! Chúng tôi sẽ liên hệ sớm.');
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      {/* SECTION 1: HERO */}
      <section className="relative flex items-start md:items-center pt-24 pb-16 md:pb-20 bg-background-dark overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full relative z-10 grid grid-cols-12 gap-y-8 md:gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="col-span-12 lg:col-span-7"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-accent-sky to-primary text-white font-black text-xs md:text-sm tracking-wide uppercase mb-8 shadow-[0_0_30px_rgba(56,189,248,0.3)] border border-white/20 max-w-full">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
              </span>
              <span className="leading-snug">THE PIONEER 02 | Can Thiệp Tối Thiểu, Hiệu Quả Tối Đa</span>
            </div>
            <h1 className="text-white font-headline text-3xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-8">
              Kỷ Nguyên Mới Của Phục Hình Thẩm Mỹ
            </h1>
            <div className="space-y-2 mb-8">
              <div className="flex items-start gap-2">
                <motion.div
                  className="mt-1"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 15, -15, 0],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Sparkles className="w-6 h-6 text-accent-sky" />
                </motion.div>
                <p className="text-base md:text-lg font-bold bling-text leading-tight">
                  Webinar chuyên môn miễn phí <br className="hidden sm:block" /> 20:00–22:00 · 03/04/2026
                </p>
                <motion.div
                  className="mt-1"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, -15, 15, 0],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                >
                  <Sparkles className="w-6 h-6 text-accent-beige" />
                </motion.div>
              </div>
              <p className="text-slate-400 text-base md:text-lg italic">
                Dành cho: Bác sĩ Răng Hàm Mặt · Chủ phòng khám · Người muốn nâng cấp giải pháp phục hình thẩm mỹ
              </p>
            </div>
            
            <Countdown />

            <a 
              href="#registration"
              className="bg-primary hover:bg-primary-light text-white px-8 py-3 md:py-4 rounded-full font-bold text-sm md:text-base transition-all shadow-lg shadow-primary/20 active:scale-95 flex items-center gap-2 w-fit"
            >
              Đăng ký tham gia miễn phí <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="col-span-12 lg:col-span-5 relative"
          >
            <div className="hero-image-frame overflow-hidden aspect-square">
              <img
                alt="SmartVeneer Launch"
                className="w-full h-full object-cover"
                src="/images/banner-event.png"
              />
            </div>
            <div className="hidden sm:block absolute -bottom-10 -left-10 w-80 h-56 rounded-3xl border-4 border-background-dark overflow-hidden shadow-2xl">
              <img
                alt="Training Session"
                className="w-full h-full object-cover"
                src="/images/banner-training.png"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 0: MARKET CONTEXT */}
      <section className="py-10 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-12 gap-y-8 md:gap-x-8 lg:gap-x-16 items-center">
            <div className="col-span-12 lg:col-span-6">
              <h2 className="font-headline text-2xl sm:text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
                Thị trường phục hình thẩm mỹ đang đặt ra những câu hỏi lớn
              </h2>
              <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-10">
                Buổi tối 03/04 là nơi chúng ta cùng nhìn vào bức tranh đó. Bằng số liệu thật. Từ người đã làm.
              </p>
              <div className="space-y-0 border-t border-slate-200">
                {[
                  { text: 'Bệnh nhân ngày càng hỏi: "Có cách nào không mài răng không?"', highlight: 'Đây không phải yêu cầu vô lý. Đây là xu hướng toàn cầu.' },
                  { text: 'Phục hình bền vững đang trở thành tiêu chuẩn mới.', highlight: 'Phân khúc khách hàng cao cấp sẵn sàng trả giá cao hơn cho giải pháp xâm lấn tối thiểu.' },
                  { text: 'Những bác sĩ nhận ra điều này sớm đang định vị lại phòng khám.', highlight: 'Đây là cơ hội, không phải áp lực.' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="py-6 border-b border-slate-200"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.12, duration: 0.45 }}
                    viewport={{ once: true }}
                  >
                    <p className="text-slate-700 text-sm md:text-base leading-relaxed font-medium">
                      {item.text}{' '}
                      <span className="font-bold text-slate-900">{item.highlight}</span>
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="col-span-12 lg:col-span-6">
              {/* Market data visualization */}
              <div className="rounded-[28px] bg-slate-950 p-6 md:p-8 shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-56 h-56 rounded-full bg-primary/20 blur-3xl" />
                <p className="text-[10px] font-bold tracking-wider text-primary-light uppercase mb-6">Thị trường du lịch nha khoa toàn cầu</p>

                {/* Big stat */}
                <div className="mb-7">
                  <p className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-none mb-2">$43.9<span className="text-lg sm:text-xl md:text-2xl font-bold text-primary-light ml-1">tỷ</span></p>
                  <p className="text-slate-400 text-base">Dự báo đến 2030 · Grand View Research</p>
                </div>

                {/* Growth rate */}
                <div className="flex items-center gap-4 bg-white/8 rounded-2xl px-5 py-4 mb-6 border border-white/15">
                  <span className="text-xl sm:text-2xl md:text-3xl font-black text-emerald-400">22%</span>
                  <div>
                    <p className="text-white font-bold text-base">CAGR hàng năm</p>
                    <p className="text-slate-300 text-sm">Tăng trưởng nhanh nhất trong nha khoa</p>
                  </div>
                </div>

                {/* Country comparison */}
                <div className="space-y-4 mb-6">
                  <p className="text-sm font-bold text-slate-300 uppercase tracking-wider">Đối thủ khu vực (2023 → 2030)</p>
                  {[
                    { country: 'Thái Lan', flag: 'th', now: '777tr USD', future: '3.24 tỷ', pct: 80 },
                    { country: 'Trung Quốc', flag: 'cn', now: '763tr USD', future: '3.24 tỷ', pct: 80 },
                  ].map((item) => (
                    <div key={item.country}>
                      <div className="flex justify-between mb-2">
                        <span className="text-white font-semibold text-sm flex items-center gap-1.5">
                          <img src={`https://flagcdn.com/16x12/${item.flag}.png`} alt={item.country} className="w-4 h-3 rounded-[2px]" />
                          {item.country}
                        </span>
                        <span className="text-slate-300 text-sm">{item.now} → <span className="text-primary-light font-black">{item.future}</span></span>
                      </div>
                      <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-primary-light"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${item.pct}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          viewport={{ once: true }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* VN opportunity */}
                <div className="bg-primary/25 border border-primary/40 rounded-2xl px-5 py-4">
                  <p className="text-white font-black text-base mb-1 flex items-center gap-1.5">
                    <img src="https://flagcdn.com/16x12/vn.png" alt="Việt Nam" className="w-4 h-3 rounded-[2px]" />
                    Việt Nam - Cơ hội chưa được khai thác
                  </p>
                  <p className="text-slate-200 text-sm leading-relaxed">Chi phí cạnh tranh + tay nghề cao. Ai chuẩn hóa trước, người đó thắng.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: PAIN HOOK */}
      <section className="py-10 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-12 gap-y-8 md:gap-x-8 lg:gap-x-16 items-center">
            <div className="col-span-12 lg:col-span-6">
              <h2 className="font-headline text-2xl sm:text-3xl md:text-5xl font-extrabold text-slate-900 mb-8 leading-tight">
                Khách hàng ngày càng hỏi câu này nhiều hơn:
              </h2>
              <div className="bg-slate-50 p-4 sm:p-8 rounded-2xl border-l-4 border-primary mb-6 md:mb-10">
                <p className="text-sm sm:text-base font-bold text-slate-800 italic">
                  "Bác sĩ ơi, có cách nào làm răng đẹp mà không cần mài không?"
                </p>
              </div>
              <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-6">
                Đây không phải yêu cầu khó. Đây là tín hiệu thị trường.
              </p>
              <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-10">
                Phân khúc khách hàng cao cấp đang dịch chuyển — <span className="font-bold text-slate-900 bg-primary/10 px-1 py-0.5 rounded">họ muốn kết quả thẩm mỹ tối đa nhưng can thiệp tối thiểu</span>. Những phòng khám nắm được điều này trước đang định vị lại toàn bộ dịch vụ của mình.
              </p>
              <p className="text-red-600 font-black text-sm md:text-lg uppercase tracking-tight">
                Câu hỏi là: phòng khám của bạn đang ở đâu trong bức tranh đó?
              </p>
            </div>
            <div className="col-span-12 lg:col-span-6">
              <div className="relative p-3 bg-slate-100 rounded-[40px] overflow-hidden">
                <img 
                  alt="Dental market" 
                  className="w-full h-[500px] object-cover rounded-[32px]" 
                  src="/images/dental-consultation.png"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: PROMISE */}
      <section className="py-10 md:py-20 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-12 gap-y-8 md:gap-x-8 lg:gap-x-16 items-center">
            <div className="col-span-12 lg:col-span-5">
              <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
                Trong 2 tiếng tối 03/04, bạn sẽ nắm được:
              </h2>
                <div className="space-y-0 border-t border-slate-200">
                  {[
                    { id: '01', title: 'Mài hay không mài?', desc: 'Ranh giới giữa bảo tồn và xâm lấn trong phục hình thẩm mỹ.' },
                    { id: '02', title: 'SmartVeneer - Giải pháp "may đo"', desc: 'Cho từng ca lâm sàng: Từ thiết kế đến vật liệu.' },
                    { id: '03', title: 'Tối ưu hóa quy trình & Bài toán kinh tế', desc: 'Cách vận hành hiệu quả cho phòng khám.', highlight: true }
                  ].map((item) => (
                    <div 
                      key={item.id} 
                      className={`group py-4 border-b border-slate-200 transition-all duration-300 ${
                        item.highlight ? 'bg-primary/5 px-4 rounded-2xl border-none my-3 shadow-md ring-2 ring-primary/20 z-10 relative' : ''
                      }`}
                    >
                      <div className="flex items-center gap-6 mb-2">
                        <span className={`w-12 h-12 rounded-full flex items-center justify-center text-base font-bold border transition-colors ${
                          item.highlight 
                            ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30' 
                            : 'border-slate-200 text-slate-500 group-hover:bg-primary group-hover:border-primary group-hover:text-white'
                        }`}>
                          {item.id}
                        </span>
                        <div className="flex items-center gap-4">
                          <span className={`font-black text-base md:text-lg transition-colors ${
                            item.highlight ? 'text-primary' : 'text-slate-900 group-hover:text-primary'
                          }`}>
                            {item.title}
                          </span>
                        </div>
                      </div>
                      <p className={`text-sm md:text-base ml-16 leading-relaxed ${
                        item.highlight ? 'text-slate-800 font-bold' : 'text-slate-500 font-medium'
                      }`}>
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
            </div>
            <div className="col-span-12 lg:col-span-7">
              <div className="relative">
                {/* Economics Card */}
                <div className="rounded-[28px] bg-white shadow-2xl shadow-slate-200/60 border border-slate-100 p-6 md:p-8 overflow-hidden">
                  {/* Card header */}
                  <div className="flex items-center gap-3 mb-7">
                    <div className="w-2 h-7 rounded-full bg-primary" />
                    <p className="text-sm font-bold tracking-widest text-slate-400 uppercase">Bài toán kinh tế SmartVeneer</p>
                  </div>

                  {/* Per-case breakdown */}
                  <div className="mb-8">
                    <p className="text-base font-semibold text-slate-500 mb-5">Cấu trúc 1 ca (20 răng Opal):</p>
                    <div className="space-y-4">
                      {/* Doanh thu */}
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="font-semibold text-slate-700 text-base">Doanh thu</span>
                          <span className="font-bold text-slate-900 text-base">100.000.000đ</span>
                        </div>
                        <div className="h-3.5 rounded-full bg-slate-100 overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-primary-light to-primary"
                            initial={{ width: 0 }}
                            whileInView={{ width: '100%' }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            viewport={{ once: true }}
                          />
                        </div>
                      </div>
                      {/* Chi phí vật liệu */}
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="font-semibold text-slate-500 text-base">Chi phí vật liệu DETEC</span>
                          <span className="font-bold text-slate-500 text-base">22.000.000đ</span>
                        </div>
                        <div className="h-3.5 rounded-full bg-slate-100 overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-slate-300"
                            initial={{ width: 0 }}
                            whileInView={{ width: '22%' }}
                            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                            viewport={{ once: true }}
                          />
                        </div>
                      </div>
                      {/* Lợi nhuận */}
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="font-bold text-emerald-700 text-base">Lợi nhuận thuần / ca</span>
                          <span className="font-black text-emerald-600 text-lg">78.000.000đ ✓</span>
                        </div>
                        <div className="h-3.5 rounded-full bg-emerald-50 overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500"
                            initial={{ width: 0 }}
                            whileInView={{ width: '78%' }}
                            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.4 }}
                            viewport={{ once: true }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-slate-100 mb-7" />

                  {/* Monthly scale */}
                  <div className="mb-6">
                    <p className="text-base font-semibold text-slate-500 mb-4">Nhân lên theo tháng:</p>
                    <div className="space-y-2">
                      {[
                        { label: '1 ca / tháng', value: '78.000.000đ', highlight: false },
                        { label: '5 ca / tháng', value: '390.000.000đ', highlight: false },
                        { label: '10 ca / tháng', value: '780.000.000đ', highlight: true },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className={`flex items-center justify-between px-5 py-3 rounded-xl ${item.highlight ? 'bg-primary' : 'bg-slate-50'}`}
                        >
                          <span className={`text-base font-medium ${item.highlight ? 'text-white/80' : 'text-slate-500'}`}>{item.label}</span>
                          <span className={`text-lg font-black ${item.highlight ? 'text-white' : 'text-slate-900'}`}>{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Case study badge */}
                  <div className="bg-slate-50 rounded-xl px-5 py-4 border-l-4 border-amber-400">
                    <p className="text-sm font-bold text-slate-800 mb-0.5">Case study — Dentisan Lab</p>
                    <p className="text-sm text-slate-600">10 ca/tháng, lợi nhuận thuần <span className="font-black text-slate-900">780 triệu đồng</span>. Số liệu từ phòng khám đang vận hành.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-start">
            <button
              className="bg-primary hover:bg-primary-light text-white px-8 py-3 md:py-4 rounded-full font-bold text-sm md:text-base transition-all shadow-lg shadow-primary/20 active:scale-95"
              onClick={() => document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Giữ chỗ của tôi →
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 3: SPEAKERS */}
      <section className="py-10 md:py-20 bg-white" id="speakers">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-8 md:mb-16 text-center">
            5 chuyên gia sẽ đồng hành cùng bạn tối 03/04
          </h2>
          <div className="flex flex-wrap justify-center gap-8">
            <SpeakerCard
              name="Chuyên gia Công nghệ và Kỹ thuật phòng Lab Vũ Đề"
              role="Người tiên phong công nghệ SmartVeneer"
              description=""
              image="/images/speaker-vu-de.jpg"
              quote="Đồng sáng chế kỹ thuật vi chốt cơ học, làm rỗ bề mặt vật liệu Zirconia ứng dụng sản xuất miếng dán SmartVeneer, chưa có đơn vị nào triển khai tại Việt Nam."
            />
            <SpeakerCard
              name="Thầy thuốc nhân dân, Tiến sĩ, Bác sĩ Lê Hưng"
              role="Chuyên gia Cao cấp Phục hình Răng bảo tồn"
              description="Chủ tịch Hội đồng chuyên môn DETEC · Giám đốc chuyên môn Nha khoa Dr. Lê Hưng & Cộng sự · Nguyên Giám đốc Bệnh viện Đa khoa Đống Đa"
              image="/images/speaker-le-hung.jpg"
              quote="Đóng góp chuyên môn, nghiên cứu phát triển công nghệ dán răng bảo tồn SmartVeneer và là một trong những bác sĩ đầu tiên đã trải nghiệm SmartVeneer trên chính hàm răng của mình."
              objectPositionStyle="35% 15%"
            />
            <SpeakerCard
              name="Bà Trần Khánh Chi"
              role="Giám đốc vận hành nha khoa Dentisan"
              description="Người trực tiếp vận hành mô hình SmartVeneer thực chiến tại phòng khám."
              image="/images/speaker-khanh-chi.jpg"
              quote="10 ca/tháng — 780 triệu lợi nhuận thuần. Số liệu thật, từ phòng khám đang chạy."
            />
            <SpeakerCard
              name="Bác sĩ Vương Tiến Thịnh"
              role="Bác sĩ thực chiến lâm sàng"
              description="Bác sĩ đang triển khai SmartVeneer tại phòng khám. Chia sẻ từ ca đầu tiên đến quy trình chuẩn hóa."
              image="/images/speaker-vuong-tin-thinh.jpg"
              quote="Không lý thuyết. Đây là những gì tôi làm thật, sai thật, và rút ra được sau mỗi ca."
            />
            <SpeakerCard
              name="Coach Duy Nguyễn"
              role="Góc nhìn khách hàng"
              description="Không phải chuyên gia kỹ thuật. Là người trực tiếp trải nghiệm SmartVeneer trên chính hàm răng của mình."
              image="/images/speaker-duy-nguyen.jpg"
              quote="Anh đặt câu hỏi từ góc độ bệnh nhân: những gì khách hàng của bạn đang thực sự muốn biết."
            />
          </div>
        </div>
      </section>

      {/* SECTION 4: AGENDA */}
      <section className="py-10 md:py-20 bg-background-dark text-white" id="agenda">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="text-center mb-10 md:mb-20">
            <h2 className="font-headline text-2xl sm:text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-white via-[#eaca8b] to-white bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(234,202,139,0.5)]">
              Lộ trình 2 tiếng, không có phần nào thừa
            </h2>
            <p className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm text-white/80 text-base font-medium px-5 py-2.5 rounded-full mt-2">
              📧 Zoom link gửi qua email trước 18:00 ngày 03/04
            </p>
          </div>
          <div className="space-y-4">
            <AgendaItem index={0} time="19:55–20:10" title="Đón tiếp & kết nối" description="Chuẩn bị kỹ thuật và giao lưu đầu giờ." />
            <AgendaItem index={1} time="20:10–20:15" title="Khai mạc" description="Coach Duy Nguyễn dẫn dắt chương trình." />
            <AgendaItem index={2} time="20:15–20:40" title="Thị trường đang phân hóa: Phòng khám nào hành động trước sẽ dẫn đầu" description="Chuyên gia Vũ Đề chia sẻ tầm nhìn chiến lược." />
            <AgendaItem index={3} time="20:40–21:10" title="SmartVeneer: Từ vật liệu đến lâm sàng" description="Thầy thuốc nhân dân, Tiến sĩ, Bác sĩ Lê Hưng đi sâu vào chuyên môn." />
            <AgendaItem index={4} time="21:10–21:25" title="Bài toán kinh tế của 1 ca SmartVeneer tại phòng khám" description="Bà Trần Khánh Chi phân tích con số thực tế." highlight />
            <AgendaItem index={5} time="21:25–21:40" title="Thực chiến từ phòng khám đã triển khai" description="Bác sĩ Vương Tiến Thịnh chia sẻ kinh nghiệm thực tế." highlight />
            <AgendaItem index={6} time="21:40–21:45" title="Hệ sinh thái đồng hành DETEC" description="Chuyên gia Vũ Đề giới thiệu các giải pháp hỗ trợ." />
            <AgendaItem index={7} time="21:45–22:00" title="Hỏi đáp trực tiếp + Quà ưu đãi đặc biệt dành riêng người tham dự live" description="Coach Duy Nguyễn điều phối phần thảo luận và công bố quà tặng." gold />
          </div>
          <div className="mt-16 flex justify-center">
            <button
              className="bg-primary hover:bg-primary-light text-white px-8 py-3 md:py-4 rounded-full font-bold text-sm md:text-base transition-all shadow-lg shadow-primary/20 active:scale-95"
              onClick={() => document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Đăng ký tham dự →
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 5: SOCIAL PROOF */}
      <section className="py-10 md:py-20 bg-slate-950 relative overflow-hidden">
        {/* Glow orbs */}
        <div className="absolute top-0 left-1/3 w-80 h-80 bg-primary/30 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#8acdff]/20 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-12 gap-y-8 md:gap-x-8 lg:gap-x-16 items-center">
            {/* Left: heading + stats */}
            <div className="col-span-12 lg:col-span-6">
              <h2 className="font-headline text-2xl sm:text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                Bảo chứng từ những con số và tổ chức uy tín
              </h2>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-8 md:mb-12">
                Hành trình 5+ năm nghiên cứu được ghi nhận bởi các đơn vị đầu ngành và giới chuyên môn quốc tế.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: '1.000+', label: 'Ca lâm sàng' },
                  { value: '100+', label: 'Phòng khám' },
                  { value: '06', label: 'Báo chí lớn' },
                  { value: 'VITA', label: 'Đối tác Đức 100 năm' },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all duration-300"
                  >
                    <span className="block text-2xl sm:text-3xl md:text-4xl font-black mb-2 bg-gradient-to-r from-white via-[#8acdff] to-white bg-clip-text text-transparent">{stat.value}</span>
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{stat.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right: testimonial card */}
            <div className="col-span-12 lg:col-span-6">
              <div className="relative rounded-[28px] bg-white/5 border border-white/10 backdrop-blur-sm p-4 sm:p-6 md:p-10">
                {/* Quote mark */}
                <div className="text-3xl md:text-4xl font-black leading-none mb-4 bg-gradient-to-r from-primary to-[#8acdff] bg-clip-text text-transparent">"</div>
                <p className="text-white text-sm md:text-lg font-semibold leading-relaxed mb-6 md:mb-8">
                  SmartVeneer thay đổi hoàn toàn cách chúng tôi tiếp cận phục hình xâm lấn tối thiểu.
                </p>
                <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                  <img src="/images/speaker-khanh-chi.jpg" alt="Khánh Chi" className="w-12 h-12 rounded-full object-cover flex-shrink-0 ring-2 ring-primary/40" />
                  <div>
                    <p className="font-bold text-white">Bà Trần Khánh Chi</p>
                    <p className="text-slate-400 text-sm">Giám đốc vận hành Nha khoa Dentisan</p>
                  </div>
                </div>
                {/* Inner glow */}
                <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: EXPERT PROOF */}
      <section className="py-10 md:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-8 md:mb-16 text-center">
            Bác sĩ và phòng khám nói gì về SmartVeneer?
          </h2>
          <VideoGallery />
        </div>
      </section>

      {/* SECTION 7: BEFORE / AFTER */}
      <section className="py-10 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-8 md:mb-16 text-center">
            Kết quả thực tế từ phòng khám đang triển khai
          </h2>
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
        </div>
      </section>

      {/* SECTION 8: REVIEW KHÁCH HÀNG */}
      <section className="py-10 md:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-8 md:mb-16 text-center">
            Nụ cười khoẻ đẹp chỉ sau 2 lần gặp gỡ
          </h2>
          <PortraitVideoGallery />
        </div>
      </section>

      {/* SECTION 9: SMARTVENEER LÀ GÌ? */}
      <section className="py-10 md:py-20 bg-gradient-to-br from-slate-950 via-primary-dark to-primary overflow-hidden" id="technology">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-12 gap-y-8 md:gap-x-8 lg:gap-x-16 items-center">
            <div className="col-span-12 lg:col-span-6">
              <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs font-bold px-4 py-2 rounded-full mb-6 border border-white/20 backdrop-blur-sm">
                ✦ Công nghệ độc quyền
              </div>
              <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-white via-[#8acdff] to-white bg-clip-text text-transparent">
                SMARTVENEER<br/>LÀ GÌ?
              </h2>
              <p className="text-white/70 text-sm md:text-base leading-relaxed mb-6 md:mb-10">
                Công nghệ dán răng bảo tồn, khôi phục hình thể, màu sắc và chức năng của hàm răng. <span className="text-white font-semibold">Bảo tồn tối đa răng thật.</span>
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: '🎨', label: 'Cản màu xuất sắc' },
                  { icon: '💎', label: 'Bền chắc dài lâu' },
                  { icon: '🛡️', label: 'An toàn vượt trội' },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-1 items-center text-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-2 py-3">
                    <span className="text-xl">{item.icon}</span>
                    <p className="text-white font-bold text-xs sm:text-sm">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-span-12 lg:col-span-6">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-tr from-primary/40 to-[#8acdff]/20 rounded-[50px] blur-2xl" />
                <div className="relative p-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-[40px] overflow-hidden shadow-2xl">
                  <img
                    alt="SmartVeneer smile result"
                    className="w-full h-[440px] object-cover rounded-[32px]"
                    src="/images/smartveneer-smile.jpg"
                  />
                  <div className="absolute bottom-6 left-6 right-6 bg-black/40 backdrop-blur-md rounded-2xl px-5 py-3 border border-white/10">
                    <p className="text-white font-bold text-sm">Kết quả thực tế · SmartVeneer by DETEC</p>
                    <p className="text-white/60 text-xs mt-0.5">Can thiệp tối thiểu · Hiệu quả tối đa</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9B: SMARTVENEER COMPARISON TABLE */}
      <section className="py-10 md:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Mobile card view */}
          {(() => {
            const rows = [
              { feature: 'Tiêm tê', sv: 'Có thể tiêm tê trong một số trường hợp chỉ định', veneer: 'Cần tiêm tê', crown: 'Cần tiêm tê nhiều để giảm đau' },
              { feature: 'Xâm lấn mô răng', sv: 'Rất ít — chỉ làm sạch nhẹ bề mặt men (0.1–0.3mm)', veneer: 'Mài mặt ngoài hoặc bán phần (0.5–0.8mm)', crown: 'Mài toàn phần, đến sát tuỷ răng (1.5–2.0mm)' },
              { feature: 'Thời gian thực hiện', sv: '2 lần hẹn · tổng 2–3 tiếng', veneer: '3–5 lần hẹn · tổng 7–8 tiếng', crown: 'Nhiều lần hẹn · tổng 7–8 tiếng' },
              { feature: 'Độ bám dính', sv: 'Vi chốt cơ học độc quyền', veneer: 'Keo dán thông thường', crown: 'Mài + keo dán' },
              { feature: 'Ảnh hưởng nướu', sv: 'Zirconia tích hợp sinh học, kháng vi khuẩn', veneer: 'Có thể kích ứng nếu không chăm sóc kỹ', crown: 'Dễ viêm lợi, hôi miệng do tổn thương viền nướu' },
              { feature: 'Bảo tồn khớp cắn', sv: 'Tôn trọng và bảo tồn khớp cắn nguyên thuỷ', veneer: 'Có thể sai lệch do mài mặt ngoài', crown: 'Dễ biến đổi khớp cắn do mài toàn phần' },
              { feature: 'Độ bền', sv: '≥ 20 năm · không đổi màu · (900–1250MPa)', veneer: '7–15 năm · (350–400MPa)', crown: '10–15 năm · có thể hở đường viền' },
            ];
            return (
              <>
                {/* Mobile cards */}
                <div className="sm:hidden space-y-3">
                  {rows.map(row => (
                    <div key={row.feature} className="rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-white">
                      <div className="bg-slate-900 px-4 py-2">
                        <span className="text-white font-bold text-xs uppercase tracking-wide">{row.feature}</span>
                      </div>
                      <div className="px-4 py-3 bg-primary/5 border-l-4 border-primary">
                        <p className="text-xs font-extrabold text-primary uppercase tracking-widest mb-1">SmartVeneer</p>
                        <p className="text-sm font-semibold text-primary leading-snug">{row.sv}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-0 border-t border-slate-100">
                        <div className="px-3 py-3 border-r border-slate-100">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Veneer truyền thống</p>
                          <p className="text-sm text-slate-700 leading-snug">{row.veneer}</p>
                        </div>
                        <div className="px-3 py-3">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Chụp / Bọc răng sứ</p>
                          <p className="text-sm text-slate-700 leading-snug">{row.crown}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Desktop table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-left border-separate border-spacing-0 shadow-xl">
                    <thead>
                      <tr>
                        <th className="p-5 md:p-6 font-bold text-sm uppercase tracking-widest text-white bg-slate-900 w-[22%] rounded-tl-2xl">Đặc điểm</th>
                        <th className="p-5 md:p-6 font-bold text-white bg-primary text-center">
                          <div className="text-lg font-extrabold tracking-wide">SMARTVENEER</div>
                          <div className="text-xs font-normal opacity-90 mt-1">Zirconia · Độc quyền DETEC</div>
                        </th>
                        <th className="p-5 md:p-6 font-bold text-sm uppercase tracking-widest text-white bg-slate-600 text-center">Veneer truyền thống</th>
                        <th className="p-5 md:p-6 font-bold text-sm uppercase tracking-widest text-white bg-slate-900 text-center rounded-tr-2xl">Chụp / Bọc răng sứ</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {rows.map((row, idx) => (
                        <tr key={row.feature} className={`border-b border-slate-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}`}>
                          <td className={`p-5 md:p-6 font-bold text-slate-900 text-base border-r border-slate-200${idx === rows.length - 1 ? ' rounded-bl-2xl' : ''}`}>{row.feature}</td>
                          <td className="p-5 md:p-6 font-semibold text-primary bg-primary/5 text-base text-center border-r border-primary/15">{row.sv}</td>
                          <td className="p-5 md:p-6 text-slate-600 text-base text-center border-r border-slate-100">{row.veneer}</td>
                          <td className={`p-5 md:p-6 text-slate-600 text-base text-center${idx === rows.length - 1 ? ' rounded-br-2xl' : ''}`}>{row.crown}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            );
          })()}
        </div>
      </section>

      {/* SECTION 10: EXCLUSIVE GIFT */}
      <section className="py-10 md:py-20 bg-accent-beige relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 mix-blend-overlay">
          <img 
            alt="Pattern" 
            className="w-full h-full object-cover" 
            src="https://images.unsplash.com/photo-1557683311-eac922347aa1?auto=format&fit=crop&q=80&w=1200"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="max-w-5xl mx-auto px-4 md:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-white/40 backdrop-blur-xl p-6 sm:p-10 md:p-16 rounded-[28px] md:rounded-[40px] text-center shadow-2xl shadow-slate-900/10 border border-white/20"
          >
            <div className="w-12 h-12 md:w-20 md:h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 md:mb-8 shadow-lg">
              <Star className="text-white w-6 h-6 md:w-10 md:h-10 fill-current" />
            </div>
            <h2 className="font-headline text-xl sm:text-2xl md:text-4xl font-extrabold text-slate-900 mb-3 md:mb-6">🎁 Quà ưu đãi đặc biệt dành cho người tham dự</h2>
            <p className="text-slate-800 text-sm md:text-base font-medium mb-5 md:mb-10 max-w-2xl mx-auto leading-relaxed">
              Ngoài nội dung chuyên môn, người tham gia live sẽ nhận được quà tặng độc quyền từ <span className="font-extrabold uppercase tracking-wide">SmartVeneer</span>, công bố ngay trong buổi tối.
            </p>
            <div className="bg-slate-900/10 p-4 md:p-6 rounded-2xl mb-5 md:mb-10">
              <p className="text-slate-900 font-bold text-sm md:text-base">
                Trong đó có <span className="text-primary font-extrabold">50 phần quà đặc biệt</span> dành riêng cho bác sĩ đăng ký sớm nhất.
              </p>
            </div>
            <button
              className="bg-primary hover:bg-primary-light text-white px-8 py-3 md:py-4 rounded-full font-bold text-sm md:text-base transition-all shadow-lg shadow-primary/20 active:scale-95"
              onClick={() => document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Đăng ký ngay để không bỏ lỡ →
            </button>
          </motion.div>
        </div>
      </section>

      {/* SECTION 11: FORM ĐĂNG KÝ */}
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
                '✅ Zoom link gửi qua email trước 18:00 ngày 03/04',
                '✅ Tài liệu chuyên môn độc quyền qua Zalo',
                '✅ 50 phần quà đặc biệt cho người đăng ký sớm',
              ].map((item, i) => (
                <p key={i} className="text-slate-700 font-medium text-base">{item}</p>
              ))}
            </div>
            <div className="flex justify-around gap-2 p-4 md:p-8 bg-primary/5 rounded-3xl border border-primary/10">
              {[
                { label: 'Ngày', value: '03/04' },
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
              <form className="space-y-3 md:space-y-5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <input 
                    className="w-full bg-slate-50 border border-slate-100 rounded-full px-4 py-3 text-sm md:text-base text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
                    placeholder="Họ và tên *" 
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                  <input 
                    className="w-full bg-slate-50 border border-slate-100 rounded-full px-4 py-3 text-sm md:text-base text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
                    placeholder="Số điện thoại *" 
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <input
                  className="w-full bg-slate-50 border border-slate-100 rounded-full px-4 py-3 text-sm md:text-base text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Email *"
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
                <input
                  className="w-full bg-slate-50 border border-slate-100 rounded-full px-4 py-3 text-sm md:text-base text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Tên phòng khám / cơ sở *"
                  type="text"
                  required
                  value={formData.clinic}
                  onChange={e => setFormData({...formData, clinic: e.target.value})}
                />
                <input 
                  className="w-full bg-slate-50 border border-slate-100 rounded-full px-4 py-3 text-sm md:text-base text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
                  placeholder="Tỉnh / Thành phố *" 
                  type="text"
                  required
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                />
                <button 
                  className="w-full bg-primary hover:bg-primary-light text-white font-bold py-3 md:py-4 rounded-full text-sm md:text-base transition-all shadow-lg shadow-primary/20 mt-2 active:scale-95" 
                  type="submit"
                >
                  Đăng ký tham gia webinar
                </button>
                <p className="text-center text-sm text-slate-500 font-medium">
                  Thông tin của bạn được bảo mật theo tiêu chuẩn HIPAA & GDPR.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 py-10 px-4 md:px-8 border-t border-slate-200/20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          <div>
            <div className="text-base font-bold text-slate-800 mb-3">SMARTVENEER</div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Công nghệ dán răng bảo tồn bằng vi chốt cơ học
            </p>
          </div>
          <div>
            <h5 className="text-slate-800 font-bold mb-3 uppercase text-xs tracking-widest">Liên hệ</h5>
            <p className="text-slate-500 text-sm leading-relaxed">
              605 đường Quang Trung, P. Kiến Hưng, Hà Nội.<br/>
              Email: smartveneer@detec.vn<br/>
              Facebook: fb.com/DanSinhHocSmartVeneer
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-0 pt-8 mt-10 border-t border-slate-200/20 text-center">
          <p className="text-sm text-slate-400">© 2026 SmartVeneer. All rights reserved. Professional use only.</p>
        </div>
      </footer>
    </div>
  );
}
