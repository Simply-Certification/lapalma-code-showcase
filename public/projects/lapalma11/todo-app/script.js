// Base URL for the Todo API
const BASE_URL = "https://mongodb.simplycodingcourses.com/simply/todo/";
const USER_ID = "phill"; // Replace with your unique user identifier (e.g., johndoe)
const TOKEN =
  "cc58584ae3de66d82f57e0d2c69824f61f7406fbafe7875b9df43bcc176233dc"; // Replace with your token from the API Access page if different

// Axios configuration with Authorization header
axios.defaults.headers.common["Authorization"] = `Bearer ${TOKEN}`;

// Utility function to log actions
function logAction(action) {
  // Simple: Log to console
  //console.log(action);
  // Medium: Append to log area

  let newPtag = document.createElement("p");
  newPtag.textContent = action;
  log.appendChild(newPtag);
  log.scrollTop = log.scrollHeight;

  //    const log = document.getElementById("log");
  //     log.innerHTML += "<p>" + action + "</p>";
  //  log.textContent += action + '\n';
  // Advanced: Append as paragraph, auto-scroll
}

// Utility function to format date
function formatDate(dateString) {
  console.log(`in format date:`, dateString);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  // Parse the date string manually to avoid UTC timezone issues
  const [year, month, day] = dateString.split(/[T\s-]/).slice(0, 3); // Extract Y, M, D
  const localDate = new Date(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day)
  );

  // Use Intl.DateTimeFormat safely
  const dateTimeFormat3 = new Intl.DateTimeFormat("en-US", options);

  try {
    return dateTimeFormat3.format(localDate);
  } catch (e) {
    return dateString;
  }
}

// Fetch todos from API
async function fetchTodos() {
  // Simple: Basic GET request
  // const response = await axios.get(`${BASE_URL}${USER_ID}/get`);
  // return response.data;
  // Medium: GET with error handling
  try {
    const response = await axios.get(`${BASE_URL}${USER_ID}/get`);
    return response.data;
  } catch (error) {
    console.error("Error fetching todos:", error);
    return [];
  }
  // Advanced: GET with error handling and user feedback
}

// Add a new todo
async function addTodo(task, dueDate, completed) {
  // Simple: Basic POST request
  // await axios.post(`${BASE_URL}${USER_ID}/post`, { task, dueDate, completed });
  // Medium: POST with error handling
  try {
    await axios.post(`${BASE_URL}${USER_ID}/post`, {
      task,
      dueDate,
      completed,
    });
    // formatDate();
    init();
    logAction(` Added task: ${task}. Due: ${dueDate}. Completed:${completed}`);
  } catch (error) {
    console.error("Error adding todo:", error);
  }
  // Advanced: POST with error handling, user feedback
}

