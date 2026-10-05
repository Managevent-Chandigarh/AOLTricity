/* ============================================================
   Art of Living — Centers & Events
   This is the ONLY file you need to edit to manage the website.
   See README.md for step-by-step instructions.
   ============================================================ */

// ---- Centers ------------------------------------------------
// id: a short unique code. Once events reference an id, don't change it.
const CENTERS = [
  {
    id: "green-meadows",
    name: "Green Meadows Center",
    address: "12, Lake View Road, Green Meadows",
    phone: "+91 98450 00001",
  },
  {
    id: "city-center",
    name: "City Center",
    address: "45, MG Road, opposite City Mall",
    phone: "+91 98450 00002",
  },
  {
    id: "sunrise-vihar",
    name: "Sunrise Vihar",
    address: "8, Temple Street, Sunrise Layout",
    phone: "+91 98450 00003",
  },
  {
    id: "riverside",
    name: "Riverside Ashram",
    address: "Riverside Road, near Old Bridge",
  },
];

// ---- Events -------------------------------------------------
// One-off event: give "start" as "YYYY-MM-DDTHH:MM" (24-hour, local time),
//                plus optional "durationMin" (default 90).
// Weekly event:  give "weekly": { "day": 0-6, "time": "HH:MM" }
//                where day: 0=Sun, 1=Mon, ... 6=Sat.
//                The site automatically shows the next 12 weeks of it.
// Special programs (e.g. a Janmashtami Celebration) are simply their own
// event entry, with the "type" of program it mainly is.
// type: one of "satsang", "long-kriya", "knowledge-session", "janmashtami" —
//       or an array to file the event under several at once, e.g.
//       type: ["satsang", "janmashtami"]
//       (new types can be added in EVENT_TYPES at the top of app.js)
const EVENTS = [
  {
    id: "satsang-green-meadows",
    type: "satsang",
    title: "Weekly Satsang",
    centerId: "green-meadows",
    weekly: { day: 0, time: "18:00" },
    durationMin: 90,
    host: "Meera Rao",
    description:
      "An evening of bhajans, a short discourse and group meditation. Open to everyone; prasad is served afterwards.",
  },
  {
    id: "long-kriya-city-center",
    type: "long-kriya",
    title: "Long Kriya",
    centerId: "city-center",
    weekly: { day: 6, time: "07:00" },
    durationMin: 150,
    host: "Rajesh Kulkarni",
    description:
      "Guided long Sudarshan Kriya practice for those who have completed the Happiness Program. Please bring your own mat.",
  },
  {
    id: "knowledge-sunrise-vihar",
    type: "knowledge-session",
    title: "Bhagavad Gita — Chapter 2",
    centerId: "sunrise-vihar",
    weekly: { day: 3, time: "19:00" },
    durationMin: 60,
    host: "Anitha Sharma",
    description:
      "A weekly walk-through of Chapter 2 with commentary, followed by Q&A and a short meditation.",
  },
  {
    id: "satsang-riverside-special",
    type: "satsang",
    title: "Special Satsang with Senior Faculty",
    centerId: "riverside",
    start: "2026-10-09T18:30",
    durationMin: 120,
    host: "Visiting Faculty",
    description: "A special extended satsang. All are welcome; bring family and friends.",
  },
  {
    id: "janmashtami-celebration",
    type: ["satsang", "janmashtami"],
    title: "Janmashtami Celebration",
    centerId: "green-meadows",
    start: "2026-10-17T18:00",
    durationMin: 150,
    host: "Meera Rao",
    description:
      "Krishna Janmashtami celebration with special satsang, bhajans, meditation and prasad. All are welcome.",
  },
  {
    id: "knowledge-city-center-intro",
    type: "knowledge-session",
    title: "Know Your Mind — Intro Session",
    centerId: "city-center",
    start: "2026-10-17T17:00",
    durationMin: 90,
    description: "An introduction to how breath and mind are connected. Free and open to all.",
  },
  {
    id: "long-kriya-riverside",
    type: "long-kriya",
    title: "Long Kriya (Evening Batch)",
    centerId: "riverside",
    start: "2026-10-25T17:30",
    durationMin: 150,
    description: "Evening long kriya session for Happiness Program graduates.",
  },
];
