// Base URL for the Todo API
const BASE_URL = "https://mongodb.simplycodingcourses.com/simply/todo/";
const USER_ID = "McCabe_354838";
const TOKEN =
  "7b87ac1ee8bf04d5903c64a50d20dd7f23962f0ca6c599a4a43a2916ab86828f";

// Axios configuration with Authorization header
axios.defaults.headers.common["Authorization"] = `Bearer ${TOKEN}`;

// Utility function to log actions
function logAction(action) {
  // Simple: Log to console
  // console.log(action);
  // Medium: Append to log area
  const log = document.getElementById("log");
  // log.innerHTML += "<p>" + action + "</p>";
  // Advanced: Append as paragraph, auto-scroll
  let pText = document.createElement("p");
  pText.textContent = action;
  log.appendChild(pText);
  log.scrollTop = log.scrollHeight;
}

// Utility function to format date
function formatDate(dateString) {
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
    logAction(`Failed to fetch Todos`);
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
    // formatDate();
    logAction(
      `Added task: ${task}. Due: ${dueDate}. Completed: ${
        isCompleted ? "Yes..?" : "Not yet. I was just created."
      }`
    );
  } catch (error) {
    console.error("Error adding todo:", error);
    logAction(`Failed to add Todos`);
  }

  // Advanced: POST with error handling, user feedback
}

// Update a todo
async function updateTodo(
  todoId,
  task,
  dueDate,
  isCompleted,
  oldTask,
  newDueDate
) {
  // Simple: Basic PUT request
  // await axios.put(`${BASE_URL}${USER_ID}/put/${todoId}`, { task, dueDate, completed });
  // Medium: PUT with error handling
  // console.log(`Did I get here?`);
  try {
    await axios.put(`${BASE_URL}${USER_ID}/put/${todoId}`, {
      task,
      dueDate,
      isCompleted,
    });
    if (oldTask == task) {
      logAction(
        `${task} has been updated: New due date: ${newDueDate} Completed: ${
          isCompleted ? "Yes! Well Done!" : "No... Keep going!"
        }`
      );
    } else {
      logAction(
        `Task: ${oldTask} was updated to: ${task} Due by: ${newDueDate} Completed: ${
          isCompleted ? "Yes! Good Job!" : "Not yet. Don't give up! "
        }`
      );
    }
  } catch (error) {
    console.error("Error updating todo:", error);
    logAction(`Failed to update Todos`);
  }
  // Advanced: PUT with error handling, user feedback
}

// Delete a todo
async function deleteTodo(todoId, task, isCompleted) {
  // Simple: Basic DELETE request
  // await axios.delete(`${BASE_URL}${USER_ID}/delete/${todoId}`);
  // Medium: DELETE with error handling

  try {
    await axios.delete(`${BASE_URL}${USER_ID}/delete/${todoId}`);
    isCompleted
      ? logAction(
          `Task: ${task} is complete and has been deleted. Bye, "${task}"!`
        )
      : logAction(
          `Task: ${task} was deleted, but... Failed to complete ${task}!`
        );

    init();
  } catch (error) {
    console.error("Error deleting todo:", error);
    logAction(`Failed to delete Todos`);
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
  todos.forEach((todo, index) => {
    const li = document.createElement("li");
    li.id = todo._id;

    const displayDiv = document.createElement("div");
    displayDiv.style.display = "inline-block";
    displayDiv.innerHTML = `<div class="isCompleted">${
      todo.isCompleted ? "&#9989;" : "&#10060;"
    }</div> <div class="theTodo">${
      todo.task
    }</div> <div class="theDate">${formatDate(todo.dueDate)}</div>`;

    const editButton = document.createElement("button");
    editButton.classList = "edit-btn";
    editButton.textContent = "Edit";
    async function editFunction() {
      displayDiv.innerHTML = ``;
      let ourCheck = document.createElement("input");
      let ourText = document.createElement("input");
      let ourDate = document.createElement("input");
      ourCheck.classList.add("edit-input");
      ourText.classList.add("edit-input");
      ourDate.classList.add("edit-input");
      ourDate.setAttribute("id", `newDueDate-${index}`);
      ourCheck.setAttribute("type", "checkbox");
      ourText.setAttribute("type", "text");
      ourText.setAttribute("value", todo.task);
      // ourDate.setAttribute("type", "text");
      ourDate.setAttribute("value", todo.dueDate.split("T")[0]);
      displayDiv.appendChild(ourCheck);
      displayDiv.appendChild(ourText);
      displayDiv.appendChild(ourDate);

      await flatpickr(ourDate, {
        dateFormat: "Y-m-d",
        enableTime: false,
      });

      ourCheck.checked = todo.isCompleted;

      // editTodo(todo._id)
      editButton.textContent = "change!";
      const oldTask = todo.task;
      editButton.onclick = async () => {
        const newDueDate = ourDate.value;
        await updateTodo(
          todo._id,
          ourText.value,
          ourDate.value,
          ourCheck.checked,
          oldTask,
          newDueDate
        );
        editButton.textContent = "edit";
        editButton.onclick = editFunction;
        init();
      };
    }
    editButton.onclick = editFunction;

    const deleteButton = document.createElement("button");
    deleteButton.classList = "delete-btn";
    deleteButton.textContent = "Delete";
    deleteButton.onclick = () =>
      deleteTodo(todo._id, todo.task, todo.isCompleted);
    li.appendChild(displayDiv);
    li.appendChild(editButton);
    li.appendChild(deleteButton);
    todoList.appendChild(li);
  });
  // Advanced: Full rendering with edit/delete functionality

  // Jesus is NOT GOD
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
// function editTodo(todoId, task, dueDate, isCompleted) {
//   // Simple: Prompt for new task
//   // const newTask = prompt('Enter new task:', task);
//   // if (newTask) updateTodo(todoId, newTask, dueDate, completed);
//   // Medium: Prompt for task and date

//   // Remove prompts. Replace with...?

//   const newTask = prompt("Enter new task:", task);
//   // let editModal = document.getElementById("myModal");
//   // const newTask = document.createElement("input");
//   // task.textContent = newTask.value;
//   // editModal.appendChild(newTask);

//   const newDueDate = prompt("Enter new due date (YYYY-MM-DD):", dueDate);

//   if (newTask && newDueDate)
//     updateTodo(todoId, newTask, newDueDate, isCompleted);
//   // Advanced: Prompt for all fields, validate, update
//   logAction(
//     `Task edited: ${newTask}. Due: ${newDueDate}. Completed: ${isCompleted}`
//   );
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
  if (todos.length === 0) {
    console.log("No todos found.");
    logAction(`Failed to locate any Todos. Please add a task.`);
  }
  renderTodos(todos);
  // Advanced: Fetch with user feedback
}

init();

flatpickr("#dueDate", {
  dateFormat: "Y-m-d",
  enableTime: false,
});
