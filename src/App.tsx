import { useState, useCallback, useEffect } from "react";
import { students, type Project } from "./data/students";
import logo from "./assets/logo.png";
import "./App.css";

type FilterType = "all" | "event-website" | "todo-app";

interface FlatProject {
  studentId: string;
  studentLabel: string;
  project: Project;
}

function flattenProjects(filter: FilterType): FlatProject[] {
  const items: FlatProject[] = [];
  for (const s of students) {
    for (const p of s.projects) {
      if (filter === "all" || p.type === filter) {
        items.push({ studentId: s.id, studentLabel: s.label, project: p });
      }
    }
  }
  return items;
}

const totalProjects = students.reduce((n, s) => n + s.projects.length, 0);
const totalEvent = students.reduce(
  (n, s) => n + s.projects.filter((p) => p.type === "event-website").length,
  0
);
const totalTodo = totalProjects - totalEvent;

function App() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [selected, setSelected] = useState<FlatProject | null>(null);

  const items = flattenProjects(filter);

  const close = useCallback(() => setSelected(null), []);

  useEffect(() => {
    if (!selected) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [selected, close]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selected) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);

  return (
    <div className="showcase">
      {/* Header */}
      <header className="showcase-header">
        <img src={logo} alt="Simply Coding" className="header-logo" />
        <h1 className="header-title">
          La Palma <em>Code</em> Showcase
        </h1>
        <p className="header-subtitle">
          Student Capstone Projects — Spring 2026
        </p>
        <p className="header-count">
          <strong>{students.length}</strong> students &middot;{" "}
          <strong>{totalProjects}</strong> projects
        </p>
      </header>

      {/* Filter tabs */}
      <nav className="filter-bar">
        <button
          className={`filter-tab ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All Projects<span className="tab-count">{totalProjects}</span>
        </button>
        <button
          className={`filter-tab ${filter === "event-website" ? "active" : ""}`}
          onClick={() => setFilter("event-website")}
        >
          Event Websites<span className="tab-count">{totalEvent}</span>
        </button>
        <button
          className={`filter-tab ${filter === "todo-app" ? "active" : ""}`}
          onClick={() => setFilter("todo-app")}
        >
          Todo Apps<span className="tab-count">{totalTodo}</span>
        </button>
      </nav>

      {/* Grid */}
      {items.length > 0 ? (
        <div className="project-grid">
          {items.map((item, i) => (
            <article
              className="project-card"
              key={`${item.studentId}-${item.project.type}`}
              style={{ animationDelay: `${0.3 + i * 0.06}s` }}
              onClick={() => setSelected(item)}
            >
              <div className="card-preview">
                <div className="card-preview-scaler">
                  <iframe
                    src={item.project.entry}
                    title={`${item.studentLabel} — ${item.project.title}`}
                    loading="lazy"
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>
                <span className="card-view-label">View Project</span>
              </div>
              <div className="card-info">
                <div className="card-top-row">
                  <span className="card-student">{item.studentLabel}</span>
                  <span className={`card-badge ${item.project.type}`}>
                    {item.project.type === "event-website"
                      ? "Event Site"
                      : "Todo App"}
                  </span>
                </div>
                <span className="card-project-title">
                  {item.project.title}
                </span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3 className="empty-state-title">No projects found</h3>
          <p className="empty-state-text">
            Try selecting a different filter above.
          </p>
        </div>
      )}

      {/* Footer */}
      <footer className="showcase-footer">
        <p className="footer-text">
          <strong>La Palma Code</strong> &mdash; Simply Coding Academy &middot;
          Spring 2026 Capstone Showcase
        </p>
      </footer>

      {/* Modal */}
      {selected && (
        <div className="modal-overlay" onClick={close}>
          <div
            className="modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-toolbar">
              <div className="modal-toolbar-left">
                <div className="modal-dots">
                  <span
                    className="modal-dot close"
                    onClick={close}
                    title="Close"
                  />
                  <span className="modal-dot minimize" />
                  <span className="modal-dot maximize" />
                </div>
                <span className="modal-student-name">
                  {selected.studentLabel}
                </span>
              </div>
              <div className="modal-toolbar-right">
                <span
                  className={`modal-project-badge ${selected.project.type}`}
                >
                  {selected.project.type === "event-website"
                    ? "Event Site"
                    : "Todo App"}
                </span>
                <a
                  className="modal-open-link"
                  href={selected.project.entry}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  Open in New Tab
                </a>
              </div>
            </div>
            <div className="modal-url-bar">
              <span className="modal-url-pill">
                {window.location.origin}
                {selected.project.entry}
              </span>
            </div>
            <div className="modal-iframe-wrap">
              <iframe
                src={selected.project.entry}
                title={`${selected.studentLabel} — ${selected.project.title}`}
                sandbox="allow-scripts allow-same-origin allow-forms"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
