// Base URL for the Todo API
const BASE_URL = "https://mongodb.simplycodingcourses.com/simply/todo/";
const USER_ID = "DeshonCarter"; // Replace with your unique user identifier (e.g., johndoe)
const TOKEN =
  "6491fdc9837effd97ba52692731178a95eaccb5be480ca013e7c9453fd360feb"; // Replace with your token from the API Access page if different

// Axios configuration with Authorization header
axios.defaults.headers.common["Authorization"] = `Bearer ${TOKEN}`;

///////////////////// Utility function to log actions //////////////////////////////////////
function logAction(action) {
  // Simple: Log to console
  console.log(action);
  // Medium: Append to log area
  // const log = document.getElementById("log");
  // log.textContent += action + "\n";
  // Advanced: Append as paragraph, auto-scroll
  let newPtag = document.createElement("p");
  newPtag.textContent = action;
  log.appendChild(newPtag);
  log.scrollTop = log.scrollHeight;
}

//////////////////// Utility function to format date /////////////////////////////////
function formatDate(dateString) {
    // Parse as local time to avoid UTC-offset shifting the date
  const [year, month, day] = dateString.split("T")[0].split("-").map(Number);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}



///////////////////////////////// Fetch todos from API///////////////////////////
async function fetchTodos() {
  // Simple: Basic GET request
  // const response = await axios.get(`${BASE_URL}${USER_ID}/get`);
  // return response.data;
  // Medium: GET with error handling
  try {
    const response = await axios.get(`${BASE_URL}${USER_ID}/get`);
    console.log(response);
logAction("todos succesfully fetched")
    return response.data;
  } catch (error) {
    console.error("Error fetching todos:", error);
    return [];
  }
  // Advanced: GET with error handling and user feedback
}

///////////// Add a new todo ////////////////////////////////////////////////
async function addTodo(task, dueDate, isCompleted) {
  // Simple: Basic POST request
  // await axios.post(`${BASE_URL}${USER_ID}/post`, { task, dueDate, completed });
  // Medium: POST with error handling
  try {
    await axios.post(`${BASE_URL}${USER_ID}/post`, {
      task,
      dueDate,
      isCompleted,
    });
  } catch (error) {
    console.error("Error adding todo:", error);
  }
  // Advanced: POST with error handling, user feedback
}

///////////////////////////// Update a todo ///////////////////////////////////////
async function updateTodo(todoId, task, dueDate, isCompleted) {
  // Simple: Basic PUT request
  // await axios.put(`${BASE_URL}${USER_ID}/put/${todoId}`, { task, dueDate, completed });
  // Medium: PUT with error handling
  try {
    await axios.put(`${BASE_URL}${USER_ID}/put/${todoId}`, {
      task,
      dueDate,
      isCompleted,
    });
  } catch (error) {
    console.error("Error updating todo:", error);
  }
  // Advanced: PUT with error handling, user feedback
}

