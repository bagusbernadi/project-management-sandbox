# Project Management Sandbox

Website belajar **Project Management** untuk pemula hingga persiapan sertifikasi (PMP, CAPM, Scrum). Mencakup pendekatan tradisional (predictive) dan Agile, dengan contoh dari manufaktur/engineering, simulasi interaktif, dan latihan soal.

## 🔗 Demo (GitHub Pages)

**https://bagusbernadi.github.io/project-management-sandbox/**

## Isi

| Tahap | Modul |
|---|---|
| Fondasi | 01 Proyek & PM · 02 Siklus hidup & metodologi · 03 Inisiasi, charter, stakeholder |
| Merencanakan | 04 Scope & WBS · 05 Jadwal & critical path · 06 Estimasi & budget · 07 Risk management |
| Mengelola | 08 Tim, RACI, komunikasi · 09 Kualitas & pengadaan |
| Memantau | 10 Earned Value · 11 Change control & closing |
| Agile | 12 Scrum · 13 Kanban & Lean · 14 Estimasi Agile, hybrid, tools |
| Praktik | 15 Studi kasus akhir |
| Ujian | 16 Integrasi & kerangka standar · 17 Strategi ujian · 18 Latihan ujian |

Fitur utama:
- Simulasi interaktif (critical path, PERT, earned value, burndown, Kanban, NPV, dan lainnya).
- Istilah berlatar kuning bisa diklik untuk melihat arti; tersedia halaman glosarium.
- Kuis di akhir tiap modul.
- Latihan ujian: 102 soal (PMP 40, CAPM 32, Scrum 30), simulasi 30 soal bertimer dengan analisis per domain, dan kartu rumus.

## Menjalankan secara lokal

Website statis tanpa dependency. Buka `index.html` di browser, atau:

```bash
python3 -m http.server 8000
# buka http://localhost:8000
```

## Struktur

```
index.html            beranda
01-…17-*.html         modul
latihan.html          latihan ujian (modul 18)
glosarium.html        glosarium
assets/
  style.css           tampilan
  app.js              kerangka bersama (navigasi, kuis, popover istilah)
  charts.js           library grafik SVG
  glossary.js         data glosarium
  bank.js             bank soal latihan
  latihan.js          logika latihan, simulasi, kartu
```

## Catatan

- Soal latihan dibuat untuk belajar, **bukan soal asli ujian**. Format ujian (jumlah soal, durasi, bobot domain) dapat berubah; cek situs resmi [PMI](https://www.pmi.org/), [Scrum.org](https://www.scrum.org/), dan [Scrum Alliance](https://www.scrummasters.org/) sebelum mendaftar.
- Dibangun dengan HTML, CSS, dan vanilla JavaScript.
