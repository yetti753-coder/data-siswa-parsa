import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Santri } from '../types';

export function exportSantriReportPDF(santri: Santri) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const primaryGreen: [number, number, number] = [16, 120, 80]; // #107850
  const darkGray: [number, number, number] = [40, 50, 60];

  // --- KOP SURAT PESANTREN ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
  doc.text("PESANTREN TAHFIDZ AL-QUR'AN AL-HIKMAH", pageWidth / 2, 16, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text("Lembaga Pendidikan & Pembinaan Penghafal Al-Qur'an Berkarakter Qur'ani", pageWidth / 2, 21, { align: 'center' });
  doc.text("Jl. Pesantren No. 99, Jawa Barat | Telp: (021) 8876-5432 | Web: www.tahfidzalhikmah.sch.id", pageWidth / 2, 25, { align: 'center' });

  // Double divider line
  doc.setDrawColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
  doc.setLineWidth(0.8);
  doc.line(14, 28, pageWidth - 14, 28);
  doc.setLineWidth(0.2);
  doc.line(14, 29.2, pageWidth - 14, 29.2);

  // --- TITLE ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.text("LEMBAR LAPORAN EVALUASI TAHFIDZ & KARAKTER SANTRI", pageWidth / 2, 36, { align: 'center' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.text(`Tahun Ajaran 2025/2026 - Periode Evaluasi Berjalan`, pageWidth / 2, 40, { align: 'center' });

  // --- BIODATA SANTRI TABLE ---
  const persen = Math.round((santri.juzSelesai / santri.targetJuz) * 100);
  const bioLeft = [
    ['ID Santri', `: ${santri.id}`],
    ['Nama Lengkap', `: ${santri.nama}`],
    ['Kelas / Angkatan', `: ${santri.kelas}`],
    ['NISN', `: ${santri.nisn}`],
  ];

  const bioRight = [
    ['Halaqah Tahfidz', `: ${santri.halaqah}`],
    ['Musyrif Pembimbing', `: ${santri.musyrif}`],
    ['Asrama / Kamar', `: ${santri.asrama || santri.kamar}`],
    ['Indeks Disiplin', `: ${santri.poinDisiplin}/100 (${santri.poinDisiplin >= 90 ? 'Sangat Baik' : santri.poinDisiplin >= 75 ? 'Baik' : 'Perhatian Khusus'})`],
  ];

  autoTable(doc, {
    startY: 44,
    body: [
      [bioLeft[0][0], bioLeft[0][1], bioRight[0][0], bioRight[0][1]],
      [bioLeft[1][0], bioLeft[1][1], bioRight[1][0], bioRight[1][1]],
      [bioLeft[2][0], bioLeft[2][1], bioRight[2][0], bioRight[2][1]],
      [bioLeft[3][0], bioLeft[3][1], bioRight[3][0], bioRight[3][1]],
    ],
    theme: 'plain',
    styles: { fontSize: 8.5, cellPadding: 1.2, textColor: [30, 41, 59] },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 28 },
      1: { cellWidth: 58 },
      2: { fontStyle: 'bold', cellWidth: 34 },
      3: { cellWidth: 62 },
    },
  });

  let currentY = (doc as any).lastAutoTable.finalY + 4;

  // --- SECTION 1: PROGRES TAHFIDZ AL-QUR'AN ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
  doc.text("I. CAPAIAN & PROGRES TAHFIDZ AL-QUR'AN", 14, currentY);

  autoTable(doc, {
    startY: currentY + 2,
    head: [['Target Juz', 'Juz Selesai', '% Capaian', 'Surah Terakhir', 'Hal. Terakhir', 'Setoran / Minggu', 'Nilai Tahfidz', 'Status Mutqin']],
    body: [
      [
        `${santri.targetJuz} Juz`,
        `${santri.juzSelesai} Juz`,
        `${persen}%`,
        santri.surahTerakhir,
        `Hal. ${santri.halamanTerakhir}`,
        `${santri.setoranPerMinggu}x / pekan`,
        `${santri.nilaiTahfidz} / 100`,
        santri.status,
      ],
    ],
    theme: 'grid',
    headStyles: {
      fillColor: primaryGreen,
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'center',
    },
    styles: {
      fontSize: 8,
      cellPadding: 2,
      halign: 'center',
      textColor: [30, 41, 59],
    },
  });

  currentY = (doc as any).lastAutoTable.finalY + 5;

  // --- SECTION 2: RIWAYAT PRESTASI SANTRI ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
  doc.text("II. RIWAYAT PRESTASI & PENGHARGAAN SANTRI", 14, currentY);

  const prestasiRows = santri.prestasiList.length > 0
    ? santri.prestasiList.map((p, idx) => [
        (idx + 1).toString(),
        p.judul,
        p.kategori,
        p.tingkat,
        p.tanggal,
        `+${p.poinPlus} Poin`,
        p.sertifikatNo || '-',
      ])
    : [['-', 'Belum ada catatan prestasi tambahan pada periode ini', '-', '-', '-', '-', '-']];

  autoTable(doc, {
    startY: currentY + 2,
    head: [['No', 'Nama Prestasi / Kejuaraan', 'Kategori', 'Tingkat', 'Tanggal', 'Poin', 'No. Sertifikat']],
    body: prestasiRows,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 100, 140],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'center',
    },
    styles: { fontSize: 7.5, cellPadding: 1.8, textColor: [30, 41, 59] },
    columnStyles: {
      0: { halign: 'center', cellWidth: 8 },
      1: { cellWidth: 65 },
      2: { halign: 'center', cellWidth: 26 },
      3: { halign: 'center', cellWidth: 24 },
      4: { halign: 'center', cellWidth: 20 },
      5: { halign: 'center', cellWidth: 16 },
      6: { halign: 'center', cellWidth: 23 },
    },
  });

  currentY = (doc as any).lastAutoTable.finalY + 5;

  // --- SECTION 3: CATATAN DISIPLIN PRIBADI ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
  doc.text("III. CATATAN KEDISIPLINAN & PEMBINAAN AKHLAK", 14, currentY);

  const disiplinRows = santri.disiplinList.length > 0
    ? santri.disiplinList.map((d, idx) => [
        (idx + 1).toString(),
        d.tanggal,
        d.jenis,
        d.deskripsi,
        `-${d.poinMinus}`,
        d.sanksi,
        d.status,
      ])
    : [['-', '-', 'Alhamdulillah, nihil pelanggaran disiplin tercatat (Tertib & Teladan)', '-', '0', 'Nihil Sanksi', 'Selesai']];

  autoTable(doc, {
    startY: currentY + 2,
    head: [['No', 'Tanggal', 'Jenis Pelanggaran', 'Deskripsi Kejadian', 'Poin', 'Tindakan / Sanksi Edukatif', 'Status']],
    body: disiplinRows,
    theme: 'grid',
    headStyles: {
      fillColor: [180, 83, 9], // Amber/brown
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'center',
    },
    styles: { fontSize: 7.5, cellPadding: 1.8, textColor: [30, 41, 59] },
    columnStyles: {
      0: { halign: 'center', cellWidth: 8 },
      1: { halign: 'center', cellWidth: 20 },
      2: { cellWidth: 32 },
      3: { cellWidth: 50 },
      4: { halign: 'center', cellWidth: 12 },
      5: { cellWidth: 40 },
      6: { halign: 'center', cellWidth: 20 },
    },
  });

  currentY = (doc as any).lastAutoTable.finalY + 5;

  // Check if we need new page for signature block
  if (currentY > 235) {
    doc.addPage();
    currentY = 20;
  }

  // --- SECTION 4: CATATAN & REKOMENDASI USTADZ ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
  doc.text("IV. CATATAN & REKOMENDASI PEMBINA HALAQAH", 14, currentY);

  doc.setDrawColor(200, 210, 220);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, currentY + 2, pageWidth - 28, 16, 2, 2, 'FD');

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(40, 50, 60);
  const splitNotes = doc.splitTextToSize(`"${santri.catatanUstadz}"`, pageWidth - 36);
  doc.text(splitNotes, 18, currentY + 7);

  currentY += 23;

  // --- SECTION 5: TANDA TANGAN RESMI ---
  const dateStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(40, 50, 60);
  doc.text(`Ditetapkan di: Pesantren Al-Hikmah, ${dateStr}`, pageWidth - 14, currentY, { align: 'right' });

  currentY += 5;
  const col1 = 30;
  const col2 = pageWidth / 2;
  const col3 = pageWidth - 30;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text("Wali Santri,", col1, currentY, { align: 'center' });
  doc.text("Musyrif Halaqah Tahfidz,", col2, currentY, { align: 'center' });
  doc.text("Mudir Pesantren Al-Hikmah,", col3, currentY, { align: 'center' });

  currentY += 18;
  doc.setFont('helvetica', 'bold');
  doc.text(`( ${santri.waliSantri} )`, col1, currentY, { align: 'center' });
  doc.text(`( ${santri.musyrif} )`, col2, currentY, { align: 'center' });
  doc.text("( KH. Abdullah Syafi'i, M.A. )", col3, currentY, { align: 'center' });

  // Save the PDF
  doc.save(`Rapor_Tahfidz_${santri.id}_${santri.nama.replace(/\s+/g, '_')}.pdf`);
}

