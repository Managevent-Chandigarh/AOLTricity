/* Art of Living — upcoming events listing.
   Plain JavaScript, no dependencies. Centers/events data lives in data.js. */

const EVENT_TYPES = {
  "satsang": { label: "Satsang" },
  "long-kriya": { label: "Long Kriya" },
  "knowledge-session": { label: "Knowledge Session" },
  "janmashtami": { label: "Janmashtami" },
};

const DEFAULT_DURATION_MIN = 90;
const WEEKLY_WEEKS_AHEAD = 12;

const centerById = new Map(CENTERS.map(c => [c.id, c]));

const state = {
  center: "all",
  types: new Set(), // selected type filters; an event must have ALL of them. Empty = show all.
  q: "",
  groupBy: "date",
};

/* ---------- building the list of upcoming occurrences ---------- */

function nextWeeklyOccurrence(day, time, from) {
  const [h, m] = time.split(":").map(Number);
  const d = new Date(from);
  d.setHours(h, m, 0, 0);
  d.setDate(d.getDate() + ((day - d.getDay() + 7) % 7));
  if (d <= from) d.setDate(d.getDate() + 7);
  return d;
}

function eventDurationMs(ev) {
  return (ev.durationMin || DEFAULT_DURATION_MIN) * 60 * 1000;
}

// "type" accepts a single value or an array, e.g. type: ["satsang", "knowledge-session"]
function eventTypes(ev) {
  const list = Array.isArray(ev.type) ? ev.type : [ev.type];
  const known = [...new Set(list.filter(t => EVENT_TYPES[t]))];
  for (const t of list) {
    if (!EVENT_TYPES[t]) console.warn(`Event "${ev.id}": unknown type "${t}" — ignored`);
  }
  return known;
}

function allOccurrences() {
  const now = new Date();
  const out = [];
  for (const ev of EVENTS) {
    const center = centerById.get(ev.centerId);
    if (!center) { console.warn(`Event "${ev.id}": unknown centerId "${ev.centerId}" — skipped`); continue; }
    const types = eventTypes(ev);
    if (!types.length) { console.warn(`Event "${ev.id}": needs a known "type" — skipped`); continue; }

    if (ev.weekly) {
      let d = nextWeeklyOccurrence(ev.weekly.day, ev.weekly.time, now);
      for (let i = 0; i < WEEKLY_WEEKS_AHEAD; i++) {
        out.push({ ev, center, types, start: new Date(d), end: new Date(d.getTime() + eventDurationMs(ev)) });
        d = new Date(d.getTime() + 7 * 24 * 60 * 60 * 1000);
      }
    } else if (ev.start) {
      const start = new Date(ev.start);
      const end = ev.end ? new Date(ev.end) : new Date(start.getTime() + eventDurationMs(ev));
      if (end > now) out.push({ ev, center, types, start, end });
    }
  }
  out.sort((a, b) => a.start - b.start);
  return out;
}

/* ---------- filtering ---------- */

function matches(occ) {
  if (state.center !== "all" && occ.center.id !== state.center) return false;
  for (const t of state.types) {
    if (!occ.types.includes(t)) return false;
  }
  if (state.q) {
    const hay = [
      occ.ev.title, occ.ev.description, occ.ev.host,
      occ.center.name, occ.center.address,
      occ.types.map(t => EVENT_TYPES[t].label).join(" "),
    ].join(" ").toLowerCase();
    if (!hay.includes(state.q)) return false;
  }
  return true;
}

/* ---------- rendering ---------- */

