/* ------- Basic config ------- */
const TEACHER_NAME = "Ms. Yandolino";
const SCHOOL_NAME  = "RECC • Kindergarten";
const SCHOOL_CALENDAR_URL = "https://www.bellmoreschools.org/o/recc";

/* ------- Starter data ------- */
let students = [
  "Aria Glenis","Blake Stein","Christopher Oakes","Cora Yakubovsky","Giovani Guidice",
  "Hazel Maksym","Ivy Ducharme","Johanna Rodriguez","Leonardo Cocuzzo","Nicko Glenis",
  "Olivia Barracca","RJ Cigna","Ryan Burstein","Sienna Bomparola","Zachary Maya"
];
students = [...new Set(students)].sort();

let events = [
  { title:"Welcome Breakfast", date:"2025-09-09", type:"Party", details:"Nut-free snacks welcome." }
];

/* ------- Helpers ------- */
const $ = s => document.querySelector(s);
const rosterEl   = $("#roster");
const newStudent = $("#new-student");
const eventsWrap = $("#events");

function renderHeader() {
  $("#teacherName").textContent = TEACHER_NAME;
  $("#schoolName").textContent = SCHOOL_NAME;
  $("#schoolCalendar").href = SCHOOL_CALENDAR_URL;
  $("#yy").textContent = new Date().getFullYear();
  document.title = `${SCHOOL_NAME} • ${TEACHER_NAME} — Class Mom Portal`;
}

/* ------- Roster ------- */
function renderRoster(){
  rosterEl.innerHTML = "";
  students.forEach(name=>{
    const li = document.createElement("li");
    li.className = "item";
    li.innerHTML = `
      <span>${name}</span>
      <button class="link danger" aria-label="Remove ${name}">Remove</button>
    `;
    li.querySelector("button").onclick = () => {
      students = students.filter(n => n !== name);
      renderRoster();
    };
    rosterEl.appendChild(li);
  });
}

function exportRoster(){
  const ws = XLSX.utils.json_to_sheet(students.map(s=>({Student:s})));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Roster");
  XLSX.writeFile(wb, "class_roster.xlsx");
}

/* ------- Events ------- */
function renderEvents(){
  eventsWrap.innerHTML = "";
  events.forEach((e, i)=>{
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
        <div class="grid-2">
          <div><label class="lbl">Snacks</label><input data-k="snacks" placeholder="Comma-separated names" /></div>
          <div><label class="lbl">Supplies</label><input data-k="supplies" placeholder="Comma-separated names" /></div>
          <div><label class="lbl">Volunteers</label><input data-k="volunteers" placeholder="Comma-separated names" /></div>
          <div><label class="lbl">Notes</label><input data-k="details" placeholder="Extra details" /></div>
        </div>
      </div>
    `;
    card.querySelector("[data-edit]").onclick = ()=>{
      card.querySelector(".signups").classList.toggle("hidden");
    };
    eventsWrap.appendChild(card);
  });
}

function addEvent(){
  const title = $("#ev-title").value.trim();
  const date  = $("#ev-date").value;
  const type  = $("#ev-type").value;
  const details = $("#ev-details").value.trim();
  if(!title || !date){ alert("Please add a title and date."); return; }
  events.push({title, date, type, details});
  $("#ev-title").value = ""; $("#ev-date").value = ""; $("#ev-details").value = "";
  renderEvents();
}

function exportEvents(){
  // Pull any visible signup inputs into the event objects
  [...document.querySelectorAll(".event-card")].forEach((card, i)=>{
    ["snacks","supplies","volunteers","details"].forEach(k=>{
      const input = card.querySelector(`input[data-k="${k}"]`);
      if(input && input.value.trim()){
        events[i][k] = k==="details" ? input.value.trim()
          : input.value.split(",").map(x=>x.trim()).filter(Boolean);
      }
    });
  });
  const data = events.map(e=>({
    Title:e.title, Date:e.date, Type:e.type,
    Details:e.details||"",
    Snacks:(e.snacks||[]).join(", "),
    Supplies:(e.supplies||[]).join(", "),
    Volunteers:(e.volunteers||[]).join(", "),
  }));
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Events");
  XLSX.writeFile(wb, "class_events.xlsx");
}

/* ------- Tabs ------- */
function setupTabs(){
  const tabs = [$("#tab-roster"), $("#tab-events")];
  const panels = [$("#panel-roster"), $("#panel-events")];

  tabs.forEach((tab, idx)=>{
    tab.addEventListener("click", ()=>{
      tabs.forEach((t,i)=>{
        t.classList.toggle("is-active", i===idx);
        t.setAttribute("aria-selected", i===idx ? "true" : "false");
        panels[i].classList.toggle("is-hidden", i!==idx);
      });
    });
  });
}

/* ------- Wire up ------- */
window.addEventListener("DOMContentLoaded", ()=>{
  renderHeader();
  setupTabs();

  // roster
  renderRoster();
  $("#export-roster").onclick = exportRoster;
  newStudent.addEventListener("keydown", e=>{
    if(e.key==="Enter"){
      const name = e.target.value.trim();
      if(!name) return;
      if(!students.includes(name)) {
        students.push(name);
        students = [...new Set(students)].sort();
        renderRoster();
      }
      e.target.value = "";
    }
  });

  // events
  renderEvents();
  $("#add-event").onclick = addEvent;
  $("#export-events").onclick = exportEvents;
});
