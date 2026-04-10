// Base URL for the Todo API
const BASE_URL = "https://mongodb.simplycodingcourses.com/simply/todo/";
const USER_ID = "Odom_Billy_3"; // Replace with your unique user identifier (e.g., johndoe)
const TOKEN =
  "3e636222ec5592d6642816a7d6924178562233cdcd629d4c96238211c112fe4d"; // Replace with your token from the API Access page if different

// Axios configuration with Authorization header
axios.defaults.headers.common["Authorization"] = `Bearer ${TOKEN}`;

// Utility function to log actions
function logAction(action) {
  // Simple: Log to console
  console.log(action);
  // Medium: Append to log area
  const log = document.getElementById("log");
  log.innerHTML += "<p>" + action + "<p>";
  // Advanced: Append as paragraph, auto-scroll
}

// Utility function to format date
function formatDate(dateString) {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  const theDate = new Date(dateString);
  const dateTimeFormat3 = new Intl.DateTimeFormat("en-US", options);
  try {
    return dateTimeFormat3.format(theDate);
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
}

// Add a new todo
async function addTodo(task, dueDate, isCompleted, time) {
  try {
    await axios.post(`${BASE_URL}${USER_ID}/post`, {
      task,
      dueDate,
      isCompleted,
      time,
    });
    init();
    // formatDate();
    logAction(
      `Added task: ${task}. Completed: ${isCompleted} Date: ${dueDate} Time: ${time}`
    );
  } catch (error) {
    console.error("Error adding todo:", error);
  }
}

// Update a todo
async function updateTodo(todoId, task, dueDate, isCompleted, time) {
  try {
    await axios.put(`${BASE_URL}${USER_ID}/put/${todoId}`, {
      task,
      dueDate,
      isCompleted,
      time,
    });
    init();
    logAction(
      `Updated task: ${task}. Completed: ${isCompleted}  Date: ${dueDate} Time: ${time} `
    );
  } catch (error) {
    console.error("Error updating todo:", error);
  }
}

// Delete a todo
async function deleteTodo(todoId, task, isCompleted) {
  try {
    await axios.delete(`${BASE_URL}${USER_ID}/delete/${todoId}`);
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
  init();
  isCompleted
    ? logAction(`Deleted task: ${task}.  Completed: ${isCompleted} Good Job! `)
    : logAction(`Deleted task: ${task}. Incomplete: Too Bad!!! `);
}

// Render todo list
function renderTodos(todos) {
  const todoList = document.getElementById("todoList");
  todoList.innerHTML = "";
  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.id = todo._id;

    const displayDiv = document.createElement("div");
    displayDiv.style.display = "inline-block";
    displayDiv.innerHTML = `<div class="isCompleted" >${
      todo.isCompleted ? "😁 Completed" : "📌 Not Complete..."
    }</div> <div class="theTodo">${
      todo.isCompleted
        ? "<span class='strikethrough'>" + todo.task + "</span>"
        : todo.task
    }</div> <div class="theDate">${formatDate(todo.dueDate)}</div>`;

    const editButton = document.createElement("button");

    editButton.classList = "edit-btn bi bi-pencil-square btn btn-secondary";
    editButton.textContent = "Edit";
    function editFunction() {
      displayDiv.innerHTML = ``;
      let ourCheck = document.createElement("input");
      let ourText = document.createElement("input");
      let ourDate = document.createElement("input");
      let ourTime = document.createElement("input");
      ourCheck.classList.add("edit-checkbox");
      ourText.classList.add("edit-input");
      ourDate.classList.add("edit-input");
      ourTime.classList.add("edit-input");
      ourCheck.setAttribute("type", "checkbox");
      ourText.setAttribute("type", "text");
      ourText.setAttribute("value", todo.task);
      ourDate.setAttribute("type", "date");
      ourDate.setAttribute("value", todo.dueDate.split("T")[0]);
      ourTime.setAttribute("type", "time");
      ourTime.setAttribute("value", todo.time);
      displayDiv.appendChild(ourCheck);
      displayDiv.appendChild(ourText);
      displayDiv.appendChild(ourDate);
      displayDiv.appendChild(ourTime);
      ourCheck.checked = todo.isCompleted;

      // editTodo(todo._id)
      editButton.textContent = "change!";
      const oldTask = todo.task;
      editButton.setAttribute("class", "bi bi-pencil-square btn btn-secondary");

      editButton.onclick = async () => {
        await updateTodo(
          todo._id,
          ourText.value,
          ourDate.value,
          ourCheck.checked,
          ourTime.value,
          oldTask
        );
        editButton.textContent = "edit";

        editButton.onclick = editFunction;
        init();
      };
    }
    editButton.onclick = editFunction;

    const deleteButton = document.createElement("button");
    deleteButton.classList = "delete-btn bi bi-trash";
    // deleteButton.setAttribute("class", ");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = () =>
      deleteTodo(todo._id, todo.task, todo.isCompleted);

    const toggleCompleteButton = document.createElement("button");
    toggleCompleteButton.classList = "toggleCompleteButton";
    toggleCompleteButton.setAttribute("class", "bi bi-save btn btn-success");

    let complete = "";
    if (todo.isComplete == true) {
      toggleCompleteButton.textContent = "mark incomplete";
      complete = false;
    } else {
      toggleCompleteButton.textContent = "Complete";

      complete = true;
    }

    toggleCompleteButton.onclick = () =>
      toggleTodo(todo._id, todo.task, todo.dueDate, complete);
    li.appendChild(displayDiv);
    li.appendChild(toggleCompleteButton);
    li.appendChild(editButton);
    li.appendChild(deleteButton);

    todoList.appendChild(li);
  });
}
async function toggleTodo(todoId, task, dueDate, isCompleted) {
  console.log("complete is " + isCompleted);

  try {
    await axios.put(`${BASE_URL}${USER_ID}/put/${todoId}`, {
      task,
      dueDate,
      time,
      isCompleted,
    });

    logAction(`Finished Task: ${isCompleted}  `);
    init();
  } catch (error) {
    console.error("Error updating task:", error);
  }
}

