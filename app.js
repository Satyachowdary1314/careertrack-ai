"use strict";

const STORAGE_KEY = "careertrack-ai-applications";
const THEME_KEY = "careertrack-ai-theme";
const STATUSES = ["Saved", "Applied", "Interview", "Offer", "Rejected"];

const elements = {
  list: document.querySelector("#applications-list"),
  empty: document.querySelector("#empty-state"),
  noResults: document.querySelector("#no-results"),
  dialog: document.querySelector("#application-dialog"),
  form: document.querySelector("#application-form"),
  search: document.querySelector("#search-input"),
  filter: document.querySelector("#status-filter"),
  chart: document.querySelector("#status-chart"),
  calendar: document.querySelector("#calendar-grid"),
  calendarLabel: document.querySelector("#calendar-month-label"),
  toast: document.querySelector("#toast")
};

let applications = loadApplications();
let calendarMonth = new Date();
calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
let toastTimeout;

function loadApplications() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    console.error("Could not read saved applications:", error);
    return [];
  }
}

function saveApplications() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
  } catch (error) {
    showToast("Could not save data. Check your browser storage settings.");
    console.error("Could not save applications:", error);
  }
}

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}

function statusClass(status) {
  return String(status || "Saved").toLowerCase().replace(/[^a-z]/g, "");
}

