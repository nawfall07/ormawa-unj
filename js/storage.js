const Storage = (function() {
    const KEY_DATA = 'ormawa_data_v1';
    const KEY_LAPORAN = 'laporan_data_keliru';
    let memoryData = null;
    let useLocalStorage = true;

    function init() {
        try {
            const stored = localStorage.getItem(KEY_DATA);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed.versi === ORMAWA_DATA.versi) {
                    memoryData = parsed;
                    return;
                }
            }
            seedData();
        } catch (e) {
            useLocalStorage = false;
            seedData();
        }
    }

    function seedData() {
        memoryData = JSON.parse(JSON.stringify(ORMAWA_DATA));
        // Validation
        const ids = new Set();
        memoryData.ormawa.forEach(o => {
            if (ids.has(o.id)) console.warn(`[VERIFIKASI] Duplicate ID: ${o.id}`);
            ids.add(o.id);
            if (!o.tingkat || !['universitas', 'fakultas'].includes(o.tingkat)) {
                console.warn(`[VERIFIKASI] Invalid tingkat for ${o.id}`);
            }
            if (o.tingkat === 'fakultas' && !o.fakultasId) {
                console.warn(`[VERIFIKASI] Missing fakultasId for ${o.id}`);
            }
        });
        saveToStorage(KEY_DATA, memoryData);
    }

    function saveToStorage(key, data) {
        if (useLocalStorage) {
            try { localStorage.setItem(key, JSON.stringify(data)); } catch(e) { useLocalStorage = false; }
        }
    }

    function getFakultas() { return memoryData.fakultas; }
    
    function getOrmawa() { return memoryData.ormawa.filter(o => o.tampil !== false); }
    
    function getOrmawaById(id) { return memoryData.ormawa.find(o => o.id === id) || null; }
    
    function getUniversitas() { return memoryData.ormawa.filter(o => o.tingkat === 'universitas' && o.tampil !== false); }
    
    function getByFakultas(fakultasId) {
        return memoryData.ormawa.filter(o => (o.tingkat === 'fakultas' && o.fakultasId === fakultasId && o.tampil !== false) || (o.tingkat === 'universitas' && o.tampil !== false));
    }

    function getGroupedByFakultas() {
        const groups = {};
        memoryData.fakultas.forEach(f => { groups[f.id] = []; });
        memoryData.ormawa.filter(o => o.tampil !== false).forEach(o => {
            if (o.tingkat === 'fakultas' && o.fakultasId) {
                if (groups[o.fakultasId]) groups[o.fakultasId].push(o);
            }
        });
        return groups;
    }

    function getKategoriCounts() {
        const counts = {};
        const visibleOrmawa = getOrmawa();
        visibleOrmawa.forEach(o => {
            counts[o.kategori] = (counts[o.kategori] || 0) + 1;
        });
        return counts;
    }

    function resetData() { seedData(); }

    function simpanLaporan(obj) {
        let laporan = [];
        try {
            const stored = localStorage.getItem(KEY_LAPORAN);
            if (stored) laporan = JSON.parse(stored);
        } catch(e) {}
        laporan.push({ ...obj, timestamp: new Date().toISOString() });
        try { localStorage.setItem(KEY_LAPORAN, JSON.stringify(laporan)); } catch(e) {}
    }

    init();

    return {
        getFakultas, getOrmawa, getOrmawaById, getUniversitas,
        getByFakultas, getGroupedByFakultas, getKategoriCounts,
        resetData, simpanLaporan
    };
})();