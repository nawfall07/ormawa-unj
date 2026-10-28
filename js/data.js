/**
 * PANDUAN EDIT DATA
 * 
 * 1. Menambah Ormawa baru:
 *    - Copy TEMPLATE_ORMAWA di bawah
 *    - Isi semua field yang diperlukan
 *    - Tambahkan ke array ORMAWA_UNIVERSITAS atau ORMAWA_FAKULTAS[id_fakultas]
 * 
 * 2. Mengganti data dummy:
 *    - Ubah isDummy: false
 *    - Ubah terverifikasi: true
 *    - Isi semua field dengan data sebenarnya
 * 
 * 3. Update versi setelah perubahan:
 *    - Naikkan ORMAWA_DATA.versi (misal dari 1 ke 2)
 *    - Storage akan otomatis reseed localStorage
 * 
 * 4. Logo:
 *    - Simpan logo di assets/logos/<id>.png
 *    - Isi field logo dengan path tersebut
 *    - Format: PNG/WebP, max 200KB, ukuran persegi
 */

const TEMPLATE_ORMAWA = {
    id: null,
    namaLengkap: null,
    namaSingkat: null,
    tingkat: null,
    fakultasId: null,
    kategori: null,
    deskripsiSingkat: null,
    terbukaUntuk: null,
    komitmenWaktu: { frekuensi: null, hariJam: null, waktu: null, lokasi: null },
    kegiatan: [],
    rekamJejak: [],
    struktur: null,
    caraDaftar: { tahapan: [], periode: null, tautan: null },
    kanal: { instagram: null, linktree: null, website: null },
    logo: null,
    sumberData: null,
    diperbaruiPada: null,
    terverifikasi: false,
    isDummy: true,
    tampil: true
};

const FAKULTAS_DATA = [
    { id: "fip", nama: "Fakultas Ilmu Pendidikan", singkatan: "FIP", terverifikasi: false }, // VERIFIKASI: check name and abbreviation at unj.ac.id
    { id: "fbs", nama: "Fakultas Bahasa dan Seni", singkatan: "FBS", terverifikasi: false }, // VERIFIKASI
    { id: "fmipa", nama: "Fakultas Matematika dan Ilmu Pengetahuan Alam", singkatan: "FMIPA", terverifikasi: false }, // VERIFIKASI
    { id: "fish", nama: "Fakultas Ilmu Sosial dan Hukum", singkatan: "FISH", terverifikasi: false }, // VERIFIKASI
    { id: "ft", nama: "Fakultas Teknik", singkatan: "FT", terverifikasi: false }, // VERIFIKASI
    { id: "fikk", nama: "Fakultas Ilmu Keolahragaan dan Kesehatan", singkatan: "FIK", terverifikasi: false }, // VERIFIKASI
    { id: "feb", nama: "Fakultas Ekonomi dan Bisnis", singkatan: "FEB", terverifikasi: false }, // VERIFIKASI
    { id: "fpsi", nama: "Fakultas Psikologi", singkatan: "FPsi", terverifikasi: false } // VERIFIKASI
];