function formatDate(value) {
  if (!value) return "—";
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return "—";
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function todayISO() {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

function render() {
  renderApplications();
  renderStats();
  renderChart();
  renderCalendar();
}

function renderApplications() {
  const query = elements.search.value.trim().toLowerCase();
  const selectedStatus = elements.filter.value;

  const filtered = applications
    .filter(application => {
      const searchable = [
        application.company,
        application.role,
        application.recruiter,
        application.salary
      ].join(" ").toLowerCase();
      return searchable.includes(query);
    })
    .filter(application => selectedStatus === "All" || application.status === selectedStatus)
    .sort((a, b) => (b.dateApplied || "").localeCompare(a.dateApplied || ""));

  elements.list.innerHTML = filtered.map(application => {
    const company = escapeHTML(application.company || "Untitled company");
    const role = escapeHTML(application.role || "Role not specified");
    const initial = escapeHTML((application.company || "?").trim().charAt(0).toUpperCase());
    const salary = escapeHTML(application.salary || "—");
    const recruiter = escapeHTML(application.recruiter || "—");
    const status = STATUSES.includes(application.status) ? application.status : "Saved";

    return `
      <tr>
        <td>
          <div class="company-cell">
            <span class="company-logo">${initial}</span>
            <span>
              <span class="company-name">${company}</span>
              <span class="role-name">${role}</span>
            </span>
          </div>
        </td>
        <td class="salary-cell">${salary}</td>
        <td>${formatDate(application.dateApplied)}</td>
        <td><span class="status-badge status-${statusClass(status)}">${escapeHTML(status)}</span></td>
        <td class="recruiter-cell">${recruiter}</td>
        <td>
          <div class="row-actions">
            <button class="row-action" type="button" data-action="edit" data-id="${escapeHTML(application.id)}" aria-label="Edit ${company}" title="Edit">✎</button>
            <button class="row-action delete" type="button" data-action="delete" data-id="${escapeHTML(application.id)}" aria-label="Delete ${company}" title="Delete">×</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");

  const hasApplications = applications.length > 0;
  elements.empty.hidden = hasApplications;
  elements.noResults.hidden = !hasApplications || filtered.length > 0;
  elements.list.closest("table").hidden = !hasApplications || filtered.length === 0;
}

function renderStats() {
  const total = applications.length;
  const interviews = applications.filter(item => item.status === "Interview").length;
  const offers = applications.filter(item => item.status === "Offer").length;
  const responses = interviews + offers;
  const responseRate = total ? Math.round((responses / total) * 100) : 0;

  document.querySelector("#stat-total").textContent = total;
  document.querySelector("#stat-interviews").textContent = interviews;
  document.querySelector("#stat-offers").textContent = offers;
  document.querySelector("#stat-response").textContent = `${responseRate}%`;
}

function renderChart() {
  const counts = Object.fromEntries(STATUSES.map(status => [
    status,
    applications.filter(item => item.status === status).length
  ]));
  const maximum = Math.max(1, ...Object.values(counts));

  if (!applications.length) {
    elements.chart.innerHTML = `<p class="chart-empty">Add an application to see your pipeline.</p>`;
    return;
  }

  elements.chart.innerHTML = STATUSES.map(status => {
    const count = counts[status];
    const width = count ? Math.max(5, (count / maximum) * 100) : 0;
    return `
      <div class="chart-row">
        <span class="chart-label">${status}</span>
        <div class="chart-track"><div class="chart-bar ${statusClass(status)}" style="width:${width}%"></div></div>
        <span class="chart-count">${count}</span>
      </div>
    `;
  }).join("");
}

function renderCalendar() {
  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();
  elements.calendarLabel.textContent = calendarMonth.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric"
  });

  const firstDay = new Date(year, month, 1);
  const mondayFirstOffset = (firstDay.getDay() + 6) % 7;
  const gridStart = new Date(year, month, 1 - mondayFirstOffset);
  const today = todayISO();
  const interviewDates = new Set(
    applications
      .filter(application => application.interviewDate)
      .map(application => application.interviewDate)
  );

  const cells = [];
  for (let index = 0; index < 42; index++) {
    const day = new Date(gridStart);
    day.setDate(gridStart.getDate() + index);
    const dateString = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;
    const classes = ["calendar-day"];
    if (day.getMonth() !== month) classes.push("muted");
    if (dateString === today) classes.push("today");
    if (interviewDates.has(dateString)) classes.push("has-interview");

    cells.push(`<span class="${classes.join(" ")}" ${interviewDates.has(dateString) ? `title="Interview scheduled: ${formatDate(dateString)}"` : ""}>${day.getDate()}</span>`);
  }

  elements.calendar.innerHTML = cells.join("");
}

function openDialog(application = null) {
  elements.form.reset();
  document.querySelector("#application-id").value = "";
  document.querySelector("#dialog-title").textContent = application ? "Edit application" : "Add application";
  document.querySelector("#save-button").textContent = application ? "Save changes" : "Save application";

  if (application) {
    document.querySelector("#application-id").value = application.id;
    document.querySelector("#company-input").value = application.company || "";
    document.querySelector("#role-input").value = application.role || "";
    document.querySelector("#salary-input").value = application.salary || "";
    document.querySelector("#recruiter-input").value = application.recruiter || "";
    document.querySelector("#date-input").value = application.dateApplied || "";
    document.querySelector("#status-input").value = STATUSES.includes(application.status) ? application.status : "Saved";
    document.querySelector("#interview-date-input").value = application.interviewDate || "";
    document.querySelector("#job-link-input").value = application.jobLink || "";
    document.querySelector("#notes-input").value = application.notes || "";
  } else {
    document.querySelector("#date-input").value = todayISO();
    document.querySelector("#status-input").value = "Applied";
  }

  elements.dialog.showModal();
  document.querySelector("#company-input").focus();
}

function closeDialog() {
  elements.dialog.close();
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("visible");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => elements.toast.classList.remove("visible"), 2600);
}

function downloadCSV() {
  if (!applications.length) {
    showToast("Add an application before exporting.");
    return;
  }

  const columns = [
    ["Company", "company"],
    ["Role", "role"],
    ["Salary", "salary"],
    ["Recruiter", "recruiter"],
    ["Date Applied", "dateApplied"],
    ["Status", "status"],
    ["Interview Date", "interviewDate"],
    ["Job Link", "jobLink"],
    ["Notes", "notes"]
  ];

  const escapeCSV = value => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const rows = [
    columns.map(([label]) => escapeCSV(label)).join(","),
    ...applications.map(application =>
      columns.map(([, key]) => escapeCSV(application[key])).join(",")
    )
  ];

  const blob = new Blob(["\uFEFF" + rows.join("\r\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `careertrack-applications-${todayISO()}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("Your CSV export is ready.");
}

elements.form.addEventListener("submit", event => {
  event.preventDefault();
  if (!elements.form.reportValidity()) return;

  const id = document.querySelector("#application-id").value;
  const application = {
    id: id || (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`),
    company: document.querySelector("#company-input").value.trim(),
    role: document.querySelector("#role-input").value.trim(),
    salary: document.querySelector("#salary-input").value.trim(),
    recruiter: document.querySelector("#recruiter-input").value.trim(),
    dateApplied: document.querySelector("#date-input").value,
    status: document.querySelector("#status-input").value,
    interviewDate: document.querySelector("#interview-date-input").value,
    jobLink: document.querySelector("#job-link-input").value.trim(),
    notes: document.querySelector("#notes-input").value.trim()
  };

  if (id) {
    applications = applications.map(existing => existing.id === id ? application : existing);
    showToast("Application updated.");
  } else {
    applications.push(application);
    showToast("Application added.");
  }

  saveApplications();
  render();
  closeDialog();
});

elements.list.addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const application = applications.find(item => item.id === button.dataset.id);
  if (!application) return;

  if (button.dataset.action === "edit") {
    openDialog(application);
  } else if (button.dataset.action === "delete") {
    const confirmed = window.confirm(`Delete the application for ${application.company}?`);
    if (!confirmed) return;
    applications = applications.filter(item => item.id !== application.id);
    saveApplications();
    render();
    showToast("Application deleted.");
  }
});

document.querySelector("#add-application").addEventListener("click", () => openDialog());
document.querySelector("#empty-add-button").addEventListener("click", () => openDialog());
document.querySelector("#close-dialog").addEventListener("click", closeDialog);
document.querySelector("#cancel-dialog").addEventListener("click", closeDialog);
document.querySelector("#export-csv").addEventListener("click", downloadCSV);
elements.search.addEventListener("input", renderApplications);
elements.filter.addEventListener("change", renderApplications);

elements.dialog.addEventListener("click", event => {
  if (event.target === elements.dialog) closeDialog();
});

document.querySelector("#previous-month").addEventListener("click", () => {
  calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1);
  renderCalendar();
});
document.querySelector("#next-month").addEventListener("click", () => {
  calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1);
  renderCalendar();
});

const themeToggle = document.querySelector("#theme-toggle");

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeToggle.textContent = theme === "dark" ? "☀" : "☾";
  themeToggle.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
}

const savedTheme = localStorage.getItem(THEME_KEY);
applyTheme(savedTheme === "dark" ? "dark" : "light");

themeToggle.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem(THEME_KEY, nextTheme);
  applyTheme(nextTheme);
});

document.querySelector("#today-label").textContent = new Date().toLocaleDateString(undefined, {
  weekday: "long",
  month: "long",
  day: "numeric"
}).toUpperCase();

render();