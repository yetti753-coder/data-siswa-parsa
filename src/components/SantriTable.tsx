import React from 'react';
import { 
  Award, 
  ShieldCheck, 
  FileText, 
  ChevronRight, 
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { Santri } from '../types';

interface SantriTableProps {
  santriList: Santri[];
  onViewDetail: (santri: Santri) => void;
  onExportPdf: (santri: Santri) => void;
}

export const SantriTable: React.FC<SantriTableProps> = ({
  santriList,
  onViewDetail,
  onExportPdf,
}) => {
  if (santriList.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
        <p className="text-slate-500 text-sm font-medium">Tidak ada data santri yang sesuai dengan filter pencarian.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          {/* Table Header */}
          <thead className="bg-slate-50/90 text-slate-500 border-b border-slate-200 font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3.5 px-4">Santri</th>
              <th className="py-3.5 px-3">Kelas</th>
              <th className="py-3.5 px-3">Progres Tahfidz</th>
              <th className="py-3.5 px-3">Surah / Hal</th>
              <th className="py-3.5 px-3 text-center">Setoran/Mg</th>
              <th className="py-3.5 px-3 text-center">Nilai</th>
              <th className="py-3.5 px-3 text-center">Status</th>
              <th className="py-3.5 px-3 text-center">Prestasi</th>
              <th className="py-3.5 px-3 text-center">Disiplin</th>
              <th className="py-3.5 px-4 text-right">Aksi</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {santriList.map((santri) => {
              const percentJuz = Math.min(
                100,
                Math.round((santri.juzSelesai / (santri.targetJuz || 1)) * 100)
              );
              const isSangatBaik = santri.status.toLowerCase().includes('sangat baik') || santri.nilaiTahfidz >= 90;
              const isPerluBimbingan = santri.status.toLowerCase().includes('perlu bimbingan') || santri.nilaiTahfidz < 80;

              return (
                <tr
                  key={santri.id}
                  className="hover:bg-emerald-50/40 transition-colors group cursor-pointer"
                  onClick={() => onViewDetail(santri)}
                >
                  {/* Santri Photo & Name */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
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
                        className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-100"
                      />
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {santri.nama}
                        </div>
                        <div className="text-[11px] font-mono text-emerald-700 font-semibold">
                          {santri.id}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Kelas */}
                  <td className="py-3 px-3">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-semibold">
                      {santri.kelas}
                    </span>
                  </td>

                  {/* Progres Tahfidz */}
                  <td className="py-3 px-3 min-w-[150px]">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-800">
                          {santri.juzSelesai} / {santri.targetJuz} Juz
                        </span>
                        <span className="text-emerald-600 font-extrabold">{percentJuz}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full"
                          style={{ width: `${percentJuz}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Surah & Halaman */}
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-800">{santri.surahTerakhir}</div>
                    <div className="text-[11px] text-slate-500">Hal. {santri.halamanTerakhir}</div>
                  </td>

                  {/* Setoran/Minggu */}
                  <td className="py-3 px-3 text-center">
                    <span className="font-bold text-slate-800">{santri.setoranPerMinggu}x</span>
                  </td>

                  {/* Nilai */}
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`font-extrabold text-sm ${
                        isSangatBaik
                          ? 'text-emerald-700'
                          : isPerluBimbingan
                          ? 'text-amber-700'
                          : 'text-sky-700'
                      }`}
                    >
                      {santri.nilaiTahfidz}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        isSangatBaik
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : isPerluBimbingan
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-sky-50 text-sky-700 border-sky-200'
                      }`}
                    >
                      {santri.status}
                    </span>
                  </td>

                  {/* Prestasi */}
                  <td className="py-3 px-3 text-center">
                    {santri.prestasiList.length > 0 ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-yellow-50 text-yellow-800 border border-yellow-200 text-[11px] font-bold">
                        <Award className="w-3 h-3 text-yellow-600" />
                        <span>{santri.prestasiList.length}</span>
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>

                  {/* Disiplin */}
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        santri.poinDisiplin >= 90
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      <ShieldCheck className="w-3 h-3 text-blue-600" />
                      <span>{santri.poinDisiplin}</span>
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onViewDetail(santri)}
                        className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-emerald-600 text-slate-700 hover:text-white transition-all text-[11px] font-bold cursor-pointer"
                        title="Lihat Profil Santri"
                      >
                        Detail
                      </button>
                      <button
                        onClick={() => onExportPdf(santri)}
                        className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-emerald-600 hover:text-emerald-800 transition-all cursor-pointer"
                        title="Cetak Rapor PDF"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
