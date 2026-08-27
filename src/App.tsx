import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  fetchSheetData, 
  DEFAULT_SHEET_ID, 
  DEFAULT_GID, 
  saveSantriOverride,
  getStoredOverrides
} from './services/sheetsService';
import { exportSantriReportPDF, exportBatchSummaryPDF } from './services/pdfService';
import { Santri, FilterState, SheetConfig, PrestasiRecord, DisiplinRecord } from './types';
import { Navbar } from './components/Navbar';
import { StatCards } from './components/StatCards';
import { AnalyticsSection } from './components/AnalyticsSection';
import { SantriFilterBar } from './components/SantriFilterBar';
import { SantriCard } from './components/SantriCard';
import { SantriTable } from './components/SantriTable';
import { SantriDetailView } from './components/SantriDetailView';
import { AddRecordModal } from './components/AddRecordModal';
import { SheetSettingsModal } from './components/SheetSettingsModal';
import { PdfExportModal } from './components/PdfExportModal';
import { TvDisplayView } from './components/TvDisplayView';
import { PrayerTimesWidget } from './components/PrayerTimesWidget';
import { 
  AlertCircle, 
  RefreshCw, 
  FileSpreadsheet, 
  CheckCircle2, 
  Layers, 
  Sparkles,
  ExternalLink,
  BookOpen,
  Tv,
  Compass
} from 'lucide-react';
import confetti from 'canvas-confetti';

const INITIAL_FILTER: FilterState = {
  search: '',
  kelas: 'all',
  status: 'all',
  targetJuz: 'all',
  minNilai: 0,
  maxNilai: 100,
  kategoriPrestasi: 'all',
  statusDisiplin: 'all',
  sortBy: 'nilaiTahfidz',
  sortOrder: 'desc',
};

const INITIAL_SHEET_CONFIG: SheetConfig = {
  sheetId: DEFAULT_SHEET_ID,
  gid: DEFAULT_GID,
  sheetUrl: `https://docs.google.com/spreadsheets/d/${DEFAULT_SHEET_ID}/edit#gid=${DEFAULT_GID}`,
  autoSync: true,
  syncIntervalSeconds: 30,
};

