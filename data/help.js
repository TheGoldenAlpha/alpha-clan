// Help-Seite (help.html): Kategorien und Tutorials.
// Felder mit null zeigen auf der Seite einen Platzhalter. Einfach ausfuellen, sobald die Daten da sind.
//
// id            kurzer Name, auch fuer den Link: help.html#dungeons/bloodmoon oeffnet das Fenster direkt
// kategorie     "general", "dungeons" oder "tasks"
// schwierigkeit "easy", "medium" oder "hard" (oder null)
// bild          Thumbnail (16:9), leer = Platzhalter-Bild
// youtube       YouTube-Link, z. B. "https://www.youtube.com/watch?v=XXXXXXXXXXX" (ersetzt das Video oben im Fenster)
// video         eigenes Video, solange es noch keinen YouTube-Link gibt
// dauer         Laenge des Videos, z. B. "8:30"
// rating        Sterne von 0 bis 5 (z. B. 4.5), stimmen = Anzahl Bewertungen
// tags          Suchwoerter (optional), z. B. ["halloween", "keys"]
// infos         kurze Fakten (Wert null = Platzhalter)
// schritte      Ablauf in Stichpunkten, tipps = Tipps in Stichpunkten

const HELP_KATEGORIEN = [
  { id: "general",  titel: "GENERAL",  text: "The basics of gobattle.io and the Alpha Clan.",                          bild: "" },
  { id: "dungeons", titel: "DUNGEONS", text: "Step by step through every dungeon, always the easiest and safest way.", bild: "images/tutorials/bloodmoon.jpg" },
  { id: "tasks",    titel: "TASKS",    text: "Quests and tasks explained, so you never get stuck.",                    bild: "" },
];

function tutorial(t) {
  return Object.assign({
    kategorie: "dungeons",
    untertitel: null,
    schwierigkeit: null,
    bild: "",
    youtube: "",
    video: "",
    dauer: null,
    rating: null,
    stimmen: null,
    tags: [],
    beschreibung: null,
    infos: {
      "Recommended level": null,
      "Players": null,
      "Rewards": null,
    },
    schritte: null,
    tipps: null,
  }, t);
}

const HELP = [
  // ---------- GENERAL (noch keine Videos) ----------
  tutorial({ id: "first-steps",   kategorie: "general", titel: "First Steps" }),
  tutorial({ id: "join-the-clan", kategorie: "general", titel: "Join the Alpha Clan" }),
  tutorial({ id: "items-ultras",  kategorie: "general", titel: "Items & Ultras" }),

  // ---------- DUNGEONS ----------
  tutorial({ id: "cloudy-sky",    titel: "Cloudy Sky",     untertitel: "Beginner dungeon", schwierigkeit: "easy",   dauer: "4:50", bild: "images/tutorials/cloudy-sky.jpg",    video: "videos/tutorials/cloudy-sky.mp4" }),
  tutorial({ id: "dancie-spikes", titel: "Dancie Spikes",  untertitel: "Beginner dungeon", schwierigkeit: "easy",   dauer: "3:35", bild: "images/tutorials/dancie-spikes.jpg", video: "videos/tutorials/dancie-spikes.mp4" }),
  tutorial({ id: "ravenors-land", titel: "Ravenor's Land", untertitel: "Beginner dungeon", schwierigkeit: "easy",   dauer: "3:32", bild: "images/tutorials/ravenors-land.jpg", video: "videos/tutorials/ravenors-land.mp4" }),
  tutorial({ id: "skys-prison",   titel: "Sky's Prison",   untertitel: "Beginner dungeon", schwierigkeit: "easy",   dauer: "3:01", bild: "images/tutorials/skys-prison.jpg",   video: "videos/tutorials/skys-prison.mp4" }),
  tutorial({ id: "spider-nest",   titel: "Spider Nest",    untertitel: "Beginner dungeon", schwierigkeit: "easy",   dauer: "5:53", bild: "images/tutorials/spider-nest.jpg",   video: "videos/tutorials/spider-nest.mp4" }),
  tutorial({ id: "sawmill",       titel: "Sawmill",        untertitel: "Easy dungeon",     schwierigkeit: "easy",   dauer: "3:33", bild: "images/tutorials/sawmill.jpg",       video: "videos/tutorials/sawmill.mp4" }),
  tutorial({ id: "bloodmoon",     titel: "Bloodmoon",      untertitel: "Medium dungeon",   schwierigkeit: "medium", dauer: "8:30", bild: "images/tutorials/bloodmoon.jpg",     video: "videos/tutorials/bloodmoon.mp4", tags: ["halloween", "event door", "keys"] }),

  // ---------- TASKS (noch keine Videos) ----------
  tutorial({ id: "daily-tasks",   kategorie: "tasks", titel: "Daily Tasks" }),
  tutorial({ id: "weekly-tasks",  kategorie: "tasks", titel: "Weekly Tasks" }),
  tutorial({ id: "event-tasks",   kategorie: "tasks", titel: "Event Tasks" }),
];
