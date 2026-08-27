import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  X, 
  Clock, 
  Award, 
  BookOpen, 
  GraduationCap, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Volume2, 
  VolumeX,
  RefreshCw,
  Flame,
  User,
  Home,
  Phone,
  Calendar,
  Layers,
  TrendingUp,
  Activity,
  Compass,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Santri } from '../types';
import { 
  INDONESIAN_CITIES, 
  CityLocation, 
  calculatePrayerTimes, 
  formatCountdown 
} from '../services/prayerService';

interface TvDisplayViewProps {
  santriList: Santri[];
  onClose: () => void;
  lastSyncedAt?: string;
  onRefresh?: () => void;
  sheetId?: string;
}

const MOTIVATION_QUOTES = [
  '“خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ” — Sebaik-baik kalian adalah yang mempelajari Al-Qur’an dan mengajarkannya (HR. Bukhari)',
  '“Bacalah Al-Qur’an, karena sesungguhnya ia akan datang pada hari kiamat sebagai pemberi syafa’at bagi para pembacanya.” (HR. Muslim)',
  '“Penghafal Al-Qur’an kelak akan memakaikan mahkota kemuliaan kepada kedua orang tuanya di surga.” (HR. Abu Dawud)',
  '“Sesungguhnya orang yang tidak ada Al-Qur’an sedikit pun dalam hatinya laksana rumah yang runtuh.” (HR. Tirmidzi)',
  '“Setiap huruf dari Al-Qur’an yang dibaca mendatangkan satu kebaikan yang dilipatgandakan sepuluh kali.” (HR. Tirmidzi)'
];

