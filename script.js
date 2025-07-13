const authSection = document.getElementById('authSection');
const todoSection = document.getElementById('todoSection');
const usernameInput = document.getElementById('usernameInput');
const welcomeText = document.getElementById('welcomeText');
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const dueDateInput = document.getElementById('dueDateInput');
const taskList = document.getElementById('taskList');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const logoutBtn = document.getElementById('logoutBtn');

let currentUser = null;

window.addEventListener('DOMContentLoaded', () => {
  // Tema kontrolü
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
  }

  // Kullanıcı var mı?
  const storedUser = localStorage.getItem('todo_user');
  if (storedUser) {
    currentUser = storedUser;
    showTodoSection();
    loadTasks();
  }
});

// Profil oluşturma
document.getElementById('startBtn').addEventListener('click', () => {
  const name = usernameInput.value.trim();
  if (!name) {
    alert('Lütfen kullanıcı adınızı giriniz!');
    return;
  }
  currentUser = name;
  localStorage.setItem('todo_user', currentUser);
  showTodoSection();
  loadTasks();
});

function showTodoSection() {
  authSection.classList.add('hidden');
  todoSection.classList.remove('hidden');
  welcomeText.textContent = `Hoşgeldiniz, ${currentUser}`;
}

// Çıkış
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('todo_user');
  location.reload();
});

// Tema değiştirme
themeToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  if (document.body.classList.contains('dark')) {
    localStorage.setItem('theme', 'dark');
  } else {
    localStorage.setItem('theme', 'light');
  }
});

// Görev ekleme
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const text = taskInput.value.trim();
  const dueDate = dueDateInput.value;

  if (!text) return;

  const tasks = JSON.parse(localStorage.getItem('todo_tasks')) || [];
  tasks.push({
    user: currentUser,
    text,
    dueDate,
    id: Date.now(),
  });
  localStorage.setItem('todo_tasks', JSON.stringify(tasks));

  taskInput.value = '';
  dueDateInput.value = '';

  loadTasks();
});

// Görevleri yükleme
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('todo_tasks')) || [];
  taskList.innerHTML = '';

  const userTasks = tasks.filter((task) => task.user === currentUser);

  if (userTasks.length === 0) {
    const noTask = document.createElement('li');
    noTask.textContent = 'Henüz görev eklenmedi.';
    noTask.style.fontStyle = 'italic';
    noTask.style.color = '#777';
    taskList.appendChild(noTask);
    return;
  }

  userTasks.forEach((task) => {
    const li = document.createElement('li');

    const textSpan = document.createElement('span');
    textSpan.classList.add('task-text');
    textSpan.textContent = task.text;

    li.appendChild(textSpan);

    if (task.dueDate) {
      const dateSpan = document.createElement('span');
      dateSpan.classList.add('task-date');
      dateSpan.textContent = formatDate(task.dueDate);
      li.appendChild(dateSpan);
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.textContent = 'Sil';
    deleteBtn.title = 'Görevi sil';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    li.appendChild(deleteBtn);

    taskList.appendChild(li);
  });
}

// Tarih formatlama (gg.aa.yyyy)
function formatDate(dateStr) {
  const [year, month, day] = dateStr.split('-');
  return `${day}.${month}.${year}`;
}

// Görev silme
function deleteTask(id) {
  let tasks = JSON.parse(localStorage.getItem('todo_tasks')) || [];
  tasks = tasks.filter((task) => task.id !== id);
  localStorage.setItem('todo_tasks', JSON.stringify(tasks));
  loadTasks();
}
