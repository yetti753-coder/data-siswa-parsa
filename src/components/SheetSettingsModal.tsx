import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  FileSpreadsheet, 
  ExternalLink, 
  Check, 
  RotateCcw, 
  RefreshCw, 
  Upload,
  AlertCircle
} from 'lucide-react';
import { SheetConfig } from '../types';
import { DEFAULT_SHEET_ID, DEFAULT_GID } from '../services/sheetsService';

interface SheetSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SheetConfig;
  onSaveConfig: (newConfig: SheetConfig) => void;
  onRefreshData: () => void;
  onResetCustomData: () => void;
  onCustomCsvUpload: (csvText: string) => void;
}

export const SheetSettingsModal: React.FC<SheetSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  onRefreshData,
  onResetCustomData,
  onCustomCsvUpload,
}) => {
  if (!isOpen) return null;

  const [sheetId, setSheetId] = useState(config.sheetId);
  const [gid, setGid] = useState(config.gid);
  const [autoSync, setAutoSync] = useState(config.autoSync);
  const [syncInterval, setSyncInterval] = useState(config.syncIntervalSeconds);
  const [urlInput, setUrlInput] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  // Extract ID and GID from URL if pasted
  const handleParseUrl = () => {
    if (!urlInput.trim()) return;
    try {
      const matchId = urlInput.match(/\/d\/([a-zA-Z0-9-_]+)/);
      const matchGid = urlInput.match(/gid=([0-9]+)/);
      if (matchId && matchId[1]) {
        setSheetId(matchId[1]);
      }
      if (matchGid && matchGid[1]) {
        setGid(matchGid[1]);
      }
      setStatusMsg('URL spreadsheet berhasil dianalisis!');
      setTimeout(() => setStatusMsg(''), 3000);
    } catch (e) {
      setStatusMsg('Format URL tidak dikenali');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      sheetId: sheetId.trim(),
      gid: gid.trim(),
      sheetUrl: `https://docs.google.com/spreadsheets/d/${sheetId.trim()}/edit#gid=${gid.trim()}`,
      autoSync,
      syncIntervalSeconds: Number(syncInterval),
    });
    setStatusMsg('Pengaturan tersimpan & memuat data...');
    setTimeout(() => {
      onRefreshData();
      onClose();
    }, 500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (text) {
        onCustomCsvUpload(text);
        setStatusMsg('File CSV berhasil diimpor!');
        setTimeout(() => onClose(), 800);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl p-5 sm:p-6 shadow-2xl animate-in fade-in zoom-in-95 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Sumber Data Google Sheets</h3>
              <p className="text-xs text-slate-500 font-medium">Konfigurasi sinkronisasi spreadsheet & pembaruan berkala</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {statusMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{statusMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          
          {/* Quick URL Paste */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <label className="block font-bold text-slate-700">
              Tempel Tautan Google Sheet Lengkap
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="https://docs.google.com/spreadsheets/d/.../edit#gid=..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-1 bg-white border border-slate-200 px-3.5 py-2 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-medium"
              />
              <button
                type="button"
                onClick={handleParseUrl}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl cursor-pointer shadow-xs transition-colors"
              >
                Analisis URL
              </button>
            </div>
          </div>

          {/* ID & GID Manual inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Spreadsheet ID</label>
              <input
                type="text"
                required
                value={sheetId}
                onChange={(e) => setSheetId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-2xl text-slate-900 font-mono font-medium focus:outline-none focus:bg-white focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Sheet GID</label>
              <input
                type="text"
                required
                value={gid}
                onChange={(e) => setGid(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-2xl text-slate-900 font-mono font-medium focus:outline-none focus:bg-white focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Auto-Sync settings */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Sinkronisasi Otomatis (Real-time Polling)</span>
                <span className="text-[11px] text-slate-500 font-medium">Pembaruan data otomatis dari spreadsheet tanpa reload</span>
              </div>
              <input
                type="checkbox"
                checked={autoSync}
                onChange={(e) => setAutoSync(e.target.checked)}
                className="w-4 h-4 text-emerald-600 bg-white border-slate-300 rounded-md focus:ring-emerald-500 cursor-pointer"
              />
            </div>

            {autoSync && (
              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <span className="text-slate-700 font-medium">Interval Sinkronisasi:</span>
                <select
                  value={syncInterval}
                  onChange={(e) => setSyncInterval(Number(e.target.value))}
                  className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-slate-800 font-medium focus:outline-none focus:border-emerald-500"
                >
                  <option value={15}>Setiap 15 Detik</option>
                  <option value={30}>Setiap 30 Detik (Direkomendasikan)</option>
                  <option value={60}>Setiap 1 Menit</option>
                  <option value={300}>Setiap 5 Menit</option>
                </select>
              </div>
            )}
          </div>

          {/* Manual CSV upload & Reset Overrides */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
            <label className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer transition-colors border border-slate-200">
              <Upload className="w-3.5 h-3.5" />
              <span>Unggah File CSV Lokal</span>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={() => {
                if (confirm('Reset semua catatan prestasi dan modifikasi lokal ke setelan bawaan?')) {
                  onResetCustomData();
                  setStatusMsg('Data modifikasi lokal telah direset.');
                }
              }}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-rose-600 font-medium transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Modifikasi Lokal</span>
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-sm transition-all cursor-pointer"
            >
              Simpan & Hubungkan
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
