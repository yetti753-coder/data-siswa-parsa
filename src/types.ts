export interface Santri {
  id: string; // e.g. "QPS-001"
  nama: string; // e.g. "Salman Hidayat"
  kelas: string; // e.g. "IX A"
  targetJuz: number; // e.g. 10
  juzSelesai: number; // e.g. 6
  halamanTerakhir: number; // e.g. 2
  surahTerakhir: string; // e.g. "Al-Fil"
  setoranPerMinggu: number; // e.g. 6
  nilaiTahfidz: number; // e.g. 85
  status: 'Sangat Baik' | 'Baik' | 'Perlu Bimbingan' | string;
  // Enriched fields
  fotoUrl: string;
  nisn: string;
  gender: 'L' | 'P';
  kamar: string;
  asrama?: string;
  halaqah: string;
  musyrif: string;
  waliSantri: string;
  noHpWali: string;
  prestasiList: PrestasiRecord[];
  disiplinList: DisiplinRecord[];
  poinDisiplin: number; // Base 100
  catatanUstadz: string;
}

export interface PrestasiRecord {
  id: string;
  judul: string;
  tingkat: 'Pesantren' | 'Kecamatan' | 'Kabupaten/Kota' | 'Provinsi' | 'Nasional';
  kategori: 'Tahfidz' | 'Akademik' | 'Karakter & Kedisiplinan' | 'Bahasa Arab/Inggris' | 'Seni & Olahraga';
  tanggal: string;
  penyelenggara: string;
  poinPlus: number;
  keterangan: string;
  sertifikatNo?: string;
}

export interface DisiplinRecord {
  id: string;
  tanggal: string;
  jenis: 'Pelanggaran Ibadah' | 'Keterlambatan / Waktu' | 'Kebersihan & Kerapian' | 'Adab & Akhlak' | 'Ketertiban Asrama';
  tingkat: 'Ringan' | 'Sedang' | 'Berat';
  deskripsi: string;
  poinMinus: number;
  sanksi: string;
  status: 'Selesai' | 'Dalam Pemantauan' | 'Tindak Lanjut';
  pencatat: string;
}

export interface FilterState {
  search: string;
  kelas: string;
  status: string;
  targetJuz: string;
  minNilai: number;
  maxNilai: number;
  kategoriPrestasi: string;
  statusDisiplin: string;
  sortBy: 'nama' | 'nilaiTahfidz' | 'juzSelesai' | 'setoranPerMinggu' | 'poinDisiplin';
  sortOrder: 'asc' | 'desc';
}

export interface SheetConfig {
  sheetId: string;
  gid: string;
  sheetUrl: string;
  autoSync: boolean;
  syncIntervalSeconds: number;
}
