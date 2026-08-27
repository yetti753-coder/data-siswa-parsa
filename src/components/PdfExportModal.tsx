import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Filter, 
  Users, 
  CheckCircle, 
  GraduationCap,
  Sparkles,
  BookOpen,
  Award,
  ShieldCheck
} from 'lucide-react';
import { Santri } from '../types';
import { exportBatchSummaryPDF, exportSantriReportPDF } from '../services/pdfService';

interface PdfExportModalProps {
  santriList: Santri[];
  filteredSantriList: Santri[];
  onSelectSantri: (santri: Santri) => void;
}

export const PdfExportModal: React.FC<PdfExportModalProps> = ({
  santriList,
  filteredSantriList,
  onSelectSantri,
}) => {
  const [reportType, setReportType] = useState<'individual' | 'batch'>('individual');
  const [selectedSantriId, setSelectedSantriId] = useState<string>(santriList[0]?.id || '');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [isExporting, setIsExporting] = useState(false);

  const activeSantri = santriList.find((s) => s.id === selectedSantriId) || santriList[0];

  const handleExportIndividual = () => {
    if (!activeSantri) return;
    setIsExporting(true);
    try {
      exportSantriReportPDF(activeSantri);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportBatch = () => {
    setIsExporting(true);
    try {
      const targetList = selectedClass === 'all' 
        ? filteredSantriList 
        : santriList.filter((s) => s.kelas === selectedClass);
      
      const title = selectedClass === 'all' ? 'Seluruh Santri Terfilter' : `Santri Kelas ${selectedClass}`;
      exportBatchSummaryPDF(targetList, title);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  const classes = Array.from(new Set(santriList.map((s) => s.kelas))).sort();

  return (
    <div className="space-y-6">
      {/* Header Banner Bento Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-3 py-0.5 rounded-full font-bold">
              Modul Cetak Resmi
            </span>
            <span className="text-xs text-slate-500 font-medium">Format PDF Standar Kemenag & Pesantren</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Pusat Ekspor & Cetak Laporan Santri
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-medium">
            Cetak lembar rapor evaluasi tahfidz individual lengkap dengan foto, riwayat prestasi, dan catatan kedisiplinan atau unduh rekapitulasi data santri per kelas.
          </p>
        </div>

        {/* Mode switcher tabs */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => setReportType('individual')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              reportType === 'individual'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Rapor Individual Santri
          </button>
          <button
            onClick={() => setReportType('batch')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              reportType === 'batch'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Rekapitulasi Kelas (Batch)
          </button>
        </div>
      </div>

      {/* Mode 1: Individual Report Card Preview & Download */}
      {reportType === 'individual' && activeSantri && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Selection Column Bento Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>Pilih Santri yang Akan Dicetak</span>
            </h3>

            {/* Quick search/select */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-600">Pilih dari Daftar Santri ({santriList.length})</label>
              <select
                value={selectedSantriId}
                onChange={(e) => setSelectedSantriId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-2xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 font-medium"
              >
                {santriList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.id} - {s.nama} ({s.kelas} • Nilai {s.nilaiTahfidz})
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Santri Quick Bento Card */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={activeSantri.fotoUrl}
                  alt={activeSantri.nama}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.triedFallback) {
                      target.dataset.triedFallback = 'true';
                      target.src = 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80';
                    }
                  }}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/20 bg-slate-200"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{activeSantri.nama}</h4>
                  <p className="text-xs text-emerald-700 font-mono font-bold">{activeSantri.id}</p>
                  <p className="text-[11px] text-slate-500 font-medium">Kelas {activeSantri.kelas} • {activeSantri.halaqah}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200">
                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-[10px] block font-medium">Capaian Tahfidz</span>
                  <span className="font-bold text-slate-900">{activeSantri.juzSelesai}/{activeSantri.targetJuz} Juz</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-[10px] block font-medium">Nilai Ujian</span>
                  <span className="font-bold text-emerald-700">{activeSantri.nilaiTahfidz} ({activeSantri.status})</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-[10px] block font-medium">Prestasi</span>
                  <span className="font-bold text-yellow-700">{activeSantri.prestasiList.length} Piagam</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-[10px] block font-medium">Poin Disiplin</span>
                  <span className="font-bold text-blue-700">{activeSantri.poinDisiplin}/100</span>
                </div>
              </div>
            </div>

            {/* Action Download */}
            <button
              onClick={handleExportIndividual}
              disabled={isExporting}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Memproses PDF...' : 'Unduh Rapor Santri Ini (PDF)'}</span>
            </button>
          </div>

          {/* Right Document Visual Paper Preview */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Pratinjau Format Dokumen Rapor Resmi</span>
              </h3>
              <span className="text-xs text-slate-500 font-medium">Ukuran Kertas A4 Standar</span>
            </div>

            {/* Document Mockup */}
            <div className="bg-slate-50 text-slate-900 rounded-2xl p-6 shadow-inner text-xs border border-slate-200 font-sans space-y-4 max-h-[550px] overflow-y-auto">
              
              {/* KOP Surat Pesantren */}
              <div className="text-center border-b-2 border-emerald-800 pb-3">
                <h3 className="text-base font-bold text-emerald-800 tracking-wide">
                  PESANTREN TAHFIDZ AL-QUR'AN AL-HIKMAH
                </h3>
                <p className="text-[10px] text-slate-600">
                  Lembaga Pendidikan & Pembinaan Penghafal Al-Qur'an Berkarakter Qur'ani
                </p>
                <p className="text-[9px] text-slate-500">
                  Jl. Pesantren No. 99 | Telp: (021) 8876-5432 | Web: www.tahfidzalhikmah.sch.id
                </p>
              </div>

              {/* Title */}
              <div className="text-center">
                <h4 className="font-bold text-sm text-slate-800 underline">
                  LEMBAR EVALUASI TAHFIDZ & KARAKTER SANTRI
                </h4>
                <p className="text-[10px] text-slate-500 italic">Tahun Ajaran 2025/2026 - Periode Berjalan</p>
              </div>

              {/* Biodata Grid */}
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[11px]">
                <div>
                  <p><span className="font-semibold text-slate-600">ID Santri:</span> {activeSantri.id}</p>
                  <p><span className="font-semibold text-slate-600">Nama:</span> <strong>{activeSantri.nama}</strong></p>
                  <p><span className="font-semibold text-slate-600">Kelas:</span> {activeSantri.kelas}</p>
                </div>
                <div>
                  <p><span className="font-semibold text-slate-600">Halaqah:</span> {activeSantri.halaqah}</p>
                  <p><span className="font-semibold text-slate-600">Musyrif:</span> {activeSantri.musyrif}</p>
                  <p><span className="font-semibold text-slate-600">Indeks Disiplin:</span> {activeSantri.poinDisiplin}/100</p>
                </div>
              </div>

              {/* Section 1: Tahfidz Table */}
              <div className="space-y-1">
                <h5 className="font-bold text-xs text-emerald-800">I. Capaian & Nilai Tahfidz</h5>
                <table className="w-full text-[10px] border border-slate-300">
                  <thead className="bg-emerald-800 text-white font-semibold">
                    <tr>
                      <th className="p-1 border border-slate-300">Target</th>
                      <th className="p-1 border border-slate-300">Selesai</th>
                      <th className="p-1 border border-slate-300">% Capaian</th>
                      <th className="p-1 border border-slate-300">Surah / Hal</th>
                      <th className="p-1 border border-slate-300">Setoran/Mg</th>
                      <th className="p-1 border border-slate-300">Nilai</th>
                      <th className="p-1 border border-slate-300">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-center divide-y divide-slate-200">
                    <tr>
                      <td className="p-1 border border-slate-300">{activeSantri.targetJuz} Juz</td>
                      <td className="p-1 border border-slate-300">{activeSantri.juzSelesai} Juz</td>
                      <td className="p-1 border border-slate-300">{Math.round((activeSantri.juzSelesai / activeSantri.targetJuz) * 100)}%</td>
                      <td className="p-1 border border-slate-300">{activeSantri.surahTerakhir} (Hal {activeSantri.halamanTerakhir})</td>
                      <td className="p-1 border border-slate-300">{activeSantri.setoranPerMinggu}x</td>
                      <td className="p-1 border border-slate-300 font-bold">{activeSantri.nilaiTahfidz}</td>
                      <td className="p-1 border border-slate-300 font-semibold text-emerald-700">{activeSantri.status}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Section 2: Prestasi */}
              <div className="space-y-1">
                <h5 className="font-bold text-xs text-emerald-800">II. Riwayat Prestasi</h5>
                {activeSantri.prestasiList.length > 0 ? (
                  <div className="space-y-1">
                    {activeSantri.prestasiList.map((p, idx) => (
                      <div key={idx} className="bg-amber-50 p-1.5 rounded border border-amber-200 text-[10px] flex justify-between">
                        <div>
                          <strong className="text-slate-800">{p.judul}</strong> ({p.tingkat} • {p.kategori})
                        </div>
                        <span className="font-bold text-emerald-700">+{p.poinPlus} Poin</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-500 italic">Belum ada catatan prestasi tambahan pada periode ini.</p>
                )}
              </div>

              {/* Section 3: Disiplin */}
              <div className="space-y-1">
                <h5 className="font-bold text-xs text-emerald-800">III. Catatan Kedisiplinan & Akhlak</h5>
                {activeSantri.disiplinList.length > 0 ? (
                  <div className="space-y-1">
                    {activeSantri.disiplinList.map((d, idx) => (
                      <div key={idx} className="bg-rose-50 p-1.5 rounded border border-rose-200 text-[10px] flex justify-between">
                        <div>
                          <span className="font-semibold">{d.deskripsi}</span> ({d.sanksi})
                        </div>
                        <span className="font-bold text-rose-600">-{d.poinMinus} Poin</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-emerald-700 font-medium">Alhamdulillah, tertib dan nihil pelanggaran tercatat.</p>
                )}
              </div>

              {/* Signatures */}
              <div className="pt-4 grid grid-cols-3 text-center text-[10px] text-slate-700">
                <div>
                  <p>Wali Santri,</p>
                  <div className="h-10"></div>
                  <p className="font-bold">( {activeSantri.waliSantri} )</p>
                </div>
                <div>
                  <p>Musyrif Pembimbing,</p>
                  <div className="h-10"></div>
                  <p className="font-bold">( {activeSantri.musyrif} )</p>
                </div>
                <div>
                  <p>Mudir Pesantren,</p>
                  <div className="h-10"></div>
                  <p className="font-bold">( KH. Abdullah Syafi'i )</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Batch Class Summary PDF */}
      {reportType === 'batch' && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Ekspor Rekapitulasi Data Santri (Format Spreadsheet / PDF)</h3>
              <p className="text-xs text-slate-500 font-medium">Unduh rangkuman seluruh data tahfidz, nilai, dan statistik santri dalam dokumen PDF multi-halaman.</p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="bg-slate-50 border border-slate-200 p-2.5 rounded-2xl text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-emerald-500"
              >
                <option value="all">Semua Kelas ({santriList.length} Santri)</option>
                {classes.map((k) => (
                  <option key={k} value={k}>
                    Kelas {k} ({santriList.filter((s) => s.kelas === k).length} Santri)
                  </option>
                ))}
              </select>

              <button
                onClick={handleExportBatch}
                disabled={isExporting}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{isExporting ? 'Menghasilkan PDF...' : 'Unduh Rekapitulasi PDF'}</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs text-slate-700">
            <p className="font-bold text-slate-900 mb-2">Rincian Data yang akan Dicantumkan dalam Dokumen PDF:</p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-600 font-medium">
              <li>Header Pesantren Resmi & Tanggal Pembuatan Laporan</li>
              <li>Nomor Urut, ID Santri, Nama Lengkap, dan Kelas</li>
              <li>Target Juz, Capaian Juz Selesai, dan Persentase Kelulusan</li>
              <li>Surah Terakhir & Halaman Terakhir yang Sedang Dipelajari</li>
              <li>Rata-rata Frekuensi Setoran per Pekan</li>
              <li>Nilai Akhir Ujian Tahfidz beserta Predikat Mutqin (Sangat Baik / Baik / Perlu Bimbingan)</li>
              <li>Akumulasi Piagam Prestasi & Indeks Poin Kedisiplinan Santri</li>
            </ul>
          </div>
        </div>
      )}

    </div>
  );
};