// Update a todo
async function updateTodo(todoId, task, dueDate, isCompleted) {
  // const todoId = "phill";

  // Simple: Basic PUT request
  // await axios.put(`${BASE_URL}${USER_ID}/put/${todoId}`, { task, dueDate, completed });
  // logAction(`Faild to update -> ${task} - ${dueDate} - ${compeleted} -error ${error}`)
  // Medium: PUT with error handling

  try {
    await axios.put(`${BASE_URL}${USER_ID}/put/${todoId}`, {
      task,
      dueDate,
      isCompleted,
    });
  } catch (error) {
    logAction(
      `Faild to update -> ${task} - ${dueDate} - ${isCompleted} -error ${error}`
    );
  }
  init();

  // Advanced: PUT with error handling, user feedback
}
// Update a todo
async function editTodo(todoId) {
  //fill up task, duedate, completed,

  const taskInput = document.getElementById("newTask");
  const dueDateInput = document.getElementById("newDueDate");
  const completedInput = document.getElementById("newCompleted");

  const task = taskInput.value;
  const dueDate = dueDateInput.value;
  const isCompleted = completedInput.checked;
  console.log(todoId);

  try {
    await axios.put(`${BASE_URL}${USER_ID}/put/${todoId}`, {
      task,
      dueDate,
      isCompleted,
    });
    logAction(`Task updated ${task} ${dueDate} ${isCompleted}`);
  } catch (error) {
    console.error("Error updating todo:", error);
    logAction(
      `Failed to update! -> ${task} - ${dueDate} - ${isCompleted} - error: ${error}`
    );
  }

  init();
  // const task = document.getElementById("newTask").value;
  // const dueDate = document.getElementById("newDueDate").value;
  //  const iscompleted = document.getElementById("newCompleted").checked;
  //  console.log(todoId);
  // try {
  //     await axios.put(`${BASE_URL}${USER_ID}/put/${todoId}`, {
  //       task,
  //       dueDate,
  //      completed
  //     });
  //     logAction(`Task updated ${task} ${dueDate} ${iscompleted}`)
  //     console.log("update fire?")
  //      const todos = await fetchTodos();
  // if (todos.length === 0) console.log('No todos found.');
  // renderTodos(todos);

  // } catch (error) {
  //     console.error('Error updating todo:', error);
  //     logAction(
  //     `Failed to update! -> ${task} - ${dueDate} - ${iscompleted} - error: ${error}`
  //   );
  // }
}
// Delete a todo
async function deleteTodo(todoId) {
  // const todoId = "phill";
  // Simple: Basic DELETE request
  // await axios.delete(`${BASE_URL}${USER_ID}/delete/${todoId}`);
  // Medium: DELETE with error handling
  try {
    await axios.delete(`${BASE_URL}${USER_ID}/delete/${todoId}`);
    const todos = await fetchTodos();
    logAction("todos succesfully deleted");
    if (todos.length === 0) console.log("No todos found.");
    renderTodos(todos);
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
  // Advanced: DELETE with error handling, user feedback
}

// ///////////////////////////////////////////Render todo list
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
  const todoList = document.getElementById("todoList");
  todoList.innerHTML = "";
  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.className = "list-group-item  flex-column align-items-start";
    const topRow = document.createElement("div");
    topRow.className = "todo-top-row";
    const label = document.createElement("div");
    label.textContent = `${todo.task} - ${formatDate(todo.dueDate)} - ${
      todo.isCompleted ? "Completed" : "Pending"
    }`;
    const buttonDiv = document.createElement("div");
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "btn btn-sm btn-outline-primary edit-btn";
    editButton.onclick = () =>
      editTodo(
        todo._id,
        todo.task,
        formatDate(todo.dueDate),
        todo.isCompleted,
        li
      );
    // li.textContent = `${todo.task} - ${formatDate(todo.dueDate)}`;
    //const editButton = document.createElement('button');
    //editButton.textContent = 'Edit';
    // editButton.onclick = () => editTodo(todo._id);
    // editButton.innerHTML = "&#128395";
    // editButton.className = "pen";
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "btn btn-sm btn-outline-danger delete-btn";
    deleteButton.onclick = () => deleteTodoHandler(todo._id, li);

    buttonDiv.appendChild(editButton);
    buttonDiv.appendChild(deleteButton);
    topRow.appendChild(label);
    topRow.appendChild(buttonDiv);
    li.appendChild(topRow);

    deleteButton.innerHTML = "&#128465";
    deleteButton.className = "trash";
    li.appendChild(editButton);
    li.appendChild(deleteButton);
    todoList.appendChild(li);
    const panel = document.createElement("div");
    panel.className = "inline-panel";
    li.appendChild(panel);

    todoList.appendChild(li);
  });
  // Advanced: Full rendering with edit/delete functionality
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

// Edit todo handler
function editTodo(todoId, task, dueDate, iscompleted, li) {
  // Simple: Prompt for new task
  // const newTask = prompt('Enter new task:', task);
  // if (newTask) updateTodo(todoId, newTask, dueDate, completed);
  // Medium: Prompt for task and date
  // const newTask = prompt('Enter new task:', task);
  // const newDueDate = prompt('Enter new due date (YYYY-MM-DD):', dueDate);
  // if (newTask && newDueDate) updateTodo(todoId, newTask, newDueDate, completed);
  // init();
  // Advanced: Prompt for all fields, validate, update
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
  console.log(`dueDate is: `, dueDate);
  dateInput.value = new Date("Tuesday, March 31, 2026")
    .toISOString()
    .split("T")[0];

  // Completed checkbox
  const checkWrapper = document.createElement("div");
  checkWrapper.className = "form-check";
  const checkInput = document.createElement("input");
  checkInput.type = "checkbox";
  checkInput.className = "form-check-input";
  checkInput.id = `edit-completed-${todoId}`;
  checkInput.checked = iscompleted;
  const checkLabel = document.createElement("label");
  checkLabel.className = "form-check-label";
  checkLabel.htmlFor = `edit-completed-${todoId}`;
  checkLabel.textContent = iscompleted ? "Completed" : "Pending";
  checkWrapper.appendChild(checkInput);
  checkWrapper.appendChild(checkLabel);
  // const checkLabel = document.createElement("label");
  // checkLabel.className = "form-check-label";
  // checkLabel.htmlFor = `edit-completed-${todoId}`;
  // checkLabel.textContent = iscompleted = "completed"; "completed "; // checkLabel.textContent = `iscompleted ${iscompleted} - (${iscompleted ? "Completed" : "Pending"})`;
  // checkWrapper.appendChild(checkInput);
  // checkWrapper.appendChild(checkLabel);

  // Save button
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

  // Cancel button
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

// Delete todo handler
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

// Initialize app
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
