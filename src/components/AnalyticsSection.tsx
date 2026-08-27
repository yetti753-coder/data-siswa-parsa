import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';
import { Santri } from '../types';
import { Award, BookOpen, CheckCircle, Flame, ShieldAlert, Sparkles, TrendingUp } from 'lucide-react';

interface AnalyticsSectionProps {
  santriList: Santri[];
  onSelectClass?: (kelas: string) => void;
  onSelectSantri?: (santri: Santri) => void;
}

const COLORS = {
  sangatBaik: '#10b981', // emerald-500
  baik: '#0ea5e9',       // sky-500
  perluBimbingan: '#f59e0b', // amber-500
  target: '#64748b',     // slate-500
  selesai: '#10b981',    // emerald-500
  prestasi: '#eab308',   // yellow-500
  disiplin: '#ef4444',   // red-500
};

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({
  santriList,
  onSelectClass,
  onSelectSantri,
}) => {
  // 1. Data per Kelas (Average Target vs Selesai Juz & Avg Nilai)
  const classData = useMemo(() => {
    const map: Record<string, { totalTarget: number; totalSelesai: number; totalNilai: number; totalSetoran: number; count: number; totalPrestasi: number; totalDisiplin: number }> = {};

    santriList.forEach((s) => {
      if (!map[s.kelas]) {
        map[s.kelas] = { totalTarget: 0, totalSelesai: 0, totalNilai: 0, totalSetoran: 0, count: 0, totalPrestasi: 0, totalDisiplin: 0 };
      }
      map[s.kelas].totalTarget += s.targetJuz;
      map[s.kelas].totalSelesai += s.juzSelesai;
      map[s.kelas].totalNilai += s.nilaiTahfidz;
      map[s.kelas].totalSetoran += s.setoranPerMinggu;
      map[s.kelas].totalPrestasi += s.prestasiList.length;
      map[s.kelas].totalDisiplin += s.disiplinList.length;
      map[s.kelas].count += 1;
    });

    return Object.entries(map)
      .map(([kelas, v]) => ({
        kelas,
        avgTarget: Math.round((v.totalTarget / v.count) * 10) / 10,
        avgSelesai: Math.round((v.totalSelesai / v.count) * 10) / 10,
        avgNilai: Math.round((v.totalNilai / v.count) * 10) / 10,
        avgSetoran: Math.round((v.totalSetoran / v.count) * 10) / 10,
        prestasi: v.totalPrestasi,
        disiplin: v.totalDisiplin,
        count: v.count,
      }))
      .sort((a, b) => a.kelas.localeCompare(b.kelas));
  }, [santriList]);

  // 2. Status Distribution (Pie Data)
  const statusPieData = useMemo(() => {
    let sangatBaik = 0;
    let baik = 0;
    let perluBimbingan = 0;

    santriList.forEach((s) => {
      const st = s.status.toLowerCase();
      if (st.includes('sangat baik')) sangatBaik++;
      else if (st.includes('perlu bimbingan')) perluBimbingan++;
      else baik++;
    });

    return [
      { name: 'Sangat Baik (≥90)', value: sangatBaik, color: COLORS.sangatBaik },
      { name: 'Baik (80-89)', value: baik, color: COLORS.baik },
      { name: 'Perlu Bimbingan (<80)', value: perluBimbingan, color: COLORS.perluBimbingan },
    ];
  }, [santriList]);

  // 3. Top Surah Distribution
  const surahData = useMemo(() => {
    const map: Record<string, number> = {};
    santriList.forEach((s) => {
      if (s.surahTerakhir) {
        map[s.surahTerakhir] = (map[s.surahTerakhir] || 0) + 1;
      }
    });

    return Object.entries(map)
      .map(([surah, count]) => ({ surah, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 7);
  }, [santriList]);

  // 4. Top 5 Santri Berprestasi
  const topSantri = useMemo(() => {
    return [...santriList]
      .sort((a, b) => {
        if (b.nilaiTahfidz !== a.nilaiTahfidz) return b.nilaiTahfidz - a.nilaiTahfidz;
        return b.juzSelesai - a.juzSelesai;
      })
      .slice(0, 5);
  }, [santriList]);

  return (
    <div className="space-y-6">
      {/* Top 2 Main Bento Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Progres Juz per Kelas */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                <span>Rata-rata Capaian Juz vs Target per Kelas</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Perbandingan rata-rata hafalan target dan juz selesai per tingkatan kelas
              </p>
            </div>
            <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full font-bold">
              Live Google Sheets Data
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="kelas" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '16px',
                    color: '#0f172a',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  cursor={{ fill: 'rgba(16, 185, 129, 0.05)' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                <Bar dataKey="avgTarget" name="Rata-rata Target (Juz)" fill="#94a3b8" radius={[6, 6, 0, 0]} />
                <Bar dataKey="avgSelesai" name="Rata-rata Selesai (Juz)" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Komposisi Predikat Santri */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
          <div className="mb-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-teal-600" />
              <span>Distribusi Predikat Nilai</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Proporsi kualitas hafalan seluruh santri</p>
          </div>

          <div className="h-56 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '12px',
                    color: '#0f172a',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-extrabold text-slate-900">{santriList.length}</span>
              <span className="text-[11px] text-slate-500 font-semibold">Total Santri</span>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-100">
            {statusPieData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full shadow-xs" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900">
                  {item.value} ({Math.round((item.value / (santriList.length || 1)) * 100)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Surah Terakhir Distribution, Nilai Area Chart & Top Santri Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Surah Terakhir Bar Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Surah Terakhir Terbanyak</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Posisi surah Al-Qur'an yang sedang banyak disetorkan</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={surahData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis dataKey="surah" type="category" stroke="#334155" fontSize={11} width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '12px',
                    color: '#0f172a',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Bar dataKey="count" name="Jumlah Santri" fill="#0ea5e9" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rata-rata Nilai & Setoran per Kelas Area Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-600" />
              <span>Karakteristik & Nilai per Kelas</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Rata-rata Nilai Ujian Tahfidz per Kelas</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={classData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="nilaiGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="kelas" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[70, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '12px',
                    color: '#0f172a',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="avgNilai"
                  name="Rata-rata Nilai"
                  stroke="#14b8a6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#nilaiGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 5 Santri Unggulan */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                <span>Santri Berprestasi Tertinggi</span>
              </h3>
              <span className="text-xs font-bold bg-yellow-50 text-yellow-800 border border-yellow-200 px-2.5 py-0.5 rounded-full">
                Top 5
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3.5">
              Santri dengan nilai tahfidz dan kelancaran setoran tertinggi
            </p>

            <div className="space-y-2">
              {topSantri.map((s, index) => (
                <div
                  key={s.id}
                  onClick={() => onSelectSantri && onSelectSantri(s)}
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-100 hover:border-emerald-200 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0
                          ? 'bg-yellow-400 text-slate-900'
                          : index === 1
                          ? 'bg-slate-200 text-slate-800'
                          : index === 2
                          ? 'bg-amber-200 text-amber-900'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <img
                      src={s.fotoUrl}
                      alt={s.nama}
                      className="w-8 h-8 rounded-xl object-cover border border-emerald-200 bg-slate-200"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {s.nama}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-medium">
                        {s.kelas} • {s.juzSelesai}/{s.targetJuz} Juz
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-block px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 font-extrabold text-xs border border-emerald-200">
                      {s.nilaiTahfidz}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
