/* Kerangka bersama: header, navigasi modul, popover istilah, kuis */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const MODULES = [
  { id: '01', file: '01-proyek.html', group: 'Fondasi', title: 'Apa itu Proyek & Project Management', desc: 'Beda proyek dan operasi, tiga batasan utama, dan peran manajer proyek.' },
  { id: '02', file: '02-siklus-hidup.html', group: 'Fondasi', title: 'Siklus Hidup & Metodologi', desc: 'Predictive (Waterfall), Agile, dan Hybrid: lima process group dan cara memilih pendekatan.' },
  { id: '03', file: '03-inisiasi.html', group: 'Fondasi', title: 'Inisiasi: Business Case, Charter & Stakeholder', desc: 'Memulai proyek dengan benar: alasan proyek, dokumen piagam, dan memetakan orang yang berkepentingan.' },
  { id: '04', file: '04-scope-wbs.html', group: 'Merencanakan', title: 'Scope & WBS', desc: 'Menentukan batas pekerjaan, memecahnya menjadi paket kerja, dan mencegah scope creep.' },
  { id: '05', file: '05-jadwal.html', group: 'Merencanakan', title: 'Jadwal, Gantt & Critical Path', desc: 'Menyusun urutan kegiatan, menghitung durasi proyek, float, dan jalur kritis.' },
  { id: '06', file: '06-estimasi-budget.html', group: 'Merencanakan', title: 'Estimasi & Budget', desc: 'Estimasi tiga titik (PERT), contingency, dan cara menyusun baseline biaya.' },
  { id: '07', file: '07-risiko.html', group: 'Merencanakan', title: 'Risk Management', desc: 'Mengenali risiko, menilai dengan matriks dan EMV, lalu memilih strategi respons.' },
  { id: '08', file: '08-tim-komunikasi.html', group: 'Mengelola', title: 'Tim, RACI & Komunikasi', desc: 'Membagi peran dengan jelas, membangun tim, dan merencanakan komunikasi.' },
  { id: '09', file: '09-kualitas-pengadaan.html', group: 'Mengelola', title: 'Kualitas & Pengadaan', desc: 'Cost of quality, QA vs QC, dan memilih jenis kontrak dengan vendor.' },
  { id: '10', file: '10-earned-value.html', group: 'Memantau', title: 'Memantau Progres: Earned Value', desc: 'Satu cara mengukur jadwal dan biaya sekaligus: PV, EV, AC, SPI, CPI, dan perkiraan akhir.' },
  { id: '11', file: '11-change-closing.html', group: 'Memantau', title: 'Change Control & Closing', desc: 'Mengelola perubahan secara tertib, menutup proyek, dan mencatat lessons learned.' },
  { id: '12', file: '12-scrum.html', group: 'Agile', title: 'Agile & Scrum', desc: 'Nilai Agile, peran, event, dan artefak Scrum, plus simulasi burndown sprint.' },
  { id: '13', file: '13-kanban-lean.html', group: 'Agile', title: 'Kanban & Lean', desc: 'Visualisasi alur kerja, batas WIP, dan Hukum Little untuk mempercepat penyelesaian.' },
  { id: '14', file: '14-agile-lanjut.html', group: 'Agile', title: 'Estimasi Agile, Hybrid & Tools', desc: 'Story point, velocity, forecast, pendekatan Hybrid, dan memilih tools yang tepat.' },
  { id: '15', file: '15-studi-kasus.html', group: 'Praktik', title: 'Studi Kasus Akhir', desc: 'Satu proyek utuh: memasang lini produksi baru, memakai hampir semua modul.' },
  { id: '16', file: '16-integrasi-standar.html', group: 'Ujian', title: 'Integrasi & Kerangka Standar', desc: 'Rencana manajemen proyek, EEF/OPA, tailoring, PMBOK terbaru, Business Environment, dan etika.' },
  { id: '17', file: '17-strategi-ujian.html', group: 'Ujian', title: 'Strategi Ujian Sertifikasi', desc: 'Format PMP, CAPM, dan Scrum, cara membaca soal situasional, mengatur waktu, dan kartu rumus.' },
  { id: '18', file: 'latihan.html', group: 'Ujian', title: 'Latihan Ujian Sertifikasi', desc: 'Sekitar 100 soal latihan PMP, CAPM, dan Scrum, simulasi 30 soal bertimer, dan kartu rumus.' },
];

