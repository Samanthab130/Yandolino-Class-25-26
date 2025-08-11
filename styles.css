// ----- Config -----
const SCHOOL_SHORT = "RECC";
const TEACHER_NAME = "Ms. Yandolino";
const SCHOOL_CALENDAR_URL = "https://www.bellmoreschools.org/o/recc";

// Initial data (edit anytime)
let students = [
  "Aria Glenis","Blake Stein","Christopher Oakes","Cora Yakubovsky","Giovani Guidice",
  "Hazel Maksym","Ivy Ducharme","Johanna Rodriguez","Leonardo Cocuzzo","Nicko Glenis",
  "Olivia Barracca","RJ Cigna","Ryan Burstein","Sienna Bomparola","Zachary Maya"
].sort();

let events = [
  { title: "Welcome Breakfast", date: "2025-09-09", type: "Party", details: "Nut-free snacks." }
];

// ----- Helpers -----
const $ = sel => document.querySelector(sel);
const rosterEl = $("#roster");
const newStudentEl = $("#new-student");
const eventsWrap = $("#events");

function renderRoster() {
  rosterEl.innerHTML = "";
  students.forEach(s => {
    const li = document.createElement("li");
    li.className = "item";
    li.innerHTML = `
      <span>${s}</span>
      <button class="link danger" aria-label="Remove ${s}">Remove</button>
    `;
    li.querySelector("button").onclick = () => {
      students = students.filter(n => n !== s);
      renderRoster();
    };
    rosterEl.appendChild(li);
  });
}

function renderEvents() {
  eventsWrap.innerHTML = "";
  events.forEach((e, idx) => {
    const card = document.createElement("div");
    card.className = "event-card";
    card.innerHTML = `
      <div class="event-top">
        <div>
          <div class="event-title">${e.title}</div>
          <div class="event-sub">${e.date} • ${e.type}</div>
        </div>
        <button class="btn sm" data-edit>Edit sign-ups</button>
      </div>
      <div class="event-details">${e.details || ""}</div>
      <div class="signups hidden">
        <div class="grid-3">
          <div><label class="lbl">Snacks</label><input data-k="snacks" placeholder="Comma-separated names" /></div>
          <div><label class="lbl">Supplies</label><input data-k="supplies" placeholder="Comma-separated names" /></div>
          <div><label class="lbl">Volunteers</label><input data-k="volunteers" placeholder="Comma-separated names" /></div>
        </div>
      </div>
    `;
    // toggle editor
    card.querySelector("[data-edit]").onclick = () => {
      card.querySelector(".signups").classList.toggle("hidden");
    };
    eventsWrap.appendChild(card);
  });
}

function exportRoster() {
  const data = students.map(s => ({ Student: s }));
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Roster");
  XLSX.writeFile(wb, "class_roster.xlsx");
}

function exportEvents() {
  // Collect visible signup inputs into the events objects (best-effort)
  const cards = [...document.querySelectorAll(".event-card")];
  cards.forEach((card, i) => {
    ["snacks","supplies","volunteers"].forEach(k => {
      const input = card.querySelector(`input[data-k="${k}"]`);
      if (!input) return;
      const val = input.value.trim();
      if (val) events[i][k] = val.split(",").map(x => x.trim()).filter(Boolean);
    });
  });
  const data = events.map(e => ({
    Title: e.title, Date: e.date, Type: e.type,
    Details: e.details || "",
    Snacks: (e.snacks || []).join(", "),
    Supplies: (e.supplies || []).join(", "),
    Volunteers: (e.volunteers || []).join(", ")
  }));
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Events");
  XLSX.writeFile(wb, "class_events.xlsx");
}

// ----- Wire up UI -----
window.addEventListener("DOMContentLoaded", () => {
  // Header bits
  document.title = `${SCHOOL_SHORT} • ${TEACHER_NAME} — Class Mom Portal`;
  $("#yy").textContent = new Date().getFullYear();
  document.querySelector('.topbar a.btn').href = SCHOOL_CALENDAR_URL;

  // Roster
  renderRoster();
  newStudentEl.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      const name = e.target.value.trim();
      if (name && !students.includes(name)) {
        students.push(name);
        students = [...new Set(students)].sort();
        e.target.value = "";
        renderRoster();
      }
    }
  });
  $("#export-roster").onclick = exportRoster;

  // Events
  $("#add-event").onclick = () => {
    const title = $("#ev-title").value.trim();
    const date = $("#ev-date").value;
    const type = $("#ev-type").value;
    const details = $("#ev-details").value.trim();
    if (!title || !date) return alert("Please add a title and date.");
    events.push({ title, date, type, details });
    $("#ev-title").value = "";
    $("#ev-date").value = "";
    $("#ev-details").value = "";
    renderEvents();
  };
  $("#export-events").onclick = exportEvents;

  renderEvents();
});
