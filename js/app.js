(function() {
    'use strict';

    const app = document.getElementById('app');
    const navMenu = document.getElementById('navMenu');
    const menuToggle = document.getElementById('menuToggle');

    // --- Router ---
    function router() {
        const hash = window.location.hash || '#/beranda';
        const [path, queryString] = hash.split('?');
        const params = new URLSearchParams(queryString);
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === path);
        });

        navMenu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (path === '#/beranda') renderHome();
        else if (path === '#/jelajah') renderJelajah(params);
        else if (path.startsWith('#/ormawa/')) {
            const id = path.split('/')[2];
            renderDetail(id);
        }
        else if (path === '#/tentang') renderTentang();
        else renderHome();
    }

    window.addEventListener('hashchange', router);
    window.addEventListener('DOMContentLoaded', router);

    // --- Mobile Menu ---
    menuToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        menuToggle.setAttribute('aria-label', isOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi');
    });

    // --- Helpers ---
    function getInitials(name) {
        if (!name) return '?';
        return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
    }

    function formatOpenFor(terbuka) {
        if (!terbuka) return 'Info keanggotaan belum tersedia';
        if (terbuka === 'semua') return 'Terbuka untuk semua mahasiswa';
        if (Array.isArray(terbuka)) {
            const fakultas = Storage.getFakultas().filter(f => terbuka.includes(f.id));
            return `Khusus: ${fakultas.map(f => f.singkatan).join(', ')}`;
        }
        return 'Info keanggotaan belum tersedia';
    }

    // --- NEW RENDER CARD FUNCTION ---
    function renderCard(o) {
    // Determine Level Text
    let levelText = 'Universitas';
    if (o.tingkat === 'fakultas' && o.fakultasId) {
        const fakultas = Storage.getFakultas().find(f => f.id === o.fakultasId);
        levelText = fakultas ? fakultas.nama : 'Fakultas';
    }

    // Generate Initials for placeholder logo
    const initials = o.namaSingkat 
        ? o.namaSingkat.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() 
        : '?';

    return `
        <article class="card">
            <div class="card-header">
                <div class="card-logo-wrap">
                    ${o.logo 
                        ? `<img src="${o.logo}" alt="Logo ${o.namaLengkap}" class="card-logo-img">` 
                        : `<div class="card-logo-placeholder">${initials}</div>`
                    }
                </div>
                <div class="card-title-group">
                    <h3 class="card-name" title="${o.namaLengkap}">${o.namaSingkat}</h3>
                    <div class="card-category">${o.kategori}</div>
                    <div class="card-level">${levelText}</div>
                </div>
            </div>
            
            <p class="card-description">${o.deskripsiSingkat || 'Deskripsi belum tersedia.'}</p>
            
            <div class="card-footer">
                ${o.isDummy ? '<span class="card-dummy-tag">Data contoh</span>' : '<span></span>'}
                <a href="#/ormawa/${o.id}" class="card-btn" aria-label="Lihat detail ${o.namaLengkap}">Lihat detail</a>
            </div>
        </article>
    `;
}

    // --- Pages ---
    function renderHome() {
        const counts = Storage.getKategoriCounts();
        const totalOrmawa = Storage.getOrmawa().length;
        const totalFakultas = Storage.getFakultas().length;
        const totalKategori = Object.keys(counts).length;
        const uniOrmawa = Storage.getUniversitas().slice(0, 4);

        let catHtml = '';
        const categories = ['Seni dan Budaya', 'Olahraga', 'Keilmuan dan Teknologi', 'Media dan Kreatif', 'Kewirausahaan dan Bisnis', 'Sosial dan Kemanusiaan', 'Keagamaan', 'Alam dan Kepemimpinan'];
        const icons = {
            'Seni dan Budaya': 'bi-palette-fill', 'Olahraga': 'bi-trophy-fill', 'Keilmuan dan Teknologi': 'bi-cpu-fill',
            'Media dan Kreatif': 'bi-camera-reels-fill', 'Kewirausahaan dan Bisnis': 'bi-briefcase-fill',
            'Sosial dan Kemanusiaan': 'bi-heart-fill', 'Keagamaan': 'bi-book-half', 'Alam dan Kepemimpinan': 'bi-tree-fill'
        };

        categories.forEach(cat => {
            const count = counts[cat] || 0;
            catHtml += `
                <a href="#/jelajah?kategori=${encodeURIComponent(cat)}" class="cat-card">
                    <div class="cat-icon"><i class="bi ${icons[cat]}"></i></div>
                    <h3>${cat}</h3>
                    <p>Temukan organisasi di bidang ini.</p>
                    <span class="cat-count">${count} Ormawa &rarr;</span>
                </a>`;
        });

        // Menggunakan renderCard(o)
        let uniHtml = uniOrmawa.map(o => renderCard(o)).join('');

        app.innerHTML = `
            <section class="hero">
                <div class="container hero-inner">
                    <div class="hero-badge"><i class="bi bi-stars"></i> Pencarian Informasi Ormawa UNJ</div>
                    <h1>Temukan <span>Organisasi Kemahasiswaan</span> UNJ Sesuai Minatmu</h1>
                    <p>Jelajahi berbagai Ormawa tingkat universitas dan fakultas di Universitas Negeri Jakarta. Pelajari kegiatan, program kerja, rekam jejak, dan komitmen waktu dalam satu tempat.</p>
                    <form class="search-box" onsubmit="event.preventDefault(); window.location.hash='#/jelajah?q=' + encodeURIComponent(this.q.value);">
                        <i class="bi bi-search"></i>
                        <input type="text" name="q" placeholder="Cari organisasi, minat, atau kata kunci..." aria-label="Cari organisasi" />
                        <button type="submit" class="search-btn">Cari</button>
                    </form>
                    <div class="hero-stats">
                        <div class="stat"><div class="stat-num">${totalOrmawa}</div><div class="stat-label">Ormawa Terdaftar</div></div>
                        <div class="stat"><div class="stat-num">${totalKategori}</div><div class="stat-label">Kategori Minat</div></div>
                        <div class="stat"><div class="stat-num">${totalFakultas}</div><div class="stat-label">Fakultas</div></div>
                    </div>
                </div>
            </section>

            <section class="page-section categories">
                <div class="container">
                    <div class="section-head">
                        <span class="section-tag">Kategori Minat</span>
                        <h2 class="section-title">Mulai dari Minatmu</h2>
                        <p class="section-desc">Pilih kategori yang paling sesuai dengan dirimu.</p>
                    </div>
                    <div class="cat-grid">${catHtml}</div>
                </div>
            </section>

            <section class="page-section">
                <div class="container">
                    <div class="section-head">
                        <span class="section-tag">Pilihan</span>
                        <h2 class="section-title">Ormawa Tingkat Universitas</h2>
                        <p class="section-desc">Beberapa Ormawa tingkat universitas yang tersedia.</p>
                    </div>
                    <div class="ormawa-grid">${uniHtml}</div>
                </div>
            </section>

            <section class="page-section">
                <div class="container">
                    <div class="section-head">
                        <span class="section-tag">Panduan</span>
                        <h2 class="section-title">Cara Menggunakan</h2>
                    </div>
                    <div class="how-to-grid">
                        <div class="how-to-card">
                            <div class="how-to-num">1</div>
                            <h3>Cari</h3>
                            <p>Gunakan kolom pencarian atau pilih kategori minat di Beranda.</p>
                        </div>
                        <div class="how-to-card">
                            <div class="how-to-num">2</div>
                            <h3>Pelajari</h3>
                            <p>Buka detail Ormawa untuk melihat komitmen waktu, program kerja, dan rekam jejak.</p>
                        </div>
                        <div class="how-to-card">
                            <div class="how-to-num">3</div>
                            <h3>Daftar</h3>
                            <p>Ikuti tautan resmi pada bagian "Cara Daftar" untuk mendaftar.</p>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    function renderJelajah(params) {
        const q = (params.get('q') || '').toLowerCase();
        const kategori = params.get('kategori') || '';
        const tingkat = params.get('tingkat') || '';
        const fakultas = params.get('fakultas') || '';
        const waktu = params.get('waktu') || '';

        let data = Storage.getOrmawa();
        
        // Initial filter based on URL params
        if (q) data = data.filter(o => (o.namaLengkap + ' ' + o.namaSingkat + ' ' + o.kategori + ' ' + (o.deskripsiSingkat||'')).toLowerCase().includes(q));
        if (kategori) data = data.filter(o => o.kategori === kategori);
        if (tingkat && tingkat !== 'semua') data = data.filter(o => o.tingkat === tingkat);
        if (fakultas && fakultas !== 'semua') {
            data = data.filter(o => o.tingkat === 'universitas' || o.fakultasId === fakultas);
        }
        if (waktu) data = data.filter(o => o.komitmenWaktu && o.komitmenWaktu.waktu === waktu);

        data.sort((a, b) => a.namaSingkat.localeCompare(b.namaSingkat));

        const fakultasOpts = Storage.getFakultas().map(f => `<option value="${f.id}" ${fakultas === f.id ? 'selected' : ''}>${f.nama} (${f.singkatan})</option>`).join('');
        
        let gridHtml = '';
        if (data.length === 0) {
            gridHtml = `<div class="empty-state"><i class="bi bi-search"></i><h3>Tidak ada hasil</h3><p>Coba ubah filter atau kata kunci pencarian Anda.</p></div>`;
        } else if (tingkat === 'fakultas' && !fakultas) {
            Storage.getFakultas().forEach(f => {
                const items = data.filter(o => o.fakultasId === f.id);
                if (items.length > 0) {
                    gridHtml += `<h3 style="margin: 32px 0 16px; color: var(--primary-dark);">${f.nama}</h3><div class="ormawa-grid">`;
                    gridHtml += items.map(o => renderCard(o)).join('');
                    gridHtml += `</div>`;
                }
            });
        } else {
            gridHtml = `<div class="ormawa-grid">${data.map(o => renderCard(o)).join('')}</div>`;
        }

        // Gunakan <div> biasa, bukan <form>, untuk menghindari perilaku submit
        app.innerHTML = `
            <section class="page-section" style="background: var(--bg-light); padding-bottom: 32px;">
                <div class="container">
                    <span class="section-tag">Jelajah Ormawa</span>
                    <h1 class="section-title" style="text-align:left">Temukan Ormawa yang Tepat</h1>
                    <p class="section-desc" style="margin:0;text-align:left">Gunakan pencarian dan filter untuk menemukan organisasi.</p>
                    
                    <div class="filter-bar" id="explore-filters">
                        <input type="text" name="q" placeholder="Cari nama atau kata kunci..." value="${params.get('q') || ''}" autocomplete="off" />
                        <select name="kategori">
                            <option value="">Semua Kategori</option>
                            ${['Seni dan Budaya', 'Olahraga', 'Keilmuan dan Teknologi', 'Media dan Kreatif', 'Kewirausahaan dan Bisnis', 'Sosial dan Kemanusiaan', 'Keagamaan', 'Alam dan Kepemimpinan'].map(c => `<option value="${c}" ${kategori === c ? 'selected' : ''}>${c}</option>`).join('')}
                        </select>
                        <select name="tingkat">
                            <option value="semua" ${tingkat === 'semua' || !tingkat ? 'selected' : ''}>Semua Tingkat</option>
                            <option value="universitas" ${tingkat === 'universitas' ? 'selected' : ''}>Universitas</option>
                            <option value="fakultas" ${tingkat === 'fakultas' ? 'selected' : ''}>Fakultas</option>
                        </select>
                        <select name="fakultas">
                            <option value="semua" ${!fakultas ? 'selected' : ''}>Semua Fakultas</option>
                            ${fakultasOpts}
                        </select>
                        <select name="waktu">
                            <option value="">Semua Waktu</option>
                            <option value="pagi" ${waktu === 'pagi' ? 'selected' : ''}>Pagi</option>
                            <option value="siang" ${waktu === 'siang' ? 'selected' : ''}>Siang</option>
                            <option value="sore" ${waktu === 'sore' ? 'selected' : ''}>Sore</option>
                            <option value="malam" ${waktu === 'malam' ? 'selected' : ''}>Malam</option>
                            <option value="akhir-pekan" ${waktu === 'akhir-pekan' ? 'selected' : ''}>Akhir pekan</option>
                        </select>
                    </div>
                    <div class="filter-actions">
                        <span class="filter-counter">Menampilkan ${data.length} organisasi</span>
                        <button class="btn-clear" id="btn-clear-filters">Hapus semua filter</button>
                    </div>
                    <div id="explore-grid-container">
                        ${gridHtml}
                    </div>
                </div>
            </section>
        `;

        // Aktifkan filter real-time setelah HTML dirender
        setupRealtimeFilters();
    }

    function setupRealtimeFilters() {
        const filterContainer = document.getElementById('explore-filters');
        const gridContainer = document.getElementById('explore-grid-container');
        const counter = document.querySelector('.filter-counter');
        const clearBtn = document.getElementById('btn-clear-filters');

        if (!filterContainer || !gridContainer) return;

        const searchInput = filterContainer.querySelector('input[name="q"]');
        const selects = filterContainer.querySelectorAll('select');

        // Fungsi untuk mengambil nilai filter saat ini
        const getCurrentValues = () => ({
            q: searchInput.value.toLowerCase().trim(),
            kategori: filterContainer.querySelector('select[name="kategori"]').value,
            tingkat: filterContainer.querySelector('select[name="tingkat"]').value,
            fakultas: filterContainer.querySelector('select[name="fakultas"]').value,
            waktu: filterContainer.querySelector('select[name="waktu"]').value
        });

        // Fungsi utama untuk memfilter dan merender ulang grid saja
        const updateGrid = () => {
            const vals = getCurrentValues();
            let data = Storage.getOrmawa();

            // Terapkan logika filter yang sama
            if (vals.q) data = data.filter(o => (o.namaLengkap + ' ' + o.namaSingkat + ' ' + o.kategori + ' ' + (o.deskripsiSingkat||'')).toLowerCase().includes(vals.q));
            if (vals.kategori) data = data.filter(o => o.kategori === vals.kategori);
            if (vals.tingkat && vals.tingkat !== 'semua') data = data.filter(o => o.tingkat === vals.tingkat);
            if (vals.fakultas && vals.fakultas !== 'semua') {
                data = data.filter(o => o.tingkat === 'universitas' || o.fakultasId === vals.fakultas);
            }
            if (vals.waktu) data = data.filter(o => o.komitmenWaktu && o.komitmenWaktu.waktu === vals.waktu);

            data.sort((a, b) => a.namaSingkat.localeCompare(b.namaSingkat));

            // Perbarui teks counter
            if (counter) counter.textContent = `Menampilkan ${data.length} organisasi`;

            // Render ulang grid
            let newGridHtml = '';
            if (data.length === 0) {
                newGridHtml = `<div class="empty-state"><i class="bi bi-search"></i><h3>Tidak ada hasil</h3><p>Coba ubah filter atau kata kunci pencarian Anda.</p></div>`;
            } else if (vals.tingkat === 'fakultas' && !vals.fakultas) {
                Storage.getFakultas().forEach(f => {
                    const items = data.filter(o => o.fakultasId === f.id);
                    if (items.length > 0) {
                        newGridHtml += `<h3 style="margin: 32px 0 16px; color: var(--primary-dark);">${f.nama}</h3><div class="ormawa-grid">`;
                        newGridHtml += items.map(o => renderCard(o)).join('');
                        newGridHtml += `</div>`;
                    }
                });
            } else {
                newGridHtml = `<div class="ormawa-grid">${data.map(o => renderCard(o)).join('')}</div>`;
            }

            // Hanya update innerHTML grid, input tidak kehilangan fokus
            gridContainer.innerHTML = newGridHtml;
        };

        // Pasang event listener untuk pencarian (real-time saat mengetik)
        if (searchInput) {
            searchInput.addEventListener('input', updateGrid);
        }

        // Pasang event listener untuk dropdown (real-time saat memilih)
        selects.forEach(select => {
            select.addEventListener('change', updateGrid);
        });

        // Fungsi tombol "Hapus semua filter"
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                // Reset nilai input dan select
                searchInput.value = '';
                selects.forEach(s => s.selectedIndex = 0);
                // Perbarui grid
                updateGrid();
                // Opsional: reset URL hash agar bersih
                window.location.hash = '#/jelajah';
            });
        }
    }

    function renderDetail(id) {
        const o = Storage.getOrmawaById(id);
        if (!o) {
            app.innerHTML = `<section class="page-section"><div class="container empty-state"><i class="bi bi-exclamation-triangle"></i><h3>Ormawa tidak ditemukan</h3><a href="#/jelajah" class="btn-primary" style="margin-top:16px">Kembali ke Jelajah</a></div></section>`;
            return;
        }

        const fakultasName = o.fakultasId ? Storage.getFakultas().find(f => f.id === o.fakultasId)?.nama : 'Universitas';
        const similar = Storage.getOrmawa().filter(x => x.kategori === o.kategori && x.id !== o.id).slice(0, 3);

        const tabs = [
            { id: 'tentang', label: 'Tentang', content: `<p>${o.deskripsiSingkat || 'Belum tersedia'}</p>` },
            { id: 'kegiatan', label: 'Kegiatan dan Program Kerja', content: o.kegiatan && o.kegiatan.length ? `<ul>${o.kegiatan.map(k => `<li>${k}</li>`).join('')}</ul>` : '<p>Belum tersedia</p>' },
            { id: 'rekam', label: 'Rekam Jejak', content: o.rekamJejak && o.rekamJejak.length ? o.rekamJejak.map(r => `<div class="timeline-item"><div class="timeline-year">${r.tahun}</div><div class="timeline-title">${r.judul}</div></div>`).join('') : '<p>Belum tersedia</p>' },
            { id: 'struktur', label: 'Struktur', content: `<p>${o.struktur || 'Belum tersedia'}</p>` },
            { id: 'daftar', label: 'Cara Daftar', content: o.caraDaftar ? `<p><strong>Periode:</strong> ${o.caraDaftar.periode || 'Belum tersedia'}</p>${o.caraDaftar.tahapan && o.caraDaftar.tahapan.length ? `<ul>${o.caraDaftar.tahapan.map(t => `<li>${t}</li>`).join('')}</ul>` : ''}` : '<p>Belum tersedia</p>' }
        ];

        app.innerHTML = `
            <section class="detail-header">
                <div class="container">
                    <div class="detail-top">
                        <div class="detail-logo">
                            ${o.logo ? `<img src="${o.logo}" alt="Logo" onerror="this.style.display='none';this.parentElement.innerText='${getInitials(o.namaSingkat)}'">` : getInitials(o.namaSingkat)}
                        </div>
                        <div class="detail-info">
                            ${o.isDummy ? '<span class="card-badge" style="position:static;margin-bottom:8px;display:inline-block">Data contoh</span>' : ''}
                            <h1>${o.namaLengkap}</h1>
                            <div class="detail-badges">
                                <span class="ormawa-level">${o.tingkat === 'universitas' ? 'Tingkat Universitas' : 'Tingkat Fakultas: ' + fakultasName}</span>
                                <span class="ormawa-level" style="background:#fff;border:1px solid var(--border)">${o.kategori}</span>
                            </div>
                            <div class="detail-actions">
                                ${o.kanal?.instagram ? `<a href="${o.kanal.instagram}" target="_blank" rel="noopener" class="btn-primary"><i class="bi bi-instagram"></i> Instagram</a>` : `<button class="btn-primary" disabled title="Tautan belum tersedia" aria-label="Tautan belum tersedia"><i class="bi bi-instagram"></i> Tautan belum tersedia</button>`}
                                ${o.caraDaftar?.tautan ? `<a href="${o.caraDaftar.tautan}" target="_blank" rel="noopener" class="btn-secondary"><i class="bi bi-box-arrow-up-right"></i> Cara daftar</a>` : `<button class="btn-secondary" disabled title="Tautan belum tersedia" aria-label="Tautan belum tersedia"><i class="bi bi-box-arrow-up-right"></i> Tautan belum tersedia</button>`}
                            </div>
                        </div>
                    </div>
                    <div class="detail-meta">
                        Diperbarui: ${o.diperbaruiPada || 'Belum tersedia'} · Sumber: ${o.sumberData || 'Belum tersedia'} · 
                        <a href="#/tentang">Lihat asal data</a>
                    </div>

                    <div class="commitment-box">
                        <h3><i class="bi bi-clock-history"></i> Komitmen Waktu</h3>
                        <div class="commitment-grid">
                            <div class="commitment-item"><i class="bi bi-calendar3"></i><div><strong>Frekuensi</strong><span>${o.komitmenWaktu?.frekuensi || 'Belum tersedia'}</span></div></div>
                            <div class="commitment-item"><i class="bi bi-clock"></i><div><strong>Hari & Jam</strong><span>${o.komitmenWaktu?.hariJam || 'Belum tersedia'}</span></div></div>
                            <div class="commitment-item"><i class="bi bi-sun"></i><div><strong>Waktu</strong><span>${o.komitmenWaktu?.waktu ? o.komitmenWaktu.waktu.replace('-', ' ') : 'Belum tersedia'}</span></div></div>
                            <div class="commitment-item"><i class="bi bi-geo-alt"></i><div><strong>Lokasi</strong><span>${o.komitmenWaktu?.lokasi || 'Belum tersedia'}</span></div></div>
                        </div>
                    </div>

                    <div class="tabs">
                        <div class="tab-list" role="tablist">
                            ${tabs.map((t, i) => `<button class="tab-btn ${i===0?'active':''}" role="tab" aria-selected="${i===0}" onclick="switchTab(this, '${t.id}')">${t.label}</button>`).join('')}
                        </div>
                        ${tabs.map((t, i) => `<div class="tab-content ${i===0?'active':''}" id="tab-${t.id}" role="tabpanel"><h3>${t.label}</h3>${t.content}</div>`).join('')}
                    </div>

                    ${similar.length ? `
                    <h3 style="margin-top:48px;margin-bottom:24px;color:var(--primary-dark)">Ormawa Serupa</h3>
                    <div class="ormawa-grid">${similar.map(x => renderCard(x)).join('')}</div>
                    ` : ''}
                </div>
            </section>
        `;
    }

    function renderTentang() {
        app.innerHTML = `
            <section class="about-hero">
                <div class="container">
                    <span class="section-tag">Tentang Kami</span>
                    <h1>Platform Informasi Ormawa UNJ</h1>
                    <p>Proyek mahasiswa untuk mengumpulkan informasi organisasi kemahasiswaan di Universitas Negeri Jakarta dalam satu tempat - agar mahasiswa dapat menemukan dan mempelajari Ormawa yang sesuai dengan minat, jadwal, dan tujuannya.</p>
                </div>
            </section>

            <section class="page-section">
                <div class="container">
                    <div class="section-head">
                        <span class="section-tag">Latar Belakang</span>
                        <h2 class="section-title">Mengapa Platform Ini Ada?</h2>
                        <p class="section-desc">Berdasarkan riset pengguna, mahasiswa UNJ kesulitan menemukan Ormawa karena informasi tersebar di berbagai akun Instagram, tidak seragam, dan kurang memuat hal penting seperti jadwal, program kerja, dan rekam jejak.</p>
                    </div>
                    <div class="about-grid">
                        <div class="about-card"><i class="bi bi-search"></i><h3>Informasi Terpusat</h3><p>Seluruh Ormawa tingkat universitas dan fakultas dikumpulkan dalam satu platform.</p></div>
                        <div class="about-card"><i class="bi bi-funnel-fill"></i><h3>Cari Berdasarkan Minat</h3><p>Filter Ormawa berdasarkan kategori minat, tingkat, fakultas, dan waktu kegiatan.</p></div>
                        <div class="about-card"><i class="bi bi-clock-history"></i><h3>Komitmen Waktu Transparan</h3><p>Informasi jadwal dan frekuensi kegiatan ditampilkan sebelum mahasiswa mendaftar.</p></div>
                        <div class="about-card"><i class="bi bi-shield-check"></i><h3>Data Terpercaya</h3><p>Setiap profil dilengkapi sumber dan tanggal pembaruan untuk menjaga kepercayaan.</p></div>
                    </div>
                </div>
            </section>

            <section class="page-section" style="background:var(--bg-light)">
                <div class="container">
                    <div class="section-head">
                        <span class="section-tag">Sumber Data</span>
                        <h2 class="section-title">Asal dan Pembaruan Data</h2>
                        <p class="section-desc">Data dikumpulkan melalui observasi langsung, laman resmi, dan verifikasi internal. Beberapa data masih berstatus "Data contoh" dan akan segera diganti dengan data terverifikasi.</p>
                    </div>
                    <div class="team-grid">
                        <div class="team-card"><div class="team-avatar">FN</div><h4>Farrel Naufal Priyonggo</h4><p>1512625021</p></div>
                        <div class="team-card"><div class="team-avatar">SM</div><h4>Muhammad Sail Mustajab</h4><p>1512625096</p></div>
                        <div class="team-card"><div class="team-avatar">PS</div><h4>Philip Joshua Maloma Sihotang</h4><p>1512625094</p></div>
                    </div>
                    <p style="text-align:center;margin-top:30px;color:var(--text-secondary)"><strong>Dosen Pengampu:</strong> Ressy Dwitias Sari, S.T., M.T.I.</p>
                </div>
            </section>

            <section class="form-section" id="laporan-form">
                <div class="container">
                    <div class="form-container">
                        <h2>Laporkan Data Keliru</h2>
                        <p>Bantu kami memperbaiki data.</p>
                        <form id="reportForm" novalidate>
                            <div class="form-group">
                                <label for="r_ormawa">Nama Ormawa *</label>
                                <select id="r_ormawa" required>
                                    <option value="">Pilih Ormawa</option>
                                    ${Storage.getOrmawa().map(o => `<option value="${o.id}">${o.namaSingkat}</option>`).join('')}
                                </select>
                                <div class="error">Pilih organisasi terlebih dahulu.</div>
                            </div>
                            <div class="form-group">
                                <label for="r_bagian">Bagian yang Keliru *</label>
                                <input type="text" id="r_bagian" required placeholder="Contoh: Jadwal kegiatan, Link Instagram" />
                                <div class="error">Bagian yang keliru wajib diisi.</div>
                            </div>
                            <div class="form-group">
                                <label for="r_koreksi">Koreksi yang Diusulkan *</label>
                                <textarea id="r_koreksi" required placeholder="Jelaskan data yang seharusnya..."></textarea>
                                <div class="error">Koreksi wajib diisi.</div>
                            </div>
                            <div class="form-group">
                                <label for="r_email">Email (Opsional)</label>
                                <input type="email" id="r_email" placeholder="nama@email.com" />
                            </div>
                            <button type="submit" class="btn-submit">Kirim Laporan</button>
                            <div class="success-message" id="successMsg">Laporan berhasil disimpan secara lokal. Terima kasih atas kontribusinya!</div>
                        </form>
                    </div>
                </div>
            </section>
        `;

        document.getElementById('reportForm').addEventListener('submit', function(e) {
            e.preventDefault();
            let valid = true;
            const fields = ['r_ormawa', 'r_bagian', 'r_koreksi'];
            fields.forEach(id => {
                const el = document.getElementById(id);
                const group = el.closest('.form-group');
                if (!el.value.trim()) {
                    group.classList.add('invalid');
                    valid = false;
                } else {
                    group.classList.remove('invalid');
                }
            });

            if (valid) {
                Storage.simpanLaporan({
                    ormawaId: document.getElementById('r_ormawa').value,
                    bagian: document.getElementById('r_bagian').value,
                    koreksi: document.getElementById('r_koreksi').value,
                    email: document.getElementById('r_email').value
                });
                document.getElementById('successMsg').classList.add('show');
                this.reset();
            }
        });
    }

    // --- Global Functions ---
    window.applyJelajahFilter = function(form) {
        const fd = new FormData(form);
        const params = new URLSearchParams();
        for (let [key, value] of fd.entries()) {
            if (value) params.set(key, value);
        }
        window.location.hash = '#/jelajah?' + params.toString();
    };

    window.switchTab = function(btn, tabId) {
        btn.closest('.tabs').querySelectorAll('.tab-btn').forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        
        btn.closest('.tabs').querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.getElementById('tab-' + tabId).classList.add('active');
    };

})();