const ORMAWA_UNIVERSITAS = [
    // Seni dan Budaya
    { ...TEMPLATE_ORMAWA, id: "ukm", namaLengkap: "Unit Kesenian Mahasiswa Universitas Negeri Jakarta", namaSingkat: "UKM", tingkat: "universitas", kategori: "Seni dan Budaya", deskripsiSingkat: "Wadah pengembangan bakat seni musik, tari, dan teater.", terbukaUntuk: "semua", komitmenWaktu: { frekuensi: "[Contoh] 2x seminggu", hariJam: "[Contoh] Selasa & Kamis, 15:00-17:00", waktu: "sore", lokasi: "[Contoh] Gedung Student Center" }, kegiatan: ["[Contoh] Latihan rutin", "[Contoh] Pentas seni tahunan"], rekamJejak: [{ tahun: "[Tahun]", judul: "[Contoh] Juara festival seni" }], struktur: "[Contoh] Ketua, Divisi Musik, Divisi Tari", caraDaftar: { tahapan: ["[Contoh] Pendaftaran online", "[Contoh] Audisi"], periode: "[Contoh] Awal semester", tautan: "https://example.com/ukm" }, kanal: { instagram: "https://example.com/ukm-ig", linktree: null, website: null }, sumberData: "[Contoh] Observasi", diperbaruiPada: "2026-10-28", terverifikasi: false, isDummy: true },
    { ...TEMPLATE_ORMAWA, id: "isa", namaLengkap: "International Student Association Universitas Negeri Jakarta", namaSingkat: "ISA", tingkat: "universitas", kategori: "Seni dan Budaya", deskripsiSingkat: "Organisasi mahasiswa internasional untuk pertukaran budaya.", terbukaUntuk: "semua", isDummy: true },
    // Olahraga
    { ...TEMPLATE_ORMAWA, id: "uko", namaLengkap: "Unit Kegiatan Olahraga Mahasiswa Universitas Negeri Jakarta", namaSingkat: "UKO", tingkat: "universitas", kategori: "Olahraga", deskripsiSingkat: "Unit kegiatan olahraga untuk berbagai cabang.", terbukaUntuk: "semua", komitmenWaktu: { frekuensi: "[Contoh] 3x seminggu", hariJam: "[Contoh] Senin, Rabu, Jumat, 16:00", waktu: "sore", lokasi: "[Contoh] GOR UNJ" }, isDummy: true },
    // Keilmuan dan Teknologi
    { ...TEMPLATE_ORMAWA, id: "kpm", namaLengkap: "Kelompok Peneliti Muda Universitas Negeri Jakarta", namaSingkat: "KPM", tingkat: "universitas", kategori: "Keilmuan dan Teknologi", deskripsiSingkat: "Wadah penelitian dan pengembangan ilmiah.", terbukaUntuk: "semua", isDummy: true },
    { ...TEMPLATE_ORMAWA, id: "lkm", namaLengkap: "Lembaga Kajian Mahasiswa Universitas Negeri Jakarta", namaSingkat: "LKM", tingkat: "universitas", kategori: "Keilmuan dan Teknologi", deskripsiSingkat: "Lembaga kajian dan diskusi ilmiah.", terbukaUntuk: "semua", isDummy: true },
    { ...TEMPLATE_ORMAWA, id: "robotic", namaLengkap: "Robotic Club Universitas Negeri Jakarta", namaSingkat: "Robotic Club", tingkat: "universitas", kategori: "Keilmuan dan Teknologi", deskripsiSingkat: "Klub robotika dan teknologi.", terbukaUntuk: "semua", isDummy: true },
    { ...TEMPLATE_ORMAWA, id: "batavia", namaLengkap: "Batavia Tim Universitas Negeri Jakarta", namaSingkat: "Batavia Tim", tingkat: "universitas", kategori: "Keilmuan dan Teknologi", deskripsiSingkat: "Tim desain kendaraan ramah lingkungan.", terbukaUntuk: "semua", isDummy: true },
    // Media dan Kreatif
    { ...TEMPLATE_ORMAWA, id: "era-fm", namaLengkap: "Badan Penyelenggara Radio Siaran Era FM Universitas Negeri Jakarta", namaSingkat: "Era FM", tingkat: "universitas", kategori: "Media dan Kreatif", deskripsiSingkat: "Radio kampus UNJ.", terbukaUntuk: "semua", isDummy: true },
    { ...TEMPLATE_ORMAWA, id: "didaktika", namaLengkap: "Lembaga Pers Mahasiswa Didaktika Universitas Negeri Jakarta", namaSingkat: "Didaktika", tingkat: "universitas", kategori: "Media dan Kreatif", deskripsiSingkat: "Lembaga pers dan jurnalistik.", terbukaUntuk: "semua", isDummy: true },
    { ...TEMPLATE_ORMAWA, id: "sigma-tv", namaLengkap: "SIGMA TV Universitas Negeri Jakarta", namaSingkat: "SIGMA TV", tingkat: "universitas", kategori: "Media dan Kreatif", deskripsiSingkat: "Televisi kampus UNJ.", terbukaUntuk: "semua", isDummy: true },
    { ...TEMPLATE_ORMAWA, id: "kmpf", namaLengkap: "Kelompok Mahasiswa Peminat Fotografi Universitas Negeri Jakarta", namaSingkat: "KMPF", tingkat: "universitas", kategori: "Media dan Kreatif", deskripsiSingkat: "Komunitas fotografi mahasiswa.", terbukaUntuk: "semua", isDummy: true },
    // Kewirausahaan dan Bisnis
    { ...TEMPLATE_ORMAWA, id: "ec", namaLengkap: "Entrepreneur Club Universitas Negeri Jakarta", namaSingkat: "EC", tingkat: "universitas", kategori: "Kewirausahaan dan Bisnis", deskripsiSingkat: "Klub kewirausahaan mahasiswa.", terbukaUntuk: "semua", isDummy: true },
    { ...TEMPLATE_ORMAWA, id: "kopma", namaLengkap: "Koperasi Mahasiswa Universitas Negeri Jakarta", namaSingkat: "KOPMA", tingkat: "universitas", kategori: "Kewirausahaan dan Bisnis", deskripsiSingkat: "Koperasi mahasiswa UNJ.", terbukaUntuk: "semua", isDummy: true },
    // Sosial dan Kemanusiaan
    { ...TEMPLATE_ORMAWA, id: "kspa", namaLengkap: "Kelompok Sosial Pecinta Anak Universitas Negeri Jakarta", namaSingkat: "KSPA", tingkat: "universitas", kategori: "Sosial dan Kemanusiaan", deskripsiSingkat: "Kelompok sosial fokus pada anak-anak.", terbukaUntuk: "semua", isDummy: true },
    { ...TEMPLATE_ORMAWA, id: "ksr", namaLengkap: "KSR Palang Merah Indonesia Unit Universitas Negeri Jakarta", namaSingkat: "KSR PMI", tingkat: "universitas", kategori: "Sosial dan Kemanusiaan", deskripsiSingkat: "Unit PMI di UNJ untuk kegiatan kemanusiaan.", terbukaUntuk: "semua", isDummy: true },
    { ...TEMPLATE_ORMAWA, id: "atenna", namaLengkap: "Pusat Informasi dan Konseling Mahasiswa Atenna Universitas Negeri Jakarta", namaSingkat: "Atenna", tingkat: "universitas", kategori: "Sosial dan Kemanusiaan", deskripsiSingkat: "Pusat informasi dan konseling mahasiswa.", terbukaUntuk: "semua", isDummy: true },
    // Keagamaan
    { ...TEMPLATE_ORMAWA, id: "ldk-salim", namaLengkap: "Lembaga Dakwah Kampus Salim Universitas Negeri Jakarta", namaSingkat: "LDK Salim", tingkat: "universitas", kategori: "Keagamaan", deskripsiSingkat: "Lembaga dakwah kampus UNJ.", terbukaUntuk: "semua", isDummy: true },
    { ...TEMPLATE_ORMAWA, id: "pmk", namaLengkap: "Persekutuan Mahasiswa Kristen Universitas Negeri Jakarta", namaSingkat: "PMK", tingkat: "universitas", kategori: "Keagamaan", deskripsiSingkat: "Persekutuan mahasiswa Kristen di UNJ.", terbukaUntuk: "semua", isDummy: true },
    { ...TEMPLATE_ORMAWA, id: "kmk", namaLengkap: "Keluarga Mahasiswa Katolik Universitas Negeri Jakarta", namaSingkat: "KMK", tingkat: "universitas", kategori: "Keagamaan", deskripsiSingkat: "Komunitas mahasiswa Katolik UNJ.", terbukaUntuk: "semua", isDummy: true },
    { ...TEMPLATE_ORMAWA, id: "kmhb", namaLengkap: "Keluarga Mahasiswa Hindu Budha Universitas Negeri Jakarta", namaSingkat: "KMHB", tingkat: "universitas", kategori: "Keagamaan", deskripsiSingkat: "Komunitas mahasiswa Hindu dan Budha UNJ.", terbukaUntuk: "semua", isDummy: true },
    // Alam dan Kepemimpinan
    { ...TEMPLATE_ORMAWA, id: "racana", namaLengkap: "Racana Pramuka Universitas Negeri Jakarta", namaSingkat: "Racana", tingkat: "universitas", kategori: "Alam dan Kepemimpinan", deskripsiSingkat: "Guarda Pramuka UNJ untuk pecinta alam.", terbukaUntuk: "semua", isDummy: true },
    { ...TEMPLATE_ORMAWA, id: "eka-citra", namaLengkap: "Keluarga Mahasiswa Pecinta Alam Eka Citra Universitas Negeri Jakarta", namaSingkat: "Eka Citra", tingkat: "universitas", kategori: "Alam dan Kepemimpinan", deskripsiSingkat: "Komunitas pecinta alam UNJ.", terbukaUntuk: "semua", isDummy: true },
    { ...TEMPLATE_ORMAWA, id: "menwa", namaLengkap: "Resimen Mahasiswa Universitas Negeri Jakarta", namaSingkat: "Menwa", tingkat: "universitas", kategori: "Alam dan Kepemimpinan", deskripsiSingkat: "Organisasi kemahasiswaan bersifat semi-militer.", terbukaUntuk: "semua", isDummy: true },
    // KEPUTUSAN: set tampil:true to show BEM
    { ...TEMPLATE_ORMAWA, id: "bem-unj", namaLengkap: "Badan Eksekutif Mahasiswa Universitas Negeri Jakarta", namaSingkat: "BEM UNJ", tingkat: "universitas", kategori: "Alam dan Kepemimpinan", deskripsiSingkat: "Badan eksekutif mahasiswa.", terbukaUntuk: "semua", tampil: false, isDummy: true }
];

