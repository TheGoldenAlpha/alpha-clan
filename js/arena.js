// Spielt Greenscreen-Videos (oben Bild, unten Maske) transparent ab. Kopie aus home.js.
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
      alpha = smoothstep(.15, .85, alpha);
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
    let seen = false;
    new IntersectionObserver(([e]) => {
      seen = e.isIntersecting;
      seen ? video.play().catch(() => {}) : video.pause();
    }, { rootMargin: "200px" }).observe(box);

    // Nach dem Zurueck-Pfeil im Browser (Seite kommt aus dem Speicher) wieder abspielen
    const resume = () => {
      if (seen && document.visibilityState === "visible") video.play().catch(() => {});
    };
    addEventListener("pageshow", resume);
    document.addEventListener("visibilitychange", resume);
  }

  document.querySelectorAll(".fighter").forEach(fighter);
})();
