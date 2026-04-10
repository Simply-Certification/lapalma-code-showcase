// Base URL for the Todo API
const BASE_URL = "https://mongodb.simplycodingcourses.com/simply/todo/";
const USER_ID = "Turnbo"; // Replace with your unique user identifier (e.g., johndoe)
const TOKEN =
  "3130f28730c15b8cae4ef3920d6040d6e2f43037a07453eaf02b2c1ad23a8778"; // Replace with your token from the API Access page if different

// Axios configuration with Authorization header
axios.defaults.headers.common["Authorization"] = `Bearer ${TOKEN}`;

// Utility function to log actions
function logAction(action) {
  // Simple: Log to console
  // console.log(action);
  // Medium: Append to log area

  const log = document.getElementById("log");
  log.innerHTML += "<p>" + action + "</p>";
  // Advanced: Append as paragraph, auto-scroll
}

// Utility function to format date
function formatDate(dateString) {
  console.log(`in format date:`, dateString);
  if (!dateString) return;
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
let global_todos = null;
// Fetch todos from API
async function fetchTodos() {
  // Simple: Basic GET request
  // const response = await axios.get(`${BASE_URL}${USER_ID}/get`);
  // return response.data;
  // Medium: GET with error handling
  try {
    const response = await axios.get(`${BASE_URL}${USER_ID}/get`);
    global_todos = response.data;
    return response.data;
  } catch (error) {
    console.error("Error fetching todos:", error);
    return [];
  }
  // Advanced: GET with error handling and user feedback
}

// Add a new todo
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
    init();
    logAction(`Added task: ${task}. Due: ${dueDate} Completed: ${isCompleted}`);
  } catch (error) {
    console.error("Error adding todo:", error);
  }
  // Advanced: POST with error handling, user feedback
}

// Update a todo
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
    logAction(`Task update ${task} ${dueDate} ${isCompleted}`);
  } catch (error) {
    console.error("Error updating todo:", error);
  }
  // Advanced: PUT with error handling, user feedback
}

// Delete a todo
async function deleteTodo(todoId) {
  try {
    await axios.delete(`${BASE_URL}${USER_ID}/delete/${todoId}`);
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
  init();

  // async function deleteTodo(todoId) {
  //   // Simple: Basic DELETE request
  //   // await axios.delete(`${BASE_URL}${USER_ID}/delete/${todoId}`);
  //   // Medium: DELETE with error handling
  //   try {
  //     await axios.delete(`${BASE_URL}${USER_ID}/delete/${todoId}`);
  //   } catch (error) {
  //     console.error("Error deleting todo:", error);
  //   }
  //   // Advanced: DELETE with error handling, user feedback
  const deleteTask = deleteTodo;

  // if (deleteTask) updateTodo(todoId, isCompleted);
  console.log(global_todos);
  let myTodo = global_todos.find((item) => item._id == todoId);

  logAction(`deleted - ${myTodo.task} --- completed: ${myTodo.isCompleted}`);
  init();
}

// Render todo list
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
    const liCheck = document.createElement("input");
    liCheck.setAttribute("type", "checkbox");
    liCheck.setAttribute("id", "taskList");
    liCheck.className = "checkBox";
    const liLabel = document.createElement("label");
    liLabel.setAttribute("for", "taskList");

    liCheck.checked = todo.isCompleted;
    const li = document.createElement("li");
    if (liCheck.checked) {
      li.style.textDecoration = "line-through";
      li.style.color = "black";
      // logAction(`${todo.task} is complete`);
    } else {
      li.style.textDecoration = "none";
      li.style.color = "maroon";
    }
    liCheck.onclick = async function () {
      await updateTodo(todo._id, todo.task, todo.dueDate?.split("T")[0], !todo.isCompleted);
      init();
    };

    li.setAttribute("id", "todo._id)");
    console.log(todo._id);
    li.textContent = `${todo.task} - ${formatDate(todo.dueDate)}`;

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.onclick = () =>
      openModal(todo._id, todo.task, todo.dueDate, todo.isCompleted);

    editButton.innerHTML = "&#128221";
    editButton.className = "pen";
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "&#128465";
    deleteButton.className = "trash";
    deleteButton.onclick = () => deleteTodo(todo._id);
    li.appendChild(editButton);
    li.appendChild(deleteButton);
    li.appendChild(liCheck);
    todoList.appendChild(li);
  });

  // Advanced: Full rendering with edit/delete functionality
}

