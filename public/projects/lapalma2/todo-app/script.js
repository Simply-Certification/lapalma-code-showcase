// Base URL for the Todo API
const BASE_URL = "https://mongodb.simplycodingcourses.com/simply/todo/";
const USER_ID = "BuzzelleID"; // Replace with your unique user identifier (e.g., johndoe)
const TOKEN =
  "1d2592448f7cc0fbdc4e5f60b2dd702a16759e72bcb80bc830a17a80af59891d"; // Replace with your token from the API Access page if different

// Axios configuration with Authorization header
axios.defaults.headers.common["Authorization"] = `Bearer ${TOKEN}`;

// Utility function to log actions
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
  try {
    await axios.post(`${BASE_URL}${USER_ID}/post`, {
      task,
      dueDate,
      isCompleted,
    });

    logAction(`New Task added to Todo ${task} ${dueDate} ${isCompleted}`);
  } catch (error) {
    console.error("Error adding todo:", error);
    logAction(`UNABLE TO POST -> ${task} , ERROR --> ${error}`);
  }
  // Advanced: POST with error handling, user feedback
}

async function updateTodo(
  todoId,
  taskParameter,
  dueDateParameter,
  isCompleted
) {
  try {
    await axios.put(`${BASE_URL}${USER_ID}/put/${todoId}`, {
      taskParameter,
      dueDateParameter,
      isCompleted,
    });
    logAction(
      `Task IsCompleted updated  ${taskParameter} ${
        dueDateParameter?.split("T")[0]
      } ${isCompleted}`
    );
  } catch (error) {
    console.error("Error updating todo:", error);
    logAction(
      `Failed to update! -> ${taskParameter} - ${
        dueDateParameter?.split("T")[0]
      } - ${isCompleted} - error: ${error}`
    );
  }

  init();
}

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
    taskInput.classList.add("is-invalid");
    logAction(`Please fill out task form input`);
  } else if (!dueDate) {
    dueDateInput.classList.add("is-invalid");
    logAction(`Please fill out date form input`);
  } else {
    dueDateInput.classList.remove("is-invalid");
    taskInput.classList.remove("is-invalid");
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

// Delete a todo
async function deleteTodo(todoId, task, dueDate) {
  // Simple: Basic DELETE request
  // await axios.delete(`${BASE_URL}${USER_ID}/delete/${todoId}`);
  // Medium: DELETE with error handling
  try {
    await axios.delete(`${BASE_URL}${USER_ID}/delete/${todoId}`);
    init();
    logAction(`Task deleted ${task} ${dueDate}`);
  } catch (error) {
    console.error("Error deleting todo:", error);
    logAction(`ERROR while attempting to delete ID: ${todoId}, ${error}`);
  }
  // Advanced: DELETE with error handling, user feedback
}

function renderTodos(todos) {
  const todoList = document.getElementById("todoList");
  todoList.innerHTML = "";
  todos.forEach((todo) => {
    console.log(todo);
    const li = document.createElement("li");
    li.textContent = `${todo.task} - ${formatDate(todo.dueDate)} `;
    li.classList.add("list-group-item");

    // const dueDateInput = document.getElementById("dueDate");
    // const completedInput = document.getElementById("completed");

    // const dueDate = dueDateInput.value;
    // const isCompleted = completedInput.checked;
    //  const isOverdue = !isComplete && new Date() > dueDate;

    // if (isOverdue) {
    //   console.log("does it make it here?")
    //   li.style.backgroundColor = "rgb(255, 153, 153)";
    // } else if (!todo.isCompleted) {
    //   li.style.backgroundColor = "rgb(255, 255, 153)";
    // } else {
    //   li.style.backgroundColor = "rgb(128, 255, 170)";
    // }

    li.style.backgroundColor = todo.isCompleted
      ? "rgb(128, 255, 170)"
      : new Date(todo.dueDate) - new Date() > 0
      ? "rgb(255, 255, 153)"
      : "rgb(255, 153, 153)";

    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.classList.add("form-check-input");
    checkBox.checked = todo.isCompleted;
    checkBox.onclick = () => {
      updateTodo(todo._id, todo.task, todo.dueDate, !todo.isCompleted);
    };
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add(
      "btn",
      "btn-outline-info",
      "edit-btn",
      "btn-sm",
      "bi-pencil",
    );
    
    editButton.onclick = () => {
      document.getElementById("newTask").value = todo.task;
      document.getElementById("newDueDate").value = todo.dueDate?.split("T")[0];
      document.getElementById("newCompleted").checked = todo.isCompleted;
      openModal(todo._id);
    };
    const deleteButton = document.createElement("button");
    deleteButton.onclick = () =>
      deleteTodo(todo._id, todo.task, todo.dueDate?.split("T")[0]);
    deleteButton.textContent = "Delete";
    deleteButton.classList.add(
      "btn",
      "btn-outline-danger",
      "delete-btn",
      "btn-sm",
      "bi-trash"
    );
    li.appendChild(checkBox);
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
  const isCompleted = document.getElementById("completed").checked;

  // Medium: Add todo, clear form, refresh list
  await addTodo(task, dueDate, isCompleted);
  document.getElementById("todoForm").reset();
  const todos = await fetchTodos();
  renderTodos(todos);

  // Advanced: Validate input, add todo, refresh list, clear form
});

// Delete todo handler
async function deleteTodoHandler(todoId) {
  await deleteTodo(todoId);
  const todos = await fetchTodos();
  renderTodos(todos);
  // Advanced: Confirm deletion, delete, refresh
}

// Initialize app
async function init() {
  // Medium: Fetch with basic error logging
  const todos = await fetchTodos();
  if (todos.length === 0) console.log("No todos found.");
  renderTodos(todos);
  // Advanced: Fetch with user feedback
}

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

flatpickr("#dueDate", {
  dateFormat: "Y-m-d",
  enableTime: false,
});

flatpickr("#newDueDate", {
  dateFormat: "Y-m-d",
  enableTime: false,
});

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
      `hsl(175,${Math.random() * 110}%,${Math.random() * 100}%)`
    );
  }
});
/*
usage: 
x,y are x and y coordinates on the viewport(you could get these in response to an onclick event, they
have .x and .y event properties that show where the mouse clicked)

particalLife is time in Milliseconds  before particle dissolves, i.e. 500 is 1/2 second.

particleSpeed is a smaller number multiplied by the speed.
e.g. 1.0 is normal speed, 2.0 is twice as face, 3.0 is three times as fast

particleAngleStart is the starting angle
particleAngleEnd is the ending angle
e.g. anywhere in a circle would be 0, and 360 for those two arguments respectively
e.g. anywhere in the left side of vertical would be 90, and 270 for those two arguments respectively
e.g. anywhere in the right side of vertical would be 270, and 90,  for those two arguments respectively


particleMinSize is the minimum div(particle) size in px.
particleMaxSize is the Maximum div(particle) size in px.
they are randomly generated between that range.
particleColor can be any valid CSS backgroundColor property, if left blank, its random


example usage: 

button.onclick = (event) => { 
     for (let i = 0; i < 30; i++) {
      particle(
        event.x,
        event.y,
        Math.random() * 100,
        Math.random() * 3,
        0,
        360,
        0,
        8,
        `hsl(300,${Math.random() * 100}%,${Math.random() * 100}%)`
      );
    }
  }
 
this will create 30 particles each button click event, centered at the 
button click of the mouse, 3 times normal speed, with a random life of up to 100milliseconds
0,360,  means shoot out anywhere in a circle from the center point.
of random sizes 0px to 8px in size

and that is 
`hsl(300,${Math.random() * 100}%,${Math.random() * 100}%)`
hsl(300,%,%) gives like a magenta, with random intensity and lightness
    
*/
function particle(
  x,
  y,
  particleLife,
  particleSpeed,
  particleAngleStart,
  particleAngleEnd,
  particleMinSize,
  particleMaxSize,
  particleColor
) {
  let newParticle = document.createElement("div");
  let size = `${Math.random() * particleMaxSize + particleMinSize}px`;
  newParticle.style.width = size;
  newParticle.style.height = size;
  newParticle.style.borderRadius = "50%";
  newParticle.style.backgroundColor = particleColor
    ? particleColor
    : `hsl(${Math.random() * 360},75%,75%)`;

  newParticle.style.position = "absolute";
  newParticle.x = x;
  newParticle.y = y;
  newParticle.style.left = `${newParticle.x}px`;
  newParticle.style.top = `${newParticle.y}px`;
  newParticle.style.zIndex = `10`;

  document.body.appendChild(newParticle);
  let timeOut = particleLife
    ? particleLife + 1
    : Math.floor(Math.random() * 250);
  let randomDir =
    Math.random() * (particleAngleEnd - particleAngleStart) +
    particleAngleStart;

  randomDir *= Math.PI / 180; //convert to radians;
  let vx = Math.cos(randomDir) * particleSpeed;
  let vy = Math.sin(randomDir) * particleSpeed;
  let movementInterval = setInterval(() => {
    timeOut = timeOut - 1;
    if (timeOut > 0) {
      newParticle.x += vx;
      newParticle.y += vy;
      newParticle.style.left = `${newParticle.x}px`;
      newParticle.style.top = `${newParticle.y}px`;
    } else {
      newParticle.parentElement.removeChild(newParticle);
      clearInterval(movementInterval);
    }
  }, 10);
}
