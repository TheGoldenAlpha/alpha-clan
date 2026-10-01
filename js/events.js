(function () {
  const STATUS = {
    live:   { label: "LIVE",     tag: "red"   },
    soon:   { label: "SOON",     tag: "blue"  },
    done:   { label: "FINISHED", tag: "green" },
    locked: { label: "LOCKED",   tag: "muted" },
  };

  function card(e) {
    const status = STATUS[e.status] ? e.status : "soon";
    const { label, tag } = STATUS[status];
    const highlight = status === "live" || status === "soon" ? " feat" : "";

    const thumb = has(e.bild)
      ? `<img src="${esc(e.bild)}" alt="">`
      : `<span>${esc(e.nummer || "?")}</span>`;
    const button = has(e.link)
      ? `<a class="btn" href="${esc(e.link)}">${status === "done" ? "RESULTS" : "OPEN"} &rarr;</a>`
      : `<span class="btn off">SOON</span>`;

    return `
      <article class="card event ${status}${highlight}">
        <div class="top">
          <div class="thumb">${thumb}</div>
          <span class="tag ${tag}">${status === "live" ? "<i></i>" : ""}${label}</span>
        </div>
        <h3 class="ctitle">${esc(e.titel || "Event")}</h3>
        <div class="date">${has(e.datum) ? esc(e.datum) : "Date TBD"}</div>
        <p class="desc">${esc(e.beschreibung)}</p>
        ${button}
      </article>`;
  }

  $("grid").innerHTML = (typeof EVENTS !== "undefined" ? EVENTS : []).map(card).join("") +
    `<div class="watcher" aria-hidden="true"><img src="images/golden-alpha-links.webp" alt=""></div>`;
  $("kontakt").textContent = typeof KONTAKT !== "undefined" ? KONTAKT : "";
})();
