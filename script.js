let currentUser = '';
let avatar = '😊';

function login() {
  const name = document.getElementById('username').value.trim();
  if (!name) return alert('Lütfen adınızı girin.');

  currentUser = name;
  avatar = localStorage.getItem(name + '_avatar') || '😊';

  document.getElementById('welcome').textContent = `Merhaba ${avatar} ${currentUser}`;
  document.getElementById('login-screen').classList.remove('active');
  document.getElementById('app-screen').classList.add('active');
  document.getElementById('profileName').value = currentUser;
  document.getElementById('avatarSelect').value = avatar;
  loadTasks();
}

function logout() {
  location.reload();
}

function showSection(id) {
  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function addTask() {
  const text = document.getElementById('taskInput').value.trim();
  const category = document.getElementById('taskCategory').value;
  if (!text) return alert('Görev boş olamaz!');

  const tasks = JSON.parse(localStorage.getItem(currentUser + '_tasks') || '[]');
  tasks.push({ id: Date.now(), text, category });
  localStorage.setItem(currentUser + '_tasks', JSON.stringify(tasks));
  document.getElementById('taskInput').value = '';
  loadTasks();
}

function loadTasks() {
  const list = document.getElementById('taskList');
  list.innerHTML = '';
  const tasks = JSON.parse(localStorage.getItem(currentUser + '_tasks') || '[]');

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${task.category} ${task.text}</span>
                    <button onclick="deleteTask(${task.id})">❌</button>`;
    list.appendChild(li);
  });
}

function deleteTask(id) {
  let tasks = JSON.parse(localStorage.getItem(currentUser + '_tasks') || '[]');
  tasks = tasks.filter(t => t.id !== id);
  localStorage.setItem(currentUser + '_tasks', JSON.stringify(tasks));
  loadTasks();
}

function saveProfile() {
  const newName = document.getElementById('profileName').value.trim();
  const newAvatar = document.getElementById('avatarSelect').value;

  if (!newName) return alert('Ad boş bırakılamaz!');
  localStorage.setItem(newName + '_avatar', newAvatar);
  if (newName !== currentUser) {
    const oldTasks = localStorage.getItem(currentUser + '_tasks');
    localStorage.setItem(newName + '_tasks', oldTasks);
    localStorage.removeItem(currentUser + '_tasks');
  }

  currentUser = newName;
  avatar = newAvatar;
  document.getElementById('welcome').textContent = `Merhaba ${avatar} ${currentUser}`;
  alert('Profil güncellendi!');
  loadTasks();
}