/////////////////////////////// Delete a todo //////////////////////////////////////
async function deleteTodo(todoId) {
  // Simple: Basic DELETE request
  // await axios.delete(`${BASE_URL}${USER_ID}/delete/${todoId}`);
  // Medium: DELETE with error handling
  try {
    await axios.delete(`${BASE_URL}${USER_ID}/delete/${todoId}`);
    const todos = await fetchTodos();
    logAction("todos succesfully deleted")
    if (todos.length === 0) console.log("No todos found.");
    renderTodos(todos);
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
  // Advanced: DELETE with error handling, user feedback
}

///////////////////////////////////// Render todo list //////////////////////////////////
function renderTodos(todos) {
  // Simple: Clear and append todos
  // const todoList = document.getElementById('todoList');
  // todoList.innerHTML = '';
  // todos.forEach(todo => {
  //     const li = document.createElement('li');
  //     li.textContent = `${todo.task} - ${formatDate(todo.dueDate)}`;
  //     todoList.appendChild(li);
  // });
  // Medium: Add buttons but no edit functionality
  // const todoList = document.getElementById("todoList");
  // todoList.innerHTML = "";
  // todos.forEach((todo) => {
  //   const li = document.createElement("li");
  //   li.textContent = `${todo.task} - ${formatDate(todo.dueDate)}`;
  //   const editButton = document.createElement("button");
  //   editButton.textContent = "Editbutton";
  //   editButton.onclick = () => editTodo(todo._id, todo.task, todo.dueDate, todo.isCompleted, li);
  //   editButton.classList.add("btn", "btn-info");

  //   const deleteButton = document.createElement("button");
  //   deleteButton.textContent = "Delete";
  //   deleteButton.onclick = () => {
  //     deleteTodo(todo._id);
  //   };
  //   deleteButton.classList.add("btn", "btn-info");
  //   li.appendChild(editButton);
  //   li.appendChild(deleteButton);
  //   todoList.appendChild(li);
  // });
  // Advanced: Full rendering with edit/delete functionality
   const todoList = document.getElementById("todoList");
  todoList.textContent = ""; // Clear using textContent
  todos.forEach((todo) => {
    
    
    const li = document.createElement("li");
    li.className = "list-group-item flex-column align-items-start";
    

    // Top row: task info + buttons
    const topRow = document.createElement("div");
    topRow.className = "todo-top-row";

    const label = document.createElement("span");
    label.textContent = `${todo.task} - ${formatDate(todo.dueDate)} - ${todo.isCompleted ? "Completed" : "Pending"}`;
   
   
   
    
    const buttonDiv = document.createElement("div");

    const editButton = document.createElement("button");
    // editButton.textContent = "Edit";
    editButton.innerHTML = "&#128395 Edit";
    editButton.classList.add("btn", "btn-primary", "edit-btn");
    editButton.onclick = () =>
      editTodo(
        todo._id,
        todo.task,
        formatDate(todo.dueDate),
        todo.isCompleted,
        li,
      );

    const deleteButton = document.createElement("button");
    // deleteButton.textContent = "Delete";
    deleteButton.innerHTML = "&#128465 Delete";
    deleteButton.classList.add("btn", "btn-primary", "delete-btn");
    deleteButton.onclick = () => deleteTodoHandler(todo._id, li);

    buttonDiv.appendChild(editButton);
    buttonDiv.appendChild(deleteButton);
    topRow.appendChild(label);
    topRow.appendChild(buttonDiv);
    li.appendChild(topRow);

    // Inline panel placeholder (edit form or delete confirm inject here)
    const panel = document.createElement("div");
    panel.className = "inline-panel";
    li.appendChild(panel);

    todoList.appendChild(li);
  });
}

// Handle form submission
document.getElementById("todoForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const task = document.getElementById("task").value;
  const dueDate = document.getElementById("dueDate").value;
  const completed = document.getElementById("completed").checked;

  // Simple: Add todo and clear form
  // await addTodo(task, dueDate, completed);
  // document.getElementById('todoForm').reset();

  // Medium: Add todo, clear form, refresh list
  await addTodo(task, dueDate, completed);
  document.getElementById("todoForm").reset();
  const todos = await fetchTodos();
  renderTodos(todos);

  // Advanced: Validate input, add todo, refresh list, clear form
});

///////////////////////////////////// Edit todo handler ///////////////////////////////////////////////

