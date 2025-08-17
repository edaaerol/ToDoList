function addTask() {
  const input = document.getElementById("taskInput");
  const taskText = input.value.trim();

  if (taskText === "") return;

  const li = document.createElement("li");
  li.className = "flex justify-between items-center bg-gray-100 px-3 py-2 rounded-xl shadow";
  li.innerHTML = `
    <span>${taskText}</span>
    <button onclick="removeTask(this)" class="text-red-500 hover:text-red-700">✕</button>
  `;

  document.getElementById("taskList").appendChild(li);
  input.value = "";
}

function removeTask(button) {
  button.parentElement.remove();
}
