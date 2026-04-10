document.addEventListener("DOMContentLoaded", function () {
  flatpickr("#dueDate", {
    dateFormat: "Y-m-d",
    allowInput: true,
  });
  let filterBox = document.getElementById("filterByText");

  filterBox.addEventListener(
    "input",
    debounce((e) => {
      init();
    }, 500)
  );
});
//global for sorting.
let sortByDate = false;

let sortByDateHandler = () => {
  let theBtn = document.getElementById("sortByDate");
  theBtn.classList.remove("btn", "btn-outline-primary", "btn-primary");
  sortByDate = !sortByDate;
  if (sortByDate) {
    theBtn.classList.add("btn", "btn-primary");
  } else {
    theBtn.classList.add("btn", "btn-outline-primary");
  }
  init();
};

let sortByCompleted = false;

let sortByCompletedHandler = () => {
  let theBtn = document.getElementById("sortByCompleted");
  theBtn.classList.remove("btn", "btn-outline-primary", "btn-primary");
  sortByCompleted = !sortByCompleted;
  if (sortByCompleted) {
    theBtn.classList.add("btn", "btn-primary");
  } else {
    theBtn.classList.add("btn", "btn-outline-primary");
  }
  init();
};

// Base URL for the Todo API
const BASE_URL = "https://mongodb.simplycodingcourses.com/simply/todo/";
const USER_ID = "ChrisAndrews"; // Replace with your unique user identifier (e.g., johndoe)
const TOKEN =
  "5a4fdbc8d381f5695e6e485bfd8bb3015d12d6e125f08431a9227c20c82744fe"; // Replace with your token from the API Access page if different

// Axios configuration with Authorization header
axios.defaults.headers.common["Authorization"] = `Bearer ${TOKEN}`;

// Utility function to log actions
function logAction(action) {
  const log = document.getElementById("log");
  let newP = document.createElement("p");
  newP.textContent = action;
  log.appendChild(newP);
  log.scrollTop = log.scrollHeight;
}

// Fetch todos from API
async function fetchTodos() {
  try {
    const response = await axios.get(`${BASE_URL}${USER_ID}/get`);
    let finalResponse = response.data;
    if (sortByDate && !sortByCompleted) {
      finalResponse = response.data.sort(sortDueDateNewestFirst);
    } else if (sortByCompleted && !sortByDate) {
      finalResponse = response.data.sort(sortIsCompletedFirst);
    } else if (sortByDate && sortByCompleted) {
      finalResponse = response.data.sort(sortDateThenCompleted);
    }
    let filterBox = document.getElementById("filterByText");
    finalResponse = finalResponse.filter((todo) => {
      return (
        todo.task.toLowerCase().indexOf(filterBox.value.toLowerCase()) > -1
      );
    });
    return finalResponse;
  } catch (error) {
    console.error("Error fetching todos:", error);
    return [];
  }
}

// Add a new todo
async function addTodo(task, dueDate, isCompleted) {
  try {
    await axios.post(`${BASE_URL}${USER_ID}/post`, {
      task,
      dueDate,
      isCompleted,
    });

    logAction(`posted -> ${task} - ${dueDate} - ${isCompleted}`);
  } catch (error) {
    console.error("Error adding todo:", error);
    logAction(`UNABLE TO POST -> ${task} , ERROR --> ${error}`);
  }
}

// Update a todo
async function updateTodo(todoId, task, dueDate, isCompleted) {
  try {
    await axios.put(`${BASE_URL}${USER_ID}/put/${todoId}`, {
      task,
      dueDate,
      isCompleted,
    });
    logAction(`updated -> ${task} - ${dueDate} - ${isCompleted}`);
  } catch (error) {
    console.error("Error updating todo:", error);
    logAction(
      `Failed to update! -> ${task} - ${dueDate} - ${isCompleted} - error: ${error}`
    );
  }
}

// Delete a todo
async function deleteTodo(todoId) {
  try {
    await axios.delete(`${BASE_URL}${USER_ID}/delete/${todoId}`);
    logAction(`deleted -> todo w/ ID: ${todoId}`);
  } catch (error) {
    console.error("Error deleting todo:", error);
    logAction(`ERROR while attempting to delete ID: ${todoId}, ${error}`);
  }
}

