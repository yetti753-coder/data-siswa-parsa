import React, { useState, useEffect, useMemo } from 'react';
import { 
  Clock, 
  MapPin, 
  Sun, 
  Moon, 
  Sunrise, 
  Sunset, 
  Compass, 
  Bell, 
  BellOff, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { 
  INDONESIAN_CITIES, 
  CityLocation, 
  calculatePrayerTimes, 
  formatCountdown,
  PrayerTimeItem
} from '../services/prayerService';

interface PrayerTimesWidgetProps {
  variant?: 'dashboard' | 'tv-compact' | 'tv-full';
  className?: string;
}

export const PrayerTimesWidget: React.FC<PrayerTimesWidgetProps> = ({
  variant = 'dashboard',
  className = '',
}) => {
  // Load saved city preference or default to Jakarta
  const [selectedCityId, setSelectedCityId] = useState<string>(() => {
    try {
      return localStorage.getItem('sims_prayer_city') || 'jkt';
    } catch {
      return 'jkt';
    }
  });

  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState<boolean>(false);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentCity = useMemo(() => {
    return INDONESIAN_CITIES.find(c => c.id === selectedCityId) || INDONESIAN_CITIES[0];
  }, [selectedCityId]);

  const prayerData = useMemo(() => {
    return calculatePrayerTimes(currentCity, currentTime);
  }, [currentCity, currentTime]);

  const handleSelectCity = (city: CityLocation) => {
    setSelectedCityId(city.id);
    setIsCityDropdownOpen(false);
    try {
      localStorage.setItem('sims_prayer_city', city.id);
    } catch {}
  };

  const getPrayerIcon = (id: string) => {
    switch (id) {
      case 'imsak':
        return <Moon className="w-4 h-4 text-indigo-400" />;
      case 'shubuh':
        return <Sunrise className="w-4 h-4 text-cyan-400" />;
      case 'syuruq':
        return <Sun className="w-4 h-4 text-amber-300" />;
      case 'dhuha':
        return <Sun className="w-4 h-4 text-amber-400" />;
      case 'dzuhur':
        return <Sun className="w-4 h-4 text-yellow-400" />;
      case 'ashar':
        return <Sunset className="w-4 h-4 text-orange-400" />;
      case 'maghrib':
        return <Sunset className="w-4 h-4 text-rose-400" />;
      case 'isya':
        return <Moon className="w-4 h-4 text-indigo-300" />;
      default:
        return <Clock className="w-4 h-4 text-emerald-400" />;
    }
  };

  // TV Compact / Strip Layout
  if (variant === 'tv-compact') {
    return (
      <div className={`flex items-center gap-2 overflow-x-auto scrollbar-none ${className}`}>
        {prayerData.items.filter(p => ['shubuh', 'dzuhur', 'ashar', 'maghrib', 'isya'].includes(p.id)).map((p) => (
          <div
            key={p.id}
            className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-2 border transition-all ${
              p.isNext
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 ring-2 ring-emerald-500/30'
                : 'bg-slate-950/70 text-slate-300 border-slate-800'
            }`}
          >
            <span className="font-semibold">{p.name}:</span>
            <span className="font-mono font-bold">{p.time}</span>
            {p.isNext && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 rounded-3xl p-5 sm:p-6 text-white border border-emerald-900/50 shadow-xl relative overflow-hidden backdrop-blur-md ${className}`}>
      
      {/* Background glow circle */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header: Title, City Selector, and Hijri Date */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4 relative z-10">
        
        {/* Title & Islamic Calendar */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-inner shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black tracking-tight text-white flex items-center gap-2">
                Jadwal Sholat & Waktu Ibadah
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold">
                {currentCity.zone}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {prayerData.hijriDate} • Standar Kemenag RI
            </p>
          </div>
        </div>

        {/* City Selector Dropdown */}
        <div className="relative w-full sm:w-auto">
          <button
            onClick={() => setIsCityDropdownOpen(prev => !prev)}
            className="w-full sm:w-auto flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800/90 text-slate-200 border border-slate-700/80 text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <div className="flex items-center gap-1.5 text-emerald-400">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="text-slate-100">{currentCity.name}</span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isCityDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isCityDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-56 max-h-60 overflow-y-auto bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-1.5 z-50 text-xs">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                Pilih Kota / Daerah
              </div>
              {INDONESIAN_CITIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleSelectCity(c)}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-between ${
                    c.id === selectedCityId
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{c.name}</span>
                  <span className="text-[10px] opacity-75">{c.zone}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Countdown Card to Next Prayer */}
      <div className="my-4 bg-slate-950/80 rounded-2xl p-3.5 sm:p-4 border border-emerald-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <div>
            <div className="text-xs text-slate-400 font-medium">
              Menuju Waktu Sholat Berikutnya:
            </div>
            <div className="text-base sm:text-lg font-black text-emerald-400 flex items-center gap-2">
              <span>{prayerData.nextPrayer.name}</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-300">
                {prayerData.nextPrayer.time} {currentCity.zone}
              </span>
            </div>
          </div>
        </div>

        <div className="text-left sm:text-right w-full sm:w-auto">
          <div className="text-xs text-slate-400 font-medium">Sisa Waktu Hitung Mundur:</div>
          <div className="text-xl sm:text-2xl font-mono font-black text-amber-400 tracking-wider">
            {formatCountdown(prayerData.msToNext)}
          </div>
        </div>
      </div>

      {/* Grid of All Prayer Times */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 relative z-10">
        {prayerData.items.map((p) => {
          const isNext = p.isNext;
          const isCurrent = p.isCurrent;

          return (
            <div
              key={p.id}
              className={`rounded-2xl p-3 flex flex-col items-center justify-between text-center transition-all duration-300 relative ${
                isNext
                  ? 'bg-gradient-to-b from-emerald-600/30 to-emerald-900/40 border-2 border-emerald-400/80 shadow-lg shadow-emerald-900/30 scale-102 ring-2 ring-emerald-400/20'
                  : isCurrent
                  ? 'bg-slate-950/90 border border-blue-500/50 text-blue-200'
                  : 'bg-slate-950/60 border border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              {isNext && (
                <span className="absolute -top-2.5 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[9px] font-black uppercase tracking-wider shadow-sm">
                  Berikutnya
                </span>
              )}

              <div className="mb-1.5 flex items-center justify-center p-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
                {getPrayerIcon(p.id)}
              </div>

              <span className="text-xs font-bold text-slate-200">{p.name}</span>
              <span className="text-[10px] text-slate-400 font-serif">{p.arabicName}</span>

              <span className={`text-sm sm:text-base font-mono font-black mt-1.5 ${
                isNext ? 'text-emerald-300' : isCurrent ? 'text-blue-400' : 'text-white'
              }`}>
                {p.time}
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
};
