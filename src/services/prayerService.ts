/**
 * Indonesian Prayer Times Service (Jadwal Sholat)
 * Provides accurate offline calculation and regional presets for Indonesian cities
 * based on Ministry of Religious Affairs (KEMENAG) calculation parameters.
 */

export interface PrayerTimeItem {
  id: string;
  name: string;
  arabicName: string;
  time: string; // "04:35"
  timestamp: number; // Unix timestamp in ms for today
  isPassed: boolean;
  isNext: boolean;
  isCurrent: boolean;
}

export interface CityLocation {
  id: string;
  name: string;
  province: string;
  zone: 'WIB' | 'WITA' | 'WIT';
  lat: number;
  lng: number;
  timezoneOffset: number; // in hours, e.g. 7 for WIB, 8 for WITA, 9 for WIT
}

export const INDONESIAN_CITIES: CityLocation[] = [
  { id: 'jkt', name: 'DKI Jakarta', province: 'DKI Jakarta', zone: 'WIB', lat: -6.2088, lng: 106.8456, timezoneOffset: 7 },
  { id: 'sby', name: 'Surabaya', province: 'Jawa Timur', zone: 'WIB', lat: -7.2575, lng: 112.7521, timezoneOffset: 7 },
  { id: 'bdg', name: 'Bandung', province: 'Jawa Barat', zone: 'WIB', lat: -6.9175, lng: 107.6191, timezoneOffset: 7 },
  { id: 'smg', name: 'Semarang', province: 'Jawa Tengah', zone: 'WIB', lat: -6.9667, lng: 110.4167, timezoneOffset: 7 },
  { id: 'yog', name: 'Yogyakarta', province: 'DI Yogyakarta', zone: 'WIB', lat: -7.7956, lng: 110.3695, timezoneOffset: 7 },
  { id: 'mdn', name: 'Medan', province: 'Sumatera Utara', zone: 'WIB', lat: 3.5952, lng: 98.6722, timezoneOffset: 7 },
  { id: 'plg', name: 'Palembang', province: 'Sumatera Selatan', zone: 'WIB', lat: -2.9761, lng: 104.7754, timezoneOffset: 7 },
  { id: 'pdg', name: 'Padang', province: 'Sumatera Barat', zone: 'WIB', lat: -0.9471, lng: 100.4172, timezoneOffset: 7 },
  { id: 'bpp', name: 'Balikpapan', province: 'Kalimantan Timur', zone: 'WITA', lat: -1.2379, lng: 116.8529, timezoneOffset: 8 },
  { id: 'mks', name: 'Makassar', province: 'Sulawesi Selatan', zone: 'WITA', lat: -5.1477, lng: 119.4327, timezoneOffset: 8 },
  { id: 'dps', name: 'Denpasar', province: 'Bali', zone: 'WITA', lat: -8.6705, lng: 115.2126, timezoneOffset: 8 },
  { id: 'mtr', name: 'Mataram', province: 'NTB', zone: 'WITA', lat: -8.5833, lng: 116.1167, timezoneOffset: 8 },
  { id: 'jpr', name: 'Jayapura', province: 'Papua', zone: 'WIT', lat: -2.5337, lng: 140.7181, timezoneOffset: 9 },
  { id: 'amb', name: 'Ambon', province: 'Maluku', zone: 'WIT', lat: -3.6554, lng: 128.1909, timezoneOffset: 9 }
];

export const DEFAULT_CITY: CityLocation = INDONESIAN_CITIES[0];

// Trigonometric helpers (in degrees)
const dSin = (d: number) => Math.sin((d * Math.PI) / 180);
const dCos = (d: number) => Math.cos((d * Math.PI) / 180);
const dTan = (d: number) => Math.tan((d * Math.PI) / 180);
const dArcSin = (x: number) => (Math.asin(x) * 180) / Math.PI;
const dArcCos = (x: number) => (Math.acos(x) * 180) / Math.PI;
const dArcTan = (x: number) => (Math.atan(x) * 180) / Math.PI;

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime() + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * Calculates prayer times for a specific date and coordinates
 * Using Kemenag standard: Fajr (Subuh) angle = 20.0 deg, Isha angle = 18.0 deg, Ihtiyati +2 mins.
 */
