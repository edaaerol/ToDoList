// Elementler
const authSection = document.getElementById('authSection');
const homeSection = document.getElementById('homeSection');
const todoSection = document.getElementById('todoSection');
const profileSection = document.getElementById('profileSection');

const usernameInput = document.getElementById('usernameInput');
const welcomeText = document.getElementById('welcomeText');
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const dueDateInput = document.getElementById('dueDateInput');
const taskList = document.getElementById('taskList');
const themeToggleBtn = document.getElementById('themeToggleBtn');

const profileUsernameInput = document.getElementById('profileUsername');
const saveProfileBtn = document.getElementById('saveProfileBtn');
const logoutBtn = document.getElementById('logoutBtn');

const navButtons = document.querySelectorAll('.nav-btn');

let currentUser = null;

// Sayfa yüklendiğinde
window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
  }

  const storedUser = localStorage.getItem('todo_user');
  if (storedUser) {
    currentUser = storedUser;
    showApp();
  } else {
    showSection('authSection');
  }
});

// Menü butonları event
navButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    if (!currentUser) {
      alert('Önce giriş yapmalısınız!');
      showSection('authSection');
      return;
    }
    const target = btn.getAttribute('data-target');
    showSection(target);

    navButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    if(target === 'todoSection') loadTasks();
    if(target === 'profileSection') loadProfile();
  });
});

// Giriş yap
document.getElementById('startBtn').addEventListener('click', () => {
  const name = usernameInput.value.trim();
  if (!name) {
    alert('Lütfen kullanıcı adınızı giriniz!');
    return;
  }
  currentUser = name;
  localStorage.setItem('todo_user', currentUser);
  showApp();
});

// Uygulamayı göster
function showApp() {
  authSection.classList.add('hidden');
  showSection('homeSection');
  updateWelcomeText();
  setActiveNav('homeSection');
}

// Bölüm gösterme fonksiyonu
function showSection(id) {
  [authSection, homeSection, todoSection, profileSection].forEach((sec) => {
    if (sec.id === id) {
      sec.classList.remove('hidden');
    } else {
      sec.classList.add('hidden');
    }
  });
}

// Nav buton aktiflik ayarı
function setActiveNav(id) {
  navButtons.forEach((btn) => {
    if (btn.getAttribute('data-target') === id) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// Welcome text güncelle
function updateWelcomeText() {
  welcomeText.textContent = `Hoşgeldiniz, ${currentUser}`;
}

// Tema değiştir
themeToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  if (document.body.classList.contains('dark')) {
    localStorage.setItem('theme', 'dark');
  } else {
    localStorage.setItem('theme', 'light');
  }
});

// Görev ekle
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
    completed: false,
  });
  localStorage.setItem('todo_tasks', JSON.stringify(tasks));

  taskInput.value = '';
  dueDateInput.value = '';

  loadTasks();
  showSection('todoSection');
  setActiveNav('todoSection');
});

// Görevleri yükle
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
    if (task.completed) textSpan.classList.add('task-completed');

    // Tamamlandı toggle
    textSpan.addEventListener('click', () => toggleComplete(task.id));

    li.appendChild(textSpan);

    if (task.dueDate) {
      const dateSpan = document.createElement('span');
      dateSpan.classList.add('task-date');
      dateSpan.textContent = formatDate(task.dueDate);

      // Tarih tıklayınca da tamamlandı toggle
      dateSpan.addEventListener('click', () => toggleComplete(task.id));

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

// Görev tamamlandı toggle
function toggleComplete(id) {
  let tasks = JSON.parse(localStorage.getItem('todo_tasks')) || [];
  tasks = tasks.map((task) => {
    if (task.id === id) {
      task.completed = !task.completed;
    }
    return task;
  });
  localStorage.setItem('todo_tasks', JSON.stringify(tasks));
  loadTasks();
}

// Görev sil
function deleteTask(id) {
  let tasks = JSON.parse(localStorage.getItem('todo_tasks')) || [];
  tasks = tasks.filter((task) => task.id !== id);
  localStorage.setItem('todo_tasks', JSON.stringify(tasks));
  loadTasks();
}

// Profil yükle
function loadProfile() {
  profileUsernameInput.value = currentUser;
}

// Profil kaydet
saveProfileBtn.addEventListener('click', () => {
  const newName = profileUsernameInput.value.trim();
  if (!newName) {
    alert('Kullanıcı adı boş olamaz!');
    return;
  }
  // Kullanıcı adını değiştir ve kaydet
  changeUsername(newName);
  alert('Profil güncellendi!');
});

// Kullanıcı adı değiştir
function changeUsername(newName) {
  const tasks = JSON.parse(localStorage.getItem('todo_tasks')) || [];
  // Kullanıcının tüm görevlerindeki user alanını güncelle
  tasks.forEach((task) => {
    if (task.user === currentUser) {
      task.user = newName;
    }
  });
  localStorage.setItem('todo_tasks', JSON.stringify(tasks));
  currentUser = newName;
  localStorage.setItem('todo_user', currentUser);
  updateWelcomeText();
}

// Çıkış yap
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('todo_user');
  location.reload();
});
