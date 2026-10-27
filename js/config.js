/* ==========================================================
   CONFIG – cukup edit file ini untuk mengganti seluruh data
   undangan. Semua teks, foto, jadwal, rekening, dll. ada di sini.
   ========================================================== */
const INVITATION = {
  groom: { name: "Raka Aditya", nick: "Raka", father: "Bapak [AYAH]", mother: "Ibu [IBU]", photo: "assets/groom.svg" },
  bride: { name: "Anindya Putri", nick: "Anindya", father: "Bapak [AYAH]", mother: "Ibu [IBU]", photo: "assets/bride.svg" },

  // Tanggal & jam acara utama (dipakai countdown & kalender). Format ISO + zona waktu.
  weddingDate: "2026-12-12T08:00:00+07:00",
  weddingDuration: 6, // jam, untuk file kalender

  akad:    { date: "Sabtu, 12 Desember 2026", time: "08.00 – 10.00 WIB", place: "[LOKASI AKAD]", address: "[ALAMAT AKAD]" },
  resepsi: { date: "Sabtu, 12 Desember 2026", time: "11.00 – 14.00 WIB", place: "[LOKASI RESEPSI]", address: "[ALAMAT RESEPSI]" },

  map: {
    name: "[NAMA GEDUNG]",
    address: "[ALAMAT LENGKAP GEDUNG, KOTA]",
    url: "https://maps.google.com/?q=Monumen+Nasional+Jakarta",
    embed: "https://www.google.com/maps?q=Monumen+Nasional+Jakarta&output=embed",
    directions: "Dari pintu utama, ikuti papan petunjuk menuju ballroom. Area parkir tersedia di basement dan halaman depan."
  },

  ayat: {
    arab: "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ",
    arti: "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.",
    sumber: "QS. Ar-Rum : 21"
  },

  story: [
    { year: "2021", title: "First Meet",      text: "Takdir mempertemukan kami untuk pertama kalinya. Sebuah sapaan sederhana yang menjadi awal dari segalanya." },
    { year: "2022", title: "Getting Closer",  text: "Obrolan demi obrolan membuat kami saling mengenal, saling percaya, dan tumbuh menjadi sahabat terbaik." },
    { year: "2024", title: "The Proposal",    text: "Dengan penuh keyakinan, ia melamar. Satu kata “ya” yang mengubah dua cerita menjadi satu tujuan." },
    { year: "2026", title: "The Wedding",     text: "Dengan restu keluarga, kami melangkah ke jenjang pernikahan dan memulai babak baru bersama." }
  ],

  dressCode: {
    title: "Elegant Neutral",
    text: "Kami mengundang Anda mengenakan busana bernuansa netral agar harmonis dengan suasana hari bahagia kami.",
    colors: [
      { name: "Cream", hex: "#F6EFDF" },
      { name: "Beige", hex: "#D9C7A8" },
      { name: "Champagne", hex: "#EAD9B8" },
      { name: "Black", hex: "#1F1B16" }
    ]
  },

  gallery: [
    { src: "assets/g1.svg", caption: "Kenangan 1" },
    { src: "assets/g2.svg", caption: "Kenangan 2" },
    { src: "assets/g3.svg", caption: "Kenangan 3" },
    { src: "assets/g4.svg", caption: "Kenangan 4" },
    { src: "assets/g5.svg", caption: "Kenangan 5" },
    { src: "assets/g6.svg", caption: "Kenangan 6" },
    { src: "assets/g7.svg", caption: "Kenangan 7" },
    { src: "assets/g8.svg", caption: "Kenangan 8" }
  ],

  // Link YouTube / Vimeo / file .mp4. Kosongkan jika belum ada.
  video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  videoThumb: "assets/video.svg",

  notes: [
    { text: "Cinta bukan tentang menemukan seseorang yang sempurna, tetapi melihat kesempurnaan dalam ketidaksempurnaan.", by: "Sam Keen" },
    { text: "Rumah bukanlah sebuah tempat, rumah adalah seseorang.", by: "Love Notes" },
    { text: "Bersamamu, hari-hari biasa menjadi cerita yang paling indah.", by: "Love Notes" },
    { text: "Dan aku memilihmu, hari ini, esok, dan selamanya.", by: "Love Notes" }
  ],

  gift: {
    accounts: [
      { bank: "BCA",     number: "1234567890", holder: "Raka Aditya" },
      { bank: "Mandiri", number: "0987654321", holder: "Anindya Putri" }
    ],
    qris: "assets/qris.svg",       // ganti dengan file QRIS asli (png/jpg), tanpa crop/kompres
    qrisHolder: "Raka & Anindya",
    qrisPrayer: "Doa restu Anda adalah hadiah terindah bagi kami. Namun jika berkenan memberi tanda kasih, dapat melalui QRIS berikut."
  },

  info: [
    { icon: "clock",  title: "Hadir Tepat Waktu", text: "Mohon hadir 15 menit sebelum acara dimulai." },
    { icon: "shirt",  title: "Dress Code",        text: "Elegant Neutral: cream, beige, champagne, hitam." },
    { icon: "shield", title: "Jaga Kesehatan",    text: "Demi kenyamanan bersama, tetap jaga kesehatan dan kebersihan." },
    { icon: "users",  title: "Undangan Terbatas", text: "Undangan berlaku untuk nama yang tertera pada cover." }
  ],

  closing: {
    text: "Merupakan kebahagiaan dan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu. Terima kasih atas segala perhatian, doa, dan kasih sayang yang diberikan."
  },

  social: { instagram: "https://instagram.com/", email: "mailto:hello@example.com" },

  whatsapp: "6281234567890",   // nomor tujuan konfirmasi (format 62xxxx tanpa +)
  music: "assets/music.mp3",   // letakkan file musik di sini
  shareText: "Kami mengundang Anda ke pernikahan kami",

  // Opsional: URL Google Apps Script agar RSVP & ucapan tersimpan permanen (lihat README.md)
  endpoint: "",

  // Contoh ucapan awal (hanya tampil jika belum ada ucapan)
  sampleWishes: [
    { name: "Keluarga Besar", message: "Selamat menempuh hidup baru! Semoga sakinah, mawaddah, warahmah.", time: Date.now() - 86400000 * 2 },
    { name: "Sahabat Kampus", message: "Happy wedding! Semoga bahagia selalu sampai kakek nenek.", time: Date.now() - 86400000 }
  ]
};
