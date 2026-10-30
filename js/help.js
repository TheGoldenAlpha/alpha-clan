(function () {
  const LIST = typeof HELP !== "undefined" ? HELP : [];
  const KATS = typeof HELP_KATEGORIEN !== "undefined" ? HELP_KATEGORIEN : [];
  const STUFE = {
    easy:   { label: "EASY",   tag: "green",  rang: 1 },
    medium: { label: "MEDIUM", tag: "orange", rang: 2 },
    hard:   { label: "HARD",   tag: "red",    rang: 3 },
  };
  const PH = `<span class="ph">placeholder</span>`;

  const hatVideo = t => has(t.youtube) || has(t.video);
  const sekunden = t => {
    const m = String(t.dauer || "").match(/^(\d+):(\d{2})$/);
    return m ? +m[1] * 60 + +m[2] : null;
  };

  function stufe(t) {
    const s = STUFE[t.schwierigkeit];
    return s ? `<span class="tag ${s.tag}">${s.label}</span>` : "";
  }

  function sterne(t) {
    const r = typeof t.rating === "number" ? Math.max(0, Math.min(5, t.rating)) : null;
    let html = "";
    for (let i = 1; i <= 5; i++) {
      const full = r !== null && r >= i;
      const half = r !== null && !full && r >= i - 0.5;
      html += `<i class="${full ? "on" : half ? "half" : ""}"></i>`;
    }
    const text = r === null
      ? "No rating yet"
      : `${r.toFixed(1)} / 5${typeof t.stimmen === "number" ? ` · ${t.stimmen} votes` : ""}`;
    return `<span class="stars" aria-hidden="true">${html}</span><span class="rtext">${text}</span>`;
  }

  // ---------- Startansicht: Kategorien ----------
  $("kats").innerHTML = KATS.map(k => {
    const items = LIST.filter(t => t.kategorie === k.id);
    const videos = items.filter(hatVideo).length;
    return `
      <a class="kat" href="#${esc(k.id)}">
        <span class="kthumb${has(k.bild) ? "" : " empty"}">${has(k.bild) ? `<img src="${esc(k.bild)}" alt="" data-fallback>` : ""}</span>
        <span class="kinfo">
          <span class="ktitle">${esc(k.titel)}</span>
          <span class="ktext">${esc(k.text)}</span>
          <span class="kfoot">
            <span class="tag ${videos ? "gold" : "muted"}">${videos ? `${videos} VIDEO${videos === 1 ? "" : "S"}` : "COMING SOON"}</span>
            <span class="kgo">OPEN &rarr;</span>
          </span>
        </span>
      </a>`;
  }).join("");

  // ---------- Kategorie mit Filtern ----------
  const f = { q: "", diff: "all", video: false, sort: "default" };
  let kat = null;

  function card(t) {
    return `
      <a class="tcard${hatVideo(t) ? "" : " soon"}" href="#${esc(t.kategorie)}/${esc(t.id)}">
        <span class="tthumb${has(t.bild) ? "" : " empty"}">
          ${has(t.bild) ? `<img src="${esc(t.bild)}" alt="" loading="lazy" data-fallback>` : ""}
          <span class="play"></span>
          ${has(t.dauer) ? `<span class="dur">${esc(t.dauer)}</span>` : ""}
        </span>
        <span class="tinfo">
          <span class="ttitle">${esc(t.titel)}</span>
          <span class="tmeta">${stufe(t)}${hatVideo(t) ? "" : `<span class="tag muted">COMING SOON</span>`}</span>
          <span class="rating">${sterne(t)}</span>
        </span>
      </a>`;
  }

  function passt(t, ohne) {
    if (ohne !== "q" && f.q) {
      const text = [t.titel, t.untertitel, ...(t.tags || [])].join(" ").toLowerCase();
      if (!f.q.split(/\s+/).every(w => text.includes(w))) return false;
    }
    if (ohne !== "diff" && f.diff !== "all" && t.schwierigkeit !== f.diff) return false;
    if (f.video && !hatVideo(t)) return false;
    return true;
  }

  function sortiere(list) {
    const rang = t => (STUFE[t.schwierigkeit] || { rang: 9 }).rang;
    const nachName = (a, b) => String(a.titel).localeCompare(String(b.titel));
    const leerHinten = (a, b, wert, richtung) => {
      const x = wert(a), y = wert(b);
      if (x === null && y === null) return nachName(a, b);
      if (x === null) return 1;
      if (y === null) return -1;
      return (x - y) * richtung || nachName(a, b);
    };
    const by = {
      name:   nachName,
      easy:   (a, b) => rang(a) - rang(b) || nachName(a, b),
      hard:   (a, b) => (rang(b) % 9) - (rang(a) % 9) || nachName(a, b),
      rating: (a, b) => leerHinten(a, b, t => typeof t.rating === "number" ? t.rating : null, -1),
      short:  (a, b) => leerHinten(a, b, sekunden, 1),
      long:   (a, b) => leerHinten(a, b, sekunden, -1),
    }[f.sort];
    return by ? list.slice().sort(by) : list;
  }

  function chips(items) {
    const n = d => items.filter(t => passt(t, "diff") && (d === "all" || t.schwierigkeit === d)).length;
    return ["all", "easy", "medium", "hard"].map(d => {
      const label = d === "all" ? "ALL" : STUFE[d].label;
      const cls = d === "all" ? "" : ` ${STUFE[d].tag}`;
      const count = n(d);
      return `<button type="button" class="chip${cls}${f.diff === d ? " on" : ""}" data-diff="${d}"${count || f.diff === d ? "" : " disabled"} aria-pressed="${f.diff === d}">${label} <small>${count}</small></button>`;
    }).join("");
  }

  function zeichne() {
    if (!kat) return;
    const items = LIST.filter(t => t.kategorie === kat.id);
    const treffer = sortiere(items.filter(t => passt(t)));
    $("f-diff").innerHTML = chips(items);
    $("grid").innerHTML = treffer.map(card).join("");
    $("f-count").textContent = `${treffer.length} of ${items.length} tutorial${items.length === 1 ? "" : "s"}`;
    $("none").hidden = treffer.length > 0;
  }

  function reset() {
    Object.assign(f, { q: "", diff: "all", video: false, sort: "default" });
    $("f-q").value = "";
    $("f-video").checked = false;
    $("f-sort").value = "default";
  }

  $("f-q").addEventListener("input", e => { f.q = e.target.value.trim().toLowerCase(); zeichne(); });
  $("f-video").addEventListener("change", e => { f.video = e.target.checked; zeichne(); });
  $("f-sort").addEventListener("change", e => { f.sort = e.target.value; zeichne(); });
  $("f-diff").addEventListener("click", e => {
    const b = e.target.closest(".chip");
    if (b && !b.disabled) { f.diff = b.dataset.diff; zeichne(); }
  });
  $("f-reset").addEventListener("click", () => { reset(); zeichne(); });

  // ---------- Fenster ----------
  const dlg = $("tut");
  let offen = null;
  let perKlick = false;

  function ytId(url) {
    const m = String(url).match(/(?:youtu\.be\/|v=|embed\/|shorts\/|live\/)([\w-]{11})/);
    return m ? m[1] : "";
  }

  function video(t) {
    const id = ytId(t.youtube || "");
    if (id) {
      return `<iframe src="https://www.youtube-nocookie.com/embed/${id}?rel=0" title="${esc(t.titel)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    }
    if (has(t.video)) {
      return `<video src="${esc(t.video)}" controls playsinline preload="metadata"${has(t.bild) ? ` poster="${esc(t.bild)}"` : ""}></video>`;
    }
    return `
      <div class="vph">
        ${has(t.bild) ? `<img src="${esc(t.bild)}" alt="">` : ""}
        <span class="vph-label"><span class="play"></span>VIDEO COMING SOON</span>
      </div>`;
  }

  function liste(items) {
    return Array.isArray(items) && items.length
      ? items.map(s => `<li>${esc(s)}</li>`).join("")
      : `<li>${PH}</li><li>${PH}</li><li>${PH}</li>`;
  }

  function oeffne(t) {
    if (offen === t && dlg.open) return;
    offen = t;
    const k = KATS.find(x => x.id === t.kategorie);
    $("tut-video").innerHTML = video(t);
    $("tut-tags").innerHTML = `${k ? `<span class="tag gold">${esc(k.titel)}</span>` : ""}${stufe(t)}`;
    $("tut-title").textContent = t.titel || "Tutorial";
    $("tut-rating").innerHTML = sterne(t);
    $("tut-desc").innerHTML = has(t.beschreibung) ? esc(t.beschreibung) : `${has(t.untertitel) ? esc(t.untertitel) + ". " : ""}${PH}`;

    const infos = Object.assign({
      "Difficulty": STUFE[t.schwierigkeit] ? STUFE[t.schwierigkeit].label : null,
      "Video length": has(t.dauer) ? t.dauer + " min" : null,
    }, t.infos || {});
    $("tut-info").innerHTML = Object.entries(infos)
      .map(([key, v]) => `<div><dt>${esc(key)}</dt><dd>${v === null || v === "" ? PH : esc(v)}</dd></div>`)
      .join("");

    $("tut-steps").innerHTML = liste(t.schritte);
    $("tut-tips").innerHTML = liste(t.tipps);

    const yt = $("tut-yt");
    if (has(t.youtube)) {
      yt.href = t.youtube;
      yt.classList.remove("off");
    } else {
      yt.removeAttribute("href");
      yt.classList.add("off");
    }

    if (!dlg.open) dlg.showModal();
    dlg.scrollTop = 0;
  }

  function schliesse() {
    if (dlg.open) dlg.close();
  }

  dlg.addEventListener("close", () => {
    $("tut-video").innerHTML = "";
    if (!offen) return;
    const zurueck = "#" + offen.kategorie;
    offen = null;
    if (location.hash.indexOf("/") < 0) return;
    if (perKlick) history.back();
    else history.replaceState(null, "", zurueck);
    perKlick = false;
  });
  dlg.addEventListener("click", e => {
    if (e.target === dlg || e.target.closest(".tut-close")) schliesse();
  });
  document.addEventListener("click", e => {
    if (e.target.closest(".tcard")) perKlick = true;
  });

  // ---------- Ansicht je nach Adresse (#dungeons oder #dungeons/bloodmoon) ----------
  function route() {
    const [kId, tId] = decodeURIComponent(location.hash.slice(1)).split("/");
    const k = KATS.find(x => x.id === kId) || null;

    if (k !== kat) {
      if (k) reset();
      kat = k;
      $("view-home").hidden = !!k;
      $("view-kat").hidden = !k;
      $("top").hidden = !!k;
      if (k) {
        $("kat-title").textContent = k.titel;
        $("kat-text").textContent = k.text;
        document.title = `${k.titel} · ALPHA CLAN HELP`;
      } else {
        document.title = "ALPHA CLAN HELP";
      }
      zeichne();
      if (!tId) window.scrollTo(0, 0);
    }

    const t = k && LIST.find(x => x.id === tId && x.kategorie === k.id);
    if (t) {
      oeffne(t);
    } else {
      perKlick = false;
      offen = null;
      schliesse();
    }
  }

  window.addEventListener("hashchange", route);
  route();
  $("kontakt").textContent = typeof KONTAKT !== "undefined" ? KONTAKT : "";
})();
