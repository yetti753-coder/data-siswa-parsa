import { PrestasiRecord, DisiplinRecord } from '../types';

// Preset photos for Islamic students / youth
export const AVATAR_POOLS = [
  'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=200&auto=format&fit=crop&q=80',
];

export const MUSYRIF_LIST = [
  'Ust. Ahmad Zaki, S.Pd.I',
  'Ust. Muhammad Ridwan, Lc.',
  'Ust. Abdullah Al-Fatih, S.Ag',
  'Ust. Farhan Muttaqin, Al-Hafizh',
  'Ust. Dr. Syarifuddin, M.Pd.I',
  'Ust. Bilal Al-Basyir, Al-Hafizh',
];

export const HALAQAH_LIST = [
  'Halaqah Imam Nafi\'',
  'Halaqah Imam Ibnu Katsir',
  'Halaqah Imam Ashim',
  'Halaqah Imam Hamzah',
  'Halaqah Imam Al-Kisa\'i',
  'Halaqah Imam Abu Amr',
];

export const ASRAMA_LIST = [
  'Gedung Abu Bakar Ash-Shiddiq (Lt. 2)',
  'Gedung Umar bin Khattab (Lt. 1)',
  'Gedung Utsman bin Affan (Lt. 2)',
  'Gedung Ali bin Abi Thalib (Lt. 1)',
  'Gedung Bilal bin Rabah (Lt. 3)',
  'Gedung Salman Al-Farisi (Lt. 2)',
];

const PRESTASI_TEMPLATES: Array<Omit<PrestasiRecord, 'id' | 'tanggal'>> = [
  {
    judul: "Juara 1 Musabaqah Hifdzil Qur'an (MHQ) Tingkat Kabupaten",
    tingkat: 'Kabupaten/Kota',
    kategori: 'Tahfidz',
    penyelenggara: 'LPTQ & Kemenag Kabupaten',
    poinPlus: 30,
    keterangan: 'Kategori Hifdzil 5 Juz dan Tilawah dengan predikat Mumtaz',
    sertifikatNo: 'LPTQ/MHQ-2026/042',
  },
  {
    judul: "Penghargaan Santri Teladan Tahfidz Terbaik Bulanan",
    tingkat: 'Pesantren',
    kategori: 'Tahfidz',
    penyelenggara: 'Pesantren Tahfidz Qur\'an',
    poinPlus: 20,
    keterangan: 'Kelancaran mutqin setoran 4 juz dalam 1 bulan kalender',
    sertifikatNo: 'PPTQ/ST-III/2026/018',
  },
  {
    judul: "Juara 2 Lomba Pidato Bahasa Arab (Muhadharah)",
    tingkat: 'Kabupaten/Kota',
    kategori: 'Bahasa Arab/Inggris',
    penyelenggara: 'Forum Komunikasi Pesantren Modern',
    poinPlus: 25,
    keterangan: 'Tema: Urgensi Menjaga Al-Qur\'an di Era Digital',
    sertifikatNo: 'FKPM/BA-2026/112',
  },
  {
    judul: "Sertifikasi Kelulusan Tahfidz Juz 30 (Mumtaz)",
    tingkat: 'Pesantren',
    kategori: 'Tahfidz',
    penyelenggara: 'Lembaga Tahsin & Tahfidz Pesantren',
    poinPlus: 15,
    keterangan: 'Ujian komprehensif sekali duduk dengan nilai makharijul huruf 98',
    sertifikatNo: 'LTTQ/CERT-J30/889',
  },
  {
    judul: "Juara 1 Lomba Cerdas Cermat Fiqih & Hadits",
    tingkat: 'Kecamatan',
    kategori: 'Akademik',
    penyelenggara: 'KUA & Forum Diniyah Kecamatan',
    poinPlus: 20,
    keterangan: 'Materi Kitab Bulughul Maram dan Fathul Qorib',
    sertifikatNo: 'KUA-DINIYAH/LCC/07',
  },
  {
    judul: "Juara 3 Kaligrafi Khat Naskhi & Tsuluts",
    tingkat: 'Provinsi',
    kategori: 'Seni & Olahraga',
    penyelenggara: 'Dinas Kebudayaan & Pendidikan Provinsi',
    poinPlus: 35,
    keterangan: 'Karya mushaf dekorasi surah Al-Fath',
    sertifikatNo: 'DISBUD/KALIGRAFI-2026/09',
  },
  {
    judul: "Santri Disiplin & Muadzin Terbaik Asrama",
    tingkat: 'Pesantren',
    kategori: 'Karakter & Kedisiplinan',
    penyelenggara: 'Bagian Kepengasuhan Santri',
    poinPlus: 15,
    keterangan: 'Kehadiran shalat fardhu 100% dan keteladanan adab kamar',
    sertifikatNo: 'BKS/DISP-2026/005',
  },
];

