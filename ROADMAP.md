# Prism Ops — Update & Development Roadmap

## 🎯 Tier 1 — Wajib sebelum bisa disebut "game" (1–2 minggu)

Ini yang bikin orang **nggak langsung uninstall**:

1. **Main Menu lengkap** — Start, Settings, Profile, Leaderboard, Quit. Sekarang lu masih masuk game langsung.
2. **Pause Menu** — ESC buat pause, resume, settings, quit to menu.
3. **Game Over Screen** — tampilkan kills, deaths, K/D ratio, XP gained, tombol "Play Again" + "Main Menu".
4. **Loading Screen** — logo Prism + tips + progress bar. Bikin kesan profesional.
5. **Countdown "3-2-1 GO"** sebelum match mulai — ini standar FPS.
6. **Respawn screen** — "You were killed by [nama bot]" + tombol respawn.
7. **Hitmarker** — crosshair berubah merah saat kena bot (feedback penting).
8. **Sound FX lengkap** — footsteps, reload click, empty magazine, hurt grunt.

Tanpa ini, pemain ngerasa "belum jadi game". Ini **prioritas nomor 1**.

---

## 🎯 Tier 2 — Retention & Progression (2–4 minggu)

Ini yang bikin orang **balik lagi besok**:

1. **XP & Level System** — main match dapet XP, naik level, unlock senjata baru.
2. **Rank System (5 tier)** — sesuai rencana lu. Butuh Supabase:
   - Bronze / Silver / Gold / Platinum / Diamond
   - Star per tier (misal 3 star per rank)
   - Win = +1 star, Lose = -1 star
   - **TCS Protection** — item langka, kalau lose gak turun star
3. **MMR (hidden rating)** — yang lu rencanain. Elo-style:
   - Win vs bot susah = MMR naik banyak
   - Lose = MMR turun
   - **Leaderboard per mode & per hero** (query Supabase)
4. **Daily Login Reward** — 7 hari berturut = hadiah
5. **Achievements** — "First Blood", "10 Kill Streak", "Headshot 100x"
6. **Match History** — tabel Supabase, tampil di profile

Ini yang bikin **retention 7-day** bagus. Tanpa ini, pemain main 2 hari terus hilang.

---

## 🎯 Tier 3 — Konten & Variasi (1–2 bulan)

Ini yang bikin orang **nggak bosen**:

1. **5+ Map** — sekarang cuma "Choco Yard". Butuh variasi:
   - Warehouse (indoor, banyak lorong)
   - Desert (outdoor, sniper friendly)
   - Urban (2 lantai, vertical)
   - Night Club (gelap, flashlight mechanic)
2. **3+ Senjata** — SMG (cepat, damage kecil), Shotgun (dekat), Sniper (jauh):
   - Statistik beda: fire rate, damage, range, recoil, mag size
   - Viewmodel beda-beda (tetap prosedural)
3. **Mode Game**:
   - Deathmatch (sekarang)
   - Team Deathmatch (2v2 vs bot)
   - Capture the Flag
   - Survival (wave of bots)
4. **Hero/Operator System** — sesuai rencana lu:
   - 3–5 hero, tiap hero punya ability unik (speed boost, heal, shield, radar)
   - MMR per hero
   - Skin kosmetik (B&W dulu, warna later)

**Jangan bikin ini dulu sebelum Tier 1 & 2 selesai.** Konten banyak tapi sistem belum matang = mati.

---

## 🎯 Tier 4 — Polish & Feel (1 bulan)

Ini yang bedain "game indie" vs "game profesional":

1. **Animasi Bot proper** — bukan cuma bobbing:
   - Walk cycle (kaki gerak)
   - Death animation (roboh, bukan hilang tiba-tiba)
   - Reload animation
   - Death ragdoll (kalau sempat)
2. **Animasi Player Viewmodel**:
   - ADS (aim down sight) — gerakan senjata ke tengah
   - Reload animation (senjata turun, mag keluar, mag masuk)
   - Sprint pose (senjata miring)
   - Inspect weapon (buat kosmetik)
3. **Particle Effects**:
   - Muzzle smoke (asap setelah tembak)
   - Impact sparks (percikan di tembok)
   - Blood / hit particles (B&W: putih/abu)
   - Footstep dust
4. **Screen Effects**:
   - Screen shake saat tembak
   - Chromatic aberration saat kena
   - Vignette saat HP rendah
   - Bloom (glow) — tapi jangan berlebihan
5. **Dynamic Lighting**:
   - Muzzle flash nyalain ruangan sekitar
   - Bot silhouette kelihatan karena rim light
6. **Motion Blur** (optional, buat preset Ultra)
7. **Ambient Sound** — angin, langkah kaki, drone ambient

Ini yang bikin orang bilang **"wih, ini game beneran"**.

---

## 🎯 Tier 5 — Sosial & Komunitas (2–3 minggu)

Ini yang bikin pemain **ngajak temen**:

1. **Friend System** — tambah teman, lihat status online
2. **Party System** — main bareng (meski bot, tetap rame)
3. **Clan/Guild** — bikin clan, clan leaderboard, clan tag
4. **Chat Global & Chat Clan** — Supabase realtime
5. **Spectator Mode** — nonton match temen
6. **Shareable Match Result** — tombol "Share ke Twitter/Discord" pakai Web Share API

---

## 🎯 Tier 6 — Teknis & Performa

Ini yang bikin pemain **nggak complain**:

