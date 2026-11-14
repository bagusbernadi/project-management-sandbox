/* Halaman latihan: tab sertifikasi, latihan per topik, simulasi bertimer, kartu rumus */
(function () {
  let cert = 'pmp', mode = 'lat', TM = null, flt = { d: 'all', ap: 'all' };
  const tabsEl = $('#ctabs'), subEl = $('#sub'), host = $('#host'), info = $('#info');
  const SUBS = [['lat', 'Latihan per topik'], ['s1', 'Simulasi 1'], ['s2', 'Simulasi 2'], ['fl', 'Kartu rumus']];
  /* urutan opsi diacak tetap per soal, agar posisi jawaban benar tidak berpola */
  const toItem = (r, i) => { const ord = shuffle([0, 1, 2, 3], 1000 + i * 7 + cert.length * 131); return { d: r[0], ap: r[1], q: r[2], o: ord.map(k => r[3][k]), a: ord.indexOf(r[4]), e: r[5] }; };
  const pool = () => BANK[cert].map(toItem);
  const mm = s => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');

  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function shuffle(a, seed) { const r = rng(seed), b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }

  function draw() {
    clearInterval(TM);
    const c = CERTS[cert];
    tabsEl.innerHTML = Object.keys(CERTS).map(k => `<button data-c="${k}" class="${k === cert ? 'on' : ''}">${CERTS[k].name}</button>`).join('');
    subEl.innerHTML = SUBS.map(s => `<button data-m="${s[0]}" class="${s[0] === mode ? 'on' : ''}">${s[1]}</button>`).join('');
    info.innerHTML = `<b>${c.full}</b><br>${c.facts}<br><span class="muted small">Bank latihan: ${BANK[cert].length} soal.</span>`;
    if (mode === 'lat') practice(); else if (mode === 'fl') cards(); else sim(mode === 's1' ? 1 : 2);
  }

  /* ---------- Latihan per topik */
  function practice() {
    const c = CERTS[cert], items = pool();
    const chips = (obj, key, label) => `<div class="flt"><b>${label}</b><button data-f="${key}" data-v="all" class="${flt[key] === 'all' ? 'on' : ''}">Semua</button>${Object.entries(obj).map(([k, v]) => `<button data-f="${key}" data-v="${k}" class="${flt[key] === k ? 'on' : ''}">${v}</button>`).join('')}</div>`;
    const sel = items.filter(i => (flt.d === 'all' || i.d === flt.d) && (flt.ap === 'all' || i.ap === flt.ap));
    host.innerHTML = chips(c.domains, 'd', 'Domain') + (c.apps ? chips(c.apps, 'ap', 'Pendekatan') : '') +
      `<p class="muted small">${sel.length} soal ditampilkan. Pilih jawaban untuk melihat penjelasan.</p><div id="pl"></div>`;
    if (!sel.length) { $('#pl').innerHTML = '<div class="out">Tidak ada soal untuk kombinasi filter ini. Ubah salah satu filter.</div>'; return; }
    quiz(sel.map(i => ({ q: `<span class="qtag">${c.domains[i.d]}${i.ap ? ' · ' + c.apps[i.ap] : ''}</span>${i.q}`, o: i.o, a: i.a, e: i.e })), '#pl');
  }

  /* ---------- Simulasi */
  function sim(n) {
    const c = CERTS[cert], all = pool(), items = shuffle(all, n === 1 ? 11 : 29).slice(0, Math.min(30, all.length));
    const total = Math.round(items.length * c.secPerQ);
    let ans = items.map(() => -1), flag = items.map(() => false), cur = 0, left = total;
    host.innerHTML = `<div class="sim"><div class="sim-h">Simulasi ${n} · ${c.name}</div>
      <h3>${items.length} soal, ${Math.round(total / 60)} menit</h3>
      <p>Tempo disesuaikan dengan ujian asli (sekitar ${c.secPerQ} detik per soal). Tidak ada penjelasan sampai Anda menyelesaikan simulasi. Anda boleh menandai soal ragu-ragu dan kembali ke soal mana pun sebelum waktu habis.</p>
      <button id="go">Mulai simulasi</button></div>`;
    $('#go').onclick = run;

    function run() {
      host.innerHTML = `<div class="sim"><div class="sim-h">Simulasi ${n} · ${c.name}</div>
        <div class="sim-top"><span class="muted small" id="prog"></span><span class="timer" id="tm"></span></div>
        <div class="dots2" id="dots"></div><div class="simq" id="sq"></div></div>`;
      paint();
      TM = setInterval(() => { left--; tick(); if (left <= 0) finish(); }, 1000); tick();
    }
    function tick() { const t = $('#tm'); if (!t) return; t.textContent = mm(Math.max(0, left)); t.classList.toggle('low', left <= 120); }
    function paint() {
      const it = items[cur];
      $('#prog').textContent = `Soal ${cur + 1} dari ${items.length} · terjawab ${ans.filter(a => a >= 0).length}`;
      $('#dots').innerHTML = items.map((_, i) => `<button data-i="${i}" class="${i === cur ? 'cur' : ans[i] >= 0 ? 'ans' : ''} ${flag[i] ? 'flg' : ''}">${i + 1}</button>`).join('');
      $('#sq').innerHTML = `<p class="qt"><span class="qtag">${c.domains[it.d]}</span>${it.q}</p><div class="opts">${it.o.map((o, j) => `<button data-j="${j}" class="${ans[cur] === j ? 'on' : ''}">${o}</button>`).join('')}</div>
        <div class="seg"><button class="ghost" data-a="prev"${cur === 0 ? ' disabled' : ''}>← Sebelumnya</button><button class="ghost" data-a="flag">${flag[cur] ? 'Lepas tanda' : 'Tandai ragu'}</button><button class="ghost" data-a="next"${cur === items.length - 1 ? ' disabled' : ''}>Berikutnya →</button><button data-a="fin" style="margin-left:auto">Selesai</button></div>`;
    }
    host.onclick = e => {
      const d = e.target.closest('#dots button'), o = e.target.closest('.opts button'), a = e.target.closest('[data-a]');
      if (d) { cur = +d.dataset.i; paint(); } else if (o) { ans[cur] = +o.dataset.j; paint(); }
      else if (a) {
        const k = a.dataset.a;
        if (k === 'prev') cur--; else if (k === 'next') cur++; else if (k === 'flag') flag[cur] = !flag[cur];
        else if (k === 'fin') { finish(); return; }
        paint();
      }
    };
    function finish() {
      clearInterval(TM); host.onclick = null;
      const ok = items.map((it, i) => ans[i] === it.a), n1 = ok.filter(Boolean).length, pct = Math.round(n1 / items.length * 100);
      const by = {}; items.forEach((it, i) => { const b = by[it.d] || (by[it.d] = [0, 0]); b[1]++; if (ok[i]) b[0]++; });
      const used = total - Math.max(0, left);
      let verdict;
      if (c.pass) verdict = pct >= c.pass ? `<b style="color:#2B8A3E">Di atas target ${c.pass}%.</b> Pertahankan konsistensi di beberapa simulasi.` : `<b style="color:#C92A2A">Di bawah target ${c.pass}%.</b> Ujian asli menuntut ${c.pass}%, jadi pelajari lagi Scrum Guide dan ulangi simulasi.`;
      else verdict = pct >= 75 ? `<b style="color:#2B8A3E">Cukup kuat.</b> Latih terus dengan soal yang lebih sulit.` : pct >= 60 ? `<b style="color:#B7791F">Perlu diperkuat.</b> Fokus pada domain dengan skor terendah.` : `<b style="color:#C92A2A">Belum siap.</b> Ulangi materi modul terkait lalu coba lagi.`;
      host.innerHTML = `<div class="sim"><div class="sim-h">Hasil simulasi ${n} · ${c.name}</div>
        <div class="kpis"><div class="kpi"><span>Skor</span><b>${pct}%</b></div><div class="kpi"><span>Benar</span><b>${n1} / ${items.length}</b></div><div class="kpi"><span>Waktu terpakai</span><b>${mm(used)}</b></div></div>
        <div class="out">${verdict}${c.pass ? '' : '<br><span class="small muted">PMI tidak menerbitkan nilai lulus tetap; hasil resmi dilaporkan per domain (Above Target, Target, Below Target, Needs Improvement). Angka 75% di sini hanya patokan latihan, bukan nilai lulus resmi.</span>'}</div>
        <h3>Per domain</h3><table class="res">${Object.entries(by).map(([k, v]) => { const p = Math.round(v[0] / v[1] * 100); return `<tr><td>${c.domains[k]}</td><td>${v[0]} / ${v[1]}</td><td><div class="bar2"><i style="width:${p}%;background:${p >= 75 ? '#2B8A3E' : p >= 60 ? '#B7791F' : '#C92A2A'}"></i></div></td><td>${p}%</td></tr>`; }).join('')}</table>
        <p><button id="again">Ulangi simulasi ini</button> <button class="ghost" id="rev">Lihat pembahasan</button></p><div id="rvw"></div></div>`;
      $('#again').onclick = () => sim(n);
      $('#rev').onclick = () => {
        $('#rvw').innerHTML = items.map((it, i) => `<div class="rv"><p><b>${i + 1}. ${it.q}</b></p><p class="small">${ans[i] < 0 ? '<b style="color:#B7791F">Tidak dijawab.</b>' : ok[i] ? '<b style="color:#2B8A3E">Benar.</b>' : `<b style="color:#C92A2A">Jawaban Anda salah:</b> ${it.o[ans[i]]}`}<br>Jawaban benar: <b>${it.o[it.a]}</b></p><p class="small muted" style="margin:0">${it.e}</p></div>`).join('');
        $('#rev').disabled = true;
      };
    }
  }

  /* ---------- Kartu */
  function cards() {
    let order = FLASH[cert].map((_, i) => i);
    const render = () => { $('#fcs').innerHTML = order.map(i => `<button class="fc"><b>${FLASH[cert][i][0]}</b><span>${FLASH[cert][i][1]}</span></button>`).join(''); };
    host.innerHTML = `<p class="muted small">Klik kartu untuk melihat jawabannya. Coba ingat dulu sebelum membuka.</p><p><button class="ghost" id="shf">Acak urutan</button> <button class="ghost" id="all">Buka semua</button></p><div class="fcs" id="fcs"></div>`;
    render();
    $('#fcs').onclick = e => { const f = e.target.closest('.fc'); if (f) f.classList.toggle('on'); };
    $('#shf').onclick = () => { order = shuffle(order, Date.now() % 9973); render(); };
    $('#all').onclick = () => $$('.fc').forEach(f => f.classList.add('on'));
  }

  tabsEl.onclick = e => { const b = e.target.closest('[data-c]'); if (b) { cert = b.dataset.c; flt = { d: 'all', ap: 'all' }; host.onclick = null; draw(); } };
  subEl.onclick = e => { const b = e.target.closest('[data-m]'); if (b) { mode = b.dataset.m; host.onclick = null; draw(); } };
  host.addEventListener('click', e => { const f = e.target.closest('[data-f]'); if (f) { flt[f.dataset.f] = f.dataset.v; practice(); } });
  draw();
})();
