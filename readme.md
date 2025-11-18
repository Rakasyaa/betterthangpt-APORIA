# 🎭 APORIA — Your Greek Philosophy Assistant  

Jelajahi perjalanan panjang filsafat Yunani kuno yang dipenuhi pemikiran mendalam dari para filsuf besar seperti Socrates, Plato, dan Aristoteles. Temukan ajaran-ajaran klasik tentang etika, logika, kebajikan, dan pencarian jati diri yang telah membentuk fondasi peradaban Barat dan tetap relevan hingga zaman modern. Dari kebijaksanaan kuno yang mengajarkan moderasi hingga dialog kritis yang mendorong kita mempertanyakan segala sesuatu, dunia filsafat Yunani menawarkan wawasan abadi yang dapat memperkaya cara kita berpikir dan menjalani hidup. Melalui Aporia, Anda dapat bertanya tentang apa saja—mitologi, konsep filsafat, kisah para dewa, ataupun tokoh-tokoh klasik—dan mendapatkan penjelasan yang ramah, interaktif, serta mudah dipahami.

Aporia adalah sebuah **web-based chatbot** bertema filsafat Yunani yang dibangun menggunakan HTML, CSS, dan JavaScript. Website ini menyediakan antarmuka chat modern dengan integrasi **Gemini API** sehingga pengguna dapat mengajukan pertanyaan filosofis, mitologi Yunani, sejarah, hingga topik terkait lainnya.

Website juga memiliki elemen visual tematik seperti Gunung Olympus, animasi awan, partikel, dark mode toggle, dan halaman pendukung (Home & About). Fokus utama proyek ini adalah **fitur chat AI**, bukan hanya landing page.

---

## ✨ Fitur Utama Chatbot
- **Integrasi API Gemini 2.5 Flash** untuk respons cepat.
- **Prompt sistem yang memaksa chatbot menjawab dalam plain text** tanpa bold, italic, heading, list, atau markup.
- **Quick Suggestions** berupa tombol yang langsung mengisi pertanyaan populer (Socrates, Zeus, Plato, Olympus).
- **Pesan User & Bot** dengan avatar, timestamp, dan auto-scroll.
- **Loading Indicator** animasi titik tiga saat bot berpikir.
- **Dark Mode Toggle** tersimpan di localStorage.
- **Efek Awan & Partikel** bergerak secara periodik untuk nuansa tema Olympus.
- **Error Handling** untuk kegagalan API.

---

## 🧠 Arsitektur Chatbot (script.js)

### 🔹 1. System Prompt
Bot dipaksa menjawab:
- TANPA markdown  
- TANPA bold/italic  
- TANPA list  
- Dalam bentuk paragraf biasa  
- Maksimal ±100 kata  

### 🔹 2. Logika Chat
- `addMessage()` → buat pesan user/bot
- `addLoadingMessage()` → animasi bot mengetik
- `callGeminiAPI()` → fetch ke endpoint Gemini
- `handleSendMessage()` → urutan kirim pesan
- Event: klik tombol kirim, Enter, quick suggestion

### 🔹 3. UI & Experience
- Efek visual partikel (jatuh perlahan)
- Efek awan bergerak horizontal
- Dark mode toggle yang persistent
- Auto-focus input ketika halaman dimuat

---

## 📁 Struktur Direktori
```
asilkomtech-betterthangpt/
│
├── css/
│   └── style.css                  # Styling utama, dark mode, animasi
│
├── js/
│   └── script.js                  # Sistem chatbot + interaksi UI lengkap
│
├── assets/
│   └── images/                    # Gambar halaman Home & About
│
├── pages/
│   ├── Home/
│   │   └── index.html
│   └── About/
│       └── index.html
│
└── index.html                     # Halaman Chat utama (Aporia Chat)
```

---

## Penjelasan File JavaScript (script.js)
### 1. Variabel Utama
- Referensi DOM (chatMessages, chatInput, sendBtn, quickSuggestions).
- State aplikasi: `messageCount`, `isLoading`.
- URL + API key untuk Gemini.

### 2. Sistem Prompt
Chatbot diatur menggunakan prompt berikut:
- Jawaban harus *plain text*.
- Dilarang memakai markdown.
- Kalimat maksimal ±100 kata.

