import React from 'react';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  LayoutGrid, 
  List, 
  SlidersHorizontal,
  Download,
  FileSpreadsheet
} from 'lucide-react';
import { FilterState } from '../types';

interface SantriFilterBarProps {
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  classList: string[];
  totalResults: number;
  viewMode: 'grid' | 'table';
  setViewMode: (mode: 'grid' | 'table') => void;
  onExportPdf: () => void;
  onReset: () => void;
}

export const SantriFilterBar: React.FC<SantriFilterBarProps> = ({
  filterState,
  setFilterState,
  classList,
  totalResults,
  viewMode,
  setViewMode,
  onExportPdf,
  onReset,
}) => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-6 space-y-4">
      {/* Top Row: Search & View Toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama santri, ID (contoh: QPS-001), surah terakhir..."
            value={filterState.search}
            onChange={(e) => setFilterState((prev) => ({ ...prev, search: e.target.value }))}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all font-medium"
          />
          {filterState.search && (
            <button
              onClick={() => setFilterState((prev) => ({ ...prev, search: '' }))}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              Hapus
            </button>
          )}
        </div>

        {/* View mode toggle & PDF Export */}
        <div className="flex items-center gap-2">
          {/* Grid / Table Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Tampilan Kartu Santri"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Tampilan Tabel Data"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Export PDF Button */}
          <button
            onClick={onExportPdf}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl transition-all shadow-sm cursor-pointer whitespace-nowrap"
            title="Ekspor Rekapitulasi ke PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor PDF ({totalResults})</span>
          </button>
        </div>
      </div>

      {/* Bottom Filter Controls Bento Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-3 border-t border-slate-100">
        {/* 1. Filter Kelas */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 mb-1">Kelas</label>
          <select
            value={filterState.kelas}
            onChange={(e) => setFilterState((prev) => ({ ...prev, kelas: e.target.value }))}
            className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-500 cursor-pointer"
          >
            <option value="all">Semua Kelas</option>
            {classList.map((k) => (
              <option key={k} value={k}>
                Kelas {k}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Filter Status Tahfidz */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 mb-1">Status Nilai</label>
          <select
            value={filterState.status}
            onChange={(e) => setFilterState((prev) => ({ ...prev, status: e.target.value }))}
            className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-500 cursor-pointer"
          >
            <option value="all">Semua Status</option>
            <option value="Sangat Baik">Sangat Baik (≥90)</option>
            <option value="Baik">Baik (80-89)</option>
            <option value="Perlu Bimbingan">Perlu Bimbingan (&lt;80)</option>
          </select>
        </div>

        {/* 3. Filter Target Juz */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 mb-1">Target Juz</label>
          <select
            value={filterState.targetJuz}
            onChange={(e) => setFilterState((prev) => ({ ...prev, targetJuz: e.target.value }))}
            className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-500 cursor-pointer"
          >
            <option value="all">Semua Target</option>
            <option value="5">5 Juz</option>
            <option value="10">10 Juz</option>
            <option value="15">15 Juz</option>
            <option value="20">20 Juz</option>
            <option value="30">30 Juz (Khatam)</option>
          </select>
        </div>

        {/* 4. Filter Prestasi */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 mb-1">Riwayat Prestasi</label>
          <select
            value={filterState.kategoriPrestasi}
            onChange={(e) => setFilterState((prev) => ({ ...prev, kategoriPrestasi: e.target.value }))}
            className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-500 cursor-pointer"
          >
            <option value="all">Semua Prestasi</option>
            <option value="has_prestasi">Memiliki Prestasi</option>
            <option value="Tahfidz">Prestasi Tahfidz</option>
            <option value="Akademik">Prestasi Akademik</option>
            <option value="Bahasa Arab/Inggris">Prestasi Bahasa</option>
          </select>
        </div>

        {/* 5. Filter Disiplin */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 mb-1">Status Disiplin</label>
          <select
            value={filterState.statusDisiplin}
            onChange={(e) => setFilterState((prev) => ({ ...prev, statusDisiplin: e.target.value }))}
            className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-500 cursor-pointer"
          >
            <option value="all">Semua Status</option>
            <option value="100">Disiplin Sempurna (100 Poin)</option>
            <option value="has_infraction">Catatan Kedisiplinan</option>
          </select>
        </div>

        {/* 6. Sort & Reset */}
        <div className="flex items-end gap-1.5">
          <div className="flex-1">
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Urutan</label>
            <select
              value={`${filterState.sortBy}_${filterState.sortOrder}`}
              onChange={(e) => {
                const [by, order] = e.target.value.split('_');
                setFilterState((prev) => ({
                  ...prev,
                  sortBy: by as any,
                  sortOrder: order as any,
                }));
              }}
              className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-500 cursor-pointer"
            >
              <option value="nilaiTahfidz_desc">Nilai Tertinggi</option>
              <option value="nilaiTahfidz_asc">Nilai Terendah</option>
              <option value="juzSelesai_desc">Juz Terbanyak</option>
              <option value="setoranPerMinggu_desc">Setoran Terbanyak</option>
              <option value="poinDisiplin_desc">Disiplin Tertinggi</option>
              <option value="nama_asc">Nama (A-Z)</option>
            </select>
          </div>

          <button
            onClick={onReset}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            title="Reset Semua Filter"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
