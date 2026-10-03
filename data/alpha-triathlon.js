const DATEN = {

  // Jedes Minigame hat sein eigenes Datum und seine eigene Uhrzeit.
  // Leer lassen ("") = es wird "TBD" angezeigt.
  termine: {
    hideAndSeek: { datum: "", uhrzeit: "" },
    jumpAndRun:  { datum: "", uhrzeit: "" },
    pvp:         { datum: "", uhrzeit: "" },
  },

  autoNeuLaden: 60,

  hideAndSeek: [
    { account: "", preisText: "", preisIcon: "", gefundenVon: "" },
    { account: "", preisText: "", preisIcon: "", gefundenVon: "" },
    { account: "", preisText: "", preisIcon: "", gefundenVon: "" },
    { account: "", preisText: "", preisIcon: "", gefundenVon: "" },
    { account: "", preisText: "", preisIcon: "", gefundenVon: "" },
  ],
  hideAndSeekUltrare: [
    { bild: "", gewinner: "" },
    { bild: "", gewinner: "" },
    { bild: "", gewinner: "" },
  ],

  jumpErsterPlatz:     { preisText: "", preisIcon: "", gewinner: "" },
  jumpUnterLevel150:   { preisText: "", preisIcon: "", gewinner: "" },
  jumpUltrare: [
    { bild: "", gewinner: "" },
    { bild: "", gewinner: "" },
    { bild: "", gewinner: "" },
  ],

  battleRoyale: ["", "", "", ""],

  halbfinale1Gewinner:   "",
  halbfinale2Gewinner:   "",
  finaleGewinner:        "",
  kleinesFinaleGewinner: "",

  pvpPreis1: { preisText: "Blue Dragon Ring", preisIcon: "GoBattle_Icons/Ultras/20_Blue_Dragon_Ring.png" },
  pvpPreis2: { preisText: "", preisIcon: "" },
  pvpPreis3: { preisText: "", preisIcon: "" },
  pvpPreis4: { preisText: "", preisIcon: "" },

  pvpUltrare: [
    { bild: "", gewinner: "" },
    { bild: "", gewinner: "" },
    { bild: "", gewinner: "" },
  ],
};
