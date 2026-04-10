// Base URL for the Todo API
const BASE_URL = "https://mongodb.simplycodingcourses.com/simply/todo/";
const USER_ID = "DamianHaggar"; // Replace with your unique user identifier (e.g., johndoe)
const TOKEN = "8a7777d43aa8b34d1658529b4a0580d64fc6bbe43a38ab95180909e89ab90bdd"; // Replace with your token from the API Access page if different`

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
    return response.data;
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

    logAction(`posted - ${task} - ${dueDate} - ${isCompleted ? "Completed" : "Not Completed"}`);
  } catch (error) {
    console.error("Error adding todo:", error);
    logAction(`UNABLE TO POST -> ${task} , ERROR --> ${error}`);
  }
}

// Update a todo
async function updateTodo(todoId, task, dueDate, isCompleted) {
  let newDate = formatDate(dueDate);
  try {
    await axios.put(`${BASE_URL}${USER_ID}/put/${todoId}`, {
      task,
      dueDate,
      isCompleted,
      
     });
    logAction(`updated  ${task} - ${newDate} - ${isCompleted ? "Completed" : "Not Completed"}`);

  } catch (error) {
    console.error("Error updating todo:", error);
    logAction(`Failed to update!  ${task} -  ${newDate} - error: ${error}`);
  }
}

// Delete task
async function deleteTodo(todoId, task, dueDate) {
//  let newDate = formatDate(dueDate);
  try {
    await axios.delete(`${BASE_URL}${USER_ID}/delete/${todoId}`);
    logAction(`deleted ${task} - ${dueDate}`);
  } catch (error) {
    console.error("Error deleting todo:", error);
    logAction(`ERROR while attempting to delete ID: ${task} - ${dueDate} - error: ${error}`);
  }
}
// Edit a task
async function renderEditableTodo(todo) {
  let editBtn = document.getElementById("editTodoBtn");
  editBtn.taskId = todo._id;
  editBtn.style.display = "block";

  let formSubmitBtn = document.getElementById("formSubmitBtn");
  formSubmitBtn.style.display = "none";
  
  const addTask = document.getElementById("addTask");
  addTask.innerHTML="Edit Task";


  

  document.getElementById("task").value = todo.task;
// console.log(`todo due date:`,todo.dueDate)
  document.getElementById("dueDate").value = dateStringToDateElementSetableValue(
    todo.dueDate
  );

  document.getElementById("completed").checked = todo.isCompleted;
     editBtn.addEventListener('click', function() {
      document.getElementById('addTask').textContent = 'Add Task';
    });
}
// Render todo list
function renderTodos(todos) {
  const todoList = document.getElementById("todoList");
  todoList.innerHTML = "";
  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.textContent = `${todo.task} - ${todo.dueDate} - ${todo.isCompleted ? "Completed" : "Not Completed"}`;
    li.classList.add("list-group-item");
    const editButton = document.createElement("button");
    editButton.textContent = "";
    editButton.classList.add("btn", "btn-primary", "bi-pencil-square", "edit-btn",);
    editButton.onclick = async () => {
      
      todoList.childNodes.forEach ( child => { 
        child.style.backgroundColor =  `white`;
      })
      li.style.backgroundColor =  `rgb(113, 213, 243)`;
      let removeSpinner = addSpinner(editButton);
      await renderEditableTodo(todo);
      removeSpinner();
    };

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "";
    deleteButton.classList.add(
      "btn",
      "btn-danger",
      "bi-trash",
      "delete-btn",
      
    );
    deleteButton.onclick = async () => {
      let removeSpinner = addSpinner(deleteButton);
      await deleteTodo(todo._id, todo.task, todo.dueDate);
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

document.getElementById("editTodoBtn").addEventListener("click", async function (e) {
e.preventDefault();

    const task = document.getElementById("task").value;
    const dueDate = document.getElementById("dueDate").value;
    const completed = document.getElementById("completed").checked;
    const taskId = document.getElementById("editTodoBtn").taskId;
        if (!dueDate) {
      alert("Please select a date first!");
      return;
    }
      if (!task) {
      alert("Please select a task first!");
      return;
    }
    let removeSpinner = addSpinner("editTodoBtn");

    

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
  } 
  catch (e) {
    logAction(`Failed to fetch todos- error: ${e}`);
  }
}

//click to `hide` or `show`. 
document.getElementById("showList").addEventListener("click", () => toggleElementDisplay(document.getElementById("todoList")))
document.getElementById("showList2").addEventListener("click", () => toggleElementDisplay(document.getElementById("log")))

init();