const ORMAWA_FAKULTAS = {
    fip: [
        { ...TEMPLATE_ORMAWA, id: "fip-1", namaLengkap: "[CONTOH] Ormawa Fakultas Ilmu Pendidikan 1", namaSingkat: "FIP 1", tingkat: "fakultas", fakultasId: "fip", kategori: "Sosial dan Kemanusiaan", deskripsiSingkat: "[Contoh] Ormawa fakultas.", terbukaUntuk: ["fip"], komitmenWaktu: { waktu: "pagi" }, isDummy: true },
        { ...TEMPLATE_ORMAWA, id: "fip-2", namaLengkap: "[CONTOH] Ormawa Fakultas Ilmu Pendidikan 2", namaSingkat: "FIP 2", tingkat: "fakultas", fakultasId: "fip", kategori: "Seni dan Budaya", deskripsiSingkat: "[Contoh] Ormawa fakultas.", terbukaUntuk: ["fip"], komitmenWaktu: { waktu: "siang" }, isDummy: true }
    ],
    fbs: [
        { ...TEMPLATE_ORMAWA, id: "fbs-1", namaLengkap: "[CONTOH] Ormawa Fakultas Bahasa dan Seni 1", namaSingkat: "FBS 1", tingkat: "fakultas", fakultasId: "fbs", kategori: "Media dan Kreatif", deskripsiSingkat: "[Contoh] Ormawa fakultas.", terbukaUntuk: ["fbs"], komitmenWaktu: { waktu: "sore" }, isDummy: true },
        { ...TEMPLATE_ORMAWA, id: "fbs-2", namaLengkap: "[CONTOH] Ormawa Fakultas Bahasa dan Seni 2", namaSingkat: "FBS 2", tingkat: "fakultas", fakultasId: "fbs", kategori: "Kewirausahaan dan Bisnis", deskripsiSingkat: "[Contoh] Ormawa fakultas.", terbukaUntuk: ["fbs"], komitmenWaktu: { waktu: "malam" }, isDummy: true }
    ],
    fmipa: [
        { ...TEMPLATE_ORMAWA, id: "fmipa-1", namaLengkap: "[CONTOH] Ormawa FMIPA 1", namaSingkat: "FMIPA 1", tingkat: "fakultas", fakultasId: "fmipa", kategori: "Keilmuan dan Teknologi", deskripsiSingkat: "[Contoh] Ormawa fakultas.", terbukaUntuk: ["fmipa"], komitmenWaktu: { waktu: "akhir-pekan" }, isDummy: true },
        { ...TEMPLATE_ORMAWA, id: "fmipa-2", namaLengkap: "[CONTOH] Ormawa FMIPA 2", namaSingkat: "FMIPA 2", tingkat: "fakultas", fakultasId: "fmipa", kategori: "Olahraga", deskripsiSingkat: "[Contoh] Ormawa fakultas.", terbukaUntuk: ["fmipa"], komitmenWaktu: { waktu: "pagi" }, isDummy: true }
    ],
    fish: [
        { ...TEMPLATE_ORMAWA, id: "fish-1", namaLengkap: "[CONTOH] Ormawa FISH 1", namaSingkat: "FISH 1", tingkat: "fakultas", fakultasId: "fish", kategori: "Keagamaan", deskripsiSingkat: "[Contoh] Ormawa fakultas.", terbukaUntuk: ["fish"], komitmenWaktu: { waktu: "siang" }, isDummy: true },
        { ...TEMPLATE_ORMAWA, id: "fish-2", namaLengkap: "[CONTOH] Ormawa FISH 2", namaSingkat: "FISH 2", tingkat: "fakultas", fakultasId: "fish", kategori: "Alam dan Kepemimpinan", deskripsiSingkat: "[Contoh] Ormawa fakultas.", terbukaUntuk: ["fish"], komitmenWaktu: { waktu: "sore" }, isDummy: true }
    ],
    ft: [
        { ...TEMPLATE_ORMAWA, id: "himaptik", namaLengkap: "Himpunan Mahasiswa PTIK Universitas Negeri Jakarta", namaSingkat: "HIMA PTIK", tingkat: "fakultas", fakultasId: "ft", kategori: "Keilmuan dan Teknologi", deskripsiSingkat: "Himpunan mahasiswa Pendidikan Teknik Informatika dan Komputer.", terbukaUntuk: ["ft"], isDummy: true },
        { ...TEMPLATE_ORMAWA, id: "ft-2", namaLengkap: "[CONTOH] Ormawa Fakultas Teknik 2", namaSingkat: "FT 2", tingkat: "fakultas", fakultasId: "ft", kategori: "Kewirausahaan dan Bisnis", deskripsiSingkat: "[Contoh] Ormawa fakultas.", terbukaUntuk: ["ft"], komitmenWaktu: { waktu: "malam" }, isDummy: true }
    ],
    fikk: [
        { ...TEMPLATE_ORMAWA, id: "fikk-1", namaLengkap: "[CONTOH] Ormawa FIKK 1", namaSingkat: "FIKK 1", tingkat: "fakultas", fakultasId: "fikk", kategori: "Olahraga", deskripsiSingkat: "[Contoh] Ormawa fakultas.", terbukaUntuk: ["fikk"], komitmenWaktu: { waktu: "akhir-pekan" }, isDummy: true },
        { ...TEMPLATE_ORMAWA, id: "fikk-2", namaLengkap: "[CONTOH] Ormawa FIKK 2", namaSingkat: "FIKK 2", tingkat: "fakultas", fakultasId: "fikk", kategori: "Sosial dan Kemanusiaan", deskripsiSingkat: "[Contoh] Ormawa fakultas.", terbukaUntuk: ["fikk"], komitmenWaktu: { waktu: "pagi" }, isDummy: true }
    ],
    feb: [
        { ...TEMPLATE_ORMAWA, id: "feb-1", namaLengkap: "[CONTOH] Ormawa FEB 1", namaSingkat: "FEB 1", tingkat: "fakultas", fakultasId: "feb", kategori: "Kewirausahaan dan Bisnis", deskripsiSingkat: "[Contoh] Ormawa fakultas.", terbukaUntuk: ["feb"], komitmenWaktu: { waktu: "siang" }, isDummy: true },
        { ...TEMPLATE_ORMAWA, id: "feb-2", namaLengkap: "[CONTOH] Ormawa FEB 2", namaSingkat: "FEB 2", tingkat: "fakultas", fakultasId: "feb", kategori: "Media dan Kreatif", deskripsiSingkat: "[Contoh] Ormawa fakultas.", terbukaUntuk: ["feb"], komitmenWaktu: { waktu: "sore" }, isDummy: true }
    ],
    fpsi: [
        { ...TEMPLATE_ORMAWA, id: "fpsi-1", namaLengkap: "[CONTOH] Ormawa FPsi 1", namaSingkat: "FPsi 1", tingkat: "fakultas", fakultasId: "fpsi", kategori: "Sosial dan Kemanusiaan", deskripsiSingkat: "[Contoh] Ormawa fakultas.", terbukaUntuk: ["fpsi"], komitmenWaktu: { waktu: "malam" }, isDummy: true },
        { ...TEMPLATE_ORMAWA, id: "fpsi-2", namaLengkap: "[CONTOH] Ormawa FPsi 2", namaSingkat: "FPsi 2", tingkat: "fakultas", fakultasId: "fpsi", kategori: "Seni dan Budaya", deskripsiSingkat: "[Contoh] Ormawa fakultas.", terbukaUntuk: ["fpsi"], komitmenWaktu: { waktu: "akhir-pekan" }, isDummy: true }
    ]
};

const ORMAWA_DATA = {
    versi: 1,
    fakultas: FAKULTAS_DATA,
    ormawa: [...ORMAWA_UNIVERSITAS, ...Object.values(ORMAWA_FAKULTAS).flat()]
};