import React, { useState } from 'react';
import { 
  X, 
  Award, 
  ShieldCheck, 
  BookOpen, 
  FileText, 
  Plus, 
  Calendar, 
  User, 
  Phone, 
  Home, 
  GraduationCap, 
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Download,
  Share2,
  Camera
} from 'lucide-react';
import { Santri, PrestasiRecord, DisiplinRecord } from '../types';
import { formatPhotoUrl } from '../services/sheetsService';
import confetti from 'canvas-confetti';

interface SantriDetailViewProps {
  santri: Santri | null;
  onClose: () => void;
  onExportPdf: (santri: Santri) => void;
  onOpenAddPrestasi: (santri: Santri) => void;
  onOpenAddDisiplin: (santri: Santri) => void;
  onUpdatePhoto: (santriId: string, newPhotoUrl: string) => void;
}

export const SantriDetailView: React.FC<SantriDetailViewProps> = ({
  santri,
  onClose,
  onExportPdf,
  onOpenAddPrestasi,
  onOpenAddDisiplin,
  onUpdatePhoto,
}) => {
  if (!santri) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'prestasi' | 'disiplin'>('overview');
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [newPhotoInput, setNewPhotoInput] = useState('');

  const percentJuz = Math.min(100, Math.round((santri.juzSelesai / (santri.targetJuz || 1)) * 100));
  const sisaJuz = Math.max(0, santri.targetJuz - santri.juzSelesai);

  const isSangatBaik = santri.status.toLowerCase().includes('sangat baik') || santri.nilaiTahfidz >= 90;
  const isPerluBimbingan = santri.status.toLowerCase().includes('perlu bimbingan') || santri.nilaiTahfidz < 80;

  const handleCelebrate = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPhotoInput.trim()) {
      const formatted = formatPhotoUrl(newPhotoInput.trim());
      onUpdatePhoto(santri.id, formatted);
      setIsEditingPhoto(false);
      setNewPhotoInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header Bento Card */}
        <div className="bg-gradient-to-r from-emerald-50/70 via-slate-50/90 to-white p-5 sm:p-6 border-b border-slate-200 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer shadow-xs"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Santri Photo & Avatar controls */}
            <div className="relative group shrink-0">
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
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-4 ring-emerald-500/20 shadow-md bg-slate-100 border border-slate-200"
              />
              <button
                onClick={() => {
                  setIsEditingPhoto(!isEditingPhoto);
                  setNewPhotoInput(santri.fotoUrl);
                }}
                className="absolute inset-0 bg-slate-900/60 rounded-3xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer text-xs gap-1"
                title="Ganti Foto Profil"
              >
                <Camera className="w-4 h-4" />
                <span>Ubah</span>
              </button>
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-100/80 border border-emerald-200 px-2 py-0.5 rounded-lg">
                  {santri.id}
                </span>
                <span className="text-xs text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-lg font-medium">
                  NISN: {santri.nisn}
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  isSangatBaik
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : isPerluBimbingan
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-sky-50 text-sky-700 border-sky-200'
                }`}>
                  {santri.status}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span>{santri.nama}</span>
                {santri.nilaiTahfidz >= 95 && (
                  <button
                    onClick={handleCelebrate}
                    className="text-yellow-500 hover:scale-110 transition-transform cursor-pointer"
                    title="Rayakan Prestasi Mumtaz!"
                  >
                    <Sparkles className="w-5 h-5" />
                  </button>
                )}
              </h2>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 mt-1 font-medium">
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                  Kelas {santri.kelas}
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                  {santri.halaqah}
                </span>
                <span className="flex items-center gap-1">
                  <Home className="w-3.5 h-3.5 text-amber-600" />
                  {santri.kamar}
                </span>
              </div>
            </div>

            {/* Quick PDF button in header */}
            <div className="sm:self-center shrink-0">
              <button
                onClick={() => onExportPdf(santri)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-sm transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Rapor PDF</span>
              </button>
            </div>
          </div>

          {/* Photo Edit Input form if open */}
          {isEditingPhoto && (
            <form onSubmit={handleSavePhoto} className="mt-3 flex items-center gap-2 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm">
              <input
                type="url"
                placeholder="Masukkan URL foto baru (https://...)"
                value={newPhotoInput}
                onChange={(e) => setNewPhotoInput(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Simpan
              </button>
              <button
                type="button"
                onClick={() => setIsEditingPhoto(false)}
                className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-900"
              >
                Batal
              </button>
            </form>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 px-4 sm:px-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'overview'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Progres Tahfidz & Akademik</span>
          </button>

          <button
            onClick={() => setActiveTab('prestasi')}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'prestasi'
                ? 'border-yellow-500 text-yellow-800 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Riwayat Prestasi ({santri.prestasiList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('disiplin')}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'disiplin'
                ? 'border-blue-600 text-blue-800 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Catatan Disiplin & Akhlak ({santri.disiplinList.length})</span>
          </button>
        </div>

        {/* Tab Content Container (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#F8FAFC]">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Progress Summary Bento Card */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    <span>Capaian Hafalan Al-Qur'an</span>
                  </h3>
                  <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    {percentJuz}% Selesai
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200">
                    <div
                      className="bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 h-full rounded-full transition-all duration-700"
                      style={{ width: `${percentJuz}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 font-medium">
                    <span>Mulai (Juz 1)</span>
                    <span className="font-bold text-slate-900">
                      {santri.juzSelesai} dari {santri.targetJuz} Juz Selesai
                    </span>
                    <span>Target: Juz {santri.targetJuz}</span>
                  </div>
                </div>

                {/* Metrics Bento Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <span className="text-[11px] text-slate-500 font-semibold block">Surah Terakhir</span>
                    <span className="text-sm font-bold text-slate-900">{santri.surahTerakhir}</span>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <span className="text-[11px] text-slate-500 font-semibold block">Halaman Terakhir</span>
                    <span className="text-sm font-bold text-slate-900">Hal. {santri.halamanTerakhir}</span>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <span className="text-[11px] text-slate-500 font-semibold block">Setoran / Pekan</span>
                    <span className="text-sm font-bold text-emerald-700">{santri.setoranPerMinggu}x setoran</span>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <span className="text-[11px] text-slate-500 font-semibold block">Nilai Ujian Tahfidz</span>
                    <span className={`text-base font-extrabold ${isSangatBaik ? 'text-emerald-700' : isPerluBimbingan ? 'text-amber-700' : 'text-sky-700'}`}>
                      {santri.nilaiTahfidz} / 100
                    </span>
                  </div>
                </div>
              </div>

              {/* Wali & Pengasuhan Information Bento Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Informasi Wali Santri</span>
                  </h4>
                  <div className="text-xs space-y-1.5 text-slate-700">
                    <p><span className="text-slate-500">Nama Wali:</span> <strong className="text-slate-900 font-bold">{santri.waliSantri}</strong></p>
                    <p className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-slate-500">Kontak:</span> {santri.noHpWali}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-teal-600" />
                    <span>Musyrif & Halaqah</span>
                  </h4>
                  <div className="text-xs space-y-1.5 text-slate-700">
                    <p><span className="text-slate-500">Pembimbing:</span> <strong className="text-slate-900 font-bold">{santri.musyrif}</strong></p>
                    <p><span className="text-slate-500">Grup Halaqah:</span> {santri.halaqah}</p>
                  </div>
                </div>
              </div>

              {/* Catatan Ustadz */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Catatan & Evaluasi Pembimbing Halaqah
                </h4>
                <p className="text-xs text-slate-700 italic bg-slate-50 p-4 rounded-2xl border border-slate-100 leading-relaxed">
                  "{santri.catatanUstadz}"
                </p>
              </div>

            </div>
          )}

          {/* TAB 2: RIWAYAT PRESTASI */}
          {activeTab === 'prestasi' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    <span>Daftar Riwayat Prestasi Santri</span>
                  </h3>
                  <p className="text-xs text-slate-500">Piagam penghargaan, musabaqah, dan sertifikasi resmi</p>
                </div>

                <button
                  onClick={() => onOpenAddPrestasi(santri)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-bold text-xs rounded-2xl shadow-xs transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Prestasi</span>
                </button>
              </div>

              {santri.prestasiList.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-sm">
                  <Award className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-700 text-xs font-bold">Belum Ada Catatan Prestasi Tambahan</p>
                  <p className="text-slate-400 text-[11px] mt-1">Klik tombol di atas untuk mencatat kejuaraan atau sertifikasi baru santri ini.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {santri.prestasiList.map((p) => (
                    <div
                      key={p.id}
                      className="bg-white rounded-3xl p-5 border border-yellow-200/90 shadow-sm relative overflow-hidden space-y-2 group hover:border-yellow-400 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="bg-yellow-50 text-yellow-800 border border-yellow-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                          {p.tingkat} • {p.kategori}
                        </span>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                          +{p.poinPlus} Poin
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-yellow-700 transition-colors">
                        {p.judul}
                      </h4>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {p.keterangan}
                      </p>

                      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                        <span className="flex items-center gap-1 font-medium text-slate-500">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {p.tanggal}
                        </span>
                        <span className="truncate max-w-[150px] font-medium text-slate-500">
                          {p.penyelenggara}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CATATAN DISIPLIN */}
          {activeTab === 'disiplin' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                    <span>Catatan Kedisiplinan & Akhlak</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Sistem evaluasi poin ketertiban dan pembinaan kepengasuhan
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="bg-white px-3.5 py-2 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">Indeks Disiplin:</span>
                    <span className={`text-sm font-extrabold ${santri.poinDisiplin >= 90 ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {santri.poinDisiplin} / 100
                    </span>
                  </div>

                  <button
                    onClick={() => onOpenAddDisiplin(santri)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-2xl shadow-xs transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Catat Pelanggaran</span>
                  </button>
                </div>
              </div>

              {santri.disiplinList.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 text-center border border-emerald-200 shadow-sm">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                  <p className="text-slate-900 text-xs font-bold">Alhamdulillah, Nihil Pelanggaran Disiplin</p>
                  <p className="text-slate-500 text-[11px] mt-1">Santri ini senantiasa menjaga ketertiban ibadah dan tata tertib asrama (100/100 Poin Penuh).</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {santri.disiplinList.map((d) => (
                    <div
                      key={d.id}
                      className="bg-white rounded-3xl p-5 border border-rose-200 shadow-sm space-y-2 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                            {d.tingkat} • {d.jenis}
                          </span>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                            <Calendar className="w-3 h-3" />
                            {d.tanggal}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
                          -{d.poinMinus} Poin
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900">
                        {d.deskripsi}
                      </h4>

                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs text-slate-700">
                        <span className="text-slate-500 font-bold">Tindakan / Sanksi Edukatif: </span>
                        {d.sanksi}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 font-medium">
                        <span>Pencatat: {d.pencatat}</span>
                        <span className={`px-2.5 py-0.5 rounded-full font-bold ${
                          d.status === 'Selesai' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {d.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-white p-4 sm:px-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500 font-medium">
            Terakhir disinkronkan dengan data Google Sheets
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-2xl transition-colors cursor-pointer"
            >
              Tutup
            </button>
            <button
              onClick={() => onExportPdf(santri)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Cetak Rapor Santri PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
