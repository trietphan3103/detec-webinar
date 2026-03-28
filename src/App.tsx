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
    { label: 'Công nghệ', href: '#technology' },
    { label: 'Chuyên gia', href: '#speakers' },
    { label: 'Giải pháp toàn diện', href: '#ecosystem' },
    { label: 'Thư viện hình ảnh', href: '#cases' },
    { label: 'Nội dung', href: '#agenda' },
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
      <ul className="text-slate-500 text-sm mb-4 flex-grow space-y-0.5">
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
              Xu Hướng Mới Của Phục Hình Thẩm Mỹ
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
                  Webinar chuyên môn miễn phí <br className="hidden sm:block" /> 20:00–22:00 · 10/04/2026
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
                alt="Tư vấn điều trị"
                className="w-full h-full object-cover"
                src="/images/dental-consultation.jpg"
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
                Sau buổi webinar 10/04, bạn sẽ không chỉ hiểu thị trường, mà biết mình cần làm gì để không bị bỏ lại phía sau.
              </p>
              <div className="space-y-0 border-t border-slate-200">
                {[
                  { text: 'Khách hàng ngày càng hỏi: "Có cách nào ít mài răng không?"', highlight: 'Đây không phải yêu cầu vô lý. Đây là xu hướng toàn cầu.' },
                  { text: 'Phục hình ít xâm lấn đang trở thành tiêu chuẩn mới.', highlight: 'Phân khúc khách hàng cao cấp sẵn sàng trả giá cao hơn, miễn là không phải đánh đổi răng thật.' },
                  { text: 'Cập nhật ngay xu hướng điều trị mới', highlight: 'trước khi khách hàng của bạn lựa chọn phòng khám khác.' },
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
              <div className="mt-8">
                <button
                  className="bg-primary hover:bg-primary-light text-white px-8 py-3 rounded-full font-bold text-sm md:text-base transition-all shadow-lg shadow-primary/20 active:scale-95"
                  onClick={() => document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Tìm hiểu ngay →
                </button>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-6">
              {/* Market data visualization */}
              <div className="rounded-[28px] bg-slate-950 p-6 md:p-8 shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-56 h-56 rounded-full bg-primary/20 blur-3xl" />
                <p className="text-xs font-bold tracking-wider text-primary-light uppercase mb-6">Thị trường du lịch nha khoa toàn cầu</p>

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

      {/* SECTION: THỰC TRẠNG VIỆT NAM */}
      <section className="py-20 md:py-28 bg-slate-950 overflow-hidden relative">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-primary/8 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative">

          {/* Header */}
          <motion.div
            className="mb-12 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-accent-sky to-primary text-white font-black text-xs md:text-sm tracking-wide uppercase mb-8 shadow-[0_0_30px_rgba(56,189,248,0.3)] border border-white/20">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <span>Thị trường · Việt Nam</span>
            </div>
            <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight max-w-2xl">
              Thực trạng nha khoa<br/>Việt Nam hiện nay
            </h2>
          </motion.div>

          {/* 4 stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-10">
            {[
              { value: '~30.000', label: 'Nha sĩ cả nước', sub: 'Trên 100 triệu dân' },
              { value: '1/3.500', label: 'Nha sĩ / người dân', sub: 'WHO chuẩn: 1/1.000' },
              { value: '$500tr', label: 'Quy mô thị trường', sub: 'Năm 2023' },
              { value: '$1,275 tỷ', label: 'Dự báo đến 2028', sub: 'Tăng ~18%/năm' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-[20px] bg-white/8 border border-white/15 px-5 py-7 md:px-7 md:py-8 overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-primary/20 blur-2xl" />
                <p className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-2 tracking-tight leading-none">{item.value}</p>
                <p className="text-slate-100 text-sm md:text-base font-bold mb-1">{item.label}</p>
                <p className="text-emerald-400 text-xs md:text-sm font-medium">{item.sub}</p>
              </motion.div>
            ))}
          </div>

          {/* Two columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Left: bệnh răng miệng */}
            <motion.div
              className="rounded-[24px] bg-white/5 border border-white/10 p-6 md:p-8"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs font-black tracking-widest text-white uppercase mb-7 bg-primary/20 border border-primary/30 rounded-lg px-3 py-1.5 inline-block">Tỷ lệ bệnh răng miệng</p>
              <div className="space-y-6">
                {[
                  { label: 'Dân số có vấn đề răng miệng', pct: 90 },
                  { label: 'Chưa được điều trị đúng cách', pct: 65 },
                  { label: 'Quan tâm thẩm mỹ nha khoa (dưới 35 tuổi)', pct: 35 },
                ].map((row) => (
                  <div key={row.label}>
                    <div className="flex justify-between items-baseline mb-2.5">
                      <span className="text-slate-300 text-sm">{row.label}</span>
                      <span className="text-white font-black text-base tabular-nums">{row.pct}%</span>
                    </div>
                    <div className="h-2 bg-white/8 overflow-hidden rounded-full">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-primary-light"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${row.pct}%` }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-slate-400 text-xs mt-7 bg-white/5 border border-white/10 rounded-lg px-3 py-2 inline-block">Nguồn: WHO, Bộ Y tế Việt Nam</p>
            </motion.div>

            {/* Right: so sánh giá */}
            <motion.div
              className="rounded-[24px] bg-white/5 border border-white/10 p-6 md:p-8"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs font-black tracking-widest text-white uppercase mb-7 bg-primary/20 border border-primary/30 rounded-lg px-3 py-1.5 inline-block">Chi phí veneer / răng</p>
              <div className="space-y-5">
                {[
                  { country: 'Mỹ', flag: 'us', price: '$1.500 – 3.000', bar: 100, color: 'bg-gradient-to-r from-red-600 to-red-400' },
                  { country: 'Úc', flag: 'au', price: '$1.200 – 2.500', bar: 85, color: 'bg-gradient-to-r from-orange-600 to-orange-400' },
                  { country: 'Thái Lan', flag: 'th', price: '$500 – 900', bar: 40, color: 'bg-gradient-to-r from-yellow-600 to-yellow-400' },
                  { country: 'Việt Nam', flag: 'vn', price: '$200 – 400', bar: 17, highlight: true, color: 'bg-gradient-to-r from-emerald-500 to-emerald-400' },
                ].map((row) => (
                  <div key={row.country}>
                    <div className="flex justify-between items-baseline mb-2.5">
                      <span className={`text-sm flex items-center gap-2 ${row.highlight ? 'text-white font-semibold' : 'text-slate-400'}`}>
                        <img src={`https://flagcdn.com/16x12/${row.flag}.png`} alt={row.country} className="w-4 h-3 rounded-[2px] opacity-80" />
                        {row.country}
                      </span>
                      <span className={`text-sm tabular-nums font-black ${row.highlight ? 'text-white' : 'text-slate-500'}`}>{row.price}</span>
                    </div>
                    <div className="h-2 bg-white/8 overflow-hidden rounded-full">
                      <motion.div
                        className={`h-full rounded-full ${row.color}`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${row.bar}%` }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-emerald-300 text-sm font-semibold mt-7 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">Việt Nam rẻ hơn 5–8 lần so với Mỹ, tạo lợi thế cạnh tranh lớn với khách du lịch nha khoa quốc tế</p>
            </motion.div>
          </div>

          {/* Bottom insight */}
          <motion.div
            className="relative rounded-[28px] overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Elite background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f2e] via-[#0d1a4a] to-[#050a1e]" />
            {/* Gold accent top line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/70 to-transparent" />
            {/* Glow orbs */}
            <div className="absolute -top-10 left-1/4 w-80 h-80 rounded-full bg-primary/20 blur-[100px] pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-amber-400/8 blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-blue-600/15 blur-[60px] pointer-events-none" />
            {/* Subtle grid pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            {/* Gold border */}
            <div className="absolute inset-0 rounded-[28px] border border-amber-400/20" />
            <div className="absolute inset-[1px] rounded-[27px] border border-white/5" />

            <div className="relative z-10 px-8 py-10 md:px-12 md:py-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                  <span className="text-emerald-300 text-xs font-bold tracking-[0.15em] uppercase">Quy mô cơ hội thị trường</span>
                </div>
                <p className="font-headline text-6xl md:text-7xl lg:text-8xl font-black leading-none tracking-tight mb-3"
                  style={{ background: 'linear-gradient(135deg, #ffffff 40%, #93c5fd 70%, #fbbf24 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: 'none', filter: 'drop-shadow(0 0 40px rgba(59,130,246,0.35))' }}>
                  1.275.000
                </p>
                <p className="text-white text-lg md:text-xl font-bold tracking-wide">khách hàng tiềm năng <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-sky to-primary">SmartVeneer</span> tại Việt Nam</p>
              </div>
              <div className="md:max-w-md lg:max-w-lg">
                <div className="bg-white/8 border border-white/15 rounded-2xl px-6 py-6 backdrop-blur-sm">
                  <p className="font-headline text-xl md:text-2xl font-extrabold text-white leading-snug mb-3">Tầng lớp trung lưu và cao cấp</p>
                  <p className="text-slate-200 text-base leading-relaxed">đang tìm kiếm giải pháp phục hình thẩm mỹ ít xâm lấn, và sẵn sàng chi trả để có được điều đó.</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* SECTION: TETRACYCLINE */}
      <section className="py-20 md:py-28 bg-white overflow-hidden relative">

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">

          {/* Header */}
          <motion.div
            className="mb-10 md:mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-red-700 to-red-500 text-white font-black text-xs md:text-sm tracking-wide uppercase mb-8 shadow-[0_0_30px_rgba(239,68,68,0.25)] border border-red-400/30">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
              </span>
              <span>Ca lâm sàng thực tế</span>
            </div>
            <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight max-w-3xl mb-5">
              Nhóm 45–65 tuổi: thế hệ chịu ảnh hưởng bởi răng nhiễm màu <span className="text-red-500">tetracycline</span>
            </h2>
            <p className="inline-block text-slate-700 text-base font-semibold italic border-l-4 border-red-400 pl-5 pr-8 py-3 bg-red-50 rounded-r-xl">
              "Không phải do chăm sóc kém, mà là hệ lụy từ một giai đoạn lịch sử"
            </p>
          </motion.div>

          {/* Two-column */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">

            {/* Left: photos */}
            <motion.div
              className="grid grid-cols-2 gap-3"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm group">
                  <img
                    src={`/images/tetracycline-${n}.jpg`}
                    alt={`Ca Tetracycline ${n}`}
                    className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="text-xs font-bold text-red-400 uppercase tracking-widest bg-black/50 px-2 py-0.5 rounded-full border border-red-400/30">Trước điều trị</span>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Right: quote + problems */}
            <motion.div
              className="flex flex-col justify-center gap-5"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              {/* Quote card */}
              <div className="rounded-[24px] bg-slate-50 border border-slate-200 shadow-sm px-7 py-8 relative overflow-hidden">
                <p className="font-headline text-2xl md:text-3xl font-extrabold text-slate-900 leading-snug relative z-10 mb-4">
                  Họ không phải không muốn làm, chỉ là chưa có giải pháp đủ an tâm
                </p>
                <p className="text-red-500 text-base font-semibold relative z-10">Phản hồi thường gặp từ nhóm 45–65 tuổi</p>
              </div>

              {/* Problems card */}
              <div className="rounded-[24px] bg-slate-50 border border-slate-200 shadow-sm px-7 py-7">
                <p className="text-xs font-bold tracking-widest text-red-500 uppercase mb-6">Tại sao họ chưa quyết định</p>
                <div className="space-y-5">
                  {[
                    'Tẩy trắng thông thường không hiệu quả với tetracycline',
                    'Dán Veneer mỏng không cản được màu cùi răng ố nặng',
                    'Bọc/chụp sứ phải mài quá nhiều mô răng thật',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3.5">
                      <div className="w-6 h-6 rounded-full bg-red-100 border border-red-200 flex items-center justify-center shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-red-500" viewBox="0 0 10 10" fill="none">
                          <path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <p className="text-slate-700 text-base leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom insight */}
          <motion.div
            className="rounded-[24px] overflow-hidden relative"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Elite dark card */}
            <div className="rounded-[24px] px-8 md:px-10 py-8 md:py-9 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
              {/* Elite background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#071a12] via-[#0a2218] to-[#050f0a]" />
              {/* Grid pattern */}
              <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage:'linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)',backgroundSize:'40px 40px'}} />
              {/* Glow orbs */}
              <div className="absolute -top-10 left-1/4 w-80 h-80 rounded-full bg-emerald-500/15 blur-[100px] pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full bg-emerald-400/8 blur-[60px] pointer-events-none" />
              {/* Top emerald line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent" />
              {/* Double border */}
              <div className="absolute inset-0 rounded-[24px] border border-emerald-400/25" />
              <div className="absolute inset-[1px] rounded-[23px] border border-white/5" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-400 font-bold text-xs uppercase tracking-widest mb-4">
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                  </span>
                  Cơ hội chưa được khai thác
                </div>
                <p className="text-white font-bold text-xl md:text-2xl leading-snug max-w-lg">
                  Đây là nhóm khách hàng có nhu cầu thật, nhưng khó chuyển đổi nhất vì chưa có giải pháp đủ thuyết phục
                </p>
              </div>
              <div className="relative z-10 shrink-0 max-w-sm">
                <div className="bg-white/8 border border-emerald-400/30 rounded-2xl px-6 py-5 backdrop-blur-sm">
                  <p className="text-white font-bold text-base md:text-lg leading-relaxed">
                    SmartVeneer được thiết kế để giải quyết ca tetracycline nặng với can thiệp tối thiểu, bảo tồn răng thật tối đa.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* SECTION: EXPERT STORY */}
      <section className="py-10 md:py-20 bg-gradient-to-br from-blue-50 via-primary/5 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-12 gap-y-8 md:gap-x-16 items-center">
            <div className="col-span-12 lg:col-span-5">
              <div className="relative">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <img src="/images/speaker-vu-de.jpg" alt="Chuyên gia Vũ Đề" className="w-full object-cover object-top" style={{ maxHeight: 480 }} />
                </div>
                <div className="mt-5 bg-white rounded-2xl border border-slate-200 px-5 py-4 shadow-sm">
                  <p className="font-black text-slate-900 text-base mb-2">Nhà sáng lập Hệ sinh thái DETEC</p>
                  <div className="space-y-1.5 mb-3">
                    <p className="text-slate-700 text-sm flex items-start gap-2"><span className="text-emerald-500 mt-0.5">✓</span>Chủ tịch Hội đồng quản trị DETEC Group</p>
                    <p className="text-slate-700 text-sm flex items-start gap-2"><span className="text-emerald-500 mt-0.5">✓</span>Nhà sáng chế công nghệ SmartVeneer</p>
                    <p className="text-slate-700 text-sm flex items-start gap-2"><span className="text-emerald-500 mt-0.5">✓</span>Chuyên gia Công nghệ &amp; Kỹ thuật Lab</p>
                  </div>
                  <div className="border-t border-slate-100 pt-3">
                    <p className="bg-primary/8 text-primary font-semibold text-sm italic leading-relaxed px-3 py-2 rounded-xl border-l-3 border-primary">Trực tiếp chứng kiến hàng nghìn ca phải mài răng và sự do dự của cả bác sĩ lẫn khách hàng</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-7">
              <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
                Khi thị trường thay đổi, và nỗi đau khách hàng ngày càng rõ ràng…
              </h2>
              <p className="text-slate-600 text-base leading-relaxed mb-4">
                Hơn 30 năm làm nghề, chuyên gia Vũ Đề luôn trăn trở một câu hỏi:
              </p>
              <div className="bg-primary/5 border-l-4 border-primary px-6 py-4 rounded-r-2xl mb-6">
                <p className="font-black text-slate-900 text-lg md:text-xl leading-snug">
                  Làm sao để cải thiện thẩm mỹ mà không phải đánh đổi quá nhiều mô răng thật?
                </p>
              </div>
              <p className="text-slate-600 text-base leading-relaxed mb-6">
                Trải qua hành trình học tập và tiếp thu trên gần 50 quốc gia, cùng nhiều thử nghiệm và cả những thất bại, chuyên gia Vũ Đề đã tìm ra: <strong className="text-slate-900">Một công nghệ giúp bác sĩ và khách hàng không còn phải lựa chọn giữa thẩm mỹ và đánh đổi.</strong>
              </p>
              <div className="mb-8">
                <p className="text-slate-800 text-base leading-relaxed">
                  Chuyên gia Vũ Đề mất hơn 30 năm "nằm gai nếm mật" để tìm ra giải pháp. Bạn chỉ cần <span className="font-black text-primary underline decoration-primary decoration-2 underline-offset-2">2 giờ tối 10/04</span> để hiểu rõ và biết cách ứng dụng tại phòng khám.
                </p>
              </div>
              <button
                className="bg-primary hover:bg-primary-light text-white px-8 py-3 md:py-4 rounded-full font-bold text-sm md:text-base transition-all shadow-lg shadow-primary/20 active:scale-95"
                onClick={() => document.getElementById('technology')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Tìm hiểu công nghệ SmartVeneer →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: SMARTVENEER LÀ GÌ? */}
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

      {/* SECTION 9B: ZIRCONIA SEM PROOF */}
      <section className="py-16 md:py-24 bg-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">

          {/* Header — narrative hook */}
          <motion.div
            className="mb-10 md:mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-accent-sky to-primary text-white font-black text-xs uppercase tracking-wide mb-6 shadow-[0_0_20px_rgba(59,130,246,0.4)]">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" /></svg>
              Chứng minh khoa học · Viện Khoa học Vật liệu
            </div>
            <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight max-w-4xl mb-4">
              Zirconia gần như không được dùng cho veneer vì <span className="text-red-500">khó bám dính</span>
            </h2>
            <p className="text-slate-600 text-lg md:text-xl font-medium max-w-2xl">
              Nhưng SmartVeneer đã làm được. <span className="text-primary underline decoration-primary decoration-2 underline-offset-3">Điều gì đã thay đổi?</span>
            </p>
          </motion.div>

          {/* Main layout: images left, info right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

            {/* Left: 2 SEM images + caption */}
            <div>
            <div className="flex gap-3 items-start">
              {[
                {
                  src: '/images/zirconia-before.png',
                  alt: 'Zirconia chưa tạo nhám',
                  label: 'Zirconia thông thường (Chưa xử lý)',
                  desc: 'Bề mặt trơn nhẵn → Độ bám dính thấp → Dễ bong tróc',
                  accent: 'red',
                  icon: (
                    <svg className="w-3.5 h-3.5 text-red-500" viewBox="0 0 14 14" fill="none">
                      <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  ),
                },
                {
                  src: '/images/zirconia-after.png',
                  alt: 'Zirconia đã tạo nhám SmartVeneer',
                  label: 'SmartVeneer (Xử lý vi chốt 3.5 phút)',
                  desc: 'Bề mặt có cấu trúc nano → Bám dính gấp 15–30 lần → Bền vĩnh viễn',
                  accent: 'emerald',
                  icon: (
                    <svg className="w-3.5 h-3.5 text-emerald-500" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7l4 4 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ),
                },
              ].map((item, i) => (
                <motion.div
                  key={item.alt}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm group cursor-zoom-in flex-1 min-w-0"
                  onClick={() => setZirconiaLightbox(i)}
                >
                  <div className="relative overflow-hidden">
                    <img src={item.src} alt={item.alt} className="w-full aspect-[1/1] object-cover bg-black group-hover:scale-[1.03] transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full">Xem bản to</div>
                    </div>
                  </div>
                  <div className={`px-4 pt-3 pb-4 border-t ${item.accent === 'red' ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
                    <p className={`font-black text-sm mb-1 ${item.accent === 'red' ? 'text-red-600' : 'text-emerald-700'}`}>
                      {item.label}
                    </p>
                    <p className="text-slate-700 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <p className="text-slate-400 text-xs mt-2">Phân tích FESEM (HITACHI S-4800) · Ký bởi Phó Viện Trưởng Trần Quốc Tiến</p>
            </div>

            {/* Right: Stat + CTA stacked */}
            <motion.div
              className="flex flex-col gap-4"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              {/* Stat card */}
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-7 py-6">
                <p className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-3">Kết quả phân tích FESEM</p>
                <p className="font-headline text-5xl md:text-6xl font-black text-slate-900 leading-none mb-2">15-30<span className="text-emerald-500 text-4xl md:text-5xl">×</span></p>
                <p className="text-slate-700 font-semibold text-base mb-1">Tăng độ bám dính Zirconia</p>
                <p className="text-slate-600 text-sm md:text-base font-medium">So với bề mặt chưa qua xử lý vi chốt · Viện KH Vật liệu, 12/2023</p>
              </div>
              {/* CTA card */}
              <div className="rounded-2xl bg-gradient-to-br from-primary/8 to-blue-50 border border-primary/15 px-7 py-6 flex flex-col gap-5">
                <div>
                  <p className="font-headline text-xl md:text-2xl font-extrabold text-slate-900 leading-snug mb-3">
                    Tất cả sẽ được giải mã trong 2 tiếng Webinar 10/04
                  </p>
                  <p className="text-slate-700 text-base md:text-lg font-medium leading-relaxed">
                    Công nghệ xử lý vi chốt độc quyền, quy trình lâm sàng và bài toán kinh doanh: bác sĩ sẽ ra về với đủ thứ để triển khai ngay.
                  </p>
                </div>
                <button
                  className="bg-primary hover:bg-primary-light text-white px-7 py-3.5 rounded-full font-bold text-sm md:text-base transition-all shadow-lg shadow-primary/30 active:scale-95 w-fit cursor-pointer"
                  onClick={() => document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Đăng ký tham gia miễn phí →
                </button>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Zirconia Lightbox */}
        {zirconiaLightbox !== null && (
          <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setZirconiaLightbox(null)}
          >
            <button onClick={() => setZirconiaLightbox(null)} className="absolute top-4 right-4 text-white text-2xl font-bold w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full">✕</button>
            <button
              onClick={(e) => { e.stopPropagation(); setZirconiaLightbox(zirconiaLightbox === 0 ? 1 : 0); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-3xl font-bold w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-full"
            >‹</button>
            <img
              src={zirconiaLightbox === 0 ? '/images/zirconia-before.png' : '/images/zirconia-after.png'}
              alt={zirconiaLightbox === 0 ? 'Zirconia chưa tạo nhám' : 'Zirconia đã tạo nhám'}
              className="max-w-4xl w-full max-h-[85vh] object-contain rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={(e) => { e.stopPropagation(); setZirconiaLightbox(zirconiaLightbox === 0 ? 1 : 0); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-3xl font-bold w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-full"
            >›</button>
            <p className="absolute bottom-6 text-white/60 text-sm">
              {zirconiaLightbox === 0 ? 'Chưa xử lý' : 'Đã tạo nhám SmartVeneer'} · {zirconiaLightbox + 1}/2
            </p>
          </div>
        )}
      </section>

      {/* SECTION 9B: SMARTVENEER COMPARISON TABLE */}
      <section className="py-10 md:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Mobile card view */}
          {(() => {
            const rows = [
              { feature: 'Tiêm tê', sv: 'Có thể tiêm tê trong một số trường hợp chỉ định', veneer: 'Cần tiêm tê', crown: 'Cần tiêm tê nhiều để giảm đau' },
              { feature: 'Xâm lấn mô răng', sv: 'Rất ít, chỉ làm sạch nhẹ bề mặt men', veneer: 'Mài mặt ngoài hoặc bán phần', crown: 'Mài toàn phần, đến sát tuỷ răng' },
              { feature: 'Thời gian thực hiện', sv: '2 lần hẹn · tổng 2–3 tiếng', veneer: '3–5 lần hẹn · tổng 7–8 tiếng', crown: 'Nhiều lần hẹn · tổng 7–8 tiếng' },
              { feature: 'Độ bám dính', sv: 'Sáng kiến kỹ thuật vi chốt cơ học: tăng diện tích tiếp xúc, bám dính gấp 15–30 lần so với chưa tạo mặt rỗ', veneer: 'Không có kỹ thuật vi chốt', crown: 'Mài + keo dán' },
              { feature: 'Ảnh hưởng nướu', sv: 'Zirconia tích hợp sinh học, kháng vi khuẩn', veneer: 'Có thể kích ứng nếu không chăm sóc kỹ', crown: 'Dễ viêm lợi, hôi miệng do tổn thương viền nướu' },
              { feature: 'Bảo tồn khớp cắn', sv: 'Tôn trọng và bảo tồn khớp cắn nguyên thuỷ', veneer: 'Có thể sai lệch do mài mặt ngoài', crown: 'Dễ biến đổi khớp cắn do mài toàn phần' },
              { feature: 'Độ cản màu', sv: 'Màu sắc tự nhiên, trong trẻo, độ cản màu xuất sắc', veneer: 'Phụ thuộc vào màu của cùi răng', crown: 'Độ cản màu cao nhưng xâm lấn nhiều mô răng' },
              { feature: 'Mức độ chịu lực', sv: 'Rất cao, Zirconia có độ cứng 900–1250 MPa', veneer: 'Trung bình, 350–400 MPa', crown: 'Tuỳ loại sứ: Zirconia đắp sứ chịu lực bề mặt 250–350 MPa' },
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
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Veneer truyền thống</p>
                          <p className="text-sm text-slate-700 leading-snug">{row.veneer}</p>
                        </div>
                        <div className="px-3 py-3">
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Chụp / Bọc răng sứ</p>
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

      {/* SECTION 7: BEFORE / AFTER */}
      <section className="py-10 md:py-20 bg-white" id="cases">
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
        </div>
      </section>

      {/* SECTION 6: EXPERT PROOF */}
      <section className="py-10 md:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-8 md:mb-16 text-center">
            Công nghệ SmartVeneer được bác sĩ và phòng khám tin dùng
          </h2>
          <VideoGallery />
        </div>
      </section>

      {/* SECTION 8: REVIEW KHÁCH HÀNG */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-10 md:mb-14">
            <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900">
              Khách nói gì sau điều trị?
            </h2>
          </div>
          <PortraitVideoGallery />
          <div className="mt-10 md:mt-14 max-w-4xl mx-auto">
            <motion.div
              className="relative rounded-3xl bg-gradient-to-br from-[#050d1f] via-[#0a1a3a] to-[#050d1f] border border-primary/40 px-8 md:px-14 py-10 md:py-14 text-center overflow-hidden shadow-2xl shadow-primary/20"
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Top shimmer line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
              {/* Bottom shimmer line */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent-sky/60 to-transparent" />
              {/* Glow center */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-primary/20 blur-[80px] rounded-full pointer-events-none" />
              {/* Sparkle dots */}
              <div className="absolute top-6 left-8 w-2 h-2 rounded-full bg-accent-sky/60 animate-ping" style={{animationDuration:'2s'}} />
              <div className="absolute top-10 right-12 w-1.5 h-1.5 rounded-full bg-primary/80 animate-ping" style={{animationDuration:'2.5s',animationDelay:'0.5s'}} />
              <div className="absolute bottom-8 left-16 w-1.5 h-1.5 rounded-full bg-accent-sky/50 animate-ping" style={{animationDuration:'3s',animationDelay:'1s'}} />
              <div className="absolute bottom-6 right-10 w-2 h-2 rounded-full bg-primary/60 animate-ping" style={{animationDuration:'2.2s',animationDelay:'0.3s'}} />
              {/* Label */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white font-bold text-xs uppercase tracking-widest mb-6 relative z-10">
                <svg className="w-3.5 h-3.5 text-accent-sky" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
                Kết luận
              </div>
              <p className="font-headline text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-snug mb-6 relative z-10">
                Khi trải nghiệm đủ tốt, khách hàng không chỉ hài lòng mà còn chủ động giới thiệu đến những người xung quanh
              </p>
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent-sky/15 border border-accent-sky/40 relative z-10">
                <svg className="w-4 h-4 text-accent-sky shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                <p className="text-accent-sky font-bold text-base md:text-lg">Giúp phòng khám giảm phụ thuộc vào quảng cáo</p>
              </div>
            </motion.div>
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
                  { value: '06', label: 'Báo chí lớn đã truyền thông về sản phẩm' },
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

      {/* SECTION 3: SPEAKERS */}
      <section className="py-10 md:py-20 bg-white" id="speakers">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
              Diễn giả đồng hành trong buổi tối 10/04
            </h2>
            <p className="text-slate-500 text-base md:text-lg">Những người trực tiếp phát triển và ứng dụng giải pháp SmartVeneer trong thực tế</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <SpeakerCard
              name="Nhà sáng lập Hệ sinh thái DETEC Vũ Đề"
              roleBullets={["Chủ tịch Hội đồng quản trị DETEC Group", "Nhà sáng chế công nghệ SmartVeneer", "Chuyên gia Công nghệ & Kỹ thuật Lab"]}
              description=""
              image="/images/speaker-vu-de.jpg"
              quote="Sáng chế kỹ thuật vi chốt cơ học, làm rỗ bề mặt vật liệu Zirconia ứng dụng sản xuất miếng dán SmartVeneer, chưa có đơn vị nào triển khai tại Việt Nam."
            />
            <SpeakerCard
              name="Thầy thuốc nhân dân, Tiến sĩ, Bác sĩ Lê Hưng"
              role="Chuyên gia Cao cấp Phục hình Răng bảo tồn"
              description={["Nhà phát triển công nghệ SmartVeneer", "Chủ tịch Hội đồng chuyên môn DETEC", "Giám đốc chuyên môn Nha khoa Dr. Lê Hưng & Cộng sự", "Nguyên Giám đốc Bệnh viện Đa khoa Đống Đa"]}
              image="/images/speaker-le-hung.jpg"
              quote="Đóng góp chuyên môn, nghiên cứu phát triển công nghệ dán răng bảo tồn SmartVeneer và là một trong những bác sĩ đầu tiên đã trải nghiệm SmartVeneer trên chính hàm răng của mình."
              objectPositionStyle="35% 15%"
            />
            <SpeakerCard
              name="Bà Trần Khánh Chi"
              role="Giám đốc vận hành nha khoa Dentisan"
              description="Người trực tiếp vận hành mô hình SmartVeneer thực chiến tại phòng khám."
              image="/images/speaker-khanh-chi.jpg"
              quote="Số liệu thật, từ phòng khám đang chạy."
            />
            <SpeakerCard
              name="Bác sĩ Vương Tiến Thịnh"
              role="Bác sĩ thực chiến lâm sàng"
              description="Bác sĩ đang triển khai SmartVeneer tại phòng khám. Chia sẻ từ ca đầu tiên đến quy trình chuẩn hóa."
              image="/images/speaker-vuong-tin-thinh.jpg"
              quote="Không lý thuyết. Đây là những gì tôi làm thật, sai thật, và rút ra được sau mỗi ca."
            />
          </div>
        </div>
      </section>

      {/* SECTION 4: AGENDA */}
      <section className="py-10 md:py-20 bg-background-dark text-white" id="agenda">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="text-center mb-10 md:mb-20">
            <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 bg-gradient-to-r from-white via-[#eaca8b] to-white bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(234,202,139,0.5)]">
              Lộ trình 2 tiếng, không có phần nào thừa
            </h2>
            <p className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm text-white/80 text-base font-medium px-5 py-2.5 rounded-full mt-2">
              📧 Zoom link gửi qua email trước 18:00 ngày 10/04
            </p>
          </div>
          <div className="space-y-4">
            <AgendaItem index={0} time="19:55–20:10" title="Đón tiếp & kết nối" description="Chuẩn bị kỹ thuật và giao lưu đầu giờ." />
            <AgendaItem index={1} time="20:10–20:15" title="Khai mạc" description="Host chương trình dẫn dắt." />
            <AgendaItem index={2} time="20:15–20:40" title="Thị trường đang phân hóa: Phòng khám nào hành động trước sẽ dẫn đầu" description="Chuyên gia Vũ Đề chia sẻ tầm nhìn chiến lược." />
            <AgendaItem index={3} time="20:40–21:10" title="SmartVeneer: Từ vật liệu đến lâm sàng" description="Thầy thuốc nhân dân, Tiến sĩ, Bác sĩ Lê Hưng đi sâu vào chuyên môn." />
            <AgendaItem index={4} time="21:10–21:25" title="Bài toán kinh tế của 1 ca SmartVeneer tại phòng khám" description="Bà Trần Khánh Chi phân tích con số thực tế." highlight />
            <AgendaItem index={5} time="21:25–21:40" title="Thực chiến từ phòng khám đã triển khai" description="Bác sĩ Vương Tiến Thịnh chia sẻ kinh nghiệm thực tế." highlight />
            <AgendaItem index={6} time="21:40–21:45" title="Hệ sinh thái đồng hành DETEC" description="Chuyên gia Vũ Đề giới thiệu các giải pháp hỗ trợ." />
            <AgendaItem index={7} time="21:45–22:00" title="Hỏi đáp trực tiếp + Quà ưu đãi đặc biệt dành riêng người tham dự live" description="Host chương trình điều phối phần thảo luận và công bố quà tặng." gold />
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

      {/* SECTION: SOCIAL PROOF CLINICS */}
      <section className="py-16 md:py-24 bg-white overflow-hidden">
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
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/25 text-primary font-bold text-sm md:text-base mt-1">
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 16 16" fill="none"><path d="M2 8l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Ai đi trước, người đó giữ được khách hàng
            </div>
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

          <p className="text-center text-primary font-semibold text-base md:text-lg mb-12">và rất nhiều phòng khám trên toàn quốc...</p>

          {/* FOMO CTA */}
          <motion.div
            className="bg-slate-900 rounded-[28px] px-8 py-10 md:px-14 md:py-12 text-center max-w-3xl mx-auto relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-primary/20 blur-3xl rounded-full pointer-events-none" />
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent-sky to-primary text-white font-black text-xs uppercase tracking-wide mb-5 shadow-[0_0_20px_rgba(56,189,248,0.3)] border border-white/20 relative z-10">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              Cơ hội của bạn
            </div>
            <p className="font-headline text-2xl md:text-3xl font-extrabold text-white leading-snug mb-3 relative z-10">
              Webinar ngày 10/04 là cơ hội để bạn<br className="hidden md:block" /> không nằm ngoài cuộc chơi
            </p>
            <p className="text-slate-200 text-base md:text-lg mb-8 relative z-10">Những phòng khám trên đã đi trước. <span className="text-red-400 font-semibold">Slot còn lại có hạn.</span></p>
            <button
              className="relative z-10 bg-primary hover:bg-primary-light text-white px-10 py-4 rounded-full font-bold text-base md:text-lg transition-all shadow-xl shadow-primary/30 active:scale-95 cursor-pointer"
              onClick={() => document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Đăng ký ngay để không bỏ lỡ →
            </button>
          </motion.div>

        </div>
      </section>

      {/* SECTION: DETEC ECOSYSTEM */}
      <section className="py-16 md:py-24 bg-slate-950 overflow-hidden relative" id="ecosystem">
        <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-primary/8 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">

          <motion.div
            className="mb-12 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent-sky to-primary text-white font-black text-xs uppercase tracking-wide mb-6 shadow-[0_0_20px_rgba(56,189,248,0.3)] border border-white/20">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              Hệ sinh thái DETEC
            </div>
            <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight max-w-3xl mb-3">
              Giải pháp đồng hành toàn diện từ DETEC
            </h2>
            <p className="text-slate-300 text-base md:text-lg italic">
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
                title: 'Được hướng dẫn kỹ thuật bài bản qua video và case lâm sàng thực tế',
                sub: 'Không phải tự thử sai',
                accent: 'blue',
              },
              {
                label: 'Sản phẩm sẵn sàng ứng dụng',
                icon: (
                  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                    <rect x="3" y="3" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.8"/>
                    <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
                title: 'Sản phẩm đã được xử lý theo công nghệ SmartVeneer, giao tận nơi',
                sub: 'Bác sĩ tập trung điều trị, không lo vật liệu',
                accent: 'blue',
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
                accent: 'blue',
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
                accent: 'blue',
              },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-[24px] bg-white/5 border border-white/10 px-7 py-7 relative overflow-hidden group hover:border-primary/30 hover:bg-white/[0.07] transition-all"
              >
                <div className="absolute top-0 right-0 w-28 h-28 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
                <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary-light mb-5">
                  {item.icon}
                </div>
                <div className="inline-flex items-center bg-primary/20 text-accent-sky text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full mb-3 border border-primary/20">{item.label}</div>
                <p className="text-white font-semibold text-base md:text-lg leading-snug mb-3">{item.title}</p>
                <p className="text-accent-sky text-sm md:text-base font-bold flex items-center gap-2">
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
              className="bg-primary hover:bg-primary-light text-white px-10 py-4 rounded-full font-bold text-base md:text-lg transition-all shadow-xl shadow-primary/30 active:scale-95 cursor-pointer"
              onClick={() => document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Tìm hiểu ngay cách triển khai →
            </button>
          </motion.div>

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
