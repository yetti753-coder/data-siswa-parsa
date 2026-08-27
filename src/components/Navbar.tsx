import React from 'react';
import { 
  RefreshCw, 
  FileSpreadsheet, 
  ExternalLink, 
  Settings, 
  BarChart3, 
  Users, 
  FileText, 
  ShieldCheck,
  GraduationCap,
  Tv
} from 'lucide-react';
import { SheetConfig } from '../types';

interface NavbarProps {
  activeTab: 'analytics' | 'directory' | 'reports';
  setActiveTab: (tab: 'analytics' | 'directory' | 'reports') => void;
  isLoading: boolean;
  lastSyncedAt: string;
  onRefresh: () => void;
  onOpenSettings: () => void;
  onOpenTvMode: () => void;
  sheetConfig: SheetConfig;
  totalSantri: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isLoading,
  lastSyncedAt,
  onRefresh,
  onOpenSettings,
  onOpenTvMode,
  sheetConfig,
  totalSantri,
}) => {
  const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${sheetConfig.sheetId}/edit#gid=${sheetConfig.gid}`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Banner with Real-time Status */}
      <div className="bg-emerald-50 border-b border-emerald-100/80 px-4 py-2 text-xs text-emerald-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
            </span>
            <span className="font-bold text-emerald-900">Live Sync Google Sheets:</span>
            <span className="font-mono text-emerald-700 hidden sm:inline truncate max-w-[280px]">
              ID: {sheetConfig.sheetId.slice(0, 12)}... (GID: {sheetConfig.gid})
            </span>
            <a
              href={spreadsheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-medium underline decoration-emerald-400 hover:decoration-emerald-700 transition-colors ml-1"
              title="Buka Spreadsheet di Google Sheets"
            >
              <span>Buka Sheet</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-emerald-800 text-xs">
              Update Terakhir: <strong className="text-emerald-950 font-bold">{lastSyncedAt || 'Menghubungkan...'}</strong>
            </span>
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
              title="Sinkronisasi Data Sekarang"
            >
              <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden xs:inline">Sinkron Ulang</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Nav Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">SIMS TAHFIDZ <span className="text-emerald-600 text-sm font-semibold">v2.0</span></h1>
                <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                  {totalSantri} Santri Aktif
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Sistem Monitoring & Evaluasi Prestasi Santri Real-Time
              </p>
            </div>
          </div>

          {/* Mobile TV & Settings buttons */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={onOpenTvMode}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-bold shadow-xs"
              title="Buka Mode Layar TV (Rotasi Otomatis 10 Detik)"
            >
              <Tv className="w-3.5 h-3.5 text-emerald-400" />
              <span>TV</span>
            </button>
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
              title="Pengaturan Koneksi Sheet"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* View Switcher Tabs & Actions */}
        <div className="flex items-center justify-between md:justify-end gap-2 flex-wrap sm:flex-nowrap">
          <nav className="flex items-center p-1 bg-slate-100/90 rounded-2xl border border-slate-200 overflow-x-auto">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analisis & Grafik</span>
            </button>

            <button
              onClick={() => setActiveTab('directory')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'directory'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Direktori Santri ({totalSantri})</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'reports'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Cetak Laporan / PDF</span>
            </button>
          </nav>

          {/* TV Display Button (Desktop) */}
          <button
            onClick={onOpenTvMode}
            className="hidden md:inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-emerald-950 hover:from-slate-800 hover:to-emerald-900 text-emerald-300 border border-emerald-700/50 text-xs font-black shadow-md hover:shadow-emerald-900/30 transition-all cursor-pointer group"
            title="Buka Mode Tampilan TV Monitor (Rotasi 10 Detik Otomatis)"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Tv className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>Mode TV (10s)</span>
          </button>

          {/* Desktop Settings & Info */}
          <button
            onClick={onOpenSettings}
            className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 text-xs font-bold shadow-sm transition-all cursor-pointer"
            title="Konfigurasi Sumber Data Spreadsheet"
          >
            <Settings className="w-4 h-4 text-emerald-600" />
            <span>Sumber Data</span>
          </button>
        </div>
      </div>
    </header>
  );
};
