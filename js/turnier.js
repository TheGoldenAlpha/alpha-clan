(function () {
  const D = typeof DATEN !== "undefined" ? DATEN : {};

  const TBD  = '<span class="open">TBD</span>';
  const same = (a, b) => has(a) && has(b) && a.trim().toLowerCase() === b.trim().toLowerCase();
  const name = s => has(s) ? `<span class="name">${esc(s)}</span>` : TBD;
  const img  = (src, alt) => `<img src="${esc(src)}" alt="${esc(alt || "")}" data-fallback>`;

  function prize(p) {
    p = p || {};
    const text = has(p.preisText), icon = has(p.preisIcon);
    if (!text && !icon) return '<div class="prize empty"><div class="ico"></div><div class="txt"></div></div>';
    return `
      <div class="prize">
        <div class="ico${icon ? "" : " empty"}">${icon ? img(p.preisIcon, p.preisText) : ""}</div>
        <div class="txt">${esc(p.preisText)}</div>
      </div>`;
  }

  function ultrares(list) {
    list = list && list.length ? list : [{}, {}, {}];
    return list.map((u, k) => `
      <div class="item">
        <div class="box${has(u.bild) ? "" : " empty"}">${has(u.bild) ? img(u.bild, "Ultrare") : ""}</div>
        <span class="tag blue">Ultrare ${k + 1}</span>
        ${name(u.gewinner)}
      </div>`).join("");
  }

  // Termine pro Minigame
  const T = D.termine || {};
  [T.hideAndSeek, T.jumpAndRun, T.pvp].forEach((t, k) => {
    t = t || {};
    const n = k + 1, d = has(t.datum), u = has(t.uhrzeit);
    $("d" + n).innerHTML = d ? esc(t.datum) : TBD;
    $("t" + n).innerHTML = u ? esc(t.uhrzeit) : (d ? "Time TBD" : "");
    $("p" + n).textContent = d ? t.datum + (u ? " · " + t.uhrzeit : "") : "Date TBD";
    $("w" + n).innerHTML = `<span class="tag gold">WHEN</span><span>${d ? esc(t.datum) : "Date TBD"}${u ? " · " + esc(t.uhrzeit) : ""}</span>`;
  });

  $("hs").innerHTML = (D.hideAndSeek || []).map((r, k) => `
    <div class="hs-card${has(r.gefundenVon) ? " found" : ""}">
      <div class="no">#${k + 1}</div>
      <div><span class="lbl">Account</span>${name(r.account)}</div>
      <div><span class="lbl">Reward</span>${prize(r)}</div>
      <div class="finder"><span class="lbl">Found by</span>${name(r.gefundenVon)}</div>
    </div>`).join("");
  $("hsU").innerHTML = ultrares(D.hideAndSeekUltrare);

  function award(tag, badge, title, desc, p) {
    p = p || {};
    return `
      <div class="award">
        <span class="tag ${tag}">${badge}</span>
        <h4>${title}</h4>
        <div class="d">${desc}</div>
        ${prize(p)}
        <div class="who"><span class="lbl">Winner</span>${name(p.gewinner)}</div>
      </div>`;
  }

  $("jr").innerHTML =
    award("gold", "Fastest", "1st Place", "First to reach the finish", D.jumpErsterPlatz) +
    award("blue", "Level &lt; 150", "Best under Level 150", "First player under level 150 to reach the finish", D.jumpUnterLevel150);
  $("jrU").innerHTML = ultrares(D.jumpUltrare);

  const br = [0, 1, 2, 3].map(k => (D.battleRoyale || [])[k] || "");

  const decide = (a, b, w) => same(a, w) ? [a, b] : same(b, w) ? [b, a] : ["", ""];
  const [sf1Win, sf1Lose] = decide(br[0], br[3], D.halbfinale1Gewinner);
  const [sf2Win, sf2Lose] = decide(br[1], br[2], D.halbfinale2Gewinner);
  const [first, second]   = decide(sf1Win, sf2Win, D.finaleGewinner);
  const [third, fourth]   = decide(sf1Lose, sf2Lose, D.kleinesFinaleGewinner);

  function slot(n, seed, winner) {
    const state = has(winner) && has(n) ? (same(n, winner) ? " won" : " lose") : "";
    return `<div class="slot${state}"><span class="seed">${seed}</span>${name(n)}</div>`;
  }

  function match(title, a, seedA, b, seedB, winner, cls) {
    return `
      <div class="match ${cls || ""}">
        <div class="mh">${title}</div>
        ${slot(a, seedA, winner)}
        ${slot(b, seedB, winner)}
      </div>`;
  }

  $("bracket").innerHTML = `
    <div class="round">
      <h5>Battle Royale</h5>
      <div class="hint">Top 4 advance</div>
      <div class="match">
        <div class="mh">All vs all</div>
        ${br.map((n, k) => `<div class="slot${has(n) ? " adv" : ""}"><span class="seed">${k + 1}</span>${name(n)}</div>`).join("")}
      </div>
    </div>
    <div class="round">
      <h5>Semi-finals</h5>
      ${match("Semi-final 1 · 1 vs 4", br[0], "1", br[3], "4", sf1Win)}
      ${match("Semi-final 2 · 2 vs 3", br[1], "2", br[2], "3", sf2Win)}
    </div>
    <div class="round">
      <h5>Finals</h5>
      ${match("Final", sf1Win, "SF1", sf2Win, "SF2", first, "final")}
      ${match("3rd Place Match", sf1Lose, "SF1", sf2Lose, "SF2", third, "small")}
    </div>`;

  const podium = (place, cls, p, n) => `<div class="pod ${cls}"><div class="pl">${place}</div>${name(n)}${prize(p)}</div>`;
  $("podium").innerHTML =
    podium("1st", "p1", D.pvpPreis1, first) +
    podium("2nd", "p2", D.pvpPreis2, second) +
    podium("3rd", "p3", D.pvpPreis3, third) +
    podium("4th", "p4", D.pvpPreis4, fourth);
  $("pvpU").innerHTML = ultrares(D.pvpUltrare);

  const seconds = Number(D.autoNeuLaden) || 0;
  const KEY = "gobattle-scroll";
  const y = sessionStorage.getItem(KEY);
  if (y !== null) {
    window.scrollTo(0, +y);
    sessionStorage.removeItem(KEY);
  }
  if (seconds > 0) {
    setTimeout(() => {
      sessionStorage.setItem(KEY, window.scrollY);
      location.reload();
    }, seconds * 1000);
  }
})();
