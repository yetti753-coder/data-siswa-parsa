import Papa from 'papaparse';
import { Santri } from '../types';
import { generateEnrichedSantriData, AVATAR_POOLS } from '../data/seedData';

export const DEFAULT_SHEET_ID = '1w3s2CpJd8ENjZ-lFI-ndVeMjYXZZdqczWyOKc2G0VNg';
export const DEFAULT_GID = '732261769';

const LOCAL_STORAGE_KEY = 'sims_santri_overrides_v1';

export function getStoredOverrides(): Record<string, Partial<Santri>> {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error('Failed to read local storage overrides:', e);
    return {};
  }
}

export function saveSantriOverride(santriId: string, partialData: Partial<Santri>) {
  try {
    const current = getStoredOverrides();
    current[santriId] = {
      ...(current[santriId] || {}),
      ...partialData,
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));
  } catch (e) {
    console.error('Failed to save override:', e);
  }
}

/**
 * Transforms various Google Drive or raw image links into embeddable direct image URLs
 */
export function formatPhotoUrl(rawUrl?: string): string {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const trimmed = rawUrl.trim().replace(/^['"]+|['"]+$/g, '');
  if (!trimmed) return '';

  // Google Drive format 1: https://drive.google.com/file/d/FILE_ID/view...
  const driveFileMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (driveFileMatch && driveFileMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveFileMatch[1]}`;
  }

  // Google Drive format 2: https://drive.google.com/open?id=FILE_ID or ?id=FILE_ID
  const driveIdMatch = trimmed.match(/drive\.google\.com\/(?:open|uc)\?(?:[^&]*&)*id=([a-zA-Z0-9_-]+)/i);
  if (driveIdMatch && driveIdMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveIdMatch[1]}`;
  }

  // Google Drive format 3: Google Drive thumbnail / uc link
  if (trimmed.includes('drive.google.com') && trimmed.includes('/d/')) {
    const parts = trimmed.split('/d/');
    if (parts[1]) {
      const fileId = parts[1].split('/')[0].split('?')[0];
      if (fileId) {
        return `https://lh3.googleusercontent.com/d/${fileId}`;
      }
    }
  }

  return trimmed;
}

/**
 * Extracts photo URL from a CSV row by inspecting multiple possible header names
 */
function extractPhotoFromRow(row: Record<string, string>): string {
  // Direct known keys
  const candidateKeys = [
    'Link Foto',
    'Link Foto Santri',
    'Foto',
    'Foto Santri',
    'URL Foto',
    'Foto URL',
    'Photo',
    'Photo URL',
    'Photo Link',
    'Link Photo',
    'Link Gambar',
    'Gambar',
    'Image',
    'Image URL',
    'Foto Profil',
    'Link Profil',
    'Avatar',
    'Link',
    'URL',
    'Photo Santri'
  ];

  for (const key of candidateKeys) {
    if (row[key] && row[key].trim().length > 0) {
      const formatted = formatPhotoUrl(row[key]);
      if (formatted) return formatted;
    }
  }

  // Case-insensitive / fuzzy scan over all keys in the row
  for (const [colName, val] of Object.entries(row)) {
    if (!val || typeof val !== 'string' || val.trim().length === 0) continue;
    const lowerCol = colName.toLowerCase().replace(/[^a-z]/g, '');
    if (
      lowerCol.includes('foto') ||
      lowerCol.includes('photo') ||
      lowerCol.includes('gambar') ||
      lowerCol.includes('image') ||
      lowerCol.includes('avatar')
    ) {
      const formatted = formatPhotoUrl(val);
      if (formatted) return formatted;
    }
    // Also if the value itself looks like an image URL or Google Drive link
    const trimmedVal = val.trim();
    if (
      trimmedVal.startsWith('http://') ||
      trimmedVal.startsWith('https://') ||
      trimmedVal.startsWith('data:image/')
    ) {
      if (
        trimmedVal.includes('drive.google.com') ||
        trimmedVal.includes('images.unsplash.com') ||
        trimmedVal.match(/\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/i)
      ) {
        const formatted = formatPhotoUrl(trimmedVal);
        if (formatted) return formatted;
      }
    }
  }

  return '';
}

export async function fetchSheetData(
  sheetId: string = DEFAULT_SHEET_ID,
  gid: string = DEFAULT_GID
): Promise<{ santriList: Santri[]; rawCount: number; fetchedAt: string }> {
  let csvText = '';

  // 1. Try server proxy endpoint first (avoids CORS)
  try {
    const res = await fetch(`/api/sheets-data?sheetId=${encodeURIComponent(sheetId)}&gid=${encodeURIComponent(gid)}`, {
      headers: { 'Accept': 'text/csv' }
    });
    if (res.ok) {
      csvText = await res.text();
    }
  } catch (err) {
    console.warn('Server proxy fetch failed, attempting client fallback...', err);
  }

  // 2. Fallback to direct client fetch if proxy had an issue
  if (!csvText || csvText.trim().startsWith('<!DOCTYPE') || csvText.trim().length === 0) {
    try {
      const directUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
      const res = await fetch(directUrl);
      if (res.ok) {
        csvText = await res.text();
      }
    } catch (directErr) {
      console.error('Direct CSV fetch failed too:', directErr);
    }
  }

  if (!csvText || csvText.trim().length === 0) {
    throw new Error('Tidak dapat mengambil data dari Google Sheets. Pastikan spreadsheet dapat diakses publik.');
  }

  // Parse CSV with PapaParse
  const parsed = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: 'greedy',
    transformHeader: (h) => h.trim(),
  });

  const overrides = getStoredOverrides();

  const santriList: Santri[] = parsed.data
    .filter((row) => row['ID Santri'] || row['Nama Santri'] || row['ID'] || row['Nama'])
    .map((row, index) => {
      // Normalize columns
      const id = (row['ID Santri'] || row['ID'] || `QPS-${String(index + 1).padStart(3, '0')}`).trim();
      const nama = (row['Nama Santri'] || row['Nama'] || `Santri ${index + 1}`).trim();
      const kelas = (row['Kelas'] || 'VII A').trim();
      const targetJuz = parseInt(row['Target Juz'] || row['Target'] || '10', 10) || 10;
      const juzSelesai = parseInt(row['Juz Selesai'] || row['Selesai'] || '0', 10) || 0;
      const halamanTerakhir = parseInt(row['Halaman Terakhir'] || row['Halaman'] || '1', 10) || 1;
      const surahTerakhir = (row['Surah Terakhir'] || row['Surah'] || 'An-Nas').trim();
      const setoranPerMinggu = parseFloat(row['Setoran/Minggu'] || row['Setoran'] || '2') || 2;
      const nilaiTahfidz = parseFloat(row['Nilai Tahfidz'] || row['Nilai'] || '80') || 80;
      const rawStatus = (row['Status'] || (nilaiTahfidz >= 90 ? 'Sangat Baik' : nilaiTahfidz >= 80 ? 'Baik' : 'Perlu Bimbingan')).trim();
      const status = rawStatus.replace(/[\r\n]/g, '');

      // Baseline enrichments
      const baseEnriched = generateEnrichedSantriData(id, nama, nilaiTahfidz, status);

      // Check for photo directly in Google Sheet row
      const sheetPhoto = extractPhotoFromRow(row);

      // Check if user has saved custom overrides for this santri
      const override = overrides[id] || {};

      // Determine final photo URL: prioritize Sheet Photo > Local Override > Enriched Default Avatar
      const finalFotoUrl = sheetPhoto || override.fotoUrl || baseEnriched.fotoUrl;

      return {
        id,
        nama,
        kelas,
        targetJuz,
        juzSelesai,
        halamanTerakhir,
        surahTerakhir,
        setoranPerMinggu,
        nilaiTahfidz,
        status,
        fotoUrl: finalFotoUrl,
        nisn: override.nisn || baseEnriched.nisn,
        gender: override.gender || baseEnriched.gender,
        kamar: override.kamar || baseEnriched.kamar,
        halaqah: override.halaqah || baseEnriched.halaqah,
        musyrif: override.musyrif || baseEnriched.musyrif,
        waliSantri: override.waliSantri || baseEnriched.waliSantri,
        noHpWali: override.noHpWali || baseEnriched.noHpWali,
        prestasiList: override.prestasiList || baseEnriched.prestasiList,
        disiplinList: override.disiplinList || baseEnriched.disiplinList,
        poinDisiplin: override.poinDisiplin !== undefined ? override.poinDisiplin : baseEnriched.poinDisiplin,
        catatanUstadz: override.catatanUstadz || baseEnriched.catatanUstadz,
      };
    });

  return {
    santriList,
    rawCount: santriList.length,
    fetchedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  };
}