export const TvDisplayView: React.FC<TvDisplayViewProps> = ({
  santriList,
  onClose,
  lastSyncedAt,
  onRefresh,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [intervalDuration, setIntervalDuration] = useState<number>(10); // Default 10 seconds
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  
  // Selected City for Prayer Times
  const [selectedCityId, setSelectedCityId] = useState<string>(() => {
    try {
      return localStorage.getItem('sims_prayer_city') || 'jkt';
    } catch {
      return 'jkt';
    }
  });
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const currentCity = useMemo(() => {
    return INDONESIAN_CITIES.find(c => c.id === selectedCityId) || INDONESIAN_CITIES[0];
  }, [selectedCityId]);

  const prayerData = useMemo(() => {
    return calculatePrayerTimes(currentCity, currentTime);
  }, [currentCity, currentTime]);

  // Filter santri by class if selected
  const activeList = useMemo(() => {
    if (selectedClass === 'all') return santriList;
    return santriList.filter((s) => s.kelas === selectedClass);
  }, [santriList, selectedClass]);

  // Unique classes list for dropdown
  const classOptions = useMemo(() => {
    return Array.from(new Set(santriList.map((s) => s.kelas))).filter(Boolean).sort();
  }, [santriList]);

  // Clamp index if filtered list changes
  useEffect(() => {
    if (currentIndex >= activeList.length && activeList.length > 0) {
      setCurrentIndex(0);
    }
  }, [activeList.length, currentIndex]);

  const currentSantri: Santri | undefined = activeList[currentIndex] || santriList[0];

  // Play subtle beep sound when slide transitions
  const playTransitionChime = useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) audioContextRef.current = new AudioCtx();
      }
      if (audioContextRef.current) {
        const ctx = audioContextRef.current;
        if (ctx.state === 'suspended') ctx.resume();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 note
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5 note
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch {
      // ignore audio errors
    }
  }, [soundEnabled]);

  // Real-time clock update (every 1s)
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // Main 10-second timer loop with smooth 100ms tick for progress bar
  useEffect(() => {
    if (!isPlaying || activeList.length <= 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const tickMs = 100;
    const totalMs = intervalDuration * 1000;
    const stepIncrement = (tickMs / totalMs) * 100;

    timerRef.current = setInterval(() => {
      setProgressPercent((prev) => {
        if (prev >= 100) {
          setCurrentIndex((idx) => {
            const nextIdx = (idx + 1) % activeList.length;
            playTransitionChime();
            return nextIdx;
          });
          return 0;
        }
        return prev + stepIncrement;
      });
    }, tickMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, intervalDuration, activeList.length, playTransitionChime]);

  // Navigation handlers
  const handlePrev = useCallback(() => {
    setProgressPercent(0);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : activeList.length - 1));
    playTransitionChime();
  }, [activeList.length, playTransitionChime]);

  const handleNext = useCallback(() => {
    setProgressPercent(0);
    setCurrentIndex((prev) => (prev + 1) % activeList.length);
    playTransitionChime();
  }, [activeList.length, playTransitionChime]);

  const handleSelectSantri = (index: number) => {
    setProgressPercent(0);
    setCurrentIndex(index);
    playTransitionChime();
  };

  // Keyboard navigation & Fullscreen shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'p' || e.key === 'P') {
        setIsPlaying((p) => !p);
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, onClose]);

  // Fullscreen API toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.warn('Could not enter fullscreen:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch((err) => {
        console.warn('Could not exit fullscreen:', err);
      });
    }
  };

  // Listen to fullscreen changes (e.g. user pressed Esc)
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Format Dates
  const formattedDate = useMemo(() => {
    return currentTime.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }, [currentTime]);

  const formattedTime = useMemo(() => {
    return currentTime.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  }, [currentTime]);

  if (!currentSantri) {
    return null;
  }

  const completionRate = Math.min(100, Math.round((currentSantri.juzSelesai / Math.max(1, currentSantri.targetJuz)) * 100));

  // Status Styling Logic
  const statusColor = 
    currentSantri.status === 'Sangat Baik' 
      ? 'bg-emerald-600 text-white'
      : currentSantri.status === 'Baik'
      ? 'bg-blue-600 text-white'
      : 'bg-amber-600 text-white';

  const statusBadgeBorder = 
    currentSantri.status === 'Sangat Baik' 
      ? 'border-emerald-500/40 text-emerald-400 bg-emerald-950/60'
      : currentSantri.status === 'Baik'
      ? 'border-blue-500/40 text-blue-400 bg-blue-950/60'
      : 'border-amber-500/40 text-amber-400 bg-amber-950/60';

  const glowRingColor =
    currentSantri.status === 'Sangat Baik'
      ? 'ring-emerald-500/50 shadow-emerald-500/20'
      : currentSantri.status === 'Baik'
      ? 'ring-blue-500/50 shadow-blue-500/20'
      : 'ring-amber-500/50 shadow-amber-500/20';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col justify-between overflow-hidden select-none font-sans">
      
      {/* Top TV Header Bar */}
      <header className="bg-slate-900/95 border-b border-slate-800/80 px-4 lg:px-8 py-3 shrink-0 backdrop-blur-md">
        <div className="max-w-[1920px] mx-auto flex items-center justify-between gap-4">
          
          {/* Logo & Pesantren Branding */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-900/40 shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base lg:text-lg font-black tracking-tight text-white">
                  SIMS TAHFIDZ AL-QUR'AN
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] lg:text-xs font-extrabold flex items-center gap-1.5 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  LIVE TV MONITOR
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Papan Informasi & Mutaba'ah Tahfidz Digital Santri
              </p>
            </div>
          </div>

          {/* Center Digital Clock & Prayer Times Strip */}
          <div className="hidden md:flex items-center gap-4 bg-slate-950/90 px-4 py-1.5 rounded-2xl border border-slate-800 shadow-inner">
            <div className="flex flex-col text-left border-r border-slate-800 pr-4">
              <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>{formattedDate}</span>
              </div>
              <span className="text-[11px] text-emerald-400/90 font-medium">
                {prayerData.hijriDate}
              </span>
            </div>

            <div className="flex items-center gap-2 border-r border-slate-800 pr-4">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span className="text-lg font-mono font-black text-white tracking-widest">
                {formattedTime}
              </span>
            </div>

            {/* Next Prayer Countdown in Header */}
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <div className="text-left">
                <div className="text-[10px] text-slate-400">Menuju {prayerData.nextPrayer.name}:</div>
                <div className="font-mono font-bold text-amber-400 text-xs">
                  {prayerData.nextPrayer.time} ({formatCountdown(prayerData.msToNext)})
                </div>
              </div>
            </div>
          </div>

          {/* Right Controls & Quick Actions */}
          <div className="flex items-center gap-2 lg:gap-3">
            
            {/* City Selector for TV Mode */}
            <div className="hidden xl:flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 text-xs">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <select
                value={selectedCityId}
                onChange={(e) => {
                  setSelectedCityId(e.target.value);
                  try {
                    localStorage.setItem('sims_prayer_city', e.target.value);
                  } catch {}
                }}
                className="bg-transparent text-slate-200 font-bold focus:outline-none cursor-pointer text-xs"
              >
                {INDONESIAN_CITIES.map((c) => (
                  <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                    {c.name} ({c.zone})
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Kelas for TV Mode */}
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400 font-medium">Kelas:</span>
              <select
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  setCurrentIndex(0);
                  setProgressPercent(0);
                }}
                className="bg-transparent text-emerald-400 font-bold focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-slate-900 text-white">Semua Kelas ({santriList.length})</option>
                {classOptions.map((k) => (
                  <option key={k} value={k} className="bg-slate-900 text-white">
                    Kelas {k}
                  </option>
                ))}
              </select>
            </div>

            {/* Timer Interval Selector */}
            <div className="hidden lg:flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400 text-[11px] px-1 font-medium">Durasi:</span>
              {[5, 10, 15, 20].map((sec) => (
                <button
                  key={sec}
                  onClick={() => {
                    setIntervalDuration(sec);
                    setProgressPercent(0);
                  }}
                  className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    intervalDuration === sec
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {sec}d
                </button>
              ))}
            </div>

            {/* Play / Pause Toggle with Circular Visual Countdown */}
            <button
              onClick={() => setIsPlaying((p) => !p)}
              className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer ${
                isPlaying 
                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/30' 
                  : 'bg-amber-600/20 text-amber-300 border border-amber-500/40 hover:bg-amber-600/30'
              }`}
              title={isPlaying ? 'Jeda Rotasi Otomatis' : 'Lanjutkan Rotasi Otomatis'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isPlaying ? 'Auto 10d' : 'Dijeda'}</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled((s) => !s)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                soundEnabled 
                  ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/40' 
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
              title={soundEnabled ? 'Matikan Suara Transisi' : 'Aktifkan Suara Transisi'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-slate-950 text-slate-300 hover:text-white border border-slate-800 transition-all cursor-pointer"
              title={isFullscreen ? 'Keluar Layar Penuh' : 'Mode Layar Penuh (TV)'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close / Return to Dashboard */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-rose-600/20 text-rose-300 hover:bg-rose-600/30 border border-rose-500/40 transition-all cursor-pointer"
              title="Kembali ke Dashboard Utama (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 10-Second Progress Line Indicator */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 transition-all ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* Main Showcase Stage Area (Bento Layout tailored for TV Screens) */}
      <main className="flex-1 max-w-[1920px] w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSantri.id}
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.98 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch h-full max-h-[820px]"
          >
            {/* Left Big Spotlight Bento Card (Photo & Essential Profile Badges) */}
            <div className="lg:col-span-4 bg-slate-900/90 rounded-3xl p-6 lg:p-8 border border-slate-800 shadow-2xl flex flex-col justify-between items-center text-center relative overflow-hidden backdrop-blur-md">
              
              {/* Background ambient radial glow */}
              <div className={`absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none ${
                currentSantri.status === 'Sangat Baik' ? 'bg-emerald-500' : 'bg-blue-500'
              }`} />

              {/* Top Meta Badges */}
              <div className="w-full flex items-center justify-between gap-2 z-10">
                <div className="flex items-center gap-2">
                  <span className="px-3.5 py-1 rounded-xl bg-slate-950/80 border border-slate-700/80 font-mono font-extrabold text-emerald-400 text-xs sm:text-sm tracking-wider shadow-sm">
                    {currentSantri.id}
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-slate-950/80 border border-slate-700/80 font-bold text-slate-300 text-xs sm:text-sm">
                    Kelas {currentSantri.kelas}
                  </span>
                </div>

                <span className={`px-3.5 py-1 rounded-xl font-bold text-xs sm:text-sm border shadow-sm ${statusBadgeBorder}`}>
                  {currentSantri.status}
                </span>
              </div>

              {/* Large Spotlight Santri Photo */}
              <div className="my-auto py-4 relative z-10 flex flex-col items-center">
                <div className="relative group">
                  <img
                    src={currentSantri.fotoUrl}
                    alt={currentSantri.nama}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.triedFallback) {
                        target.dataset.triedFallback = 'true';
                        target.src = 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80';
                      }
                    }}
                    className={`w-44 h-44 sm:w-56 sm:h-56 lg:w-64 lg:h-64 object-cover rounded-3xl ring-4 shadow-2xl transition-all duration-500 bg-slate-950 ${glowRingColor}`}
                  />
                  
                  {/* Floating Trophy Badge if has Prestasi */}
                  {currentSantri.prestasiList.length > 0 && (
                    <div className="absolute -bottom-3 -right-3 bg-gradient-to-br from-yellow-400 to-amber-600 text-slate-950 font-black px-3.5 py-1.5 rounded-2xl shadow-xl border-2 border-slate-900 flex items-center gap-1.5 text-xs lg:text-sm animate-bounce">
                      <Award className="w-4 h-4 fill-slate-950" />
                      <span>{currentSantri.prestasiList.length} Prestasi</span>
                    </div>
                  )}
                </div>

                {/* Name Headline on Card */}
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white mt-5 tracking-tight line-clamp-2">
                  {currentSantri.nama}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
                  NISN: <span className="text-slate-300 font-bold">{currentSantri.nisn}</span> • Asrama: <span className="text-slate-300 font-bold">{currentSantri.kamar}</span>
                </p>
              </div>

              {/* Bottom Quick Metric Pills on Left Spotlight */}
              <div className="w-full grid grid-cols-2 gap-3 z-10 pt-4 border-t border-slate-800/80">
                <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-center">
                  <span className="text-[11px] text-slate-400 block font-medium">Nilai Ujian Tahfidz</span>
                  <span className="text-lg lg:text-xl font-black text-emerald-400 font-mono">
                    {currentSantri.nilaiTahfidz} <span className="text-xs font-normal text-slate-400">/ 100</span>
                  </span>
                </div>
                <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-center">
                  <span className="text-[11px] text-slate-400 block font-medium">Indeks Disiplin</span>
                  <span className="text-lg lg:text-xl font-black text-blue-400 font-mono">
                    {currentSantri.poinDisiplin} <span className="text-xs font-normal text-slate-400">/ 100</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right Detailed Bento Tiles Area */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6 flex-1">
              
              {/* Tile 1: Capaian Tahfidz (Big Progress Visualizer) */}
              <div className="md:col-span-2 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-emerald-950/30 rounded-3xl p-6 lg:p-7 border border-emerald-900/50 shadow-xl flex flex-col justify-between relative overflow-hidden backdrop-blur-md">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-extrabold flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        CAPAIAN TAHFIDZ AL-QUR'AN
                      </span>
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-black text-white tracking-tight mt-1">
                      {currentSantri.juzSelesai} <span className="text-slate-400 text-lg font-bold">dari target</span> {currentSantri.targetJuz} Juz
                    </h3>
                  </div>

                  <div className="text-right">
                    <div className="text-3xl lg:text-4xl font-black text-emerald-400 font-mono">
                      {completionRate}%
                    </div>
                    <span className="text-xs text-slate-400 font-medium">Kelulusan Target</span>
                  </div>
                </div>

                {/* Big Visual Progress Bar */}
                <div className="my-4">
                  <div className="w-full bg-slate-950 h-5 rounded-2xl overflow-hidden border border-slate-800 p-0.5 shadow-inner">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-teal-300 rounded-xl transition-all duration-700 relative flex items-center justify-end pr-2"
                      style={{ width: `${Math.max(8, completionRate)}%` }}
                    >
                      <span className="text-[10px] font-black text-slate-950 drop-shadow-xs">
                        {completionRate}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sub-metrics: Surah, Halaman, Frekuensi Setoran */}
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-800/80 text-xs">
                  <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
                    <span className="text-slate-400 block text-[11px] font-medium">Surah Terakhir</span>
                    <span className="text-sm lg:text-base font-extrabold text-white truncate block">
                      {currentSantri.surahTerakhir}
                    </span>
                  </div>
                  <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
                    <span className="text-slate-400 block text-[11px] font-medium">Halaman Terakhir</span>
                    <span className="text-sm lg:text-base font-extrabold text-white block">
                      Halaman {currentSantri.halamanTerakhir}
                    </span>
                  </div>
                  <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
                    <span className="text-slate-400 block text-[11px] font-medium flex items-center gap-1">
                      <Flame className="w-3 h-3 text-orange-400" />
                      Setoran / Minggu
                    </span>
                    <span className="text-sm lg:text-base font-extrabold text-emerald-400 block">
                      {currentSantri.setoranPerMinggu}x Setoran
                    </span>
                  </div>
                </div>
              </div>

              {/* Tile 2: Halaqah & Pembimbing Info */}
              <div className="bg-slate-900/90 rounded-3xl p-5 lg:p-6 border border-slate-800 shadow-xl flex flex-col justify-between backdrop-blur-md">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Pembimbing & Wali Santri</h4>
                    <p className="text-[11px] text-slate-400">Informasi halaqah & asrama</p>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-400 font-medium">Kelompok Halaqah:</span>
                    <span className="font-extrabold text-emerald-400">{currentSantri.halaqah}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-400 font-medium">Ustadz Musyrif:</span>
                    <span className="font-bold text-white">{currentSantri.musyrif}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-400 font-medium">Wali Santri:</span>
                    <span className="font-bold text-white">{currentSantri.waliSantri}</span>
                  </div>
                </div>
              </div>

              {/* Tile 3: Prestasi & Piagam Highlight */}
              <div className="bg-slate-900/90 rounded-3xl p-5 lg:p-6 border border-slate-800 shadow-xl flex flex-col justify-between backdrop-blur-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-yellow-500/20 text-yellow-400 flex items-center justify-center border border-yellow-500/30">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Riwayat Prestasi Santri</h4>
                      <p className="text-[11px] text-slate-400">Penghargaan & Piagam Kejuaraan</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-bold border border-yellow-500/30">
                    {currentSantri.prestasiList.length} Prestasi
                  </span>
                </div>

                {currentSantri.prestasiList.length > 0 ? (
                  <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                    {currentSantri.prestasiList.map((p) => (
                      <div key={p.id} className="p-2.5 rounded-2xl bg-yellow-950/30 border border-yellow-800/40 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-yellow-300 line-clamp-1">{p.judul}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 font-bold shrink-0 ml-1">
                            +{p.poinPlus} Poin
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Tingkat {p.tingkat} • {p.penyelenggara} ({p.tanggal})
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center text-xs text-slate-400 my-auto">
                    <p className="font-semibold text-slate-300 mb-1">Santri Aktif & Berdedikasi</p>
                    <p className="text-[11px] text-slate-500">
                      Fokus pada penyempurnaan tajwid, kelancaran hafalan baru, dan mutaba'ah harian.
                    </p>
                  </div>
                )}
              </div>

              {/* Tile 4: Mutaba'ah & Nasihat Asatidz */}
              <div className="md:col-span-2 bg-slate-900/80 rounded-3xl p-4 lg:p-5 border border-slate-800 shadow-xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-white block">Catatan Pembinaan Asatidz:</span>
                  <p className="text-slate-300 italic mt-0.5 line-clamp-2">
                    "{currentSantri.catatanUstadz || 'Alhamdulillah, santri istiqomah dalam murajaah dan setoran hafalan harian. Terus tingkatkan tajwid dan adab.'}"
                  </p>
                </div>
              </div>

            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom TV Dock: Queue Strip, Manual Controls, and Running Ticker */}
      <footer className="bg-slate-900/95 border-t border-slate-800/80 shrink-0 backdrop-blur-md">
        
        {/* Upcoming Santri Queue Strip & Manual Arrows */}
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8 py-2.5 flex items-center justify-between gap-4">
          
          {/* Prev Button */}
          <button
            onClick={handlePrev}
            className="p-2.5 rounded-2xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all cursor-pointer shrink-0 shadow-md"
            title="Santri Sebelumnya (Panah Kiri)"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Mini Rotating Santri Thumbnail Queue */}
          <div className="flex-1 flex items-center gap-2 overflow-x-auto py-1 scrollbar-none justify-center">
            {activeList.slice(0, 15).map((santri, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={santri.id}
                  onClick={() => handleSelectSantri(idx)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl transition-all cursor-pointer shrink-0 border ${
                    isActive
                      ? 'bg-emerald-600/30 text-white border-emerald-500/80 shadow-md scale-105 ring-2 ring-emerald-500/40'
                      : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:bg-slate-800/60 hover:text-slate-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={santri.fotoUrl}
                    alt={santri.nama}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.triedFallback) {
                        target.dataset.triedFallback = 'true';
                        target.src = 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=100&auto=format&fit=crop&q=80';
                      }
                    }}
                    className="w-6 h-6 rounded-lg object-cover bg-slate-800"
                  />
                  <div className="text-left text-[11px]">
                    <span className="font-extrabold block truncate max-w-[90px]">{santri.nama}</span>
                    <span className="text-[10px] text-emerald-400 font-mono">{santri.juzSelesai}/{santri.targetJuz} Juz</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="p-2.5 rounded-2xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all cursor-pointer shrink-0 shadow-md"
            title="Santri Berikutnya (Panah Kanan / Spasi)"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom Running News Marquee / Ticker */}
        <div className="bg-emerald-950/80 border-t border-emerald-900/60 px-4 py-2 flex items-center overflow-hidden text-xs text-emerald-300">
          
          <div className="flex items-center gap-2 bg-emerald-900 text-emerald-100 font-black px-3 py-1 rounded-xl shrink-0 mr-4 shadow-sm border border-emerald-700/60">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>INFORMASI PESANTREN</span>
          </div>

          <div className="flex-1 overflow-hidden whitespace-nowrap">
            <div className="inline-block animate-marquee font-medium text-emerald-200">
              <span className="mx-6 font-bold text-white">✨ TOTAL SANTRI: {santriList.length} Santri</span>
              <span className="mx-6">•</span>
              <span className="mx-6 font-bold text-amber-300">
                🕌 JADWAL SHALAT {currentCity.name.toUpperCase()} ({currentCity.zone}): {prayerData.items.map(p => `${p.name} ${p.time}`).join('  |  ')}
              </span>
              <span className="mx-6">•</span>
              <span className="mx-6">⏳ Menuju {prayerData.nextPrayer.name}: {prayerData.nextPrayer.time} ({formatCountdown(prayerData.msToNext)})</span>
              <span className="mx-6">•</span>
              <span className="mx-6">📖 {MOTIVATION_QUOTES[currentIndex % MOTIVATION_QUOTES.length]}</span>
              <span className="mx-6">•</span>
              <span className="mx-6 text-emerald-300">🔄 Data tersinkronisasi otomatis dari Google Sheets ({lastSyncedAt || 'Live'})</span>
            </div>
          </div>

          {/* Quick Counter Info */}
          <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-emerald-400 bg-slate-950/80 px-3 py-1 rounded-xl border border-emerald-800/60 shrink-0 ml-4 font-bold">
            Santri {currentIndex + 1} / {activeList.length}
          </div>
        </div>

      </footer>

      {/* Global CSS for seamless Marquee animation */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: inline-block;
          white-space: nowrap;
          animation: marquee 35s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

    </div>
  );
};