function editTodo(todoId, task, dueDate, isCompleted, li) {
  // Simple: Prompt for new task
  // const newTask = prompt('Enter new task:', task);
  // if (newTask) updateTodo(todoId, newTask, dueDate, isCompleted);

  // Medium: Prompt for task and date
  // const newTask = prompt('Enter new task:', task);
  // const newDueDate = prompt('Enter new due date (YYYY-MM-DD):', dueDate);
  // if (newTask && newDueDate) updateTodo(todoId, newTask, newDueDate, isCompleted);

  // Advanced: Inline form with pre-filled values, no prompts or alerts
  const panel = li.querySelector(".inline-panel");

  // Toggle off if already open
  if (panel.dataset.open === "edit") {
    panel.textContent = "";
    panel.dataset.open = "";
    return;
  }
  panel.textContent = "";
  panel.dataset.open = "edit";

  const form = document.createElement("div");
  form.className = "inline-edit-form";

  // Task input
  const taskLabel = document.createElement("label");
  taskLabel.textContent = "Task";
  const taskInput = document.createElement("input");
  taskInput.type = "text";
  taskInput.className = "form-control form-control-sm";
  taskInput.value = task;

  // Due date input
  const dateLabel = document.createElement("label");
  dateLabel.textContent = "Due Date";
  const dateInput = document.createElement("input");
  dateInput.type = "date";
  dateInput.className = "form-control form-control-sm";
  dateInput.value = dueDate;

  // Completed checkbox
  const checkWrapper = document.createElement("div");
  checkWrapper.className = "form-check";
  const checkInput = document.createElement("input");
  checkInput.type = "checkbox";
  checkInput.className = "form-check-input";
  checkInput.id = `edit-completed-${todoId}`;
  checkInput.checked = isCompleted;
  const checkLabel = document.createElement("label");
  checkLabel.className = "form-check-label";
  checkLabel.htmlFor = `edit-completed-${todoId}`;
  checkLabel.textContent = `Completed ${isCompleted} - (${isCompleted ? "Completed" : "Pending"})`;
  checkWrapper.appendChild(checkInput);
  checkWrapper.appendChild(checkLabel);

  ////////////////////////////////////////////// Save button ////////////////////////////////////////////////////////
  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Save";
  saveBtn.className = "btn btn-sm btn-primary";
  saveBtn.onclick = async () => {
    const newTask = taskInput.value.trim();
    const newDueDate = dateInput.value;
    if (!newTask || !newDueDate) {
      logAction("Error: Task and due date are required.");
      return;
    }
    await updateTodo(todoId, newTask, newDueDate, checkInput.checked);
    const todos = await fetchTodos();
    renderTodos(todos);
  };

  ///////////////////////////////////// Cancel button ////////////////////////////////////////////////
  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancel";
  cancelBtn.className = "btn btn-sm btn-secondary";
  cancelBtn.onclick = () => {
    panel.textContent = "";
    panel.dataset.open = "";
  };

  const btnRow = document.createElement("div");
  btnRow.className = "inline-form-btns";
  btnRow.appendChild(saveBtn);
  btnRow.appendChild(cancelBtn);

  form.appendChild(taskLabel);
  form.appendChild(taskInput);
  form.appendChild(dateLabel);
  form.appendChild(dateInput);
  form.appendChild(checkWrapper);
  form.appendChild(btnRow);
  panel.appendChild(form);
}
  // Simple: Prompt for new task
  // const newTask = prompt('Enter new task:', task);
  // if (newTask) updateTodo(todoId, newTask, dueDate, completed);
  // Medium: Prompt for task and date
  // const newTask = prompt("Enter new task:", task);
  // const newDueDate = prompt("Enter new due date (YYYY-MM-DD):", dueDate);
  // if (newTask && newDueDate) updateTodo(todoId, newTask, newDueDate, completed);
  // init();
  // Advanced: Prompt for all fields, validate, update


//////////////////////////////////////// Delete todo handler /////////////////////////////////////////////
async function deleteTodoHandler(todoId) {
  // Simple: Delete todo
  // await deleteTodo(todoId);
  // Medium: Delete and refresh
  await deleteTodo(todoId);
  const todos = await fetchTodos();
  renderTodos(todos);
  init();
  // Advanced: Confirm deletion, delete, refresh
}

///////////////////////////////////// Initialize app /////////////////////////////////////////////////////
async function init() {
  // Simple: Fetch and render
  // const todos = await fetchTodos();
  // renderTodos(todos);
  // Medium: Fetch with basic error logging
  const todos = await fetchTodos();
  if (todos.length === 0) console.log("No todos found.");
  renderTodos(todos);
  // Advanced: Fetch with user feedback
}

init();
