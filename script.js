const authSection = document.getElementById("authSection");
const todoSection = document.getElementById("todoSection");
const usernameInput = document.getElementById("username");
const welcomeMessage = document.getElementById("welcomeMessage");
const taskInput = document.getElementById("taskInput");
const dueDateInput = document.getElementById("dueDateInput");
const taskList = document.getElementById("taskList");

let currentUser = "";

function createProfile() {
  const name = usernameInput.value.trim();
  if (!name) return alert("Lütfen adınızı girin.");
  currentUser = name;
  localStorage.setItem("username", name);
  showTodoSection();
}

function showTodoSection() {
  authSection.classList.add("hidden");
  todoSection.classList.remove("hidden");
  welcomeMessage.textContent = `Merhaba, ${currentUser} 👋`;
  loadTasks();
}

function addTask() {
  const task = taskInput.value.trim();
  const dueDate = dueDateInput.value;
  if (!task) return alert("Görev boş olamaz.");

  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

  tasks.push({
    id: Date.now(),
    user: currentUser,
    text: task,
    due: dueDate,
    category: guessCategory(task)
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
  taskInput.value = "";
  dueDateInput.value = "";
  loadTasks();
}

function guessCategory(text) {
  text = text.toLowerCase();
  if (text.includes("alışveriş") || text.includes("market")) return "🛒 Alışveriş";
  if (text.includes("yemek") || text.includes("mutfak")) return "🍳 Mutfak";
  if (text.includes("iş") || text.includes("proje")) return "💼 İş";
  if (text.includes("ödev") || text.includes("ders")) return "🎓 Eğitim";
  if (text.includes("ev") || text.includes("temizlik")) return "🏠 Ev";
  return "📅 Diğer";
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  const userTasks = tasks.filter(t => t.user === currentUser);

  taskList.innerHTML = "";

  userTasks.forEach(task => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${task.category} ${task.text} ${task.due ? `📆 ${task.due}` : ""}</span>
                    <button onclick="deleteTask(${task.id})">❌</button>`;
    taskList.appendChild(li);
  });
}

function deleteTask(id) {
  let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  tasks = tasks.filter(t => t.id !== id);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}

function logout() {
  localStorage.removeItem("username");
  location.reload();
}

// Otomatik giriş
window.onload = () => {
  const savedUser = localStorage.getItem("username");
  if (savedUser) {
    currentUser = savedUser;
    showTodoSection();
  }
};