export function calculatePrayerTimes(city: CityLocation = DEFAULT_CITY, date: Date = new Date()) {
  const dayOfYear = getDayOfYear(date);
  
  // Declination of the sun (degrees)
  const declination = 23.45 * dSin((360 / 365) * (dayOfYear - 81));
  
  // Equation of Time (EoT) in minutes
  const B = (360 / 365) * (dayOfYear - 81);
  const eot = 9.87 * dSin(2 * B) - 7.53 * dCos(B) - 1.5 * dSin(B);
  
  // Local Solar Noon (Transit / Dzuhur) in hours
  // Dzuhur = 12 + TimezoneOffset - (Lng / 15) - (EoT / 60)
  const transitHours = 12 + city.timezoneOffset - (city.lng / 15) - (eot / 60);

  // Ashar calculation (Shafi'i: shadow ratio = 1)
  const asharAlt = dArcTan(1 + dTan(Math.abs(city.lat - declination)));
  const asharHourAngle = (1 / 15) * dArcCos((dSin(asharAlt) - dSin(city.lat) * dSin(declination)) / (dCos(city.lat) * dCos(declination)));
  const asharHours = transitHours + asharHourAngle;

  // Maghrib calculation (Sun altitude = -0.833 degrees for refraction + semi-diameter)
  const maghribHourAngle = (1 / 15) * dArcCos((dSin(-0.833) - dSin(city.lat) * dSin(declination)) / (dCos(city.lat) * dCos(declination)));
  const maghribHours = transitHours + maghribHourAngle;

  // Isya calculation (Sun altitude = -18.0 degrees)
  const ishaHourAngle = (1 / 15) * dArcCos((dSin(-18.0) - dSin(city.lat) * dSin(declination)) / (dCos(city.lat) * dCos(declination)));
  const ishaHours = transitHours + ishaHourAngle;

  // Shubuh calculation (Sun altitude = -20.0 degrees)
  const fajrHourAngle = (1 / 15) * dArcCos((dSin(-20.0) - dSin(city.lat) * dSin(declination)) / (dCos(city.lat) * dCos(declination)));
  const fajrHours = transitHours - fajrHourAngle;

  // Syuruq (Sunrise)
  const syuruqHours = transitHours - maghribHourAngle;

  // Dhuha (Sun altitude = 4.5 degrees)
  const dhuhaHourAngle = (1 / 15) * dArcCos((dSin(4.5) - dSin(city.lat) * dSin(declination)) / (dCos(city.lat) * dCos(declination)));
  const dhuhaHours = transitHours - dhuhaHourAngle;

  // Imsak is 10 minutes before Shubuh
  const imsakHours = fajrHours - (10 / 60);

  // Add standard Kemenag safety buffer (Ihtiyati = +2 minutes for prayer times)
  const ihtiyatiMinutes = 2 / 60;

  const toFormattedTime = (hours: number): string => {
    let normalized = hours;
    while (normalized < 0) normalized += 24;
    while (normalized >= 24) normalized -= 24;
    
    const h = Math.floor(normalized);
    const m = Math.floor((normalized - h) * 60);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const getTimestampForTimeStr = (timeStr: string): number => {
    const [h, m] = timeStr.split(':').map(Number);
    const d = new Date(date);
    d.setHours(h, m, 0, 0);
    return d.getTime();
  };

  const rawTimes = [
    { id: 'imsak', name: 'Imsak', arabicName: 'الإمساك', time: toFormattedTime(imsakHours + ihtiyatiMinutes) },
    { id: 'shubuh', name: 'Shubuh', arabicName: 'الفجر', time: toFormattedTime(fajrHours + ihtiyatiMinutes) },
    { id: 'syuruq', name: 'Syuruq', arabicName: 'الشروق', time: toFormattedTime(syuruqHours) },
    { id: 'dhuha', name: 'Dhuha', arabicName: 'الضحى', time: toFormattedTime(dhuhaHours + ihtiyatiMinutes) },
    { id: 'dzuhur', name: 'Dzuhur', arabicName: 'الظهر', time: toFormattedTime(transitHours + ihtiyatiMinutes) },
    { id: 'ashar', name: 'Ashar', arabicName: 'العصر', time: toFormattedTime(asharHours + ihtiyatiMinutes) },
    { id: 'maghrib', name: 'Maghrib', arabicName: 'المغرب', time: toFormattedTime(maghribHours + ihtiyatiMinutes) },
    { id: 'isya', name: 'Isya', arabicName: 'العشاء', time: toFormattedTime(ishaHours + ihtiyatiMinutes) },
  ];

  const nowMs = date.getTime();
  
  // Find which prayer is next and which is current
  let nextPrayerId = 'shubuh';
  let currentPrayerId = 'isya';
  
  // Filter core 5 prayers for next detection
  const corePrayerIds = ['shubuh', 'dzuhur', 'ashar', 'maghrib', 'isya'];
  const coreTimesWithTs = rawTimes
    .filter(t => corePrayerIds.includes(t.id))
    .map(t => ({ ...t, timestamp: getTimestampForTimeStr(t.time) }));

  let foundNext = false;
  for (let i = 0; i < coreTimesWithTs.length; i++) {
    if (coreTimesWithTs[i].timestamp > nowMs) {
      nextPrayerId = coreTimesWithTs[i].id;
      currentPrayerId = i === 0 ? 'isya' : coreTimesWithTs[i - 1].id;
      foundNext = true;
      break;
    }
  }

  if (!foundNext) {
    // Past Isya: next is tomorrow's Shubuh, current is Isya
    nextPrayerId = 'shubuh';
    currentPrayerId = 'isya';
  }

  const items: PrayerTimeItem[] = rawTimes.map((t) => {
    const timestamp = getTimestampForTimeStr(t.time);
    return {
      id: t.id,
      name: t.name,
      arabicName: t.arabicName,
      time: t.time,
      timestamp,
      isPassed: timestamp < nowMs,
      isNext: t.id === nextPrayerId,
      isCurrent: t.id === currentPrayerId,
    };
  });

  // Calculate milliseconds left to next prayer
  const nextPrayerItem = items.find(i => i.id === nextPrayerId);
  let msToNext = 0;
  if (nextPrayerItem) {
    if (nextPrayerItem.timestamp > nowMs) {
      msToNext = nextPrayerItem.timestamp - nowMs;
    } else {
      // It's tomorrow's Shubuh
      const tomorrowShubuh = nextPrayerItem.timestamp + (24 * 60 * 60 * 1000);
      msToNext = tomorrowShubuh - nowMs;
    }
  }

  return {
    city,
    items,
    nextPrayer: nextPrayerItem || items[1],
    currentPrayer: items.find(i => i.id === currentPrayerId) || items[items.length - 1],
    msToNext,
    zone: city.zone,
    hijriDate: getApproximateHijriDate(date),
  };
}

/**
 * Format milliseconds into HH:MM:SS
 */
export function formatCountdown(ms: number): string {
  if (ms <= 0) return '00:00:00';
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Approximate Hijri Date conversion
 */
export function getApproximateHijriDate(date: Date = new Date()): string {
  try {
    const formatter = new Intl.DateTimeFormat('id-ID-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    return formatter.format(date) + ' H';
  } catch {
    return '1448 H';
  }
}