(function () {
  const page = document.body.dataset.page, idx = MODULES.findIndex(m => m.id === page), main = $('main');
  const logo = '<svg viewBox="0 0 28 28"><rect width="28" height="28" rx="7" fill="#0F766E"/><rect x="5" y="7" width="10" height="3.5" rx="1.5" fill="#fff"/><rect x="9" y="12.5" width="11" height="3.5" rx="1.5" fill="#FFD8A8"/><rect x="14" y="18" width="9" height="3.5" rx="1.5" fill="#fff"/></svg>';
  const h = document.createElement('header'); h.className = 'top';
  h.innerHTML = `<div class="wrap bar"><a class="brand" href="index.html">${logo}<span>Belajar Project Management</span></a><nav><a href="index.html">Beranda</a><details class="menu"><summary>Modul</summary><div class="menu-list">${MODULES.map(m => `<a href="${m.file}"${m.id === page ? ' class="cur"' : ''}><b>${m.id}</b>${m.title}</a>`).join('')}</div></details><a href="glosarium.html">Glosarium</a></nav></div>`;
  document.body.prepend(h);

  if (idx >= 0) {
    const m = MODULES[idx], hero = document.createElement('section'); hero.className = 'hero';
    hero.innerHTML = `<span class="eyebrow">Modul ${m.id} · ${m.group}</span><h1>${m.title}</h1><p class="lead">${m.desc}</p><div class="dots">${MODULES.map((x, i) => `<a href="${x.file}" title="${x.id} ${x.title}" class="${i < idx ? 'done' : i === idx ? 'cur' : ''}"></a>`).join('')}</div>`;
    main.prepend(hero);
    const p = MODULES[idx - 1], n = MODULES[idx + 1], pn = document.createElement('div'); pn.className = 'pn';
    pn.innerHTML = (p ? `<a href="${p.file}"><small>← Sebelumnya</small>${p.id} · ${p.title}</a>` : `<a href="index.html"><small>←</small>Beranda</a>`) + (n ? `<a class="next" href="${n.file}"><small>Berikutnya →</small>${n.id} · ${n.title}</a>` : `<a class="next" href="glosarium.html"><small>Selesai →</small>Buka Glosarium</a>`);
    main.append(pn);
  }
  const f = document.createElement('footer'); f.className = 'site';
  f.innerHTML = '<div class="wrap">Belajar Project Management · tradisional &amp; Agile untuk pemula hingga persiapan sertifikasi · Kata berlatar kuning bisa diklik untuk melihat artinya.</div>';
  document.body.append(f);

  // popover istilah
  const pop = document.createElement('div'); pop.id = 'pop'; pop.setAttribute('role', 'tooltip'); document.body.append(pop);
  const show = el => {
    const g = G[el.dataset.k]; if (!g) return;
    pop.innerHTML = `<b>${g[0]}</b>${g[1]}<br><a href="glosarium.html#${el.dataset.k}">Lihat di glosarium →</a>`;
    pop.style.display = 'block';
    const r = el.getBoundingClientRect(), w = pop.offsetWidth;
    pop.style.left = Math.max(12, Math.min(window.innerWidth - w - 12, r.left + r.width / 2 - w / 2)) + window.scrollX + 'px';
    pop.style.top = r.bottom + window.scrollY + 8 + 'px';
  };
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-k]');
    if (t) { show(t); e.stopPropagation(); } else if (!e.target.closest('#pop')) pop.style.display = 'none';
    const menu = $('.menu'); if (menu && !e.target.closest('.menu')) menu.open = false;
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') pop.style.display = 'none';
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-k]')) { e.preventDefault(); show(e.target); }
  });
  $$('[data-k]').forEach(el => { el.tabIndex = 0; el.setAttribute('role', 'button'); });
})();

/* Kuis: quiz([{q:'..', o:['a','b','c'], a:1, e:'penjelasan'}]) -> render ke #quiz */
function quiz(items, sel = '#quiz') {
  const root = $(sel); if (!root) return; root.classList.add('quiz');
  let done = 0, score = 0;
  root.innerHTML = items.map((it, i) => `<div class="q"><p>${i + 1}. ${it.q}</p><div class="opts">${it.o.map((o, j) => `<button data-i="${i}" data-j="${j}">${o}</button>`).join('')}</div><div class="exp"></div></div>`).join('') + '<div class="score">Skor: 0 / ' + items.length + '</div>';
  root.addEventListener('click', e => {
    const b = e.target.closest('.opts button'); if (!b || b.disabled) return;
    const it = items[+b.dataset.i], ok = +b.dataset.j === it.a, box = b.closest('.q');
    $$('button', box).forEach((x, j) => { x.disabled = true; if (j === it.a) x.classList.add('right'); });
    if (!ok) b.classList.add('wrong'); else score++;
    done++;
    const ex = $('.exp', box); ex.style.display = 'block'; ex.innerHTML = (ok ? '<b style="color:#2B8A3E">Benar.</b> ' : '<b style="color:#C92A2A">Belum tepat.</b> ') + it.e;
    $('.score', root).textContent = `Skor: ${score} / ${items.length}` + (done === items.length ? (score === items.length ? ' — sempurna!' : ' — baca lagi bagian yang salah, lalu lanjut.') : '');
  });
}

/* Stepper sederhana: stepper('#id', [{t:'judul', h:'html', run:fn}]) */
function stepper(sel, steps) {
  const root = $(sel); let cur = 0;
  root.innerHTML = `<div class="steps">${steps.map((s, i) => `<button data-s="${i}">${i + 1}. ${s.t}</button>`).join('')}</div><div class="body"></div><div class="ctrl"><button class="ghost" data-d="-1">← Kembali</button><button data-d="1">Lanjut →</button></div>`;
  const go = i => {
    cur = Math.max(0, Math.min(steps.length - 1, i));
    $$('.steps button', root).forEach((b, j) => b.classList.toggle('on', j === cur));
    const body = $('.body', root); body.innerHTML = `<div class="fade">${steps[cur].h}</div>`;
    if (steps[cur].run) steps[cur].run(body);
    $$('[data-k]', body).forEach(el => { el.tabIndex = 0; });
    $('[data-d="-1"]', root).disabled = cur === 0; $('[data-d="1"]', root).disabled = cur === steps.length - 1;
  };
  root.addEventListener('click', e => { const s = e.target.closest('[data-s]'), d = e.target.closest('[data-d]'); if (s) go(+s.dataset.s); else if (d) go(cur + +d.dataset.d); });
  go(0);
}

/* Format angka Indonesia: 1234.5 -> "1.234,5" */
const nf = (v, d = 1) => Number(v).toLocaleString('id-ID', { minimumFractionDigits: d, maximumFractionDigits: d });
