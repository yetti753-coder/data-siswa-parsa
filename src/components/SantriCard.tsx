import React from 'react';
import { 
  Award, 
  ShieldCheck, 
  BookOpen, 
  FileText, 
  ChevronRight, 
  Sparkles,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { Santri } from '../types';

interface SantriCardProps {
  santri: Santri;
  onViewDetail: (santri: Santri) => void;
  onExportPdf: (santri: Santri) => void;
}

export const SantriCard: React.FC<SantriCardProps> = ({
  santri,
  onViewDetail,
  onExportPdf,
}) => {
  const percentJuz = Math.min(100, Math.round((santri.juzSelesai / (santri.targetJuz || 1)) * 100));

  const isSangatBaik = santri.status.toLowerCase().includes('sangat baik') || santri.nilaiTahfidz >= 90;
  const isPerluBimbingan = santri.status.toLowerCase().includes('perlu bimbingan') || santri.nilaiTahfidz < 80;

  const statusBg = isSangatBaik
    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
    : isPerluBimbingan
    ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
    : 'bg-sky-500/10 text-sky-300 border-sky-500/30';

  const avatarBorder = isSangatBaik
    ? 'ring-2 ring-emerald-500/60'
    : isPerluBimbingan
    ? 'ring-2 ring-amber-500/60'
    : 'ring-2 ring-sky-500/60';

  return (
    <div className="bg-white hover:bg-white border border-slate-200/90 hover:border-emerald-400 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group relative overflow-hidden">
      <div>
        {/* Header: Photo, Name, ID, Badges */}
        <div className="flex items-start gap-3 mb-3.5">
          <div className="relative shrink-0">
            <img
              src={santri.fotoUrl}
              alt={santri.nama}
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.dataset.triedFallback) {
                  target.dataset.triedFallback = 'true';
                  target.src = 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80';
                }
              }}
              className={`w-13 h-13 rounded-2xl object-cover shadow-sm bg-slate-100 ${avatarBorder}`}
            />
            {santri.prestasiList.length > 0 && (
              <span className="absolute -bottom-1 -right-1 bg-yellow-400 text-slate-900 p-0.5 rounded-full ring-2 ring-white" title="Memiliki Prestasi">
                <Award className="w-3 h-3" />
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[11px] font-mono text-emerald-700 font-bold">
                {santri.id}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusBg}`}>
                {santri.status}
              </span>
            </div>

            <h3 className="text-sm font-bold text-slate-900 truncate mt-0.5 group-hover:text-emerald-700 transition-colors">
              {santri.nama}
            </h3>

            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-[10px] font-semibold">
                Kelas {santri.kelas}
              </span>
              <span className="truncate text-[11px] font-medium">• {santri.halaqah}</span>
            </div>
          </div>
        </div>

        {/* Progress Tahfidz Bar */}
        <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 mb-3 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 text-[11px] font-semibold flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>Capaian Tahfidz</span>
            </span>
            <span className="font-bold text-slate-900 text-xs">
              {santri.juzSelesai} <span className="text-slate-400 font-normal">/ {santri.targetJuz} Juz</span>
              <span className="ml-1 text-emerald-600 font-bold text-[11px]">({percentJuz}%)</span>
            </span>
          </div>

          {/* Progress track */}
          <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isSangatBaik
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : isPerluBimbingan
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                  : 'bg-gradient-to-r from-sky-500 to-emerald-400'
              }`}
              style={{ width: `${percentJuz}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
            <span>Surah: <strong className="text-slate-700 font-semibold">{santri.surahTerakhir}</strong></span>
            <span>Hal: <strong className="text-slate-700 font-semibold">{santri.halamanTerakhir}</strong></span>
          </div>
        </div>

        {/* Stats Bento Grid: Nilai, Setoran, Disiplin, Prestasi */}
        <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
          {/* Nilai Tahfidz */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
            <span className="text-slate-500 text-[11px] font-medium">Nilai:</span>
            <span className={`font-extrabold text-sm ${
              isSangatBaik ? 'text-emerald-700' : isPerluBimbingan ? 'text-amber-700' : 'text-sky-700'
            }`}>
              {santri.nilaiTahfidz}
            </span>
          </div>

          {/* Setoran / Minggu */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
            <span className="text-slate-500 text-[11px] font-medium">Setoran:</span>
            <span className="font-bold text-slate-800 text-xs">
              {santri.setoranPerMinggu}x<span className="text-[10px] text-slate-400 font-normal">/pekan</span>
            </span>
          </div>

          {/* Prestasi Count */}
          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-yellow-600 shrink-0" />
            <span className="text-[11px] text-slate-700 font-semibold truncate">
              {santri.prestasiList.length} Prestasi
            </span>
          </div>

          {/* Disiplin Point */}
          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex items-center gap-1.5">
            <ShieldCheck className={`w-3.5 h-3.5 shrink-0 ${santri.poinDisiplin >= 90 ? 'text-blue-600' : 'text-amber-600'}`} />
            <span className="text-[11px] text-slate-700 font-semibold truncate">
              {santri.poinDisiplin}/100 Poin
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
        <button
          onClick={() => onViewDetail(santri)}
          className="flex-1 inline-flex items-center justify-center gap-1 py-2 px-3 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200/80 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
        >
          <span>Detail Profil</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onExportPdf(santri)}
          className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-emerald-700 border border-slate-200 transition-colors cursor-pointer"
          title="Download Rapor PDF Resmi Santri"
        >
          <FileText className="w-4 h-4 text-emerald-600" />
        </button>
      </div>
    </div>
  );
};