### 3. Fungsi Chat
- **addMessage()**: membangun DOM pesan user atau bot.
- **addLoadingMessage()** dan **removeLoadingMessage()**: animasi bot mengetik.
- **callGeminiAPI()**: mengirim request POST ke Gemini dengan payload JSON.
- **getBotResponse()**: wrapper sederhana memanggil API.
- **handleSendMessage()**: validasi input, kirim pesan, tampilkan respons.

### 4. Fitur UI Tambahan
- **toggleDarkMode()** → menyimpan state ke `localStorage`.
- **createParticle()** → partikel acak jatuh perlahan.
- **createCloud()** → awan bergerak horizontal.
- Event listeners: tombol kirim, Enter, quick suggestions, onload.

---

## 🛠️ Teknologi yang Digunakan

- **HTML5** (struktur halaman)
- **CSS3** (layout, efek, animasi ringan)
- **JavaScript** (toggle dark mode & interaksi kecil)
- Tidak membutuhkan backend (static website)

---

## 🚀 Cara Menjalankan Secara Lokal

### 1. Menggunakan Live Server (VSCode)
Paling direkomendasikan.  
Cukup klik **Go Live** → otomatis terbuka di browser.

### 2. Menggunakan Python
```bash
python3 -m http.server 8000
```

Akses di: [http://localhost:8000/](http://localhost:8000/)

### 3. Menggunakan Node.js Serve

```bash
npm install -g serve
serve . -p 5000
```

---

## 🎨 Style & Panduan Pengembangan

- Gunakan variabel CSS (`:root`) agar mudah mengatur tema atau warna.
- Untuk elemen yang membutuhkan layering, **pastikan sudah pakai `position: relative`** agar `z-index` berfungsi.
- Semua elemen interaktif (toggle tema, dsb.) sudah terhubung lewat `script.js`.
- Kumpulkan seluruh document.getElementById di bagian atas sebagai variabel global untuk akses cepat.
- Pisahkan fungsi sesuai peran:
    - Fungsi UI (addMessage, createCloud, toggleDarkMode)
    - Fungsi API (callGeminiAPI, getBotResponse)
    - Event handlers (handleSendMessage, listener tombol input)

---

## 👥 Tim Pengembang

### **1. Rakasya Yoga**
**Backend & AI Engineer**  
Fokus pada machine learning, integrasi model AI, dan pembuatan sistem backend.  
Berpengalaman dalam pipeline data, API, dan arsitektur sistem modern.

### **2. Fadlullah Hasan**
**Content & Research Analyst**  
Melakukan riset filosofis dan memastikan akurasi sejarah, konsep, serta konten yang ditampilkan oleh Aporia.

### **3. M. Khalid**
**Frontend & UI/UX Designer**  
Mengembangkan desain antarmuka yang elegan, intuitif, dan konsisten dengan tema Yunani Kuno.

---

## ☁️ Deploy (Hosting)

Anda dapat meng-hosting website ini di layanan gratis seperti:

### 1. GitHub Pages

- Push repo
- Buka **Settings → Pages → Source: main/root**
- Selesai

URL akan berbentuk: `https://username.github.io/bootcamp-fasilkomtech-week2-betterthangpt/`

### 2. Netlify (super mudah)

- Drag & drop folder project
- Otomatis online

### 3. Vercel

- Connect repo
- Deploy otomatis

---

## ✔️ Checklist Sebelum Deploy

- [ ] Kompres gambar ke WebP
- [ ] Minify CSS & JS
- [ ] Tambahkan `alt=""` pada seluruh gambar
- [ ] Tambahkan favicon (logo Φ)

---

## 🗂️ Changelog

```
v0.1.0 — Initial Commit
- Struktur folder stabil
- Landing page dengan header, info cards, team, quote, footer
- Dark mode toggle
- About page
```

---

## 📜 Lisensi (MIT)

```
MIT License

Copyright © 2025 Aporia

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files...
```

---

## 📞 Kontak / Credits

- **Developer:** Rakasya Yoga Surya Pratama
- **Konsep & Desain UI:** Aporia Team
- **Icon & Assets:** dibuat sendiri / bebas lisensi

---

## 🎉 Terima Kasih!

Jika repo ini membantu, jangan lupa ⭐ di GitHub!  
Aporia terus dikembangkan untuk menjadi platform pembelajaran filosofi yang lebih baik.