export default function App() {
  const [santriList, setSantriList] = useState<Santri[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string>('');
  
  const [activeNavTab, setActiveNavTab] = useState<'analytics' | 'directory' | 'reports'>('directory');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [filterState, setFilterState] = useState<FilterState>(INITIAL_FILTER);
  
  // Modals & Display modes state
  const [isTvModeOpen, setIsTvModeOpen] = useState<boolean>(false);
  const [selectedSantri, setSelectedSantri] = useState<Santri | null>(null);
  const [addRecordState, setAddRecordState] = useState<{
    type: 'prestasi' | 'disiplin' | null;
    santri: Santri | null;
  }>({ type: null, santri: null });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [sheetConfig, setSheetConfig] = useState<SheetConfig>(() => {
    try {
      const saved = localStorage.getItem('sims_sheet_config');
      return saved ? JSON.parse(saved) : INITIAL_SHEET_CONFIG;
    } catch {
      return INITIAL_SHEET_CONFIG;
    }
  });

  // Load Data from Google Sheets
  const loadData = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    setError(null);
    try {
      const result = await fetchSheetData(sheetConfig.sheetId, sheetConfig.gid);
      setSantriList(result.santriList);
      setLastSyncedAt(result.fetchedAt);
    } catch (err: any) {
      console.error('Failed to load sheet data:', err);
      setError(err?.message || 'Gagal memuat data dari spreadsheet. Periksa koneksi internet Anda.');
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, [sheetConfig.sheetId, sheetConfig.gid]);

  // Initial load
  useEffect(() => {
    loadData(true);
  }, [loadData]);

  // Auto-sync timer
  useEffect(() => {
    if (!sheetConfig.autoSync) return;
    const intervalMs = Math.max(10, sheetConfig.syncIntervalSeconds) * 1000;
    const timer = setInterval(() => {
      loadData(false);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [sheetConfig.autoSync, sheetConfig.syncIntervalSeconds, loadData]);

  // Save config
  const handleSaveConfig = (newConfig: SheetConfig) => {
    setSheetConfig(newConfig);
    try {
      localStorage.setItem('sims_sheet_config', JSON.stringify(newConfig));
    } catch (e) {
      console.error(e);
    }
  };

  // Unique classes for filter
  const classList = useMemo(() => {
    return Array.from(new Set(santriList.map((s) => s.kelas))).filter(Boolean).sort();
  }, [santriList]);

  // Filtered & Sorted Santri List
  const filteredSantriList = useMemo(() => {
    return santriList.filter((s) => {
      // 1. Search (Name, ID, Surah, NISN)
      if (filterState.search.trim()) {
        const query = filterState.search.toLowerCase();
        const matchName = s.nama.toLowerCase().includes(query);
        const matchId = s.id.toLowerCase().includes(query);
        const matchSurah = s.surahTerakhir.toLowerCase().includes(query);
        const matchNisn = s.nisn.toLowerCase().includes(query);
        if (!matchName && !matchId && !matchSurah && !matchNisn) return false;
      }

      // 2. Kelas
      if (filterState.kelas !== 'all' && s.kelas !== filterState.kelas) {
        return false;
      }

      // 3. Status Tahfidz
      if (filterState.status !== 'all') {
        const statusLower = s.status.toLowerCase();
        const filterLower = filterState.status.toLowerCase();
        if (filterLower.includes('sangat baik') && !statusLower.includes('sangat baik')) return false;
        if (filterLower.includes('perlu bimbingan') && !statusLower.includes('perlu bimbingan')) return false;
        if (filterLower === 'baik' && (statusLower.includes('sangat') || statusLower.includes('perlu'))) return false;
      }

      // 4. Target Juz
      if (filterState.targetJuz !== 'all' && s.targetJuz !== Number(filterState.targetJuz)) {
        return false;
      }

      // 5. Prestasi
      if (filterState.kategoriPrestasi === 'has_prestasi' && s.prestasiList.length === 0) {
        return false;
      }
      if (filterState.kategoriPrestasi !== 'all' && filterState.kategoriPrestasi !== 'has_prestasi') {
        const hasKat = s.prestasiList.some((p) => p.kategori === filterState.kategoriPrestasi);
        if (!hasKat) return false;
      }

      // 6. Disiplin
      if (filterState.statusDisiplin === '100' && s.poinDisiplin < 100) {
        return false;
      }
      if (filterState.statusDisiplin === 'has_infraction' && s.disiplinList.length === 0) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      let comparison = 0;
      if (filterState.sortBy === 'nilaiTahfidz') {
        comparison = a.nilaiTahfidz - b.nilaiTahfidz;
      } else if (filterState.sortBy === 'juzSelesai') {
        comparison = a.juzSelesai - b.juzSelesai;
      } else if (filterState.sortBy === 'setoranPerMinggu') {
        comparison = a.setoranPerMinggu - b.setoranPerMinggu;
      } else if (filterState.sortBy === 'poinDisiplin') {
        comparison = a.poinDisiplin - b.poinDisiplin;
      } else if (filterState.sortBy === 'nama') {
        comparison = a.nama.localeCompare(b.nama);
      }

      return filterState.sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [santriList, filterState]);

  // Handler to add new Prestasi
  const handleSavePrestasi = (santriId: string, record: PrestasiRecord) => {
    setSantriList((prev) =>
      prev.map((s) => {
        if (s.id === santriId) {
          const updatedPrestasi = [record, ...s.prestasiList];
          saveSantriOverride(santriId, { prestasiList: updatedPrestasi });
          return { ...s, prestasiList: updatedPrestasi };
        }
        return s;
      })
    );
    if (selectedSantri && selectedSantri.id === santriId) {
      setSelectedSantri((prev) => prev ? { ...prev, prestasiList: [record, ...prev.prestasiList] } : null);
    }
    confetti({ particleCount: 50, spread: 50 });
  };

  // Handler to add new Disiplin
  const handleSaveDisiplin = (santriId: string, record: DisiplinRecord) => {
    setSantriList((prev) =>
      prev.map((s) => {
        if (s.id === santriId) {
          const updatedDisiplin = [record, ...s.disiplinList];
          const updatedPoin = Math.max(0, s.poinDisiplin - record.poinMinus);
          saveSantriOverride(santriId, {
            disiplinList: updatedDisiplin,
            poinDisiplin: updatedPoin,
          });
          return {
            ...s,
            disiplinList: updatedDisiplin,
            poinDisiplin: updatedPoin,
          };
        }
        return s;
      })
    );
    if (selectedSantri && selectedSantri.id === santriId) {
      setSelectedSantri((prev) =>
        prev
          ? {
              ...prev,
              disiplinList: [record, ...prev.disiplinList],
              poinDisiplin: Math.max(0, prev.poinDisiplin - record.poinMinus),
            }
          : null
      );
    }
  };

  // Handler to update photo
  const handleUpdatePhoto = (santriId: string, newPhotoUrl: string) => {
    setSantriList((prev) =>
      prev.map((s) => {
        if (s.id === santriId) {
          saveSantriOverride(santriId, { fotoUrl: newPhotoUrl });
          return { ...s, fotoUrl: newPhotoUrl };
        }
        return s;
      })
    );
    if (selectedSantri && selectedSantri.id === santriId) {
      setSelectedSantri((prev) => prev ? { ...prev, fotoUrl: newPhotoUrl } : null);
    }
  };

  // Reset custom local storage data
  const handleResetCustomData = () => {
    try {
      localStorage.removeItem('sims_santri_overrides_v1');
      loadData(true);
    } catch (e) {
      console.error(e);
    }
  };

  // Custom CSV text upload
  const handleCustomCsvUpload = (csvText: string) => {
    // Process uploaded CSV data
    loadData(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Top Sticky Navbar */}
      <Navbar
        activeTab={activeNavTab}
        setActiveTab={setActiveNavTab}
        isLoading={isLoading}
        lastSyncedAt={lastSyncedAt}
        onRefresh={() => loadData(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenTvMode={() => setIsTvModeOpen(true)}
        sheetConfig={sheetConfig}
        totalSantri={santriList.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* Error Alert if any */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start justify-between gap-3 shadow-sm">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold">Koneksi Spreadsheet Bermasalah</h4>
                <p className="text-xs text-rose-700 mt-0.5">{error}</p>
              </div>
            </div>
            <button
              onClick={() => loadData(true)}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shrink-0 cursor-pointer"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* TV Mode Quick Launch Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-emerald-950 rounded-3xl p-4 sm:p-5 text-white border border-emerald-800/40 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
              <Tv className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black tracking-tight text-white">
                  Mode Layar TV & Digital Signage (Rotasi 10 Detik)
                </h3>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  Kiosk Auto-Play
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Tampilkan profil, foto santri, capaian tahfidz, dan jadwal sholat di layar TV aula/lobi yang berganti otomatis setiap 10 detik.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsTvModeOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-emerald-600/40 transition-all cursor-pointer shrink-0"
          >
            <Tv className="w-4 h-4" />
            <span>Buka Layar Penuh TV</span>
          </button>
        </div>

        {/* Jadwal Sholat Real-Time Widget */}
        <PrayerTimesWidget />

        {/* Top Summary Statistics Cards */}
        <StatCards
          santriList={santriList}
          filteredCount={filteredSantriList.length}
        />

        {/* TAB 1: ANALYTICS & CHARTS */}
        {activeNavTab === 'analytics' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <AnalyticsSection
              santriList={santriList}
              onSelectSantri={(santri) => setSelectedSantri(santri)}
              onSelectClass={(kelas) => {
                setFilterState((prev) => ({ ...prev, kelas }));
                setActiveNavTab('directory');
              }}
            />
          </div>
        )}

        {/* TAB 2: SANTRI DIRECTORY (GRID / TABLE) */}
        {activeNavTab === 'directory' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            
            {/* Filter and Search Bar */}
            <SantriFilterBar
              filterState={filterState}
              setFilterState={setFilterState}
              classList={classList}
              totalResults={filteredSantriList.length}
              viewMode={viewMode}
              setViewMode={setViewMode}
              onExportPdf={() => exportBatchSummaryPDF(filteredSantriList, 'Hasil Filter Direktori')}
              onReset={() => setFilterState(INITIAL_FILTER)}
            />

            {/* Results Header */}
            <div className="flex items-center justify-between px-1 text-xs text-slate-500">
              <span>
                Menampilkan <strong className="text-emerald-600 font-bold">{filteredSantriList.length}</strong> dari {santriList.length} santri
                {filterState.kelas !== 'all' && ` (Kelas ${filterState.kelas})`}
              </span>
              <span className="hidden sm:inline">
                Klik kartu santri untuk melihat profil & riwayat bento lengkap
              </span>
            </div>

            {/* Loading Indicator */}
            {isLoading && santriList.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3 bg-white rounded-3xl border border-slate-200 shadow-sm">
                <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
                <p className="text-sm font-semibold text-slate-800">
                  Mengambil data real-time dari Google Sheets...
                </p>
                <p className="text-xs text-slate-400">Spreadsheet ID: {sheetConfig.sheetId.slice(0, 16)}...</p>
              </div>
            ) : viewMode === 'grid' ? (
              /* Grid Mode */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredSantriList.map((santri) => (
                  <SantriCard
                    key={santri.id}
                    santri={santri}
                    onViewDetail={(s) => setSelectedSantri(s)}
                    onExportPdf={(s) => exportSantriReportPDF(s)}
                  />
                ))}
              </div>
            ) : (
              /* Table Mode */
              <SantriTable
                santriList={filteredSantriList}
                onViewDetail={(s) => setSelectedSantri(s)}
                onExportPdf={(s) => exportSantriReportPDF(s)}
              />
            )}

          </div>
        )}

        {/* TAB 3: PDF EXPORT & REPORT CARD CENTER */}
        {activeNavTab === 'reports' && (
          <div className="animate-in fade-in duration-200">
            <PdfExportModal
              santriList={santriList}
              filteredSantriList={filteredSantriList}
              onSelectSantri={(s) => setSelectedSantri(s)}
            />
          </div>
        )}

      </main>

      {/* TV Display Fullscreen View */}
      {isTvModeOpen && (
        <TvDisplayView
          santriList={santriList}
          onClose={() => setIsTvModeOpen(false)}
          lastSyncedAt={lastSyncedAt}
          onRefresh={() => loadData(true)}
          sheetId={sheetConfig.sheetId}
        />
      )}

      {/* Detail Modal for Selected Santri */}
      {selectedSantri && (
        <SantriDetailView
          santri={selectedSantri}
          onClose={() => setSelectedSantri(null)}
          onExportPdf={(s) => exportSantriReportPDF(s)}
          onOpenAddPrestasi={(s) => setAddRecordState({ type: 'prestasi', santri: s })}
          onOpenAddDisiplin={(s) => setAddRecordState({ type: 'disiplin', santri: s })}
          onUpdatePhoto={handleUpdatePhoto}
        />
      )}

      {/* Add Record (Prestasi / Disiplin) Modal */}
      {addRecordState.type && addRecordState.santri && (
        <AddRecordModal
          type={addRecordState.type}
          santri={addRecordState.santri}
          onClose={() => setAddRecordState({ type: null, santri: null })}
          onSavePrestasi={handleSavePrestasi}
          onSaveDisiplin={handleSaveDisiplin}
        />
      )}

      {/* Google Sheet Configuration Modal */}
      <SheetSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={sheetConfig}
        onSaveConfig={handleSaveConfig}
        onRefreshData={() => loadData(true)}
        onResetCustomData={handleResetCustomData}
        onCustomCsvUpload={handleCustomCsvUpload}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-5 text-center text-xs text-slate-500 mt-12 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="flex items-center gap-1.5 justify-center">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span className="font-medium text-slate-700">Pesantren Tahfidz Al-Qur'an • SIMS Real-Time Google Sheets</span>
          </p>
          <p className="text-slate-400">
            Terhubung ke Google Spreadsheet ID: <span className="font-mono text-emerald-600 font-semibold">{sheetConfig.sheetId.slice(0, 10)}...</span> (GID: {sheetConfig.gid})
          </p>
        </div>
      </footer>

    </div>
  );
}
