// Base URL for the Todo API
const BASE_URL = "https://mongodb.simplycodingcourses.com/simply/todo/";
const USER_ID = "gussie"; // Replace with your unique user identifier (e.g., johndoe)
const TOKEN = "f5dd5547c1c7714caa00cfdb69d597da7911842a4a7e923b269533edb5078b64"; // Replace with your token from the API Access page if different

// Axios configuration with Authorization header
axios.defaults.headers.common["Authorization"] = `Bearer ${TOKEN}`;
// Utility function to log actions
function logAction(action) {
  // Simple: Log to console
  // console.log(action);
  // Medium: Append to log area
 const log = document.getElementById("log");
  let newP = document.createElement("p");
  newP.textContent = action;
  log.appendChild(newP);
  log.scrollTop = log.scrollHeight;
  console.log(action);
  // Advanced: Append as paragraph, auto-scroll
}

// Utility function to format date
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
  // Simple: Basic GET request
  // const response = await axios.get(`${BASE_URL}${USER_ID}/get`);
  // return response.data;
  // Medium: GET with error handling
  try {
      const response = await axios.get(`${BASE_URL}${USER_ID}/get`);
      return response.data;
  } catch (error) {
      console.error('Error fetching todos:', error);
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
      await axios.post(`${BASE_URL}${USER_ID}/post`, { task, dueDate, completed });

      logAction(`task added ${task} ${dueDate}`)
  } catch (error) {
      console.error('Error adding todo:', error);
  }
  document.getElementById("todoList").addEventListener("click", function(event){

    
  event.preventDefault()
  // Advanced: POST with error handling, user feedback
  
});
}

// Update a todo
async function updateTodo(todoId, task, dueDate, completed) {
  // Simple: Basic PUT request
  // await axios.put(`${BASE_URL}${USER_ID}/put/${todoId}`, { task, dueDate, completed });
  // Medium: PUT with error handling
  try {
      await axios.put(`${BASE_URL}${USER_ID}/put/${todoId}`, { task, dueDate, completed });
  } catch (error) {
      console.error('Error updating todo:', error);
  }
  init();
  // Advanced: PUT with error handling, user feedback
}



async function completeTodo(todoId,taskParameter,dueDateParameter,isCompleted) {
  console.log(todoId,isCompleted )
 try {
      await axios.put(`${BASE_URL}${USER_ID}/put/${todoId}`, {
        taskParameter,
        dueDateParameter,
        isCompleted,
      });
      logAction(`Task completed updated  ${taskParameter} ${dueDateParameter?.split("T")[0]} ${isCompleted}`);
    } catch (error) {
      console.error("Error updating todo:", error);
      logAction(
        `Failed to update! -> ${taskParameter} - ${dueDateParameter?.split("T")[0]} - ${isCompleted} - error: ${error}`
      );
    }

   await init();
}





// Delete a todo
async function deleteTodo(todoId) {
  // Simple: Basic DELETE request
  // await axios.delete(`${BASE_URL}${USER_ID}/delete/${todoId}`);
  // Medium: DELETE with error handling
  try {
      await axios.delete(`${BASE_URL}${USER_ID}/delete/${todoId}`);
      logAction(`task deleted`);
init();   
    } catch (error) {
      console.error('Error deleting todo:', error);
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
  const todoList = document.getElementById('todoList');
  todoList.innerHTML = '';
  todos.forEach(todo => {
      const li = document.createElement('li');
      li.textContent = `${todo.task} - ${formatDate(todo.dueDate)}`;
      const checkBox = document.createElement("input");
      checkBox.type = "checkbox";
      checkBox.checked = todo.isCompleted;
      checkBox.onclick = async () => { 
      await completeTodo(todo._id,todo.task,todo.dueDate,!todo.isCompleted)
    };
      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.onclick = () => editTodo(todo._id);
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.onclick = () => deleteTodo(todo._id);
      li.appendChild(editButton);
      li.appendChild(deleteButton);
      li.appendChild(checkBox)
      todoList.appendChild(li);
  });
  // Advanced: Full rendering with edit/delete functionality
}

// Handle form submission
document.getElementById("todoForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const task = document.getElementById("task").value;
  const dueDate = document.getElementById("dueDate").value;
  const completed = document.getElementById("completed");

  // Simple: Add todo and clear form
  // await addTodo(task, dueDate, completed);
  // document.getElementById('todoForm').reset();

  // Medium: Add todo, clear form, refresh list
  await addTodo(task, dueDate, completed);
  document.getElementById('todoForm').reset();
  const todos = await fetchTodos();
  renderTodos(todos);

  // Advanced: Validate input, add todo, refresh list, clear form
});

// Edit todo handler
function editTodo(todoId, task, dueDate, completed) {
  // Simple: Prompt for new task
  // const newTask = prompt('Enter new task:', task);
  // if (newTask) updateTodo(todoId, newTask, dueDate, completed);
  // Medium: Prompt for task and date
  const newTask = prompt('Enter new task:', task);
  const newDueDate = prompt('Enter new due date (YYYY-MM-DD):', dueDate);
  if (newTask && newDueDate) updateTodo(todoId, newTask, newDueDate, completed);
     logAction(`task updated to : ${newTask} ${newDueDate}`);
    //  renderTodos(todos)
    init();
    
  
  // Advanced: Prompt for all fields, validate, update
}

// Delete todo handler
async function deleteTodoHandler(todoId) {
  // Simple: Delete todo
  // await deleteTodo(todoId);
  // Medium: Delete and refresh
  await deleteTodo(todoId);
  const todos = await fetchTodos();
  logAction(`action logged ${task} ${dueDate}`);
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
  if (todos.length === 0) console.log('No todos found.');
  renderTodos(todos);
  // Advanced: Fetch with user feedback
}

document.body.addEventListener("click", (e) => { 
console.log(e)
    for (let i = 0; i < 25; i++) {
      particle(
        e.pageX,
        e.pageY,
        Math.random() * 50,
        Math.random() * 6,
        0,
        360,
        1,
        3,
        `hsl(84,${Math.random() * 100}%,${Math.random() * 100}%)`
      );
    }
})





init();







