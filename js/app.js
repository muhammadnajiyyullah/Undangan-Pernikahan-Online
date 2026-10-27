/* ==========================================================
   Undangan Pernikahan Digital – logika utama
   Semua data dibaca dari config.js (INVITATION)
   ========================================================== */
(() => {
  'use strict';
  const C = INVITATION;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const icon = n => `<svg class="ic"><use href="#i-${n}"/></svg>`;
  const initial = n => (n || '?').replace(/[^A-Za-z\u00C0-\u024F]/g, '').charAt(0).toUpperCase() || '?';
  history.scrollRestoration = 'manual';

  /* ---------- Data turunan ---------- */
  const wd = new Date(C.weddingDate);
  const fmt = (o) => new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Jakarta', ...o }).format(wd);
  const data = {
    ...C,
    groom: { ...C.groom, initial: initial(C.groom.nick || C.groom.name) },
    bride: { ...C.bride, initial: initial(C.bride.nick || C.bride.name) },
    dateShort: fmt({ day: '2-digit' }) + ' . ' + fmt({ month: '2-digit' }) + ' . ' + fmt({ year: 'numeric' }),
    dateLong: fmt({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  };
  const get = (path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), data);

  /* ---------- Toast ---------- */
  let toastT;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2800);
  }

  /* ---------- Bind teks / gambar ---------- */
  $$('[data-bind]').forEach(el => { el.textContent = get(el.dataset.bind) ?? ''; });
  $$('[data-bind-src]').forEach(el => { el.src = get(el.dataset.bindSrc) || ''; });
  document.title = `The Wedding of ${C.groom.nick} & ${C.bride.nick}`;
  $('meta[property="og:title"]').content = document.title;

  /* ---------- Tamu dari URL ---------- */
  const guest = (new URLSearchParams(location.search).get('to') || '').trim().slice(0, 60);
  if (guest) {
    $('#guestName').textContent = guest;
    $('#rsvpName').value = guest;
    $('#wishName').value = guest;
  }

  /* ---------- Cover background ---------- */
  $('.cover-bg').style.backgroundImage = "url('assets/cover.svg')";
  $('.closing-bg').style.backgroundImage = "url('assets/closing.svg')";

  /* ---------- Render section dinamis ---------- */
  // Story
  $('#timeline').innerHTML = C.story.map((s, i) => `
    <div class="tl-item"><div class="tl-card reveal" style="--d:${i * .05}s">
      <div class="tl-year">${s.year}</div><h3>${s.title}</h3><p>${s.text}</p></div></div>`).join('');

  // Event
  const evCard = (title, e, i) => `
    <article class="event-card reveal" style="--d:${i * .18}s">
      <h3>${title}</h3>
      <div class="ev-row">${icon('calendar')}<div><strong>${e.date}</strong></div></div>
      <div class="ev-row">${icon('clock')}<div><strong>${e.time}</strong></div></div>
      <div class="ev-row">${icon('pin')}<div><strong>${e.place}</strong>${e.address || ''}</div></div>
      <a class="btn btn-outline" href="#location">${icon('pin')}LIHAT LOKASI</a>
    </article>`;
  $('#eventGrid').innerHTML = evCard('Akad Nikah', C.akad, 0) + evCard('Resepsi', C.resepsi, 1);

  // Map
  $('#mapFrame').src = C.map.embed;
  $('#mapBtn').href = C.map.url;

  // Dress code
  $('#swatches').innerHTML = C.dressCode.colors.map((c, i) =>
    `<div class="swatch reveal" style="--d:${i * .1}s"><i style="background:${c.hex}"></i>${c.name}</div>`).join('');

  // Gallery
  $('#masonry').innerHTML = C.gallery.map((g, i) => `
    <button class="polaroid reveal" data-i="${i}" style="--d:${(i % 4) * .08}s" aria-label="Perbesar foto ${i + 1}">
      <img src="${g.src}" alt="${g.caption || 'Foto'}" loading="lazy"><span>${g.caption || ''}</span></button>`).join('');

  // Info
  $('#infoGrid').innerHTML = C.info.map((x, i) => `
    <div class="info-item reveal" style="--d:${i * .1}s">${icon(x.icon)}<h3>${x.title}</h3><p>${x.text}</p></div>`).join('');

  // Bank
  $('#bankList').innerHTML = C.gift.accounts.map((a, i) => `
    <div class="bank reveal" style="--d:${i * .12}s">
      <div class="bank-name">${a.bank}</div><div class="bank-no">${a.number}</div>
      <div class="bank-holder">a.n. ${a.holder}</div>
      <button class="btn btn-outline" data-copy="${a.number}">${icon('copy')}Salin Nomor Rekening</button>
    </div>`).join('');

  // Footer sosmed
  $('#socIg').href = C.social.instagram;
  $('#socMail').href = C.social.email;
  $('#socWa').href = `https://wa.me/${C.whatsapp}`;

  /* ---------- Copy ---------- */
  async function copyText(txt) {
    try { await navigator.clipboard.writeText(txt); }
    catch {
      const ta = document.createElement('textarea'); ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = 0;
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
    }
  }
  document.addEventListener('click', async e => {
    const b = e.target.closest('[data-copy]');
    if (!b) return;
    await copyText(b.dataset.copy);
    toast('Nomor rekening berhasil disalin 🤍');
  });

  /* ---------- QRIS ---------- */
  const qrisSave = $('#qrisSave');
  qrisSave.href = C.gift.qris;
  qrisSave.download = 'QRIS-' + (C.gift.qris.split('/').pop() || 'qris');
  $('#qrisCopy').addEventListener('click', async () => {
    try {
      const blob = await (await fetch(C.gift.qris)).blob();
      if (navigator.clipboard && window.ClipboardItem && blob.type === 'image/png') {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        toast('Gambar QRIS berhasil disalin 🤍'); return;
      }
    } catch { /* fallback */ }
    await copyText(new URL(C.gift.qris, location.href).href);
    toast('Tautan QRIS berhasil disalin 🤍');
  });

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver((es) => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .15, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach(el => io.observe(el));

  /* ---------- Loader ---------- */
  const t0 = performance.now();
  const hideLoader = () => {
    const wait = Math.max(0, 1400 - (performance.now() - t0));
    setTimeout(() => $('#loader').classList.add('done'), wait);
  };
  const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
  Promise.race([
    Promise.all([fontsReady, new Promise(r => $('.cover-bg') && (document.readyState === 'complete' ? r() : addEventListener('load', r)))]),
    new Promise(r => setTimeout(r, 4000))
  ]).then(hideLoader);

  /* ---------- Musik ---------- */
  const bgm = $('#bgm'), musicBtn = $('#musicBtn');
  let musicOn = false;
  const setMusicUI = () => {
    musicBtn.innerHTML = icon(musicOn ? 'music' : 'music-off');
    musicBtn.classList.toggle('on', musicOn);
  };
  async function playMusic() {
    if (!bgm.src) { bgm.src = C.music; bgm.volume = .6; }
    try { await bgm.play(); musicOn = true; }
    catch { musicOn = false; toast('File musik belum tersedia (assets/music.mp3)'); }
    setMusicUI();
  }
  musicBtn.addEventListener('click', () => {
    if (musicOn) { bgm.pause(); musicOn = false; setMusicUI(); } else playMusic();
  });

  /* ---------- Buka undangan ---------- */
  $('#openBtn').addEventListener('click', () => {
    const cover = $('#cover');
    $('#openBtn').disabled = true;
    cover.classList.add('opening');
    playMusic();
    setTimeout(() => {
      cover.classList.add('open');
      document.body.classList.remove('locked');
      document.body.classList.add('opened');
      window.scrollTo(0, 0);
      if (petalsOn) startPetals();
      setTimeout(() => { cover.hidden = true; }, 1200);
    }, reduceMotion ? 100 : 1500);
  });

  /* ---------- Tema gelap ---------- */
  const themeBtn = $('#themeBtn');
  const applyTheme = (t) => {
    document.documentElement.dataset.theme = t === 'dark' ? 'dark' : '';
    themeBtn.innerHTML = icon(t === 'dark' ? 'sun' : 'moon');
    $('meta[name="theme-color"]').content = t === 'dark' ? '#171410' : '#FAF6EE';
    try { localStorage.setItem('inv-theme', t); } catch { /* */ }
  };
  let savedTheme = 'light';
  try { savedTheme = localStorage.getItem('inv-theme') || 'light'; } catch { /* */ }
  applyTheme(savedTheme);
  themeBtn.addEventListener('click', () => applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
  setMusicUI();

  /* ---------- Countdown ---------- */
  const cd = { d: $('[data-cd="d"]'), h: $('[data-cd="h"]'), m: $('[data-cd="m"]'), s: $('[data-cd="s"]') };
  const pad = n => String(n).padStart(2, '0');
  function setCd(el, v) {
    if (el.textContent === v) return;
    el.textContent = v;
    el.classList.remove('tick'); void el.offsetWidth; el.classList.add('tick');
  }
  function tickCd() {
    let diff = Math.max(0, wd - Date.now()) / 1000 | 0;
    setCd(cd.d, pad(Math.floor(diff / 86400))); diff %= 86400;
    setCd(cd.h, pad(Math.floor(diff / 3600))); diff %= 3600;
    setCd(cd.m, pad(Math.floor(diff / 60)));
    setCd(cd.s, pad(diff % 60));
  }
  tickCd(); setInterval(tickCd, 1000);

  /* ---------- Add to Calendar ---------- */
  const evTitle = `Pernikahan ${C.groom.nick} & ${C.bride.nick}`;
  const evEnd = new Date(wd.getTime() + (C.weddingDuration || 4) * 3600e3);
  const icsDate = d => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const evLoc = `${C.map.name}, ${C.map.address}`;
  $('#gcalBtn').addEventListener('click', () => {
    const u = 'https://calendar.google.com/calendar/render?action=TEMPLATE'
      + `&text=${encodeURIComponent(evTitle)}&dates=${icsDate(wd)}/${icsDate(evEnd)}`
      + `&details=${encodeURIComponent('Akad: ' + C.akad.time + ' | Resepsi: ' + C.resepsi.time)}&location=${encodeURIComponent(evLoc)}`;
    window.open(u, '_blank', 'noopener');
  });
  $('#icsBtn').addEventListener('click', () => {
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Undangan Digital//ID', 'BEGIN:VEVENT',
      `UID:${icsDate(wd)}@undangan`, `DTSTAMP:${icsDate(new Date())}`, `DTSTART:${icsDate(wd)}`, `DTEND:${icsDate(evEnd)}`,
      `SUMMARY:${evTitle}`, `LOCATION:${evLoc.replace(/,/g, '\\,')}`, `DESCRIPTION:Akad ${C.akad.time}\\, Resepsi ${C.resepsi.time}`,
      'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', 'DESCRIPTION:Besok hari pernikahan', 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    a.download = 'pernikahan.ics'; document.body.appendChild(a); a.click(); a.remove();
    toast('File kalender diunduh 📅');
  });

  /* ---------- Share ---------- */
  $('#shareBtn').addEventListener('click', async () => {
    const url = location.origin === 'null' || location.protocol === 'file:' ? location.href : location.origin + location.pathname;
    if (navigator.share) { try { await navigator.share({ title: document.title, text: C.shareText, url }); return; } catch { return; } }
    await copyText(url); toast('Tautan undangan berhasil disalin 🤍');
  });

  /* ---------- Gallery lightbox ---------- */
  const lb = $('#lightbox'); let lbI = 0;
  const showLb = (i) => {
    lbI = (i + C.gallery.length) % C.gallery.length;
    const g = C.gallery[lbI];
    $('#lbImg').src = g.src; $('#lbImg').alt = g.caption || ''; $('#lbCap').textContent = g.caption || '';
  };
  $('#masonry').addEventListener('click', e => {
    const b = e.target.closest('.polaroid'); if (!b) return;
    showLb(+b.dataset.i); lb.hidden = false; document.body.classList.add('locked');
  });
  $('#lbPrev').onclick = () => showLb(lbI - 1);
  $('#lbNext').onclick = () => showLb(lbI + 1);
  let tx = 0;
  lb.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) showLb(lbI + (dx < 0 ? 1 : -1)); });

  /* ---------- Video modal ---------- */
  const vm = $('#videoModal'), vbox = $('#videoBox');
  function videoEmbed(u) {
    if (!u || !/^https?:\/\//i.test(u)) return null;
    let m = u.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
    if (m) return `<iframe src="https://www.youtube.com/embed/${m[1]}?autoplay=1&rel=0" allow="autoplay; encrypted-media; fullscreen" allowfullscreen title="Video"></iframe>`;
    m = u.match(/vimeo\.com\/(\d+)/);
    if (m) return `<iframe src="https://player.vimeo.com/video/${m[1]}?autoplay=1" allow="autoplay; fullscreen" allowfullscreen title="Video"></iframe>`;
    if (/\.(mp4|webm|ogg)(\?|$)/i.test(u)) return `<video src="${u}" controls autoplay playsinline></video>`;
    return null;
  }
  $('#videoBtn').addEventListener('click', () => {
    const html = videoEmbed(C.video);
    if (!html) { toast('Video belum diatur di config.js'); return; }
    if (musicOn) { bgm.pause(); vm.dataset.resume = '1'; }
    vbox.innerHTML = html; vm.hidden = false; document.body.classList.add('locked');
  });

  /* ---------- Tutup modal ---------- */
  function closeModals() {
    if (!vm.hidden) { vbox.innerHTML = ''; if (vm.dataset.resume) { bgm.play().catch(() => { }); delete vm.dataset.resume; } }
    vm.hidden = true; lb.hidden = true; document.body.classList.remove('locked');
  }
  $$('.modal').forEach(m => m.addEventListener('click', e => {
    if (e.target === m || e.target.closest('[data-close]')) closeModals();
  }));
  addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModals();
    if (!lb.hidden) { if (e.key === 'ArrowLeft') showLb(lbI - 1); if (e.key === 'ArrowRight') showLb(lbI + 1); }
  });

  /* ---------- Love notes ---------- */
  const stage = $('#noteStage'), dots = $('#noteDots'); let ni = 0, nt;
  stage.innerHTML = C.notes.map(n => `<blockquote class="note">“${n.text}”<small>${n.by || ''}</small></blockquote>`).join('');
  dots.innerHTML = C.notes.map((_, i) => `<button aria-label="Quote ${i + 1}" data-i="${i}"></button>`).join('');
  const notes = $$('.note', stage), dotBtns = $$('button', dots);
  function showNote(i) {
    ni = i; notes.forEach((n, k) => n.classList.toggle('show', k === i)); dotBtns.forEach((d, k) => d.classList.toggle('on', k === i));
  }
  function loopNotes() { clearInterval(nt); nt = setInterval(() => showNote((ni + 1) % notes.length), 5000); }
  dots.addEventListener('click', e => { const b = e.target.closest('button'); if (b) { showNote(+b.dataset.i); loopNotes(); } });
  showNote(0); loopNotes();

  /* ---------- Penyimpanan RSVP & Wishes ---------- */
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)) || []; } catch { return []; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* */ } }
  };
  function remoteSend(payload) {
    if (!C.endpoint) return;
    fetch(C.endpoint, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) }).catch(() => { });
  }
  function validate(form) {
    let ok = true;
    $$('[required]', form).forEach(f => { const bad = !f.value.trim(); f.classList.toggle('invalid', bad); if (bad) ok = false; });
    if (!ok) toast('Mohon lengkapi data terlebih dahulu');
    return ok;
  }

  // RSVP
  const rsvpForm = $('#rsvpForm');
  rsvpForm.addEventListener('submit', e => {
    e.preventDefault();
    if (!validate(rsvpForm)) return;
    const f = Object.fromEntries(new FormData(rsvpForm));
    const rec = { type: 'rsvp', ...f, time: Date.now() };
    store.set('inv-rsvp', [...store.get('inv-rsvp'), rec]);
    remoteSend(rec);
    toast('Terima kasih atas konfirmasinya 🤍');
    rsvpForm.querySelector('textarea').value = '';
  });
  $('#waBtn').addEventListener('click', () => {
    if (!validate(rsvpForm)) return;
    const f = Object.fromEntries(new FormData(rsvpForm));
    const msg = `Halo, saya ${f.name}.\nKonfirmasi kehadiran di pernikahan ${C.groom.nick} & ${C.bride.nick} (${data.dateLong}):\n`
      + `• Kehadiran: ${f.attend}\n• Jumlah tamu: ${f.count}\n` + (f.message ? `• Pesan: ${f.message}\n` : '') + 'Terima kasih 🤍';
    window.open(`https://wa.me/${C.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
  });
  $$('input,textarea', document).forEach(f => f.addEventListener('input', () => f.classList.remove('invalid')));

  // Wishes
  const wishList = $('#wishList');
  const timeAgo = (t) => {
    const s = (Date.now() - t) / 1000;
    if (s < 60) return 'baru saja'; if (s < 3600) return Math.floor(s / 60) + ' menit lalu';
    if (s < 86400) return Math.floor(s / 3600) + ' jam lalu'; return Math.floor(s / 86400) + ' hari lalu';
  };
  function wishNode(w, animate) {
    const d = document.createElement('div'); d.className = 'wish';
    if (!animate) d.style.animation = 'none';
    const h = document.createElement('h4'); h.textContent = w.name;
    const sm = document.createElement('small'); sm.textContent = timeAgo(w.time); h.appendChild(sm);
    const p = document.createElement('p'); p.textContent = w.message;
    d.append(h, p); return d;
  }
  function renderWishes(list) {
    wishList.innerHTML = '';
    [...list].sort((a, b) => b.time - a.time).forEach(w => wishList.appendChild(wishNode(w, false)));
  }
  let wishes = store.get('inv-wishes');
  if (!wishes.length) wishes = [...C.sampleWishes];
  renderWishes(wishes);
  if (C.endpoint) {
    fetch(C.endpoint + '?action=wishes').then(r => r.json()).then(rem => {
      if (Array.isArray(rem) && rem.length) { wishes = [...rem.map(r => ({ name: r.name, message: r.message, time: +r.time || Date.parse(r.time) || Date.now() })), ...store.get('inv-wishes')]; renderWishes(wishes); }
    }).catch(() => { });
  }
  const wishForm = $('#wishForm');
  wishForm.addEventListener('submit', e => {
    e.preventDefault();
    if (!validate(wishForm)) return;
    const f = Object.fromEntries(new FormData(wishForm));
    const rec = { name: f.name.trim(), message: f.message.trim(), time: Date.now() };
    const mine = [...store.get('inv-wishes'), rec]; store.set('inv-wishes', mine);
    wishes.push(rec);
    remoteSend({ type: 'wish', ...rec });
    wishList.prepend(wishNode(rec, true));
    wishForm.querySelector('textarea').value = '';
    toast('Terima kasih atas ucapan & doanya 🤍');
  });

  /* ---------- Scroll spy + parallax ---------- */
  const navMap = [['home', 'home'], ['couple', 'couple'], ['event', 'event'], ['gallery', 'gallery'], ['rsvp', 'rsvp'], ['gift', 'gift']];
  const navLinks = $$('.floatnav a');
  const pImgs = $$('[data-parallax]'), pBg = $('[data-parallax-bg]');
  let ticking = false;
  function onScroll() {
    ticking = false;
    const mid = innerHeight * .5;
    let cur = navMap[0][0];
    navMap.forEach(([nav, sec]) => { const el = document.getElementById(sec); if (el && el.getBoundingClientRect().top <= mid) cur = nav; });
    navLinks.forEach(a => a.classList.toggle('active', a.dataset.nav === cur));
    if (reduceMotion) return;
    pImgs.forEach(img => {
      const r = img.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const k = (r.top + r.height / 2 - mid) / innerHeight;
      img.style.transform = `translateY(${(-k * 28 - 9).toFixed(1)}px)`;
    });
    if (pBg) {
      const r = pBg.parentElement.getBoundingClientRect();
      if (r.bottom > 0 && r.top < innerHeight) pBg.style.transform = `translateY(${(((r.top + r.height / 2 - mid) / innerHeight) * -60).toFixed(1)}px) scale(1.05)`;
    }
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  /* ---------- Bunga / daun jatuh (canvas ringan) ---------- */
  const cv = $('#petals'), ctx = cv.getContext('2d');
  const weak = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) || (navigator.deviceMemory && navigator.deviceMemory <= 2);
  let petalsOn = !(reduceMotion || weak);
  try { const s = localStorage.getItem('inv-petals'); if (s !== null) petalsOn = s === '1' && !reduceMotion; } catch { /* */ }
  const petalBtn = $('#petalBtn');
  let petals = [], raf = 0, running = false, W = 0, H = 0;
  function sizeCv() { const dpr = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  const cols = ['#EAD9B8', '#D9C7A8', '#C9A96A', '#F3E4C8', '#E7C9A9'];
  const mk = (top) => ({ x: Math.random() * W, y: top ? -20 : Math.random() * H, s: 5 + Math.random() * 7, vy: .35 + Math.random() * .6, vx: (Math.random() - .5) * .3,
    a: Math.random() * 6.28, va: (Math.random() - .5) * .02, sw: Math.random() * 6.28, c: cols[Math.random() * cols.length | 0], o: .35 + Math.random() * .4 });
  function frame() {
    ctx.clearRect(0, 0, W, H);
    for (const p of petals) {
      p.sw += .015; p.x += p.vx + Math.sin(p.sw) * .45; p.y += p.vy; p.a += p.va;
      if (p.y > H + 20) Object.assign(p, mk(true));
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.globalAlpha = p.o; ctx.fillStyle = p.c;
      ctx.beginPath(); ctx.ellipse(0, 0, p.s, p.s * .5, 0, 0, 6.283); ctx.fill(); ctx.restore();
    }
    raf = requestAnimationFrame(frame);
  }
  function startPetals() {
    if (running) return; running = true; sizeCv();
    const n = innerWidth < 600 ? 14 : 24; petals = Array.from({ length: n }, () => mk(false)); frame();
  }
  function stopPetals() { running = false; cancelAnimationFrame(raf); ctx.clearRect(0, 0, W, H); }
  function setPetalUI() { petalBtn.classList.toggle('on', petalsOn); petalBtn.classList.toggle('off-fx', !petalsOn); }
  petalBtn.addEventListener('click', () => {
    petalsOn = !petalsOn; setPetalUI();
    try { localStorage.setItem('inv-petals', petalsOn ? '1' : '0'); } catch { /* */ }
    petalsOn ? startPetals() : stopPetals();
    toast(petalsOn ? 'Efek bunga dinyalakan' : 'Efek bunga dimatikan');
  });
  addEventListener('resize', () => { if (running) sizeCv(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) { if (running) { cancelAnimationFrame(raf); } } else if (running) frame(); });
  setPetalUI();
})();
