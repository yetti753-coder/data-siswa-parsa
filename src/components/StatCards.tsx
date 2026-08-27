import React from 'react';
import { 
  Users, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  ShieldCheck, 
  TrendingUp,
  Flame
} from 'lucide-react';
import { Santri } from '../types';

interface StatCardsProps {
  santriList: Santri[];
  filteredCount: number;
}

export const StatCards: React.FC<StatCardsProps> = ({ santriList, filteredCount }) => {
  if (!santriList.length) return null;

  const total = santriList.length;
  const totalNilai = santriList.reduce((acc, s) => acc + s.nilaiTahfidz, 0);
  const avgNilai = (totalNilai / total).toFixed(1);

  const totalJuzSelesai = santriList.reduce((acc, s) => acc + s.juzSelesai, 0);
  const totalTargetJuz = santriList.reduce((acc, s) => acc + s.targetJuz, 0);
  const percentJuz = Math.round((totalJuzSelesai / (totalTargetJuz || 1)) * 100);

  const sangatBaikCount = santriList.filter((s) => s.status.toLowerCase().includes('sangat baik')).length;
  const sangatBaikPercent = Math.round((sangatBaikCount / total) * 100);

  const totalSetoran = santriList.reduce((acc, s) => acc + s.setoranPerMinggu, 0);
  const avgSetoran = (totalSetoran / total).toFixed(1);

  const totalPrestasi = santriList.reduce((acc, s) => acc + s.prestasiList.length, 0);
  const totalDisiplinAvg = Math.round(
    santriList.reduce((acc, s) => acc + s.poinDisiplin, 0) / total
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
      {/* 1. Total Santri */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-emerald-400 hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Total Santri</span>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{total}</span>
          <span className="text-xs text-emerald-600 font-semibold">Santri</span>
        </div>
        <p className="mt-1 text-[11px] text-slate-400 font-medium">
          {filteredCount !== total ? `${filteredCount} filter aktif` : '8 Kelas Aktif'}
        </p>
      </div>

      {/* 2. Rata-rata Nilai Tahfidz */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-teal-400 hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Rata-rata Nilai</span>
          <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{avgNilai}</span>
          <span className="text-xs text-teal-600 font-semibold">/ 100</span>
        </div>
        <div className="mt-1 flex items-center gap-1 text-[11px] text-teal-700 font-medium">
          <CheckCircle2 className="w-3 h-3 text-teal-600" />
          <span>Predikat Mutqin</span>
        </div>
      </div>

      {/* 3. Total Juz Khatam */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-amber-400 hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Akumulasi Juz</span>
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
            <BookOpen className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{totalJuzSelesai}</span>
          <span className="text-xs text-amber-600 font-semibold">/ {totalTargetJuz} Juz</span>
        </div>
        <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, percentJuz)}%` }}
          />
        </div>
      </div>

      {/* 4. Santri Sangat Baik */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-emerald-400 hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Sangat Baik</span>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{sangatBaikCount}</span>
          <span className="text-xs text-emerald-600 font-semibold">({sangatBaikPercent}%)</span>
        </div>
        <p className="mt-1 text-[11px] text-slate-400 font-medium">Nilai Tahfidz ≥ 90</p>
      </div>

      {/* 5. Total Prestasi */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-yellow-400 hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Total Prestasi</span>
          <div className="w-8 h-8 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center border border-yellow-100">
            <Award className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{totalPrestasi}</span>
          <span className="text-xs text-yellow-600 font-semibold">Piagam</span>
        </div>
        <p className="mt-1 text-[11px] text-slate-400 font-medium">Pesantren - Nasional</p>
      </div>

      {/* 6. Indeks Kedisiplinan */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-400 hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Indeks Disiplin</span>
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{totalDisiplinAvg}</span>
          <span className="text-xs text-blue-600 font-semibold">/ 100</span>
        </div>
        <p className="mt-1 text-[11px] text-emerald-600 font-semibold">Status Akhlak Terjaga</p>
      </div>
    </div>
  );
};
