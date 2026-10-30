(function () {
  const LIST = typeof HELP !== "undefined" ? HELP : [];
  const KATS = typeof HELP_KATEGORIEN !== "undefined" ? HELP_KATEGORIEN : [];
  const STUFE = {
    easy:   { label: "EASY",   tag: "green" },
    medium: { label: "MEDIUM", tag: "orange" },
    hard:   { label: "HARD",   tag: "red" },
  };
  const PH = `<span class="ph">placeholder</span>`;

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

  function thumb(t) {
    return has(t.bild)
      ? `<img src="${esc(t.bild)}" alt="" loading="lazy" data-fallback>`
      : "";
  }

  function card(t) {
    return `
      <button class="tcard${has(t.bild) ? "" : " soon"}" type="button" data-id="${esc(t.id)}">
        <span class="tthumb${has(t.bild) ? "" : " empty"}">${thumb(t)}<span class="play"></span></span>
        <span class="tinfo">
          <span class="ttitle">${esc(t.titel)}</span>
          <span class="tmeta">${stufe(t)}${has(t.bild) ? "" : `<span class="tag muted">COMING SOON</span>`}</span>
          <span class="rating">${sterne(t)}</span>
        </span>
      </button>`;
  }

  function section(k) {
    const items = LIST.filter(t => t.kategorie === k.id);
    return `
      <section class="kat" id="${esc(k.id)}">
        <div class="head"><h2>${esc(k.titel)}</h2></div>
        <p class="kat-text">${esc(k.text)}</p>
        <div class="tgrid">${items.length ? items.map(card).join("") : `<p class="kat-text">Coming soon.</p>`}</div>
      </section>`;
  }

  $("jump").innerHTML = KATS.map(k => `<a class="tag gold" href="#${esc(k.id)}">${esc(k.titel)}</a>`).join("");
  $("help").innerHTML = KATS.map(section).join("");
  $("kontakt").textContent = typeof KONTAKT !== "undefined" ? KONTAKT : "";

  // ---------- Fenster ----------
  const dlg = $("tut");

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
      return `<video src="${esc(t.video)}" controls preload="metadata"${has(t.bild) ? ` poster="${esc(t.bild)}"` : ""}></video>`;
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

  function open(t) {
    const kat = KATS.find(k => k.id === t.kategorie);
    $("tut-video").innerHTML = video(t);
    $("tut-tags").innerHTML = `${kat ? `<span class="tag gold">${esc(kat.titel)}</span>` : ""}${stufe(t)}`;
    $("tut-title").textContent = t.titel || "Tutorial";
    $("tut-rating").innerHTML = sterne(t);
    $("tut-desc").innerHTML = has(t.beschreibung) ? esc(t.beschreibung) : `${has(t.untertitel) ? esc(t.untertitel) + ". " : ""}${PH}`;

    const infos = Object.assign({ "Difficulty": STUFE[t.schwierigkeit] ? STUFE[t.schwierigkeit].label : null }, t.infos || {});
    $("tut-info").innerHTML = Object.entries(infos)
      .map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${v === null || v === "" ? PH : esc(v)}</dd></div>`)
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
    if (location.hash !== "#" + t.id) history.replaceState(null, "", "#" + t.id);
  }

  function close() {
    if (dlg.open) dlg.close();
  }

  dlg.addEventListener("close", () => {
    $("tut-video").innerHTML = "";
    if (LIST.some(t => "#" + t.id === location.hash)) history.replaceState(null, "", location.pathname + location.search);
  });
  dlg.addEventListener("click", e => {
    if (e.target === dlg || e.target.closest(".tut-close")) close();
  });

  $("help").addEventListener("click", e => {
    const b = e.target.closest(".tcard");
    const t = b && LIST.find(x => x.id === b.dataset.id);
    if (t) open(t);
  });

  function fromHash() {
    const t = LIST.find(x => "#" + x.id === location.hash);
    if (t) open(t);
  }
  window.addEventListener("hashchange", fromHash);
  fromHash();
})();
