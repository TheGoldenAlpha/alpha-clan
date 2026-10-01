(function () {
  const ICON_FOUNDER = '<svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true" shape-rendering="crispEdges"><path d="M6 0h2v2h2v2h2v2h-2v2h-2v4h2v2H4v-2h2V8H4V6H2V4h2V2h2z"/></svg>';
  const ICON_MOD     = '<svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true" shape-rendering="crispEdges"><path d="M1 1h12v6h-1v2h-1v1h-1v1H9v1H8v1H6v-1H5v-1H4v-1H3V9H2V7H1zm2 2v4h1v2h1v1h1v1h2v-1h1V9h1V7h1V3z"/></svg>';

  const middle = name => name.replace(/^The\s+/i, "").replace(/\s+Alpha$/i, "").trim();

  function member(m) {
    const founder = m.rolle === "founder";
    const name = String(m.name || "").trim();
    const title = /^The\s.+\sAlpha$/i.test(name)
      ? `The <em>${esc(middle(name))}</em> Alpha`
      : esc(name);
    const picture = has(m.bild)
      ? `<img src="${esc(m.bild)}" alt="${esc(name)}">`
      : `<div class="ph"><b>${esc((middle(name)[0] || "A").toUpperCase())}</b><small>HEAD</small></div>`;
    const text = has(m.text)
      ? `<p class="say">${esc(m.text)}</p>`
      : `<p class="say empty">Text coming soon</p>`;

    return `
      <article class="tm ${founder ? "founder" : "mod"}">
        <div class="frame"><div class="in">${picture}</div></div>
        <span class="crown">${founder ? ICON_FOUNDER + "FOUNDER" : ICON_MOD + "MODERATOR"}</span>
        <h3>${title}</h3>
        <span class="idp">ID ${esc(m.id)}</span>
        ${text}
      </article>`;
  }

  const team = typeof TEAM !== "undefined" ? TEAM : [];
  $("founder").innerHTML = team.filter(m => m.rolle === "founder").map(member).join("");
  $("mods").innerHTML    = team.filter(m => m.rolle !== "founder").map(member).join("");

  const count = typeof ANZAHL_MEMBER !== "undefined" ? String(ANZAHL_MEMBER) : "";
  if (has(count)) $("stat").innerHTML = `<b>${esc(count)}</b> Alphas and counting`;
})();

(function () {
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const VERTEX = `
    attribute vec2 p;
    varying vec2 uv;
    void main() {
      uv = vec2(p.x * .5 + .5, .5 - p.y * .5);
      gl_Position = vec4(p, 0., 1.);
    }`;

  const FRAGMENT = `
    precision mediump float;
    uniform sampler2D tex;
    varying vec2 uv;
    void main() {
      vec3 color = texture2D(tex, vec2(uv.x, uv.y * .5)).rgb;
      float alpha = texture2D(tex, vec2(uv.x, .5 + uv.y * .5)).r;
      alpha = smoothstep(.15, .85, alpha) * smoothstep(0., .14, uv.y);
      gl_FragColor = vec4(color * alpha, alpha);
    }`;

  function shader(gl, type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  }

  function fighter(box) {
    const src = box.dataset.src;
    if (!has(src)) return;

    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true });
    if (!gl) return;

    const video = document.createElement("video");
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.preload = "auto";
    video.src = src;
    video.style.cssText = "position:absolute;width:1px;height:1px;opacity:0;pointer-events:none";

    const program = gl.createProgram();
    gl.attachShader(program, shader(gl, gl.VERTEX_SHADER, VERTEX));
    gl.attachShader(program, shader(gl, gl.FRAGMENT_SHADER, FRAGMENT));
    gl.linkProgram(program);
    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    function draw() {
      if (video.readyState < 2) return;
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    const perFrame = "requestVideoFrameCallback" in video;
    function loop() {
      draw();
      if (video.paused) return;
      perFrame ? video.requestVideoFrameCallback(loop) : requestAnimationFrame(loop);
    }

    video.addEventListener("loadedmetadata", () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight / 2;
      gl.viewport(0, 0, canvas.width, canvas.height);
      const ground = parseFloat(box.dataset.ground) || 0;
      canvas.style.transform = `translateY(${ground * 100}%)`;
    });
    video.addEventListener("loadeddata", () => {
      box.classList.remove("empty");
      draw();
    });
    video.addEventListener("play", loop);

    box.append(canvas, video);

    if (still) return;
    new IntersectionObserver(([e]) => {
      e.isIntersecting ? video.play().catch(() => {}) : video.pause();
    }, { rootMargin: "200px" }).observe(box);
  }

  document.querySelectorAll(".fighter").forEach(fighter);
})();

// Ziegel der Arena-Steine genau auf das 36px-Raster vom Footer ausrichten
(function () {
  function align() {
    document.querySelectorAll(".stone, .block").forEach(el => {
      const x = Math.round(el.getBoundingClientRect().left + window.scrollX);
      const off = -(((x % 36) + 36) % 36);
      el.style.backgroundPosition = `left top, ${off}px bottom, ${off}px bottom`;
    });
  }
  align();
  addEventListener("resize", align);
  addEventListener("load", align);
})();
