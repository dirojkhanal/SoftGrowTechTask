// ── STATE ──
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// ── DOM ELEMENTS ──
const taskInput  = document.getElementById('taskInput');
const addBtn     = document.getElementById('addBtn');
const taskList   = document.getElementById('taskList');
const emptyMsg   = document.getElementById('emptyMsg');
const taskCount  = document.getElementById('taskCount');
const clearBtn   = document.getElementById('clearBtn');
const filterBtns = document.querySelectorAll('.filter-btn');

// ── SAVE TO LOCALSTORAGE ──
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ── RENDER TASKS ──
function render() {
  // Filter tasks based on current filter
  let filtered = tasks;
  if (currentFilter === 'active') {
    filtered = tasks.filter(function (t) { return !t.completed; });
  } else if (currentFilter === 'completed') {
    filtered = tasks.filter(function (t) { return t.completed; });
  }

  // Clear list
  taskList.innerHTML = '';

  // Show/hide empty message
  if (filtered.length === 0) {
    emptyMsg.classList.add('show');
  } else {
    emptyMsg.classList.remove('show');
  }

  // Render each task
  filtered.forEach(function (task) {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.completed ? ' completed' : '');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', function () {
      toggleTask(task.id);
    });

    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = task.text;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '×';
    deleteBtn.addEventListener('click', function () {
      removeTask(task.id);
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });

  // Update count
  const remaining = tasks.filter(function (t) { return !t.completed; }).length;
  taskCount.textContent = remaining + ' task' + (remaining !== 1 ? 's' : '') + ' left';
}

// ── ADD TASK ──
function addTask() {
  const text = taskInput.value.trim();
  if (text === '') return;

  const newTask = {
    id: Date.now(),
    text: text,
    completed: false
  };

  tasks.push(newTask);
  saveTasks();
  render();
  taskInput.value = '';
  taskInput.focus();
}

// ── TOGGLE COMPLETE ──
function toggleTask(id) {
  tasks = tasks.map(function (t) {
    if (t.id === id) {
      return { id: t.id, text: t.text, completed: !t.completed };
    }
    return t;
  });
  saveTasks();
  render();
}

// ── REMOVE TASK ──
function removeTask(id) {
  tasks = tasks.filter(function (t) { return t.id !== id; });
  saveTasks();
  render();
}

// ── CLEAR COMPLETED ──
clearBtn.addEventListener('click', function () {
  tasks = tasks.filter(function (t) { return !t.completed; });
  saveTasks();
  render();
});

// ── ADD ON BUTTON CLICK ──
addBtn.addEventListener('click', addTask);

// ── ADD ON ENTER KEY ──
taskInput.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    addTask();
  }
});

// ── FILTER BUTTONS ──
filterBtns.forEach(function (btn) {
  btn.addEventListener('click', function () {
    currentFilter = btn.getAttribute('data-filter');

    filterBtns.forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');

    render();
  });
});

// ── INITIAL RENDER ──
render();
