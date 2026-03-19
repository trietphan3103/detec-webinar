/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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
    { label: 'Chuyên gia', href: '#speakers' },
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
      <div className="flex items-center justify-between px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Logo className="w-10 h-10" />
          <div className={`text-2xl font-bold tracking-tight ${isScrolled ? 'text-slate-900' : 'text-white'}`}>DETEC ACADEMY</div>
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
            className="bg-primary hover:bg-primary-light text-white px-7 py-2.5 rounded-full text-base font-bold transition-all shadow-lg shadow-primary/20 active:scale-95"
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
    <div className="flex flex-wrap gap-4 mb-12">
      {[
        { label: 'Ngày', value: timeLeft.days },
        { label: 'Giờ', value: timeLeft.hours },
        { label: 'Phút', value: timeLeft.minutes },
        { label: 'Giây', value: timeLeft.seconds }
      ].map((item) => (
        <div key={item.label} className="glass-card px-6 py-4 rounded-xl min-w-[100px] text-center">
          <span className="block text-4xl font-bold text-white">{String(item.value).padStart(2, '0')}</span>
          <span className="text-xs uppercase tracking-widest text-primary-light font-bold mt-1 block">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

const SpeakerCard = ({ name, role, description, image }: { name: string, role: string, description: string, image: string }) => {
  const items = description.split(' · ').map(item => item.trim().replace(/^"|"$/g, ''));
  const isList = items.length > 1;

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)]"
    >
      <div className="aspect-square rounded-xl overflow-hidden mb-8 shrink-0">
        <img src={image} alt={name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-1">{name}</h3>
      <p className="text-base text-primary font-semibold mb-4">{role}</p>
      
      <div className="flex-grow">
        {isList ? (
          <ul className="space-y-3 mb-6">
            {items.map((item, idx) => (
              <li key={idx} className="flex gap-3 text-slate-600 text-base leading-relaxed group/item">
                <div className="mt-1 shrink-0">
                  <CheckCircle className="w-4 h-4 text-primary" />
                </div>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-500 text-base leading-relaxed mb-6">"{description}"</p>
        )}
      </div>

    </motion.div>
  );
};

const caseImages = [
  { src: '/images/case-1.png', label: 'Ca lâm sàng #1' },
  { src: '/images/case-2.png', label: 'Ca lâm sàng #2' },
  { src: '/images/case-3.png', label: 'Ca lâm sàng #3' },
  { src: '/images/case-4.png', label: 'Ca lâm sàng #4' },
  { src: '/images/case-5.png', label: 'Ca lâm sàng #5' },
  { src: '/images/case-6.png', label: 'Ca lâm sàng #6' },
];

const Lightbox = ({ index, onClose, onPrev, onNext }: { index: number, onClose: () => void, onPrev: () => void, onNext: () => void }) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-4 right-4 text-white text-3xl font-bold w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full">✕</button>
      <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="absolute left-4 text-white text-3xl font-bold w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-full">‹</button>
      <motion.img
        key={index}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        src={caseImages[index].src}
        alt={caseImages[index].label}
        className="max-w-4xl w-full max-h-[85vh] object-contain rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      />
      <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="absolute right-4 text-white text-3xl font-bold w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-full">›</button>
      <p className="absolute bottom-6 text-white/60 text-sm">{caseImages[index].label} · {index + 1}/{caseImages.length}</p>
    </motion.div>
  </AnimatePresence>
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
    <span className={`font-headline font-black text-2xl md:w-40 shrink-0 relative`} style={{ color: gold ? '#eaca8b' : highlight ? '#396ecd' : '#8acdff' }}>{time}</span>
    <div className="relative">
      <h4 className={`font-bold mb-1.5 relative ${gold ? 'text-2xl' : highlight ? 'text-xl text-white' : 'text-lg text-white/90'}`} style={gold ? { color: '#eaca8b' } : {}}>{title}</h4>
      <p className={`text-base leading-relaxed relative ${highlight ? 'text-blue-200' : 'text-slate-400'}`} style={gold ? { color: 'rgba(234,202,139,0.7)' } : {}}>{description}</p>
    </div>
  </motion.div>
);

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
        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full relative z-10 grid grid-cols-12 gap-8 md:gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="col-span-12 lg:col-span-7"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-accent-sky to-primary text-white font-black text-xs md:text-sm tracking-wider uppercase mb-8 shadow-[0_0_30px_rgba(56,189,248,0.3)] border border-white/20 max-w-full">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
              </span>
              <span className="truncate">THE PIONEER 02 | Can Thiệp Tối Thiểu, Hiệu Quả Tối Đa</span>
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
                <p className="text-lg md:text-2xl font-bold bling-text leading-tight">
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
              className="bg-primary hover:bg-primary-light text-white px-10 py-5 rounded-full font-bold text-lg transition-all shadow-xl shadow-primary/30 active:scale-95 flex items-center gap-2 w-fit"
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
                src="/images/banner-event.jpg"
              />
            </div>
            <div className="hidden sm:block absolute -bottom-10 -left-10 w-40 h-40 rounded-3xl border-4 border-background-dark overflow-hidden shadow-2xl">
              <img
                alt="Training Session"
                className="w-full h-full object-cover"
                src="/images/banner-training.jpg"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 1: PAIN HOOK */}
      <section className="py-16 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-12 gap-8 lg:gap-16 items-center">
            <div className="col-span-12 lg:col-span-6">
              <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-slate-900 mb-8 leading-tight">
                Bệnh nhân đang hỏi bạn câu này ngày càng nhiều hơn:
              </h2>
              <div className="bg-slate-50 p-8 rounded-2xl border-l-4 border-primary mb-10">
                <p className="text-2xl font-bold text-slate-800 italic">
                  "Bác sĩ ơi, có cách nào làm răng đẹp mà không cần mài không?"
                </p>
              </div>
              <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-6">
                Đây không phải yêu cầu khó. Đây là tín hiệu thị trường.
              </p>
              <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-10">
                Phân khúc khách hàng cao cấp đang dịch chuyển — <span className="font-bold text-slate-900 bg-primary/10 px-1 py-0.5 rounded">họ muốn kết quả thẩm mỹ tối đa nhưng can thiệp tối thiểu</span>. Những phòng khám nắm được điều này trước đang định vị lại toàn bộ dịch vụ của mình.
              </p>
              <p className="text-red-600 font-black text-xl md:text-2xl uppercase tracking-tight">
                Câu hỏi là: phòng khám của bạn đang ở đâu trong bức tranh đó?
              </p>
            </div>
            <div className="col-span-12 lg:col-span-6">
              <div className="relative p-3 bg-slate-100 rounded-[40px] overflow-hidden">
                <img 
                  alt="Dental market" 
                  className="w-full h-[500px] object-cover rounded-[32px]" 
                  src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: PROMISE */}
      <section className="py-16 md:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-12 gap-8 lg:gap-16 items-center">
            <div className="col-span-12 lg:col-span-5">
              <h2 className="font-headline text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
                Trong 2 tiếng tối 03/04, bạn sẽ nắm được:
              </h2>
                <div className="space-y-0 border-t border-slate-200">
                  {[
                    { id: '01', title: 'Mài hay không mài?', desc: 'Ranh giới giữa bảo tồn và xâm lấn trong phục hình sứ.' },
                    { id: '02', title: 'SmartVeneer - Giải pháp "may đo"', desc: 'Cho từng ca lâm sàng: Từ thiết kế đến vật liệu.' },
                    { id: '03', title: 'Tối ưu hóa quy trình & Bài toán kinh tế', desc: 'Cách vận hành hiệu quả cho phòng khám.', highlight: true }
                  ].map((item) => (
                    <div 
                      key={item.id} 
                      className={`group py-4 border-b border-slate-200 transition-all duration-300 ${
                        item.highlight ? 'bg-primary/5 -mx-4 px-6 rounded-3xl border-none my-3 shadow-xl ring-2 ring-primary/20 scale-105 z-10 relative' : ''
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
              <button className="mt-12 bg-primary hover:bg-primary-light text-white px-10 py-5 rounded-full font-bold text-lg transition-all shadow-xl shadow-primary/30 active:scale-95">
                Giữ chỗ của tôi →
              </button>
            </div>
            <div className="col-span-12 lg:col-span-7">
              <div className="relative">
                <div className="rounded-[28px] overflow-hidden aspect-video shadow-2xl shadow-slate-200/50">
                  <img
                    alt="SmartVeneer Product"
                    className="w-full h-full object-cover"
                    src="/images/smartveneer-product.jpg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: SPEAKERS */}
      <section className="py-16 md:py-32 bg-white" id="speakers">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="font-headline text-4xl font-extrabold text-slate-900 mb-16 text-center">
            5 người sẽ đồng hành cùng bạn tối 03/04
          </h2>
          <div className="flex flex-wrap justify-center gap-8">
            <SpeakerCard
              name="Chuyên Gia Vũ Đề"
              role="Sáng lập DETEC Dental Lab"
              description="30 năm ngành labo · Thành viên Hiệp hội Labo Nha khoa Quốc gia Hoa Kỳ (NADL) — tổ chức nghề nghiệp lớn nhất ngành labo nha khoa tại Mỹ · Tác giả sáng chế vi chốt cơ học Zirconia độc quyền"
              image="/images/speaker-vu-de.jpg"
            />
            <SpeakerCard 
              name="Thầy Thuốc Nhân Dân, Tiến Sĩ, Bác Sĩ Lê Hưng"
              role="Tiến sĩ Y học"
              description="Tốt nghiệp Răng Hàm Mặt 1991 · Tiến sĩ 2003 · Thầy thuốc Nhân dân 2017 · Đào tạo tại Baltimore Dental School, Hàn Quốc, Nhật Bản"
              image="/images/speaker-le-hung.jpg"
            />
            <SpeakerCard
              name="Chị Khánh Chi"
              role="Giám đốc Dentisan Lab"
              description="Người trực tiếp vận hành mô hình SmartVeneer: 10 ca/tháng, lợi nhuận 780 triệu/tháng"
              image="/images/speaker-khanh-chi.jpg"
            />
            <SpeakerCard
              name="BS Vương Tiến Thịnh"
              role="Bác sĩ thực chiến lâm sàng"
              description="Bác sĩ đang triển khai SmartVeneer tại phòng khám · Chia sẻ từ ca đầu tiên đến quy trình chuẩn hóa"
              image="/images/speaker-vuong-tin-thinh.jpg"
            />
            <SpeakerCard
              name="MC Duy Nguyễn"
              role="Founder & CEO Next Step Group"
              description="Dẫn dắt toàn bộ chương trình"
              image="/images/speaker-duy-nguyen.jpg"
            />
          </div>
        </div>
      </section>

      {/* SECTION 4: AGENDA */}
      <section className="py-16 md:py-32 bg-background-dark text-white" id="agenda">
        <div className="max-w-4xl mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="font-headline text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-white via-[#eaca8b] to-white bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(234,202,139,0.5)]">
              Lộ trình 2 tiếng — không có phần nào thừa
            </h2>
            <p className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm text-white/80 text-base font-medium px-5 py-2.5 rounded-full mt-2">
              📧 Zoom link gửi qua email trước 18:00 ngày 03/04
            </p>
          </div>
          <div className="space-y-4">
            <AgendaItem index={0} time="19:55–20:10" title="Đón tiếp & kết nối" description="Chuẩn bị kỹ thuật và giao lưu đầu giờ." />
            <AgendaItem index={1} time="20:10–20:15" title="Khai mạc" description="MC Duy Nguyễn dẫn dắt chương trình." />
            <AgendaItem index={2} time="20:15–20:40" title="Thị trường đang phân hóa — Phòng khám nào hành động trước sẽ dẫn đầu" description="Chuyên Gia Vũ Đề chia sẻ tầm nhìn chiến lược." />
            <AgendaItem index={3} time="20:40–21:10" title="SmartVeneer — Từ vật liệu đến lâm sàng" description="Tiến Sĩ, Bác Sĩ Lê Hưng đi sâu vào chuyên môn." />
            <AgendaItem index={4} time="21:10–21:25" title="Bài toán kinh tế của 1 ca SmartVeneer tại phòng khám" description="Chị Khánh Chi phân tích con số thực tế." highlight />
            <AgendaItem index={5} time="21:25–21:40" title="Thực chiến từ phòng khám đã triển khai" description="Bác Sĩ Vương Tiến Thịnh chia sẻ kinh nghiệm thực tế." highlight />
            <AgendaItem index={6} time="21:40–21:45" title="Hệ sinh thái đồng hành DETEC" description="Chuyên Gia Vũ Đề giới thiệu các giải pháp hỗ trợ." />
            <AgendaItem index={7} time="21:45–22:00" title="Hỏi đáp trực tiếp + Quà ưu đãi đặc biệt dành riêng người tham dự live" description="MC Duy Nguyễn điều phối phần thảo luận và công bố quà tặng." gold />
          </div>
          <div className="mt-16 flex justify-center">
            <button
              className="bg-primary hover:bg-primary-light text-white px-10 py-5 rounded-full font-bold text-lg transition-all shadow-xl shadow-primary/30 active:scale-95"
              onClick={() => document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Đăng ký tham dự →
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 5: SOCIAL PROOF */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-950 to-primary-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-sky rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { value: '1.000+', label: 'Ca SmartVeneer đã thực hiện', icon: '🦷' },
              { value: '100+', label: 'Phòng khám đang triển khai', icon: '🏥' },
              { value: '5+ năm', label: 'Nghiên cứu và phát triển', icon: '🔬' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative bg-white/5 border border-white/10 backdrop-blur-sm rounded-3xl p-8 text-center group hover:bg-white/10 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{stat.icon}</div>
                <span className="block text-5xl md:text-6xl font-black mb-3 bg-gradient-to-r from-white via-[#8acdff] to-white bg-clip-text text-transparent">
                  {stat.value}
                </span>
                <span className="text-sm md:text-base font-bold text-white/50 uppercase tracking-widest leading-tight">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: EXPERT PROOF */}
      <section className="py-16 md:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="font-headline text-4xl font-extrabold text-slate-900 mb-16 text-center">
            Chuyên gia và bác sĩ nói gì về SmartVeneer?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="relative aspect-video rounded-2xl overflow-hidden shadow-lg">
                <iframe
                  src="https://www.youtube.com/embed/YFYK5mZlf-E"
                  title={`Expert Video ${i}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: BEFORE / AFTER */}
      <section className="py-16 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="font-headline text-4xl font-extrabold text-slate-900 mb-16 text-center">
            Kết quả thực tế từ phòng khám đang triển khai
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { src: '/images/case-1.png', label: 'Ca lâm sàng #1' },
              { src: '/images/case-2.png', label: 'Ca lâm sàng #2' },
              { src: '/images/case-3.png', label: 'Ca lâm sàng #3' },
              { src: '/images/case-4.png', label: 'Ca lâm sàng #4' },
              { src: '/images/case-5.png', label: 'Ca lâm sàng #5' },
              { src: '/images/case-6.png', label: 'Ca lâm sàng #6' },
            ].map((item, i) => (
              <div
                key={item.label}
                className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group relative"
                onClick={() => setLightboxIndex(i)}
              >
                <img src={item.src} alt={item.label} className="w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-slate-800 text-sm font-bold px-4 py-2 rounded-full">Xem ảnh</span>
                </div>
              </div>
            ))}
            {lightboxIndex !== null && (
              <Lightbox
                index={lightboxIndex}
                onClose={() => setLightboxIndex(null)}
                onPrev={() => setLightboxIndex((lightboxIndex - 1 + 6) % 6)}
                onNext={() => setLightboxIndex((lightboxIndex + 1) % 6)}
              />
            )}
          </div>
        </div>
      </section>

      {/* SECTION 8: REVIEW KHÁCH HÀNG */}
      <section className="py-16 md:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="font-headline text-4xl font-extrabold text-slate-900 mb-16 text-center">
            Nụ cười đẹp sau 2 lần gặp gỡ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="relative aspect-video rounded-2xl overflow-hidden shadow-lg">
                <iframe
                  src="https://www.youtube.com/embed/YFYK5mZlf-E"
                  title={`Review Video ${i}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9: SMARTVENEER LÀ GÌ? */}
      <section className="py-16 md:py-32 bg-gradient-to-br from-slate-950 via-primary-dark to-primary" id="technology">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-12 gap-8 lg:gap-16 items-center">
            <div className="col-span-12 lg:col-span-6">
              <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs font-bold px-4 py-2 rounded-full mb-6 border border-white/20 backdrop-blur-sm">
                ✦ Công nghệ độc quyền
              </div>
              <h2 className="font-headline text-5xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-white via-[#8acdff] to-white bg-clip-text text-transparent">
                SMARTVENEER<br/>LÀ GÌ?
              </h2>
              <p className="text-white/70 text-xl leading-relaxed mb-10">
                Công nghệ dán răng bảo tồn, khôi phục hình thể, màu sắc và chức năng của hàm răng. <span className="text-white font-semibold">Bảo tồn tối đa răng thật.</span>
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: '🎨', label: 'Cản màu xuất sắc' },
                  { icon: '💎', label: 'Bền chắc dài lâu' },
                  { icon: '🛡️', label: 'An toàn vượt trội' },
                  { icon: '✨', label: 'Thẩm mỹ tự nhiên' },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-5 py-4">
                    <span className="text-2xl">{item.icon}</span>
                    <p className="text-white font-bold text-base">{item.label}</p>
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

      {/* SECTION 10: EXCLUSIVE GIFT */}
      <section className="py-16 md:py-32 bg-accent-beige relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 mix-blend-overlay">
          <img 
            alt="Pattern" 
            className="w-full h-full object-cover" 
            src="https://images.unsplash.com/photo-1557683311-eac922347aa1?auto=format&fit=crop&q=80&w=1200"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="max-w-5xl mx-auto px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-white/40 backdrop-blur-xl p-16 rounded-[40px] text-center shadow-2xl shadow-slate-900/10 border border-white/20"
          >
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
              <Star className="text-white w-10 h-10 fill-current" />
            </div>
            <h2 className="font-headline text-4xl font-extrabold text-slate-900 mb-6">🎁 Quà ưu đãi đặc biệt dành cho người tham dự</h2>
            <p className="text-slate-800 text-xl font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
              Ngoài nội dung chuyên môn, người tham gia live sẽ nhận được quà tặng độc quyền từ DETEC — công bố ngay trong buổi tối.
            </p>
            <div className="bg-slate-900/10 p-6 rounded-2xl mb-10">
              <p className="text-slate-900 font-bold text-lg">
                Trong đó có <span className="text-primary text-2xl">50 phần quà đặc biệt</span> dành riêng cho bác sĩ đăng ký sớm nhất.
              </p>
            </div>
            <button
              className="bg-slate-900 hover:bg-slate-800 text-white px-10 py-5 rounded-full font-bold text-lg transition-all shadow-xl active:scale-95"
              onClick={() => document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Đăng ký ngay để không bỏ lỡ →
            </button>
          </motion.div>
        </div>
      </section>

      {/* SECTION 11: FORM ĐĂNG KÝ */}
      <section className="py-16 md:py-32 bg-white" id="registration">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-12 gap-8 lg:gap-16 items-center">
          <div className="col-span-12 lg:col-span-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-bold px-4 py-2 rounded-full mb-6">
              🎓 Webinar chuyên môn · Miễn phí 100%
            </div>
            <h2 className="font-headline text-5xl font-extrabold text-slate-900 leading-tight mb-6">
              Giữ chỗ ngay —<br/>
              <span className="text-primary">trước khi hết slot</span>
            </h2>
            <p className="text-slate-600 text-xl leading-relaxed mb-10">
              Chỉ 1 buổi tối, bạn sẽ hiểu rõ SmartVeneer từ lâm sàng đến kinh doanh — từ những chuyên gia đang triển khai thực tế.
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
            <div className="flex gap-10 p-8 bg-primary/5 rounded-3xl border border-primary/10">
              {[
                { label: 'Ngày', value: '03/04' },
                { label: 'Giờ bắt đầu', value: '20:00' },
                { label: 'Nền tảng', value: 'Zoom' }
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <span className="block text-2xl font-black text-primary">{stat.value}</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 mt-1 block">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-12 lg:col-span-6">
            <div className="bg-white p-12 rounded-[40px] shadow-2xl shadow-primary/10 border border-slate-100">
              <h3 className="text-2xl font-bold text-slate-900 mb-8">Đăng ký tham gia webinar</h3>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <input 
                    className="w-full bg-slate-50 border border-slate-100 rounded-full px-6 py-4 text-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
                    placeholder="Họ và tên *" 
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                  <input 
                    className="w-full bg-slate-50 border border-slate-100 rounded-full px-6 py-4 text-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
                    placeholder="Số điện thoại *" 
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <input
                  className="w-full bg-slate-50 border border-slate-100 rounded-full px-6 py-4 text-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Email *"
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
                <input
                  className="w-full bg-slate-50 border border-slate-100 rounded-full px-6 py-4 text-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Tên phòng khám / cơ sở *"
                  type="text"
                  required
                  value={formData.clinic}
                  onChange={e => setFormData({...formData, clinic: e.target.value})}
                />
                <input 
                  className="w-full bg-slate-50 border border-slate-100 rounded-full px-6 py-4 text-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
                  placeholder="Tỉnh / Thành phố *" 
                  type="text"
                  required
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                />
                <button 
                  className="w-full bg-primary hover:bg-primary-light text-white font-bold py-5 rounded-full text-xl transition-all shadow-xl shadow-primary/30 mt-4 active:scale-95" 
                  type="submit"
                >
                  Đăng ký tham gia webinar
                </button>
                <p className="text-center text-[10px] text-slate-400 font-medium">
                  Thông tin của bạn được bảo mật theo tiêu chuẩn HIPAA & GDPR.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 py-12 px-8 border-t border-slate-200/20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-7xl mx-auto">
          <div>
            <div className="text-xl font-bold text-slate-800 mb-4">DETEC ACADEMY</div>
            <p className="text-slate-500 text-base leading-relaxed">
              Tiên phong giải pháp phục hình thẩm mỹ bảo tồn tại Việt Nam. Một sáng tạo bởi DETEC Dental Lab.
            </p>
          </div>
          <div>
            <h5 className="text-slate-800 font-bold mb-4 uppercase text-sm tracking-widest">Liên hệ</h5>
            <p className="text-slate-500 text-base leading-relaxed">
              605 đường Quang Trung, P. Kiến Hưng, Hà Nội.<br/>
              Email: smartveneer@detec.vn<br/>
              Facebook: fb.com/DanSinhHocSmartVeneer
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-0 pt-8 mt-10 border-t border-slate-200/20 text-center">
          <p className="text-sm text-slate-400">© 2024 DETEC ACADEMY. All rights reserved. Professional use only.</p>
        </div>
      </footer>
    </div>
  );
}
