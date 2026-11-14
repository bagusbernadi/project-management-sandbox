/* Pustaka grafik SVG kecil — tanpa dependensi */
const C = (() => {
  const W = 520, H = 280, L = 46, R = 16, T = 20, B = 40, PW = W - L - R, PH = H - T - B;
  const pal = ['#0F766E', '#D9480F', '#3B5BDB', '#B7791F', '#9C36B5', '#64748B'];
  const fmt = v => { const a = Math.abs(v); return a >= 1e6 ? +(v / 1e6).toFixed(1) + ' jt' : a >= 1e4 ? Math.round(v / 1e3) + ' rb' : (+v.toFixed(a < 100 ? 1 : 0)).toString().replace(".", ","); };
  const node = el => typeof el === 'string' ? document.querySelector(el) : el;
  const put = (el, s, cap) => { node(el).innerHTML = `<svg viewBox="0 0 ${W} ${H}" class="chart" role="img" aria-label="${cap || 'grafik'}">${s}</svg>`; };
  const Y = (v, a, b) => T + PH - (v - a) / (b - a) * PH;
  const X = (v, a, b) => L + (v - a) / (b - a) * PW;
  const nice = m => { if (m <= 0) return 1; const p = 10 ** Math.floor(Math.log10(m)), k = m / p; return (k <= 1 ? 1 : k <= 2 ? 2 : k <= 2.5 ? 2.5 : k <= 5 ? 5 : 10) * p; };
  const grid = (a, b, f = fmt) => { let s = ''; for (let i = 0; i <= 4; i++) { const v = a + (b - a) * i / 4, y = Y(v, a, b); s += `<line class="grid" x1="${L}" x2="${W - R}" y1="${y}" y2="${y}"/><text class="ax" x="${L - 6}" y="${y + 4}" text-anchor="end">${f(v)}</text>`; } return s; };
  const xl = t => t ? `<text class="ax" x="${L + PW / 2}" y="${H - 5}" text-anchor="middle">${t}</text>` : '';
  const legend = names => names.map((n, i) => `<rect x="${L + i * 130}" y="2" width="11" height="11" rx="2" fill="${n[1]}"/><text class="ax" x="${L + i * 130 + 16}" y="12">${n[0]}</text>`).join('');

  function bar(el, o) {
    const a = o.min ?? 0, b = o.max ?? nice(Math.max(...o.values)), n = o.values.length, bw = PW / n, f = o.fmt || fmt;
    let s = grid(a, b, f);
    o.values.forEach((v, i) => {
      const x = L + i * bw + bw * .18, w = bw * .64, y = Y(Math.max(a, Math.min(v, b)), a, b), col = o.colors ? o.colors[i] : (o.color || pal[0]);
      s += `<rect x="${x}" y="${y}" width="${w}" height="${Math.max(0, T + PH - y)}" rx="3" fill="${col}"/>`;
      if (o.val !== false) s += `<text class="val" x="${x + w / 2}" y="${y - 5}" text-anchor="middle">${f(v)}</text>`;
      s += `<text class="ax" x="${x + w / 2}" y="${H - B + 15}" text-anchor="middle">${o.labels[i]}</text>`;
    });
    put(el, s + xl(o.xl), o.cap);
  }

  function line(el, o) {
    const all = o.series.flatMap(s => s.values), a = o.min ?? 0, b = o.max ?? nice(Math.max(...all)), n = o.labels.length, f = o.fmt || fmt;
    const px = i => L + (n === 1 ? PW / 2 : i / (n - 1) * PW), step = Math.ceil(n / 8);
    let s = grid(a, b, f);
    o.labels.forEach((t, i) => { if (i % step === 0) s += `<text class="ax" x="${px(i)}" y="${H - B + 15}" text-anchor="middle">${t}</text>`; });
    if (o.band) s += `<rect x="${px(o.band[0])}" y="${T}" width="${px(o.band[1]) - px(o.band[0])}" height="${PH}" fill="#D9480F" opacity=".1"/>`;
    o.series.forEach((se, k) => {
      const col = se.color || pal[k];
      s += `<polyline fill="none" stroke="${col}" stroke-width="2.5" stroke-linejoin="round" points="${se.values.map((v, i) => px(i) + ',' + Y(v, a, b)).join(' ')}"/>`;
      if (n <= 16) se.values.forEach((v, i) => s += `<circle cx="${px(i)}" cy="${Y(v, a, b)}" r="3.2" fill="${col}"/>`);
    });
    if (o.series.length > 1) s += legend(o.series.map((se, k) => [se.name, se.color || pal[k]]));
    put(el, s + xl(o.xl), o.cap);
  }

  function scatter(el, o) {
    const xs = o.pts.map(p => p[0]), ys = o.pts.map(p => p[1]);
    const pad = (lo, hi) => { const d = (hi - lo) * .08 || 1; return [lo - d, hi + d]; };
    const [xa, xb] = o.xr || pad(Math.min(...xs), Math.max(...xs)), [ya, yb] = o.yr || pad(Math.min(...ys), Math.max(...ys));
    let s = grid(ya, yb);
    for (let i = 0; i <= 4; i++) { const v = xa + (xb - xa) * i / 4; s += `<text class="ax" x="${X(v, xa, xb)}" y="${H - B + 15}" text-anchor="middle">${fmt(v)}</text>`; }
    o.pts.forEach(p => s += `<circle cx="${X(p[0], xa, xb)}" cy="${Y(p[1], ya, yb)}" r="4" fill="${o.color || pal[2]}" opacity=".7"/>`);
    if (o.fit) {
      const n = xs.length, mx = xs.reduce((p, c) => p + c) / n, my = ys.reduce((p, c) => p + c) / n;
      const m = xs.reduce((p, c, i) => p + (c - mx) * (ys[i] - my), 0) / xs.reduce((p, c) => p + (c - mx) ** 2, 0), c0 = my - m * mx;
      s += `<line x1="${X(xa, xa, xb)}" y1="${Y(m * xa + c0, ya, yb)}" x2="${X(xb, xa, xb)}" y2="${Y(m * xb + c0, ya, yb)}" stroke="${pal[1]}" stroke-width="2" stroke-dasharray="6 4"/>`;
    }
    put(el, s + xl(o.xl), o.cap);
  }

  function marks(ms, a, b) {
    return (ms || []).map((m, i) => { const x = X(m.x, a, b); return `<line x1="${x}" x2="${x}" y1="${T - 4 + i * 13}" y2="${T + PH}" stroke="${m.color}" stroke-width="2.5" stroke-dasharray="5 3"/><text class="lbl" x="${x + (x > W - 110 ? -5 : 5)}" y="${T + 5 + i * 13}" text-anchor="${x > W - 110 ? 'end' : 'start'}" fill="${m.color}">${m.label}</text>`; }).join('');
  }

  function hist(el, o) {
    const a = o.min ?? Math.min(...o.values), b = o.max ?? Math.max(...o.values), k = o.bins || 12, cnt = Array(k).fill(0);
    o.values.forEach(v => { if (v >= a && v <= b) cnt[Math.min(k - 1, Math.floor((v - a) / (b - a) * k))]++; });
    const top = o.top || nice(Math.max(...cnt)), bw = PW / k;
    let s = grid(0, top);
    cnt.forEach((c, i) => s += `<rect x="${L + i * bw + 1}" y="${Y(c, 0, top)}" width="${bw - 2}" height="${T + PH - Y(c, 0, top)}" fill="${o.color || pal[0]}" opacity=".85"/>`);
    for (let i = 0; i <= 4; i++) { const v = a + (b - a) * i / 4; s += `<text class="ax" x="${X(v, a, b)}" y="${H - B + 15}" text-anchor="middle">${fmt(v)}</text>`; }
    put(el, s + marks(o.marks, a, b) + xl(o.xl), o.cap);
  }

  function strip(el, o) {
    const a = o.min, b = o.max, base = T + PH - 6, used = {};
    let s = `<line x1="${L}" x2="${W - R}" y1="${T + PH}" y2="${T + PH}" stroke="#1B2A41" stroke-width="1.5"/>`;
    for (let i = 0; i <= 5; i++) { const v = a + (b - a) * i / 5; s += `<text class="ax" x="${X(v, a, b)}" y="${H - B + 15}" text-anchor="middle">${fmt(v)}</text>`; }
    o.values.forEach((v, i) => { const x = X(Math.min(v, b), a, b), key = Math.round(x / 14); used[key] = (used[key] || 0) + 1; s += `<circle cx="${x}" cy="${base - (used[key] - 1) * 15 - 4}" r="6.5" fill="${o.colors ? o.colors[i] : pal[2]}"/>`; });
    put(el, s + marks(o.marks, a, b) + xl(o.xl), o.cap);
  }

  function pie(el, o) {
    const tot = o.values.reduce((p, c) => p + c, 0), cx = 150, cy = H / 2, r = 105; let ang = -Math.PI / 2, s = '';
    o.values.forEach((v, i) => {
      const a2 = ang + v / tot * 2 * Math.PI, big = a2 - ang > Math.PI ? 1 : 0;
      s += `<path d="M${cx},${cy} L${cx + r * Math.cos(ang)},${cy + r * Math.sin(ang)} A${r},${r} 0 ${big} 1 ${cx + r * Math.cos(a2)},${cy + r * Math.sin(a2)}Z" fill="${pal[i % 6]}" stroke="#fff" stroke-width="2"/>`;
      s += `<rect x="300" y="${50 + i * 26}" width="13" height="13" rx="3" fill="${pal[i % 6]}"/><text class="ax" style="font-size:13px" x="320" y="${61 + i * 26}">${o.labels[i]} — ${Math.round(v / tot * 100)}%</text>`;
      ang = a2;
    });
    put(el, s, o.cap);
  }

  function pareto(el, o) {
    const idx = o.values.map((v, i) => i).sort((p, q) => o.values[q] - o.values[p]), vals = idx.map(i => o.values[i]), labs = idx.map(i => o.labels[i]);
    const tot = vals.reduce((p, c) => p + c, 0), b = nice(vals[0]), n = vals.length, bw = PW / n; let s = grid(0, b), cum = 0, pts = [];
    vals.forEach((v, i) => {
      const x = L + i * bw + bw * .15, w = bw * .7, y = Y(v, 0, b); cum += v; const pc = cum / tot * 100;
      s += `<rect x="${x}" y="${y}" width="${w}" height="${T + PH - y}" rx="3" fill="${pc <= 80.5 || i === 0 ? pal[1] : '#C9CED6'}"/><text class="val" x="${x + w / 2}" y="${y - 5}" text-anchor="middle">${v}</text><text class="ax" x="${x + w / 2}" y="${H - B + 15}" text-anchor="middle">${labs[i]}</text>`;
      pts.push([x + w / 2, Y(pc, 0, 100), Math.round(pc)]);
    });
    s += `<line x1="${L}" x2="${W - R}" y1="${Y(80, 0, 100)}" y2="${Y(80, 0, 100)}" stroke="${pal[2]}" stroke-dasharray="5 4"/><text class="lbl" x="${W - R}" y="${Y(80, 0, 100) - 5}" text-anchor="end" fill="${pal[2]}">80%</text>`;
    s += `<polyline fill="none" stroke="${pal[2]}" stroke-width="2.2" points="${pts.map(p => p[0] + ',' + p[1]).join(' ')}"/>` + pts.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="3.5" fill="${pal[2]}"/>`).join('');
    put(el, s, o.cap);
  }


  // grafik garis dengan sumbu x angka: curve(el,{series:[{name,color,pts:[[x,y]],dash,w}],xr:[a,b],yr:[a,b],xl,vlines:[{x,label,color}],hlines:[{y,label,color}]})
  function curve(el, o) {
    const [xa, xb] = o.xr, [ya, yb] = o.yr, f = o.fmt || fmt; let s = grid(ya, yb, f);
    for (let i = 0; i <= 5; i++) { const v = xa + (xb - xa) * i / 5; s += `<text class="ax" x="${X(v, xa, xb)}" y="${H - B + 15}" text-anchor="middle">${+v.toFixed(1)}</text>`; }
    (o.hlines || []).forEach(h => { const y = Y(h.y, ya, yb); s += `<line x1="${L}" x2="${W - R}" y1="${y}" y2="${y}" stroke="${h.color}" stroke-width="1.8" stroke-dasharray="5 4"/><text class="lbl" x="${W - R}" y="${y - 4}" text-anchor="end" fill="${h.color}">${h.label}</text>`; });
    (o.vlines || []).forEach(v => { const x = X(v.x, xa, xb); s += `<line x1="${x}" x2="${x}" y1="${T}" y2="${T + PH}" stroke="${v.color}" stroke-width="1.8" stroke-dasharray="5 4"/><text class="lbl" x="${x + (x > W - 90 ? -4 : 4)}" y="${T + 10}" text-anchor="${x > W - 90 ? 'end' : 'start'}" fill="${v.color}">${v.label}</text>`; });
    o.series.forEach((se, k) => {
      const col = se.color || pal[k];
      s += `<polyline fill="none" stroke="${col}" stroke-width="${se.w || 2.6}" ${se.dash ? 'stroke-dasharray="6 4"' : ''} stroke-linejoin="round" points="${se.pts.map(p => X(p[0], xa, xb) + ',' + Y(p[1], ya, yb)).join(' ')}"/>`;
      if (se.dots) se.pts.forEach((p, i) => { const c2 = se.dotc ? se.dotc(p, i) : col; s += `<circle cx="${X(p[0], xa, xb)}" cy="${Y(p[1], ya, yb)}" r="${c2 !== col ? 5.2 : 3.2}" fill="${c2}"/>`; });
      if (se.dot) { const p = se.pts[se.pts.length - 1]; s += `<circle cx="${X(p[0], xa, xb)}" cy="${Y(p[1], ya, yb)}" r="4.5" fill="${col}"/>`; }
    });
    if (o.series.length > 1) s += legend(o.series.map((se, k) => [se.name, se.color || pal[k]]));
    put(el, s + xl(o.xl), o.cap);
  }

  // angka acak yang bisa diulang (seeded) + distribusi normal
  const rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const norm = r => Math.sqrt(-2 * Math.log(1 - r())) * Math.cos(2 * Math.PI * r());
  const mean = a => a.reduce((p, c) => p + c, 0) / a.length;
  const median = a => { const s = [...a].sort((p, q) => p - q), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
  const sd = a => { const m = mean(a); return Math.sqrt(a.reduce((p, c) => p + (c - m) ** 2, 0) / (a.length - 1)); };

  return { curve, bar, line, scatter, hist, strip, pie, pareto, rng, norm, mean, median, sd, pal, fmt };
})();
