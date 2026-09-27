/* ============================================================
   EDIT THIS FILE ONLY — everything on the card comes from here.
   ============================================================ */
window.WEDDING = {
  bride: "Shilan",
  groom: "Aram",

  // ISO date/time of the ceremony (local time of the venue)
  date: "2026-12-19T18:00:00",
  dateLabel: "Saturday · 19 December 2026",
  timeLabel: "6:00 PM",

  // Kurdish greetings (Sorani + Kurmanji)
  welcomeSorani: "بەخێربێن",
  welcomeKurmanji: "Bi xêr hatin",
  blessingSorani: "پیرۆز بێت",

  // Families who invite
  families: "The families of Ahmed & Karim",
  message:
    "With joy in our hearts and the blessing of our families, we invite you to celebrate the beginning of our forever — an evening of love, music, dîlan and govend.",

  // Photos: put your own images in assets/photos and list them here.
  cover: "assets/photos/cover.svg",
  avatar: "assets/photos/avatar.svg",
  gallery: [
    { src: "assets/photos/1.svg", caption: "Where it all began" },
    { src: "assets/photos/2.svg", caption: "Two hearts, one path" },
    { src: "assets/photos/3.svg", caption: "She said yes 💍" },
  ],

  // Background music. Leave "" to use the built-in Kurdish-style melody,
  // or put an mp3 in assets/music and set e.g. "assets/music/song.mp3".
  music: "",

  venue: {
    name: "Rotana Grand Hall",
    address: "100m Street, Erbil, Kurdistan Region",
    // Anything Google Maps understands: address or "lat,lng"
    mapQuery: "Erbil Rotana Hotel, Erbil",
  },
  // Show a live Google map on the location story (false = styled card only)
  mapEmbed: true,

  // Optional: personalise the envelope ("A letter for …")
  guestName: "",

  program: [
    { time: "6:00 PM", title: "Guests Arrive", note: "Welcome drinks & zurna" },
    { time: "7:00 PM", title: "The Entrance", note: "Bride & groom enter" },
    { time: "7:30 PM", title: "Dîlan & Govend", note: "Join the halparke circle" },
    { time: "9:00 PM", title: "Dinner", note: "Traditional Kurdish feast" },
  ],

  // RSVP via WhatsApp (international format, digits only)
  rsvpWhatsApp: "9647500000000",
  rsvpDeadline: "Kindly reply by 1 December",

  hashtag: "#ShilanAndAram",

  // Seconds each story stays on screen
  storyDuration: 7,
};
