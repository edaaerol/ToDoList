// Menü butonları ve sayfa bölümleri
const navBtns = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.section');

navBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    navBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const target = btn.getAttribute('data-section');
    sections.forEach(sec => {
      sec.classList.toggle('active', sec.id === target);
    });
  });
});

// Kullanıcı adı kaydetme & yükleme
const usernameInput = document.getElementById('usernameInput');
const saveProfileBtn = document.getElementById('saveProfileBtn');
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const dueDateInput = document.getElementById('dueDateInput');
const taskList = document.getElementById('taskList');

let currentUser = localStorage.getItem('todo_username') || '';

if (!currentUser) {
  currentUser = prompt('Kullanıcı adınızı giriniz:') || 'Misafir';
  localStorage.setItem('todo_username', currentUser);
}

usernameInput.value = currentUser;

// Görevleri yükle ve göster
function loadTasks() {
  const allTasks = JSON.parse(localStorage.getItem('todo_tasks') || '[]');
  const userTasks = allTasks.filter(task => task.user === currentUser);

  taskList.innerHTML = '';

  if (userTasks.length === 0) {
    taskList.innerHTML = '<li>Görev eklenmedi.</li>';
    return;
  }

  userTasks.forEach(task => {
    const li = document.createElement('li');
    li.textContent = `${task.text}${task.dueDate ? ' (Son: ' + task.dueDate + ')' : ''}`;
    if (task.completed) li.classList.add('completed');

    // Tıklayınca tamamla
    li.addEventListener('click', () => toggleComplete(task.id));

    // Sil butonu
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Sil';
    delBtn.classList.add('delete-btn');
    delBtn.addEventListener('click', e => {
      e.stopPropagation();
      deleteTask(task.id);
    });
    li.appendChild(delBtn);

    taskList.appendChild(li);
  });
}

// Yeni görev ekle
taskForm.addEventListener('submit', e => {
  e.preventDefault();

  const text = taskInput.value.trim();
  if (!text) return alert('Görev boş olamaz!');

  const dueDate = dueDateInput.value;

  const allTasks = JSON.parse(localStorage.getItem('todo_tasks') || '[]');

  allTasks.push({
    id: Date.now().toString(),
    text,
    dueDate,
    completed: false,
    user: currentUser
  });

  localStorage.setItem('todo_tasks', JSON.stringify(allTasks));
  taskInput.value = '';
  dueDateInput.value = '';

  loadTasks();
});

// Görev tamamla
function toggleComplete(id) {
  const allTasks = JSON.parse(localStorage.getItem('todo_tasks') || '[]');

  const task = allTasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
  }

  localStorage.setItem('todo_tasks', JSON.stringify(allTasks));
  loadTasks();
}

// Görev sil
function deleteTask(id) {
  let allTasks = JSON.parse(localStorage.getItem('todo_tasks') || '[]');

  allTasks = allTasks.filter(t => t.id !== id);

  localStorage.setItem('todo_tasks', JSON.stringify(allTasks));
  loadTasks();
}

// Profil kaydet
saveProfileBtn.addEventListener('click', () => {
  const newName = usernameInput.value.trim();
  if (!newName) {
    alert('Kullanıcı adı boş olamaz!');
    return;
  }

  // Kullanıcı adını değiştir, görevlerin user bilgisini de güncelle
  const allTasks = JSON.parse(localStorage.getItem('todo_tasks') || '[]');

  allTasks.forEach(task => {
    if (task.user === currentUser) {
      task.user = newName;
    }
  });

  localStorage.setItem('todo_tasks', JSON.stringify(allTasks));
  currentUser = newName;
  localStorage.setItem('todo_username', currentUser);
  alert('Profil başarıyla güncellendi!');
  loadTasks();
});

// İlk yüklemede görevleri göster
loadTasks();