// Handle form submission
document.getElementById("todoForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const task = document.getElementById("task").value;
  const dueDate = document.getElementById("dueDate").value;
  const isCompleted = document.getElementById("isCompleted").checked;

  // Simple: Add todo and clear form
  // await addTodo(task, dueDate, completed);
  // document.getElementById('todoForm').reset();

  // Medium: Add todo, clear form, refresh list
  await addTodo(task, dueDate, isCompleted);
  document.getElementById("todoForm").reset();
  const todos = await fetchTodos();
  renderTodos(todos);

  // Advanced: Validate input, add todo, refresh list, clear form
});



// Edit todo handler
async function editTodo(todoId) {
  //fill up task, duedate, completed,
  const task = document.getElementById("newTask").value;
  const dueDate = document.getElementById("newDueDate").value;
  const isCompleted = document.getElementById("newCompleted").checked;

  //  console.log(todoId);
  // Validate task
  // const name = form.name.value.trim();
  const validate = validateForm(task, dueDate);
  // console.log("validate " + validate);
  if (validate == true) {
    try {
      await axios.put(`${BASE_URL}${USER_ID}/put/${todoId}`, {
        task,
        dueDate,
        isCompleted,
      });

      logAction(`Task updated ${task} ${dueDate} ${isCompleted}`);
      console.log("update?");
      const todos = await fetchTodos();
      if (todos.length === 0) console.log("No todos found.");
      renderTodos(todos);
    } catch (error) {
      console.error("Error updating todo:", error);
      logAction(
        `Failed to update! -> ${task} - ${dueDate} - ${isCompleted} - error: ${error}`
      );
    }
    closeModal();
  }
}
//validateform
function validateForm(task, dueDate) {
  if (task.length >= 2 && dueDate !== "") {
    // showError("nameError", "Name must be at least 2 characters long");
    document.getElementById("newTask");
    newTask.style.backgroundColor = "white";
    newDueDate.style.backgroundColor = "white";

    return true;
  } else {
    document.getElementById("newTask");
    newTask.style.backgroundColor = "red";
    document.getElementById("newDueDate");
    newDueDate.style.backgroundColor = "red";

    //  alert.classList.add("show");
    return false;
  }
}
// function editTodo(todoId, task, dueDate, isCompleted) {
//   // Simple: Prompt for new task
//   // const newTask = prompt('Enter new task:', task);
//   // if (newTask) updateTodo(todoId, newTask, dueDate, completed);
//   // Medium: Prompt for task and date

//   const newTask = prompt("Enter new task:", task);
//   const newDueDate = prompt("Enter new due date (YYYY-MM-DD):", dueDate);
//   if (newTask && newDueDate) updateTodo(todoId, newTask, newDueDate, isCompleted);
//   // Advanced: Prompt for all fields, validate, update
//     logAction(`Edited task: ${newTask}. Due: ${newDueDate} Completed: ${isCompleted}`);
//   // logAction(`edit:${newTask}. Completed: ${isCompleted}`);
//   init();
// }

// Delete todo handler
async function deleteTodoHandler(todoId) {
  // Simple: Delete todo
  // await deleteTodo(todoId);
  // Medium: Delete and refresh
  await deleteTodo(todoId);
  const todos = await fetchTodos();
  renderTodos(todos);
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

/////////////////////MODAL/////////////////////////////////////////////////////////

const modal = document.getElementById("modal");
const openBtn = document.getElementById("openBtn");
const closeBtn = document.getElementById("closeBtn");

function openModal(ID, task, dueDate, isCompleted) {
  let editBtn = document.getElementById("editId");
  //  const updateBtn = document.getElementById("editId");
  // updateBtn.disabled = true;
  document.getElementById("newTask").value = task;
  document.getElementById("newDueDate").value = formatDate(dueDate);
  document.getElementById("newCompleted").checked = isCompleted;
  console.log("what is date? " + dueDate);

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

// document.getElementById("taskList").addEventListener("change", function () {
//   const label = document.querySelector('label[for="taskList"]');
//   if (this.checked) {
//     label.style.textDecoration = "line-through";
//     label.style.color = "black";
//   } else {
//     label.style.textDecoration = "none";
//     label.style.color = "maroon";
//   }
//   // renderTodos();
// });
 const stars = document.querySelector('.stars');
        for (let i = 0; i < 500; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.width = Math.random() * 3 + 'px';
            star.style.height = star.style.width;
            star.style.left = Math.random() * 50 + '%';
            star.style.top = Math.random() * 50 + '%';
            star.style.setProperty('--duration', Math.random() * 3 + 2 + 's');
            stars.appendChild(star);
        }
           
document.querySelector('input[type="checkbox"][class="completed"]');
