/* ============================================================
   EDIT THIS FILE — everything personal on the invitation.
   Each text has a version per language: en, ckb (Sorani),
   kmr (Kurmanji), ar (Arabic).
   ============================================================ */
window.WEDDING = {
  defaultLang: "en",

  bride: { en: "Shilan", ckb: "شیلان", kmr: "Şîlan", ar: "شيلان" },
  groom: { en: "Aram", ckb: "ئارام", kmr: "Aram", ar: "آرام" },
  initials: "S A", // shown on the wax seal and monogram

  families: {
    en: "The families of Ahmed & Karim",
    ckb: "خێزانەکانی ئەحمەد و کەریم",
    kmr: "Malbatên Ehmed û Kerîm",
    ar: "عائلتا أحمد وكريم",
  },

  // Ceremony date and time (venue local time)
  date: "2026-12-19T18:00:00",
  rsvpBy: "2026-12-01",

  venue: {
    name: { en: "Rotana Grand Hall", ckb: "هۆڵی گەورەی ڕۆتانا", kmr: "Salona Mezin a Rotana", ar: "قاعة روتانا الكبرى" },
    city: { en: "Erbil, Kurdistan", ckb: "هەولێر، کوردستان", kmr: "Hewlêr, Kurdistan", ar: "أربيل، كردستان" },
    address: { en: "100m Street, Erbil", ckb: "شەقامی ١٠٠ مەتری، هەولێر", kmr: "Kolana 100m, Hewlêr", ar: "شارع ١٠٠ متر، أربيل" },
    mapQuery: "Erbil Rotana Hotel, Erbil",
  },
  mapEmbed: true, // live Google map on the real website

  program: [
    { time: "18:00", title: { en: "Guests Arrive", ckb: "گەیشتنی میوانان", kmr: "Hatina mêvanan", ar: "وصول الضيوف" },
      note: { en: "Welcome drinks & zurna", ckb: "خواردنەوە و زوڕنا", kmr: "Vexwarin û zirne", ar: "مشروبات الترحيب والزرنة" } },
    { time: "19:00", title: { en: "The Grand Entrance", ckb: "هاتنی بووک و زاوا", kmr: "Hatina bûk û zavê", ar: "دخول العروسين" },
      note: { en: "Bride & groom arrive", ckb: "بووک و زاوا دێنە هۆڵەکە", kmr: "Bûk û zava tên salonê", ar: "يدخل العروسان القاعة" } },
    { time: "19:30", title: { en: "Dîlan & Govend", ckb: "دیلان و گۆڤەند", kmr: "Dîlan û Govend", ar: "الدبكة الكردية" },
      note: { en: "Join the halparke circle", ckb: "بەشداری هەڵپەڕکێ بکە", kmr: "Tev li govendê bibe", ar: "انضموا إلى حلقة الرقص" } },
    { time: "21:00", title: { en: "Dinner", ckb: "نانی ئێوارە", kmr: "Şîva êvarê", ar: "العشاء" },
      note: { en: "A traditional Kurdish feast", ckb: "خوانێکی کوردی ڕەسەن", kmr: "Sifreyeke kurdî ya kevneşopî", ar: "مأدبة كردية تقليدية" } },
  ],

  // Photos (portrait photos look best). Replace the placeholders with your own.
  cover: "assets/photos/cover.svg",
  gallery: [
    { src: "assets/photos/1.svg", caption: { en: "Where it all began", ckb: "لێرەوە دەستی پێکرد", kmr: "Li vir dest pê kir", ar: "هنا كانت البداية" } },
    { src: "assets/photos/2.svg", caption: { en: "Two hearts, one path", ckb: "دوو دڵ، یەک ڕێگا", kmr: "Du dil, yek rê", ar: "قلبان وطريق واحد" } },
    { src: "assets/photos/3.svg", caption: { en: "She said yes", ckb: "گوتی بەڵێ", kmr: "Got erê", ar: "قالت نعم" } },
  ],

  // Background music: "Perfect" by Ed Sheeran.
  // The song is copyrighted, so it is not included. Save your mp3 as
  // assets/music/perfect.mp3. Until then an original piano waltz plays.
  song: { title: "Perfect", artist: "Ed Sheeran", src: "assets/music/perfect.mp3" },

  rsvpWhatsApp: "9647500000000", // international format, digits only
  hashtag: "#ShilanAndAram",

  // Optional: personalise the envelope, e.g. "Hama" → "A letter for Hama".
  // Also works from the link: index.html?to=Hama
  guestName: "",
};
