// Base URL for the Todo API
const BASE_URL = "https://mongodb.simplycodingcourses.com/simply/todo/";
const USER_ID = "Travone"; // Replace with your unique user identifier (e.g., johndoe)
const TOKEN =
  "e80d5a02303564236d9ce0ef500ebc4a4b8933a9820e9aee647b809719894ea0"; // Replace with your token from the API Access page if different

// Axios configuration with Authorization header
axios.defaults.headers.common["Authorization"] = `Bearer ${TOKEN}`;

// / // Utility function to log actions
function logAction(action) {
  const log = document.getElementById("log");
  let newP = document.createElement("p");
  newP.textContent = action;
  log.appendChild(newP);
  log.scrollTop = log.scrollHeight;
  console.log(action);
}

//format date
function formatDate(dateString) {
  if (!dateString) return null;
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
    logAction(`Remember to ${task} ${dueDate}`);
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
    logAction(`Updated task ${task} ${dueDate}`);
  } catch (error) {
    // console.error("Error updating todo:", error);
  }

  // Advanced: PUT with error handling, user feedback
}

// Delete a todo
async function deleteTodo(todoId, task) {
  // Simple: Basic DELETE request
  // await axios.delete(`${BASE_URL}${USER_ID}/delete/${todoId}`);
  // Medium: DELETE with error handling
  try {
    await axios.delete(`${BASE_URL}${USER_ID}/delete/${todoId}`);
    init();
    logAction(`You no longer need to ${task}`);
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
  // Advanced: DELETE with error handling, user feedback
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
    const li = document.createElement("li");
    li.textContent = `${todo.task} - ${formatDate(todo.dueDate)}`;
    li.classList.add("list-group-item");
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("bi-pencil", "btn", "btn-secondary");
    editButton.onclick = () => {
      document.getElementById("newTask").value = todo.task;
      document.getElementById("newDueDate").value = todo.dueDate?.split("T")[0];
      document.getElementById("newCompleted").checked = todo.isCompleted;
      openModal(todo._id);
    };
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("bi-trash", "btn", "btn-danger");
    deleteButton.onclick = () => deleteTodo(todo._id, todo.task);
    li.appendChild(editButton);
    li.appendChild(deleteButton);
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
async function editTodo(todoId) {
  //fill up task, duedate, completed,
  const taskInput = document.getElementById("newTask");
  const dueDateInput = document.getElementById("newDueDate");
  const completedInput = document.getElementById("newCompleted");

  const task = taskInput.value;
  const dueDate = dueDateInput.value;
  const isCompleted = completedInput.checked;
  console.log(todoId);
  if (!task) {
    document.getElementById("newTask").classList.add("is-invalid");
    logAction("Please enter a task.");
  } else {
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
    closeModal();
    init();
  }
}

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

document.body.addEventListener("click", (e) => {
  console.log(e);
  for (let i = 0; i < 50; i++) {
    particle(
      e.pageX,
      e.pageY,
      Math.random() * 100,
      Math.random() * 3,
      0,
      360,
      0,
      8,
      `hsl(300,${Math.random() * 0}%,${Math.random() * 100}%)`
    );
  }
});
init();

const modal = document.getElementById("modal");
const openBtn = document.getElementById("openBtn");
const closeBtn = document.getElementById("closeBtn");

function openModal(ID) {
  let editBtn = document.getElementById("editId");
  editBtn.onclick = () => {
    editTodo(ID);
  };
  modal.classList.add("show");
}

// function openModal(ID) {
//   let editBtn = document.getElementById("editId");
//   editBtn.setAttribute("onclick", "editTodo('" + ID + "')");
//   modal.classList.add("show");
// }

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
