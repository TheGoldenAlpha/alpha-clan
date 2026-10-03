const DATEN = {

  // Jedes Minigame hat sein eigenes Datum und seine eigene Uhrzeit.
  // Leer lassen ("") = es wird "TBD" angezeigt.
  termine: {
    jumpAndRun:  { datum: "Sun, 18 Oct 2026", uhrzeit: "7:30 PM" },
    hideAndSeek: { datum: "Sun, 25 Oct 2026", uhrzeit: "7:30 PM" },
    pvp:         { datum: "Sun, 1 Nov 2026",  uhrzeit: "7:30 PM" },
  },

  autoNeuLaden: 60,

  hideAndSeek: [
    { account: "", preisText: "Red Dragon Ring", preisIcon: "GoBattle_Icons/Ultras/21_Red_Dragon_Ring.png", gefundenVon: "" },
    { account: "", preisText: "Epic Instant Defense Cloak", preisIcon: "GoBattle_Icons/Ultras/27_Epic_Instant_Defense_Cloak.png", gefundenVon: "" },
    { account: "", preisText: "", preisIcon: "", gefundenVon: "" },
    { account: "", preisText: "", preisIcon: "", gefundenVon: "" },
  ],
  // text = Name unter dem Bild (z.B. "2x Invincibility Potion")
  hideAndSeekUltrare: [
    { text: "2x Invincibility Potion", bild: "GoBattle_Icons/Ultras/32_Invincibility_Potion.png", gewinner: "" },
    { text: "Hermes Boots", bild: "GoBattle_Icons/Ultras/30_Hermes_Boots.png", gewinner: "" },
    { text: "Extreme Invisibility Cloak", bild: "GoBattle_Icons/Ultras/31_Extreme_Invisibility_Cloak.png", gewinner: "" },
  ],

  jumpErsterPlatz:     { preisText: "Greed's Grip (Level 1)", preisIcon: "GoBattle_Icons/Relics/Greeds_Grip.png", gewinner: "" },
  jumpUnterLevel150:   { preisText: "Inferno Touch (Level 1)", preisIcon: "GoBattle_Icons/Relics/Inferno_Touch.png", gewinner: "" },
  jumpUltrare: [
    { text: "2x Invincibility Potion", bild: "GoBattle_Icons/Ultras/32_Invincibility_Potion.png", gewinner: "" },
    { text: "Hermes Boots", bild: "GoBattle_Icons/Ultras/30_Hermes_Boots.png", gewinner: "" },
    { text: "Normal Invisibility", bild: "GoBattle_Icons/Ultras/29_Normal_Invisibility.png", gewinner: "" },
  ],

  battleRoyale: ["", "", "", ""],

  halbfinale1Gewinner:   "",
  halbfinale2Gewinner:   "",
  finaleGewinner:        "",
  kleinesFinaleGewinner: "",

  pvpPreis1: { preisText: "Blue Dragon Ring", preisIcon: "GoBattle_Icons/Ultras/20_Blue_Dragon_Ring.png" },
  pvpPreis2: { preisText: "Inferno Touch", preisIcon: "GoBattle_Icons/Relics/Inferno_Touch.png" },
  // Mehrere Items: preisIcon als Liste [ "...", "..." ]
  pvpPreis3: { preisText: "Venom Cloak + Hermes Boots", preisIcon: ["GoBattle_Icons/Ultras/28_Venom_Cloak.png", "GoBattle_Icons/Ultras/30_Hermes_Boots.png"] },
  pvpPreis4: { preisText: "Normal Invisibility", preisIcon: "GoBattle_Icons/Ultras/29_Normal_Invisibility.png" },

  pvpUltrare: [
    { text: "Extreme Invisibility Cloak", bild: "GoBattle_Icons/Ultras/31_Extreme_Invisibility_Cloak.png", gewinner: "" },
    { text: "Hermes Boots", bild: "GoBattle_Icons/Ultras/30_Hermes_Boots.png", gewinner: "" },
    { text: "Normal Invisibility", bild: "GoBattle_Icons/Ultras/29_Normal_Invisibility.png", gewinner: "" },
  ],
};
