const STORAGE_KEY = "todo-app-tasks";
const MAX_TASKS = 100;

const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const list = document.querySelector("#todo-list");
const emptyMessage = document.querySelector("#empty-message");

const newTask = (text) => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  text,
  completed: false,
});

const loadTasks = () => {
  try {
    const savedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (!Array.isArray(savedTasks)) {
      return [];
    }

    return savedTasks.filter(
      (task) =>
        task !== null &&
        typeof task === "object" &&
        typeof task.id === "string" &&
        typeof task.text === "string" &&
        task.text.length <= 100 &&
        typeof task.completed === "boolean",
    );
  } catch {
    return [];
  }
};

let tasks = loadTasks();

const saveTasks = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // 保存できない環境でも、アプリ自体は動作させ続ける。
  }
};

const createTaskItem = (task) => {
  const item = document.createElement("li");
  item.className = "todo-item";
  item.classList.toggle("is-completed", task.completed);
  item.dataset.id = task.id;

  const checkbox = document.createElement("input");
  checkbox.className = "todo-checkbox";
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  checkbox.setAttribute("aria-label", `${task.text}を完了にする`);

  const text = document.createElement("span");
  text.className = "todo-text";
  text.textContent = task.text;

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "delete-button";
  deleteButton.textContent = "削除";
  deleteButton.setAttribute("aria-label", `${task.text}を削除`);

  item.append(checkbox, text, deleteButton);
  return item;
};

const render = () => {
  const fragment = document.createDocumentFragment();
  tasks.forEach((task) => fragment.append(createTaskItem(task)));

  list.replaceChildren(fragment);
  list.hidden = tasks.length === 0;
  emptyMessage.hidden = tasks.length > 0;
};

const setTaskCompleted = (taskId, completed) => {
  const task = tasks.find(({ id }) => id === taskId);
  if (task) {
    task.completed = completed;
    saveTasks();
  }
};

const deleteTask = (taskId) => {
  tasks = tasks.filter(({ id }) => id !== taskId);
  saveTasks();
  render();
};

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = input.value.trim();
  if (!text) {
    input.focus();
    return;
  }

  if (tasks.length >= MAX_TASKS) {
    window.alert(`タスクは最大${MAX_TASKS}件までです。`);
    return;
  }

  tasks.push(newTask(text));
  saveTasks();
  render();
  input.value = "";
  input.focus();
});

list.addEventListener("change", (event) => {
  const checkbox = event.target.closest(".todo-checkbox");
  if (!checkbox) {
    return;
  }

  const item = checkbox.closest(".todo-item");
  setTaskCompleted(item.dataset.id, checkbox.checked);
  item.classList.toggle("is-completed", checkbox.checked);
});

list.addEventListener("click", (event) => {
  const button = event.target.closest(".delete-button");
  if (button) {
    deleteTask(button.closest(".todo-item").dataset.id);
  }
});

render();