const esc = s => String(s ?? "").replace(/[&<>"']/g, ch =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));

const dayKey = d => d.toDateString();
const dayLabelFmt = new Intl.DateTimeFormat(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
const cardDateFmt = new Intl.DateTimeFormat(undefined, { weekday: "short", day: "numeric", month: "short" });
const timeFmt = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" });

function relativeChip(occ) {
  const now = new Date();
  if (now >= occ.start && now <= occ.end) return `<span class="pill live">● Happening now</span>`;
  const tomorrow = new Date(now.getTime() + 86400000);
  if (dayKey(occ.start) === dayKey(now)) return `<span class="pill today">Today</span>`;
  if (dayKey(occ.start) === dayKey(tomorrow)) return `<span class="pill">Tomorrow</span>`;
  return "";
}

function cardHTML(occ) {
  const c = occ.center;
  const badges = occ.types.map(t => `<span class="badge badge-${t}">${EVENT_TYPES[t].label}</span>`).join("");
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.address || c.name)}`;
  return `
  <article class="card type-${occ.types[0]}">
    <div class="card-top">
      ${badges}
      ${relativeChip(occ)}
    </div>
    <h3 class="card-title">${esc(occ.ev.title)}</h3>
    <p class="card-when">🗓 ${cardDateFmt.format(occ.start)} · ${timeFmt.format(occ.start)} – ${timeFmt.format(occ.end)}</p>
    <p class="card-where">📍 <strong>${esc(c.name)}</strong>${c.address ? ` — ${esc(c.address)}` : ""}</p>
    ${occ.ev.host ? `<p class="card-host">👤 ${esc(occ.ev.host)}</p>` : ""}
    ${occ.ev.description ? `<p class="card-desc">${esc(occ.ev.description)}</p>` : ""}
    <div class="card-actions">
      <a class="btn btn-ghost" href="${mapUrl}" target="_blank" rel="noopener">Directions</a>
      ${c.phone ? `<a class="btn btn-ghost" href="tel:${esc(c.phone.replace(/\s+/g, ""))}">Call</a>` : ""}
    </div>
  </article>`;
}

function emptyHTML() {
  return `<div class="empty">
    <div class="lotus">🙏</div>
    <p>No upcoming events match your filters.</p>
    <button type="button" id="clear-filters" class="btn">Clear filters</button>
  </div>`;
}

function groupedByDate(occs) {
  const groups = new Map();
  for (const o of occs) {
    const k = dayKey(o.start);
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(o);
  }
  let html = "";
  for (const items of groups.values()) {
    html += `<h2 class="group-heading">${dayLabelFmt.format(items[0].start)}</h2><div class="card-grid">`;
    for (const o of items) html += cardHTML(o);
    html += `</div>`;
  }
  return html || emptyHTML();
}

function groupedByCenter(occs) {
  const groups = new Map();
  for (const o of occs) {
    if (!groups.has(o.center.id)) groups.set(o.center.id, []);
    groups.get(o.center.id).push(o);
  }
  const ordered = [...groups.values()].sort((a, b) => a[0].start - b[0].start);
  let html = "";
  for (const items of ordered) {
    const c = items[0].center;
    html += `<h2 class="group-heading">${esc(c.name)} <span class="group-sub">· ${items.length} upcoming</span></h2>`;
    if (c.address) html += `<p class="group-address">📍 ${esc(c.address)}</p>`;
    html += `<div class="card-grid">`;
    for (const o of items) html += cardHTML(o);
    html += `</div>`;
  }
  return html || emptyHTML();
}

function render() {
  const occs = allOccurrences().filter(matches);
  document.getElementById("result-count").textContent = occs.length
    ? `${occs.length} upcoming ${occs.length === 1 ? "event" : "events"}`
    : "";
  document.getElementById("listings").innerHTML =
    state.groupBy === "date" ? groupedByDate(occs) : groupedByCenter(occs);
}

/* ---------- controls ---------- */

function populateCenterSelect() {
  const sel = document.getElementById("center-select");
  for (const c of [...CENTERS].sort((a, b) => a.name.localeCompare(b.name))) {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = c.name;
    sel.appendChild(opt);
  }
}

function buildTypeChips() {
  const row = document.getElementById("type-chips");
  for (const [key, t] of Object.entries(EVENT_TYPES)) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = `chip chip-${key}`;
    b.dataset.type = key;
    b.textContent = t.label;
    row.appendChild(b);
  }
}

function resetFilters() {
  state.center = "all";
  state.q = "";
  state.types = new Set();
  document.getElementById("search").value = "";
  document.getElementById("center-select").value = "all";
  document.querySelectorAll("#type-chips .chip").forEach(c => c.classList.remove("active"));
  render();
}

function wireControls() {
  document.getElementById("search").addEventListener("input", e => {
    state.q = e.target.value.trim().toLowerCase();
    render();
  });

  document.getElementById("center-select").addEventListener("change", e => {
    state.center = e.target.value;
    render();
  });

  document.getElementById("type-chips").addEventListener("click", e => {
    const chip = e.target.closest("[data-type]");
    if (!chip) return;
    const t = chip.dataset.type;
    if (state.types.has(t)) state.types.delete(t);
    else state.types.add(t);
    chip.classList.toggle("active", state.types.has(t));
    render();
  });

  document.querySelectorAll("[data-group]").forEach(btn => btn.addEventListener("click", () => {
    state.groupBy = btn.dataset.group;
    document.querySelectorAll("[data-group]").forEach(b => b.classList.toggle("active", b === btn));
    render();
  }));

  document.getElementById("listings").addEventListener("click", e => {
    if (e.target.closest("#clear-filters")) resetFilters();
  });
}

function init() {
  populateCenterSelect();
  buildTypeChips();
  wireControls();
  render();
  setInterval(render, 60 * 1000); // keep "Today"/"Happening now" fresh
}

document.addEventListener("DOMContentLoaded", init);
