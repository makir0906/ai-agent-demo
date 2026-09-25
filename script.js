const { getDateValue, isDateValue, isDueDateAllowed } = window.todoDateUtils;

const STORAGE_KEY = "todo-app-tasks";
const MAX_TASKS = 100;

const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const dueDateInput = document.querySelector("#due-date-input");
const list = document.querySelector("#todo-list");
const emptyMessage = document.querySelector("#empty-message");

const newTask = (text, dueDate) => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  text,
  dueDate,
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
        typeof task.completed === "boolean" &&
        (task.dueDate === undefined || task.dueDate === "" || isDateValue(task.dueDate)),
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

const updateDueDateMinimum = () => {
  dueDateInput.min = getDateValue(new Date());
};

dueDateInput.addEventListener("focus", updateDueDateMinimum);
dueDateInput.addEventListener("input", updateDueDateMinimum);

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

  const content = document.createElement("div");
  content.className = "todo-content";

  const text = document.createElement("span");
  text.className = "todo-text";
  text.textContent = task.text;

  const dueDate = document.createElement("time");
  dueDate.className = "todo-due-date";
  if (task.dueDate) {
    dueDate.dateTime = task.dueDate;
    dueDate.textContent = `期限日: ${task.dueDate}`;
  } else {
    dueDate.textContent = "期限日: 未設定";
  }

  content.append(text, dueDate);

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "delete-button";
  deleteButton.textContent = "削除";
  deleteButton.setAttribute("aria-label", `${task.text}を削除`);

  item.append(checkbox, content, deleteButton);
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
  updateDueDateMinimum();

  const text = input.value.trim();
  if (!text) {
    input.focus();
    return;
  }

  const dueDate = dueDateInput.value;
  if (!isDueDateAllowed(dueDate)) {
    dueDateInput.focus();
    return;
  }

  if (tasks.length >= MAX_TASKS) {
    window.alert(`タスクは最大${MAX_TASKS}件までです。`);
    return;
  }

  tasks.push(newTask(text, dueDate));
  saveTasks();
  render();
  input.value = "";
  dueDateInput.value = "";
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

updateDueDateMinimum();
render();

