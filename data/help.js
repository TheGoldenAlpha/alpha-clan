// Help-Seite (help.html): Kategorien und Tutorials.
// Felder mit null zeigen auf der Seite einen Platzhalter. Einfach ausfuellen, sobald die Daten da sind.
//
// id            kurzer Name, auch fuer den Link: help.html#bloodmoon oeffnet das Fenster direkt
// kategorie     "general", "dungeons" oder "tasks"
// schwierigkeit "easy", "medium" oder "hard" (oder null)
// bild          Thumbnail (16:9), leer = Platzhalter-Bild
// youtube       YouTube-Link, z. B. "https://www.youtube.com/watch?v=XXXXXXXXXXX" (kommt ganz oben ins Fenster)
// video         eigenes Video, falls (noch) kein YouTube-Link da ist, z. B. "videos/tutorials/bloodmoon.mp4"
// rating        Sterne von 0 bis 5 (z. B. 4.5), stimmen = Anzahl Bewertungen
// infos         kurze Fakten (Wert null = Platzhalter)
// schritte      Ablauf in Stichpunkten, tipps = Tipps in Stichpunkten

const HELP_KATEGORIEN = [
  { id: "general",  titel: "GENERAL",  text: "The basics of gobattle.io and the Alpha Clan." },
  { id: "dungeons", titel: "DUNGEONS", text: "Step by step through every dungeon, always the easiest and safest way." },
  { id: "tasks",    titel: "TASKS",    text: "Quests and tasks explained, so you never get stuck." },
];

function tutorial(t) {
  return Object.assign({
    kategorie: "dungeons",
    untertitel: null,
    schwierigkeit: null,
    bild: "",
    youtube: "",
    video: "",
    rating: null,
    stimmen: null,
    beschreibung: null,
    infos: {
      "Duration": null,
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
  tutorial({ id: "cloudy-sky",    titel: "Cloudy Sky",     untertitel: "Beginner dungeon", schwierigkeit: "easy",   bild: "images/tutorials/cloudy-sky.jpg" }),
  tutorial({ id: "dancie-spikes", titel: "Dancie Spikes",  untertitel: "Beginner dungeon", schwierigkeit: "easy",   bild: "images/tutorials/dancie-spikes.jpg" }),
  tutorial({ id: "ravenors-land", titel: "Ravenor's Land", untertitel: "Beginner dungeon", schwierigkeit: "easy",   bild: "images/tutorials/ravenors-land.jpg" }),
  tutorial({ id: "skys-prison",   titel: "Sky's Prison",   untertitel: "Beginner dungeon", schwierigkeit: "easy",   bild: "images/tutorials/skys-prison.jpg" }),
  tutorial({ id: "spider-nest",   titel: "Spider Nest",    untertitel: "Beginner dungeon", schwierigkeit: "easy",   bild: "images/tutorials/spider-nest.jpg" }),
  tutorial({ id: "sawmill",       titel: "Sawmill",        untertitel: "Easy dungeon",     schwierigkeit: "easy",   bild: "images/tutorials/sawmill.jpg" }),
  tutorial({ id: "bloodmoon",     titel: "Bloodmoon",      untertitel: "Medium dungeon",   schwierigkeit: "medium", bild: "images/tutorials/bloodmoon.jpg" }),

  // ---------- TASKS (noch keine Videos) ----------
  tutorial({ id: "daily-tasks",   kategorie: "tasks", titel: "Daily Tasks" }),
  tutorial({ id: "weekly-tasks",  kategorie: "tasks", titel: "Weekly Tasks" }),
  tutorial({ id: "event-tasks",   kategorie: "tasks", titel: "Event Tasks" }),
];
