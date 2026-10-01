function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function has(s) {
  return typeof s === "string" && s.trim() !== "";
}

function $(id) {
  return document.getElementById(id);
}

document.addEventListener("error", e => {
  const img = e.target;
  if (img.tagName === "IMG" && "fallback" in img.dataset) {
    img.parentNode.classList.add("empty");
    img.remove();
  }
}, true);

(function () {
  const btn = document.querySelector(".menu-btn");
  const nav = document.getElementById("nav");
  if (!btn || !nav) return;

  const setOpen = open => {
    nav.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", open);
  };

  btn.addEventListener("click", () => setOpen(!nav.classList.contains("open")));
  nav.addEventListener("click", e => { if (e.target.closest("a")) setOpen(false); });
  document.addEventListener("click", e => { if (!e.target.closest(".topbar")) setOpen(false); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") setOpen(false); });
  matchMedia("(min-width: 761px)").addEventListener("change", e => { if (e.matches) setOpen(false); });
})();
