export interface Project {
  type: "event-website" | "todo-app";
  title: string;
  entry: string;
}

export interface Student {
  id: string;
  label: string;
  projects: Project[];
}

export const students: Student[] = [
  {
    id: "lapalma1",
    label: "Student 1",
    projects: [
      { type: "event-website", title: "Capstone Event Site", entry: "/projects/lapalma1/event-website/CapstoneProject/CapstoneIndex.html" },
      { type: "todo-app", title: "Todo App", entry: "/projects/lapalma1/todo-app/JSCapstoneTodoApp/ToDo.html" },
    ],
  },
  {
    id: "lapalma2",
    label: "Student 2",
    projects: [
      { type: "event-website", title: "Event Website", entry: "/projects/lapalma2/event-website/index.html" },
      { type: "todo-app", title: "Todo App", entry: "/projects/lapalma2/todo-app/index.html" },
    ],
  },
  {
    id: "lapalma3",
    label: "Student 3",
    projects: [
      { type: "event-website", title: "CES 2026", entry: "/projects/lapalma3/event-website/index.html" },
      { type: "todo-app", title: "Todo App", entry: "/projects/lapalma3/todo-app/index.html" },
    ],
  },
  {
    id: "lapalma4",
    label: "Student 4",
    projects: [
      { type: "event-website", title: "Bootstrap Venue", entry: "/projects/lapalma4/event-website/index.html" },
      { type: "todo-app", title: "Todo App", entry: "/projects/lapalma4/todo-app/index.html" },
    ],
  },
  {
    id: "lapalma6",
    label: "Student 6",
    projects: [
      { type: "event-website", title: "Event Website", entry: "/projects/lapalma6/event-website/index.html" },
      { type: "todo-app", title: "Todo App", entry: "/projects/lapalma6/todo-app/index.html" },
    ],
  },
  {
    id: "lapalma9",
    label: "Student 9",
    projects: [
      { type: "event-website", title: "Event Website", entry: "/projects/lapalma9/event-website/index.html" },
      { type: "todo-app", title: "Todo App", entry: "/projects/lapalma9/todo-app/index.html" },
    ],
  },
  {
    id: "lapalma10",
    label: "Student 10",
    projects: [
      { type: "event-website", title: "Event Website", entry: "/projects/lapalma10/event-website/Event-project-/index.html" },
    ],
  },
  {
    id: "lapalma11",
    label: "Student 11",
    projects: [
      { type: "event-website", title: "Event Website", entry: "/projects/lapalma11/event-website/index.html" },
      { type: "todo-app", title: "Todo App", entry: "/projects/lapalma11/todo-app/index.html" },
    ],
  },
  {
    id: "lapalma12",
    label: "Student 12",
    projects: [
      { type: "event-website", title: "Event Website", entry: "/projects/lapalma12/event-website/event-website-project/index.html" },
      { type: "todo-app", title: "Todo App", entry: "/projects/lapalma12/todo-app/todo project/index.html" },
    ],
  },
  {
    id: "lapalma14",
    label: "Student 14",
    projects: [
      { type: "event-website", title: "Event Website", entry: "/projects/lapalma14/event-website/capstone project/index.html" },
      { type: "todo-app", title: "Task List App", entry: "/projects/lapalma14/todo-app/Task List App/index.html" },
    ],
  },
  {
    id: "lapalma15",
    label: "Student 15",
    projects: [
      { type: "event-website", title: "Event Website", entry: "/projects/lapalma15/event-website/index.html" },
      { type: "todo-app", title: "Todo App", entry: "/projects/lapalma15/todo-app/index.html" },
    ],
  },
  {
    id: "lapalma17",
    label: "Student 17",
    projects: [
      { type: "event-website", title: "Event Website", entry: "/projects/lapalma17/event-website/event-website-project/index.html" },
      { type: "todo-app", title: "Todo List", entry: "/projects/lapalma17/todo-app/ToDo_List/todo.html" },
    ],
  },
];
