// Base URL for the Todo API
const BASE_URL = "https://mongodb.simplycodingcourses.com/simply/todo/";
const USER_ID = "Maryeli_7"; // Replace with your unique user identifier (e.g., johndoe)
const TOKEN =
  "4e3bab6f7d18d71ed62ce7f76a2224e6dd621175254f8f180a2b9463c8813295"; // Replace with your token from the API Access page if different

// Axios configuration with Authorization header
axios.defaults.headers.common["Authorization"] = `Bearer ${TOKEN}`;

// Utility function to log actions
function logAction(action, logged) {
  const log = document.getElementById("log");
  const entry = document.createElement("p");
  entry.textContent = action + " " + logged;

  if (action === "DELETED") {
    entry.style.color = "red";
  } else if (action === "EDITED") {
    entry.style.color = "orange";
  } else if (action === "ADDED") {
    entry.style.color = "green";
  }
  log.appendChild(entry);
  log.scrollTop = log.scrollHeight;
}

/////////////////// Utility function to format date ///////////////////////////////////////////
function formatDate(dateString) {
  // Parse as local time to avoid UTC-offset shifting the date
  const [year, month, day] = dateString.split("T")[0].split("-").map(Number);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
    2,
    "0"
  )}`;
}
// function getDateStatus(dateString) {
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
//   // Parse as local time by splitting the parts — new Date("YYYY-MM-DD") parses
//   // as UTC midnight, which shifts the date back in negative-offset timezones.
//   const [year, month, day] = dateString.split("T")[0].split("-").map(Number);
//   const due = new Date(year, month - 1, day);
//   const diff = Math.round((due - today) / (1000 * 60 * 60 * 24));
//   if (diff < 0)
//     return { label: `Overdue by ${Math.abs(diff)}d`, cls: "overdue" };
//   if (diff === 0) return { label: "Due today", cls: "due-soon" };
//   if (diff <= 3) return { label: `Due in ${diff}d`, cls: "due-soon" };
//   return {
//     label: `Due ${due.toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//     })}`,
//     cls: "",
//   };
// }

////////////////////////// Fetch todos from API /////////////////////////////////////////////////////
async function fetchTodos() {
  //  GET with error handling
  try {
    const response = await axios.get(`${BASE_URL}${USER_ID}/get`);
    return response.data;
  } catch (error) {
    console.error("Error fetching todos:", error);
    return [];
  }
}

///////////////////// Add a new todo /////////////////////////////////////////////////////////////
async function addTodo(task, dueDate, isCompleted) {
  let newDate = formatDate(dueDate);
  try {
    await axios.post(`${BASE_URL}${USER_ID}/post`, {
      task,
      dueDate,
      isCompleted,
    });
    let complete = "";
    if (isCompleted == true) {
      complete = "Complete";
    } else {
      complete = "Incomplete";
    }
    showAnimation("added");
    logAction("ADDED", `New Task - ${task} \n Due: ${newDate} ${complete}`);
    const todos = await fetchTodos();
    if (todos.length === 0) console.log("No todos found.");
    renderTodos(todos);
  } catch (error) {
    console.error("Error adding todo:", error);
  }
}

/////////////// Delete a todo ///////////////////////////////////////////////////////////
async function deleteTodo(todoId, task, dueDate) {
  let newDate = formatDate(dueDate);
  try {
    await axios.delete(`${BASE_URL}${USER_ID}/delete/${todoId}`);
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
  showAnimation("deleted");
  logAction("DELETED", `- ${task} ${newDate}`);
  const todos = await fetchTodos();
  init();
}

/////////////////////// Render todo list //////////////////////////////////////////////////
function renderTodos(todos) {
  const todoList = document.getElementById("todoList");
  todoList.innerHTML = "";
  todos.forEach((todo) => {
    const li = document.createElement("li");
    let newDate = formatDate(todo.dueDate);
    li.textContent = `${todo.task} - ${newDate}`;
    const hr = document.createElement("hr");
    hr.className = "listHr";
    const editButton = document.createElement("button");
    editButton.className = "editBtn";
    editButton.innerHTML = " &#128393";
    editButton.onclick = () =>
      openModal(todo._id, todo.task, todo.dueDate, todo.isCompleted);
    const deleteButton = document.createElement("button");
    deleteButton.className = "deleteBtn";
    deleteButton.innerHTML = "&#128465";
    deleteButton.onclick = () =>
      deleteTodo(todo._id, todo.task, todo.dueDate, todo.isCompleted);
    li.appendChild(editButton);
    li.appendChild(deleteButton);
    todoList.appendChild(li);
    todoList.appendChild(hr);
    // thmbs-up/down ////////////
    if (todo.isCompleted) {
      // console.log(todos);
      li.style.color = "red";
      const thumbsUp = document.createElement("div");
      thumbsUp.className = "thumbs";
      thumbsUp.innerHTML = "&#128077;";
      li.appendChild(thumbsUp);
      const complete = false;
      thumbsUp.onclick = () =>
        taskNotComplete(todo._id, todo.task, todo.dueDate, complete);
    } else {
      li.style.color = "green";
      const thumbsDown = document.createElement("div");
      thumbsDown.className = "thumbs";
      thumbsDown.innerHTML = "&#128078;";
      li.appendChild(thumbsDown);
      const complete = true;
      thumbsDown.onclick = () =>
        taskNotComplete(todo._id, todo.task, todo.dueDate, complete);
    }
  });
}
///////////// task complete/notcomplete /////////////////////////////////////////////////
async function taskNotComplete(todoId, task, dueDate, isCompleted) {
 
  try {
    await axios.put(`${BASE_URL}${USER_ID}/put/${todoId}`, {
      task,
      dueDate,
      isCompleted,
    });
   let newDate = formatDate(dueDate);
    if (isCompleted == true) {
      logAction(
        "UPDATED",
        `\u{1F389}Task complete - ${task} Due: ${newDate} `
      );
    } else {
      logAction(
        "UPDATED",
        `\u{1F926}Task not complete - ${task}  Due: ${newDate} `
      );
    }
    const todos = await fetchTodos();
    if (todos.length === 0) console.log("No todos found.");
    renderTodos(todos);
  } catch (error) {
    console.error("Error updating todo:", error);
    logAction(`Error updating completion`);
  }
}
////////////////// Animation ///////////////////////////
function showAnimation(action) {
  let animeEmoji = document.createElement("div");
   const listBody = document.getElementById("listBody");
  listBody.appendChild(animeEmoji);
  if (action === "deleted"){
    animeEmoji.className = "emoji1";
  animeEmoji.innerHTML = "ToDo DELETED<p>&#128555;</p>";
} else if(action === "edited"){
      animeEmoji.className = "emoji2";
  animeEmoji.innerHTML = "Todo EDITED<p>&#129300;</p>";
} else if(action === "added") {
     animeEmoji.className = "emoji3";
  animeEmoji.innerHTML = "ToDo ADDED<p>&#129303;</p>";
}

  setTimeout(() => animeEmoji.remove(), 2000);
}

/////////////////// Handle form submission///////////////////////////////////////////////////////
document.getElementById("todoForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const task = document.getElementById("task").value;
  const dueDate = document.getElementById("dueDate").value;
  const completed = document.getElementById("completed").checked;
  await addTodo(task, dueDate, completed);
  document.getElementById("todoForm").reset();
  const todos = await fetchTodos();
  renderTodos(todos);
});

// ///////////////////////////Edit todo //////////////////////////////////////////
async function editTodo(todoId) {
  //fill up task, duedate, completed,
  const task = document.getElementById("newTask").value;
  const dueDate = document.getElementById("newDueDate").value;
  const isCompleted = document.getElementById("newCompleted").checked;
  const validate = validateForm(task, dueDate);
  let newDate = formatDate(dueDate);
  if (validate == true) {
    try {
      await axios.put(`${BASE_URL}${USER_ID}/put/${todoId}`, {
        task,
        dueDate,
        isCompleted,
      });
      let complete = "";
      if (isCompleted == true) {
        complete = "Complete";
      } else {
        complete = "Incomplete";
      }
      showAnimation("edited");
      logAction("EDITED", `- Task${task} ${newDate} ${complete}`);

      // console.log("update?");
      const todos = await fetchTodos();
      if (todos.length === 0) console.log("No todos found.");
      renderTodos(todos);
    } catch (error) {
      console.error("Error updating todo:", error);
      logAction(
        `Failed to update! -> ${task} - ${newDate} - ${isCompleted} - error: ${error}`
      );
    }
    closeModal();
  }
}
///// validate form //////////////////////////////////////////////
function validateForm(task, dueDate) {
  if (task.length < 2) {
    document.getElementById("newTask");
    newTask.style.backgroundColor = "red";
    alert.classList.add("show");
    return false;
  } else if (dueDate == "") {
    console.log(dueDate);
    document.getElementById("newDueDate");
    newDueDate.style.backgroundColor = "red";
    alert2.classList.add("show");
    return false;
  } else {
    document.getElementById("newTask");
    newTask.style.backgroundColor = "white";
    newDueDate.style.backgroundColor = "white";
    return true;
  }
}
/////// Delete todo handler ///////////////////////////////////////////////
// async function deleteTodoHandler(todoId) {
//   await deleteTodo(todoId);
//   const todos = await fetchTodos();
//   renderTodos(todos);

// }

////////// Initialize app //////////////////////////////////////////////////
async function init() {
  const todos = await fetchTodos();
  if (todos.length === 0) console.log("No todos found.");
  renderTodos(todos);
}

init();

/////////////////////MODAL/////////////////////////////////////////////////////////

const modal = document.getElementById("modal");
const openBtn = document.getElementById("openBtn");
const closeBtn = document.getElementById("closeBtn");
const alert = document.getElementById("alert");
const alert2 = document.getElementById("alert2");
function openModal(ID, task, dueDate, isCompleted) {
  let editBtn = document.getElementById("editId");
  document.getElementById("newTask").value = task;
  document.getElementById("newDueDate").value = formatDate(dueDate);
  document.getElementById("newCompleted").checked = isCompleted;
  alert.classList.remove("show");
  alert2.classList.remove("show");
  editBtn.onclick = () => {
    editTodo(ID);
  };
  modal.classList.add("show");
}

function closeModal() {
  modal.classList.remove("show");
}

closeBtn.addEventListener("click", closeModal);

/* Close when clicking outside the modal box */
modal.addEventListener("click", function (event) {
  if (event.target === modal) {
    closeModal();
  }
});

/* Close when pressing Escape */
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeModal();
  }
});