// Handle form submission
document.getElementById("todoForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const task = document.getElementById("task").value;
  const dueDate = document.getElementById("dueDate").value;
  const completed = document.getElementById("isCompleted").checked;
  const time = document.getElementById("time").value;

  await addTodo(task, dueDate, completed, time);
  document.getElementById("todoForm").reset();
  const todos = await fetchTodos();
  renderTodos(todos);
});

// Delete todo handler
async function deleteTodoHandler(todoId) {
  await deleteTodo(todoId);
  const todos = await fetchTodos();
  renderTodos(todos);
}

// Initialize app
async function init() {
  const todos = await fetchTodos();
  if (todos.length === 0) console.log("No todos found.");
  renderTodos(todos);
}

init();

function isCheckboxChecked(formName, checkboxName) {
  // Access the form and check if checkbox is checked
  const form = document.forms[formName];
  if (form && form[checkboxName]) {
    return form[checkboxName].checked;
  }
  return false;
}

const myNodelist = document.getElementsByTagName("LI");
var i;
for (i = 0; i < myNodelist.length; i++) {
  const span = document.createElement("SPAN");
  const txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  myNodelist[i].appendChild(span);
}

// Click on a close button to hide the current list item
const close = document.getElementsByClassName("close");
var i;
for (i = 0; i < close.length; i++) {
  close[i].onclick = function () {
    const div = this.parentElement;
    div.style.display = "none";
  };
}

// Create a new list item when clicking on the "Add" button
function newElement() {
  const li = document.createElement("li");
  const inputValue = document.getElementById("myInput").value;
  const t = document.createTextNode(inputValue);
  li.appendChild(t);
  if (inputValue === "") {
    alert("You must write something!");
  } else {
    document.getElementById("myUL").appendChild(li);
  }
  document.getElementById("myInput").value = "";

  const span = document.createElement("SPAN");
  const txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);

  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      const div = this.parentElement;
      div.style.display = "none";
    };
  }
}