1. **Optimasi Three.js**:
   - InstancedMesh buat bot (kalau banyak)
   - LOD (Level of Detail) — model sederhana kalau jauh
   - Frustum culling (jangan render yang gak kelihatan)
   - Object pooling (bullets, particles)
2. **Mobile Performance**:
   - Auto-detect device → set preset otomatis (HP kentang = low)
   - Battery saver mode
   - Frame limiter (60 FPS cap, bisa turun ke 30 di low)
3. **PWA** — bisa install ke home screen HP, offline mode
4. **Loading Optimization**:
   - Preload map setelah menu
   - Lazy load settings
5. **Error Handling**:
   - Sentry atau Rollbar buat log error user
   - Fallback UI kalau WebGL gak support

---

## 🎯 Tier 7 — Aksesibilitas & Lokalisasi

Ini yang bikin game **"layak global"** (bukan cuma Indonesia):

1. **Multi-bahasa**:
   - Indonesia (default)
   - English (wajib)
   - Mandarin (bonus, karena banyak gamer China)
   - Jepang, Korea, Portugis, Spanyol (nice to have)
   - Pakai `i18next` atau `@formatjs`
2. **Subtitles & Closed Captions** — buat dialog & sound cue
3. **Colorblind Mode** — protanopia, deuteranopia, tritanopia
4. **Scalable UI** — font size bisa diatur (buat device kecil)
5. **Full Controller Support** — Gamepad API (PS/Xbox controller)
6. **Remappable Keys** — semua tombol bisa diubah
7. **Aim Assist Levels** — sesuai kesulitan (buat mobile)

---

## 🎯 Tier 8 — Monetisasi (optional, hati-hati)

Kalau lu mau monetisasi **tanpa jadi "pay to win"**:

1. **Battle Pass** — seasonal, kosmetik only (skin, emote, crosshair)
2. **Cosmetic Shop** — skin senjata, hero skin, kill effect
3. **No Pay-to-Win** — jangan pernah jual stat boost
4. **No Ads** — kalau bisa, hindari iklan

**Tapi jangan mikir monetisasi dulu.** Game gratis dengan player base kecil lebih baik daripada game berbayar dengan 0 player.

---

## 🎯 Tier 9 — Marketing & Launch

Ini yang bikin **orang tahu game lu ada**:

1. **Trailer** — 30 detik gameplay, buat TikTok/YouTube/Instagram
2. **Devlog** — weekly update di Twitter/X, TikTok, YouTube Shorts
3. **Discord Server** — komunitas, feedback, beta testing
4. **Reddit Post** — r/gamedev, r/IndieGaming, r/WebGames
5. [**itch.io**](https://itch.io/) — submit game, ini pasar web game besar
6. **Product Hunt** — launch sekali, bisa dapet 1000 visitor
7. **YouTube Streamer** — gifting game ke streamer kecil
8. **SEO** — title, meta description, structured data

---

## 🎯 Prioritas Realistis buat lu (solo dev)

Kalau lu cuma bisa kerja **2–3 jam/hari**, ini urutan yang gue saranin:

| **Minggu** | **Fokus**                                               | **Hasil**              |
| :--------- | :------------------------------------------------------ | :--------------------- |
| 1–2        | Tier 1 (Main Menu, Pause, Game Over, Loading, Sound FX) | **Game terasa "jadi"** |
| 3–4        | Tier 2 (XP, Rank, MMR, Supabase, Leaderboard)           | **Pemain balik lagi**  |
| 5–6        | Tier 3 sebagian (1 map baru, 2 senjata baru)            | **Variasi**            |
| 7–8        | Tier 4 (Animasi, particle, screen effect)               | **"Wih, pro"**         |
| 9–10       | Tier 7 (English, i18n, Controller)                      | **"Layak global"**     |
| 11–12      | Tier 9 (Trailer, Devlog, Discord)                       | **Launch**             |
| 13+        | Tier 5 (Sosial) & Tier 8 (Monetisasi)                   | **Growth**             |

---

## 🎯 Yang paling impactful dalam **1 minggu** kerja

Kalau lu cuma punya **1 minggu** dan mau game langsung keliatan 10x lebih pro, ini yang gue kerjain duluan:

1. **Main Menu + Pause + Game Over** — 2 hari
2. **Countdown 3-2-1** + Loading Screen — 1 hari
3. **Hitmarker + Sound FX lengkap** — 1 hari
4. **Death animation bot** (roboh, bukan hilang) — 1 hari
5. **Screen shake + particle impact** — 2 hari

Itu **7 hari**, dan orang bakal ngerasa ini game **bukan prototype**.

---

## ❓ Pertanyaan buat lu

Sebelum gue saranin batch berikutnya, jawab ini:

1. **Target waktu lu**: berapa jam/minggu bisa lu dedicate? (2 jam, 5 jam, 10 jam?)
2. **Target launch**: kapan lu mau launch publik? (1 bulan, 3 bulan, 6 bulan?)
3. **Fokus utama**:
   - **a) Cepat jadi "game" dulu** (Tier 1) → lanjut Tier 2
   - **b) Langsung ke progression** (Rank/MMR) karena itu visi utama lu
   - **c) Polish gameplay** (animasi, efek) biar keliatan pro
4. **Lu mau monetisasi** atau **gratis full** dulu?

Kalau lu jawab, gue bikin **roadmap mingguan** yang spesifik buat lu + mulai dari batch mana. Kalau mau langsung, gue saranin **Batch 5: UI Menu + Pause + Game Over + Loading** — itu yang paling impactful.