async function renderEditableTodo(todo) {
  let editBtn = document.getElementById("editTodoBtn");
  editBtn.taskId = todo._id;
  editBtn.style.display = "block";

  let formSubmitBtn = document.getElementById("formSubmitBtn");
  formSubmitBtn.style.display = "none";

  document.getElementById("task").value = todo.task;

  document.getElementById("dueDate").value =
    dateStringToDateElementSetableValue(todo.dueDate);

  document.getElementById("completed").checked = todo.isCompleted;
}
// Render todo list
function renderTodos(todos) {
  const todoList = document.getElementById("todoList");
  todoList.innerHTML = "";
  todos.forEach((todo, index) => {
    const li = document.createElement("li");
    let overLay  = document.createElement("div");
    overLay.style.pointerEvents = "none";
    overLay.classList.add("theOverlay");
    
    overLay.style.backgroundColor = todo.isCompleted
      ? "rgba(0,255,0,.3)"
      : new Date(todo.dueDate) - new Date() > 0
      ? "rgba(255,255,0,.2)"
      : "rgba(255,0,0,.1)";
    let checkDiv = document.createElement("div");
    let taskDiv = document.createElement("div");
    let dateDiv = document.createElement("div");
    checkDiv.classList.add("theCheck");
    taskDiv.classList.add("theTask");
    dateDiv.classList.add("theDate");
    checkDiv.innerHTML = todo.isCompleted
      ? "&#9989"
      : new Date(todo.dueDate) - new Date() > 0
      ? "&#10060"
      : "&#9940";
    taskDiv.textContent = todo.task;
    dateDiv.textContent = formatDate(todo.dueDate).replaceAll(",", "\n");
    li.appendChild(overLay);
    li.appendChild(checkDiv);
    li.appendChild(taskDiv);
    li.appendChild(dateDiv);

    checkDiv.onclick = async () => {
      await updateTodo(todo._id, todo.task, todo.dueDate, !todo.isCompleted);
      init();
    };

    li.classList.add("list-group-item");
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("btn", "btn-outline-info", "edit-btn", "btn-sm");
    editButton.onclick = async () => {
      let removeSpinner = addSpinner(editButton);
      await renderEditableTodo(todo);
      removeSpinner();
    };

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add(
      "btn",
      "btn-outline-danger",
      "delete-btn",
      "btn-sm"
    );
    deleteButton.onclick = async () => {
      let removeSpinner = addSpinner(deleteButton);
      await deleteTodo(todo._id);
      const todos = await fetchTodos();
      if (todos.length === 0) logAction("No todo's stored");
      renderTodos(todos);
      removeSpinner();
    };
    li.appendChild(editButton);
    li.appendChild(deleteButton);
    todoList.appendChild(li);
  });
}

// Handle form submission
document.getElementById("todoForm").addEventListener("submit", async (e) => {
  let removeSpinner = addSpinner("formSubmitBtn");

  e.preventDefault();
  const task = document.getElementById("task").value;
  const dueDate = document.getElementById("dueDate").value;
  const completed = document.getElementById("completed").checked;

  await addTodo(task, dueDate, completed);
  document.getElementById("todoForm").reset();
  const todos = await fetchTodos();
  renderTodos(todos);
  removeSpinner();
});

document
  .getElementById("editTodoBtn")
  .addEventListener("click", async function (e) {
    let removeSpinner = addSpinner("editTodoBtn");

    e.preventDefault();

    const task = document.getElementById("task").value;
    const dueDate = document.getElementById("dueDate").value;
    const completed = document.getElementById("completed").checked;
    const taskId = document.getElementById("editTodoBtn").taskId;
    if (!taskId) {
      alert("Please select a todo to edit first!");
      return;
    }

    document.getElementById("todoForm").reset();

    await updateTodo(taskId, task, dueDate, completed);
    const todos = await fetchTodos();

    let editBtn = document.getElementById("editTodoBtn");
    editBtn.taskId = null;
    editBtn.style.display = "none";

    let formSubmitBtn = document.getElementById("formSubmitBtn");
    formSubmitBtn.style.display = "block";
    renderTodos(todos);
    removeSpinner();
  });

// Initialize app
async function init() {
  try {
    const todos = await fetchTodos();
    if (todos.length === 0) logAction("No todo's stored");
    renderTodos(todos);

    logAction(`Fetched todos successfully!`);
  } catch (e) {
    logAction(`Failed to fetch todos- error: ${e}`);
  }
}

//click anywhere in log card to `hide` or `show` log area.
document
  .getElementById("todoListHeader")
  .addEventListener("click", () =>
    toggleElementDisplay(document.getElementById("todoList"))
  );
document
  .getElementById("logCard")
  .addEventListener("click", () =>
    toggleElementDisplay(document.getElementById("log"))
  );

init();
