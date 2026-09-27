/* ============================================================
   EDIT THIS FILE — all the words on the card.
   Every text has a version per language: en (English),
   ckb (Sorani), kmr (Kurmanji), ar (Arabic).
   ============================================================ */
window.CARD = {
  defaultLang: "en", // or open the link with ?lang=ckb

  bride: { en: "Shilan", ckb: "شیلان", kmr: "Şîlan", ar: "شيلان" },
  groom: { en: "Aram", ckb: "ئارام", kmr: "Aram", ar: "آرام" },
  initials: ["S", "A"], // monogram at the end

  // Used for "Add to calendar"
  start: "2026-12-19T18:00:00",
  end: "2026-12-19T23:00:00",

  // Scene 4: Save the Date
  date: { en: "DECEMBER 19, 2026", ckb: "١٩ی کانوونی یەکەمی ٢٠٢٦", kmr: "19 KANÛN 2026", ar: "١٩ كانون الأول ٢٠٢٦" },
  time: { en: "06:00 PM – 11:00 PM", ckb: "٦ی ئێوارە تا ١١ی شەو", kmr: "18:00 – 23:00", ar: "٦:٠٠ مساءً – ١١:٠٠ مساءً" },
  venue: { en: "Rotana Grand Hall", ckb: "هۆڵی گەورەی ڕۆتانا", kmr: "Salona Rotana", ar: "قاعة روتانا الكبرى" },
  address: { en: "100M STREET · ERBIL · KURDISTAN", ckb: "شەقامی ١٠٠ مەتری · هەولێر", kmr: "KOLANA 100M · HEWLÊR", ar: "شارع ١٠٠ متر · أربيل" },
  mapQuery: "Erbil Rotana Hotel, Erbil",

  // Scene 5: RSVP
  rsvpBy: { en: "BY DECEMBER 1 TO", ckb: "تا ١ی کانوونی یەکەم بۆ", kmr: "HETA 1Ê KANÛNÊ JI BO", ar: "قبل ١ كانون الأول إلى" },
  rsvpName: { en: "HAMA", ckb: "حەمە", kmr: "HEME", ar: "حمه" },
  phone: "+964 750 000 0000",
  whatsapp: "9647500000000", // digits only, used by the RSVP button
  website: "WWW.SHILANANDARAM.COM",

  // Music: "Perfect" by Ed Sheeran. The song is copyrighted, so it is not
  // included — save your mp3 as assets/music/perfect.mp3. Until then an
  // original piano waltz plays.
  song: { title: "Perfect", artist: "Ed Sheeran", src: "assets/music/perfect.mp3" },

  // Photo-realistic artwork (e.g. made with Canva AI). When a file exists it
  // replaces the drawn artwork; missing files fall back automatically.
  images: {
    envelope: "assets/images/envelope.jpg", // embossed burgundy floral paper (9:16)
    paper: "assets/images/paper.jpg",       // cream paper with window light (9:16)
    pampas: "assets/images/pampas.jpg",     // embossed pampas on cream paper (9:16)
    frame: "assets/images/frame.jpg",       // baroque frame on burgundy (9:16)
    seal: "assets/images/seal.jpg",         // gold dove wax seal on burgundy (square)
  },

  // Optional: "?to=Hama" in the link shows "For Hama" on the envelope.
  guestName: "",

  /* ---- Fixed words of the card, per language ---- */
  words: {
    en: {
      dir: "ltr", label: "English",
      tap: "Tap to open", welcome: "بەخێربێن",
      youre: "YOU'RE", cordially: "cordially", invited: "INVITED",
      getting: "WE'RE GETTING", married: "MARRIED", amp: "&",
      save: "Save", the: "the", dateWord: "Date",
      kindly: "kindly", rsvp: "RSVP", callOrText: "CALL OR TEXT",
      forGuest: "For {name}",
      btnRsvp: "RSVP", btnCalendar: "Add to calendar", btnMap: "Directions", replay: "Back to top",
      rsvpMsg: "Hello! I'd love to confirm my attendance at {couple}'s wedding.",
    },
    ckb: {
      dir: "rtl", label: "کوردی",
      tap: "بۆ کردنەوە دەستی لێبدە", welcome: "بەخێربێن",
      youre: "بە خۆشحاڵییەوە", cordially: "بانگهێشتی", invited: "ئاهەنگەکەمان دەکەین",
      getting: "ئێمە", married: "هاوسەرگیری دەکەین", amp: "و",
      save: "ئەم", the: "ڕۆژە", dateWord: "بپارێزە",
      kindly: "تکایە", rsvp: "وەڵام بدەرەوە", callOrText: "پەیوەندی یان نامە",
      forGuest: "بۆ {name}",
      btnRsvp: "وەڵام", btnCalendar: "ڕۆژژمێر", btnMap: "ڕێگا", replay: "گەڕانەوە بۆ سەرەوە",
      rsvpMsg: "سڵاو! بە خۆشحاڵییەوە بەشداری ئاهەنگی هاوسەرگیری {couple} دەکەم.",
    },
    kmr: {
      dir: "ltr", label: "Kurmancî",
      tap: "Ji bo vekirinê bitikîne", welcome: "Bi xêr hatin",
      youre: "HÛN", cordially: "bi dilgermî", invited: "VEXWENDÎ NE",
      getting: "EM", married: "DIZEWICIN", amp: "û",
      save: "Vê", the: "rojê", dateWord: "biparêze",
      kindly: "ji kerema xwe", rsvp: "BERSIV", callOrText: "BIGERE AN BINIVÎSE",
      forGuest: "Ji bo {name}",
      btnRsvp: "Bersiv", btnCalendar: "Salname", btnMap: "Rê", replay: "Vegere jor",
      rsvpMsg: "Silav! Ez bi kêfxweşî têm daweta {couple}.",
    },
    ar: {
      dir: "rtl", label: "العربية",
      tap: "المس لفتح الدعوة", welcome: "أهلاً وسهلاً",
      youre: "يسعدنا", cordially: "دعوتكم", invited: "لحضور حفلنا",
      getting: "نحن", married: "سنتزوج", amp: "و",
      save: "احفظوا", the: "هذا", dateWord: "التاريخ",
      kindly: "نرجو", rsvp: "تأكيد الحضور", callOrText: "اتصال أو رسالة",
      forGuest: "إلى {name}",
      btnRsvp: "تأكيد", btnCalendar: "التقويم", btnMap: "الموقع", replay: "العودة للأعلى",
      rsvpMsg: "مرحباً! يسعدني تأكيد حضوري حفل زفاف {couple}.",
    },
  },
};