export function exportBatchSummaryPDF(santriList: Santri[], filterTitle: string = 'Seluruh Santri') {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const primaryGreen: [number, number, number] = [16, 120, 80];

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
  doc.text("REKAPITULASI LAPORAN DATA SANTRI & MONITORING TAHFIDZ REAL-TIME", pageWidth / 2, 14, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(80, 80, 80);
  const nowStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  doc.text(`Kategori Filter: ${filterTitle} | Total Data: ${santriList.length} Santri | Waktu Ekspor: ${nowStr}`, pageWidth / 2, 19, { align: 'center' });

  // Divider
  doc.setDrawColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
  doc.setLineWidth(0.6);
  doc.line(10, 22, pageWidth - 10, 22);

  // Table
  const tableRows = santriList.map((s, idx) => [
    (idx + 1).toString(),
    s.id,
    s.nama,
    s.kelas,
    `${s.targetJuz} Juz`,
    `${s.juzSelesai} Juz (${Math.round((s.juzSelesai / s.targetJuz) * 100)}%)`,
    `Hal. ${s.halamanTerakhir} (${s.surahTerakhir})`,
    `${s.setoranPerMinggu}x`,
    s.nilaiTahfidz.toString(),
    s.status,
    `${s.prestasiList.length} Prestasi`,
    `${s.disiplinList.length} Catatan (${s.poinDisiplin} Poin)`,
  ]);

  autoTable(doc, {
    startY: 25,
    head: [
      ['No', 'ID', 'Nama Santri', 'Kelas', 'Target', 'Capaian Juz', 'Posisi Terakhir', 'Setoran/Mg', 'Nilai', 'Status', 'Jml Prestasi', 'Poin Disiplin'],
    ],
    body: tableRows,
    theme: 'striped',
    headStyles: {
      fillColor: primaryGreen,
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'center',
    },
    styles: { fontSize: 7.5, cellPadding: 1.5, textColor: [30, 41, 59] },
    columnStyles: {
      0: { halign: 'center', cellWidth: 8 },
      1: { halign: 'center', cellWidth: 18 },
      2: { cellWidth: 42 },
      3: { halign: 'center', cellWidth: 15 },
      4: { halign: 'center', cellWidth: 18 },
      5: { halign: 'center', cellWidth: 26 },
      6: { cellWidth: 42 },
      7: { halign: 'center', cellWidth: 20 },
      8: { halign: 'center', cellWidth: 14 },
      9: { halign: 'center', cellWidth: 24 },
      10: { halign: 'center', cellWidth: 22 },
      11: { halign: 'center', cellWidth: 28 },
    },
  });

  doc.save(`Rekapitulasi_Santri_Tahfidz_${new Date().toISOString().slice(0, 10)}.pdf`);
}
