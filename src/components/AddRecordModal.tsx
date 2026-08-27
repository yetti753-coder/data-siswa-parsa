import React, { useState } from 'react';
import { X, Award, ShieldAlert, Plus, Check } from 'lucide-react';
import { Santri, PrestasiRecord, DisiplinRecord } from '../types';

interface AddRecordModalProps {
  type: 'prestasi' | 'disiplin' | null;
  santri: Santri | null;
  onClose: () => void;
  onSavePrestasi: (santriId: string, record: PrestasiRecord) => void;
  onSaveDisiplin: (santriId: string, record: DisiplinRecord) => void;
}

export const AddRecordModal: React.FC<AddRecordModalProps> = ({
  type,
  santri,
  onClose,
  onSavePrestasi,
  onSaveDisiplin,
}) => {
  if (!type || !santri) return null;

  // Prestasi state
  const [judul, setJudul] = useState('');
  const [tingkat, setTingkat] = useState<PrestasiRecord['tingkat']>('Kabupaten/Kota');
  const [kategori, setKategori] = useState<PrestasiRecord['kategori']>('Tahfidz');
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [penyelenggara, setPenyelenggara] = useState('');
  const [poinPlus, setPoinPlus] = useState(20);
  const [keterangan, setKeterangan] = useState('');
  const [sertifikatNo, setSertifikatNo] = useState('');

  // Disiplin state
  const [jenis, setJenis] = useState<DisiplinRecord['jenis']>('Pelanggaran Ibadah');
  const [tingkatDisiplin, setTingkatDisiplin] = useState<DisiplinRecord['tingkat']>('Ringan');
  const [deskripsi, setDeskripsi] = useState('');
  const [poinMinus, setPoinMinus] = useState(5);
  const [sanksi, setSanksi] = useState('');
  const [statusDisiplin, setStatusDisiplin] = useState<DisiplinRecord['status']>('Selesai');
  const [pencatat, setPencatat] = useState('Ust. Ahmad Zaki - Bagian Kepengasuhan');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (type === 'prestasi') {
      if (!judul.trim()) return;
      const record: PrestasiRecord = {
        id: `PRES-${Date.now()}`,
        judul: judul.trim(),
        tingkat,
        kategori,
        tanggal,
        penyelenggara: penyelenggara.trim() || 'Pesantren Al-Hikmah',
        poinPlus: Number(poinPlus),
        keterangan: keterangan.trim() || 'Pencapaian prestasi santri',
        sertifikatNo: sertifikatNo.trim() || undefined,
      };
      onSavePrestasi(santri.id, record);
    } else {
      if (!deskripsi.trim()) return;
      const record: DisiplinRecord = {
        id: `DISC-${Date.now()}`,
        tanggal,
        jenis,
        tingkat: tingkatDisiplin,
        deskripsi: deskripsi.trim(),
        poinMinus: Number(poinMinus),
        sanksi: sanksi.trim() || 'Teguran lisan dan bimbingan akhlak',
        status: statusDisiplin,
        pencatat: pencatat.trim(),
      };
      onSaveDisiplin(santri.id, record);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-5 sm:p-6 shadow-2xl animate-in fade-in zoom-in-95 space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-3">
            {type === 'prestasi' ? (
              <div className="w-10 h-10 rounded-2xl bg-yellow-50 text-yellow-600 flex items-center justify-center border border-yellow-200">
                <Award className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
                <ShieldAlert className="w-5 h-5" />
              </div>
            )}
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                {type === 'prestasi' ? 'Tambah Catatan Prestasi' : 'Tambah Catatan Disiplin'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Santri: <strong className="text-emerald-700">{santri.nama}</strong> ({santri.id})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {type === 'prestasi' ? (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Kejuaraan / Prestasi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Juara 1 MHQ 5 Juz Tingkat Provinsi"
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-2xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tingkat</label>
                  <select
                    value={tingkat}
                    onChange={(e) => setTingkat(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-2xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 font-medium"
                  >
                    <option value="Pesantren">Pesantren</option>
                    <option value="Kecamatan">Kecamatan</option>
                    <option value="Kabupaten/Kota">Kabupaten/Kota</option>
                    <option value="Provinsi">Provinsi</option>
                    <option value="Nasional">Nasional</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-2xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 font-medium"
                  >
                    <option value="Tahfidz">Tahfidz Al-Qur'an</option>
                    <option value="Akademik">Akademik & Diniyah</option>
                    <option value="Bahasa Arab/Inggris">Bahasa</option>
                    <option value="Karakter & Kedisiplinan">Karakter / Adab</option>
                    <option value="Seni & Olahraga">Seni & Olahraga</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-2xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Poin Plus (+)</label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={poinPlus}
                    onChange={(e) => setPoinPlus(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-2xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Penyelenggara</label>
                <input
                  type="text"
                  placeholder="LPTQ Kemenag / Pesantren / Pemda"
                  value={penyelenggara}
                  onChange={(e) => setPenyelenggara(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-2xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Keterangan / Rincian</label>
                <textarea
                  rows={2}
                  placeholder="Deskripsi pencapaian..."
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-2xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 font-medium"
                />
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jenis Pelanggaran</label>
                  <select
                    value={jenis}
                    onChange={(e) => setJenis(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-2xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 font-medium"
                  >
                    <option value="Pelanggaran Ibadah">Pelanggaran Ibadah</option>
                    <option value="Keterlambatan / Waktu">Keterlambatan / Waktu</option>
                    <option value="Kebersihan & Kerapian">Kebersihan & Kerapian</option>
                    <option value="Adab & Akhlak">Adab & Akhlak</option>
                    <option value="Ketertiban Asrama">Ketertiban Asrama</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tingkat</label>
                  <select
                    value={tingkatDisiplin}
                    onChange={(e) => setTingkatDisiplin(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-2xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 font-medium"
                  >
                    <option value="Ringan">Ringan (1-5 Poin)</option>
                    <option value="Sedang">Sedang (6-15 Poin)</option>
                    <option value="Berat">Berat (&gt;15 Poin)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Deskripsi Kejadian Pelanggaran *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Terlambat mengikuti shalat Shubuh berjamaah"
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-2xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Kejadian</label>
                  <input
                    type="date"
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-2xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Poin Pelanggaran (-)</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={poinMinus}
                    onChange={(e) => setPoinMinus(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-2xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 font-bold text-rose-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Sanksi / Tindakan Edukatif</label>
                <input
                  type="text"
                  placeholder="Contoh: Tilawah 1 juz & nasihat pembinaan"
                  value={sanksi}
                  onChange={(e) => setSanksi(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-2xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status Sanksi</label>
                  <select
                    value={statusDisiplin}
                    onChange={(e) => setStatusDisiplin(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-2xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 font-medium"
                  >
                    <option value="Selesai">Selesai Ditunaikan</option>
                    <option value="Dalam Pemantauan">Dalam Pemantauan</option>
                    <option value="Tindak Lanjut">Tindak Lanjut</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ustadz Pencatat</label>
                  <input
                    type="text"
                    value={pencatat}
                    onChange={(e) => setPencatat(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-2xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 font-medium"
                  />
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-2xl cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className={`px-5 py-2 text-xs font-bold rounded-2xl text-white shadow-sm transition-all cursor-pointer ${
                type === 'prestasi'
                  ? 'bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-extrabold'
                  : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              Simpan Data
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