const DISIPLIN_TEMPLATES: Array<Omit<DisiplinRecord, 'id' | 'tanggal'>> = [
  {
    jenis: 'Pelanggaran Ibadah',
    tingkat: 'Ringan',
    deskripsi: 'Terlambat mengikuti shalat Shubuh berjamaah di masjid utama',
    poinMinus: 3,
    sanksi: 'Membaca tilawah 1 juz di serambi masjid setelah shalat',
    status: 'Selesai',
    pencatat: 'Ust. Ahmad Zaki - Bagian Pengasuhan',
  },
  {
    jenis: 'Keterlambatan / Waktu',
    tingkat: 'Ringan',
    deskripsi: 'Terlambat 10 menit masuk halaqah tahfidz sore',
    poinMinus: 2,
    sanksi: 'Membersihkan ruang halaqah dan muraja\'ah mandiri 15 menit',
    status: 'Selesai',
    pencatat: 'Ust. Bilal Al-Basyir',
  },
  {
    jenis: 'Kebersihan & Kerapian',
    tingkat: 'Ringan',
    deskripsi: 'Lemari pakaian tidak rapi saat inspeksi kamar mingguan',
    poinMinus: 2,
    sanksi: 'Menata ulang lemari pakaian & piket lorong kamar',
    status: 'Selesai',
    pencatat: 'Musyrif Asrama Umar bin Khattab',
  },
  {
    jenis: 'Adab & Akhlak',
    tingkat: 'Sedang',
    deskripsi: 'Bercanda berlebihan saat zikir ba\'da shalat Isya',
    poinMinus: 5,
    sanksi: 'Pemberian nasihat tazkiyatun nufus & hafalan 10 hadits Arbain',
    status: 'Selesai',
    pencatat: 'Ust. Farhan Muttaqin',
  },
  {
    jenis: 'Ketertiban Asrama',
    tingkat: 'Sedang',
    deskripsi: 'Keluar area asrama tanpa kartu izin keluar (tasrih) resmi',
    poinMinus: 10,
    sanksi: 'Surat Peringatan I (SP1) & larangan pesiar selama 2 pekan',
    status: 'Dalam Pemantauan',
    pencatat: 'Kepala Bagian Keamanan & Ketertiban',
  },
];

/**
 * Deterministically generates realistic enrichment data for a santri
 */
export function generateEnrichedSantriData(
  id: string,
  nama: string,
  nilaiTahfidz: number,
  status: string
) {
  // Hash code from ID
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const avatarIndex = hash % AVATAR_POOLS.length;
  const musyrifIndex = hash % MUSYRIF_LIST.length;
  const halaqahIndex = hash % HALAQAH_LIST.length;
  const asramaIndex = hash % ASRAMA_LIST.length;

  const nisn = `00${(80000000 + hash * 12345).toString().slice(0, 8)}`;
  const kamar = `Kamar ${String.fromCharCode(65 + (hash % 6))}-${(hash % 4) + 1}`;

  // Generate Wali name
  const lastNames = ['Hidayat', 'Firmansyah', 'Santoso', 'Pratama', 'Nugroho', 'Kusuma', 'Gunawan', 'Suryono'];
  const waliLast = lastNames[hash % lastNames.length];
  const waliSantri = `Bpk. Drs. H. ${waliLast}`;
  const noHpWali = `0812-${(1000 + (hash % 8999))}-${(1000 + ((hash * 7) % 8999))}`;

  // Prestasi list
  const prestasiList: PrestasiRecord[] = [];
  const numPrestasi = nilaiTahfidz >= 95 ? 3 : nilaiTahfidz >= 85 ? 2 : nilaiTahfidz >= 80 ? 1 : (hash % 2 === 0 ? 1 : 0);

  for (let i = 0; i < numPrestasi; i++) {
    const templateIndex = (hash + i * 2) % PRESTASI_TEMPLATES.length;
    const tpl = PRESTASI_TEMPLATES[templateIndex];
    const month = (i * 2 + 1).toString().padStart(2, '0');
    const day = (10 + (hash % 15)).toString().padStart(2, '0');
    prestasiList.push({
      ...tpl,
      id: `PRES-${id}-${i + 1}`,
      tanggal: `2026-${month}-${day}`,
    });
  }

  // Disiplin list
  const disiplinList: DisiplinRecord[] = [];
  let poinDisiplin = 100;

  if (status.includes('Perlu Bimbingan') || nilaiTahfidz < 80) {
    const numDisiplin = 2 + (hash % 2);
    for (let i = 0; i < numDisiplin; i++) {
      const templateIndex = (hash + i) % DISIPLIN_TEMPLATES.length;
      const tpl = DISIPLIN_TEMPLATES[templateIndex];
      const month = (i * 2 + 2).toString().padStart(2, '0');
      const day = (5 + (hash % 20)).toString().padStart(2, '0');
      disiplinList.push({
        ...tpl,
        id: `DISC-${id}-${i + 1}`,
        tanggal: `2026-${month}-${day}`,
      });
      poinDisiplin -= tpl.poinMinus;
    }
  } else if (hash % 3 === 0) {
    const tpl = DISIPLIN_TEMPLATES[hash % 3]; // minor infraction
    disiplinList.push({
      ...tpl,
      id: `DISC-${id}-1`,
      tanggal: `2026-02-14`,
    });
    poinDisiplin -= tpl.poinMinus;
  }

  // Catatan Ustadz
  let catatanUstadz = '';
  if (nilaiTahfidz >= 90) {
    catatanUstadz = `Ananda ${nama} memiliki daya tangkap hafalan yang sangat kuat dan makhraj tajwid yang fasih. Pertahankan istiqomah muraja'ah harian dan terus jaga kebersihan hati dalam menghafal Kalamullah.`;
  } else if (nilaiTahfidz >= 80) {
    catatanUstadz = `Ananda ${nama} aktif dalam halaqah dan menunjukkan komitmen baik. Perlu penguatan pada mutqin hukum mad dan ghunnah saat tasmi' juz baru.`;
  } else {
    catatanUstadz = `Ananda ${nama} membutuhkan bimbingan intensif dan jadwal muraja'ah tambahan ba'da Maghrib agar target juz dapat tercapai tepat waktu.`;
  }

  return {
    fotoUrl: AVATAR_POOLS[avatarIndex],
    nisn,
    gender: 'L' as const,
    kamar,
    halaqah: HALAQAH_LIST[halaqahIndex],
    musyrif: MUSYRIF_LIST[musyrifIndex],
    waliSantri,
    noHpWali,
    prestasiList,
    disiplinList,
    poinDisiplin: Math.max(0, poinDisiplin),
    catatanUstadz,
  };
}
