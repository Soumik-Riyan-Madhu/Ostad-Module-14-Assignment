
// ==========================================
// TASKFLOW - TODO APPLICATION
// Backend: Node.js + Express + MongoDB
// Frontend: HTML + CSS + Vanilla JavaScript
// ==========================================

const API_URL = "/todos";

// DOM Elements
const todoForm = document.getElementById("todoForm");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");

const todoList = document.getElementById("todoList");

const submitBtn = document.getElementById("submitBtn");
const cancelEditBtn = document.getElementById("cancelEdit");
const formHeading = document.getElementById("formHeading");

const searchInput = document.getElementById("searchInput");
const refreshBtn = document.getElementById("refreshBtn");

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");

const connectionStatus = document.getElementById("connectionStatus");
const statusContainer = document.querySelector(".api-status");


// Application State
let todos = [];
let currentFilter = "all";
let editingTodoId = null;


// ==========================================
// API REQUEST HANDLER
// ==========================================

async function apiRequest(endpoint = "", options = {}) {

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        }
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Something went wrong!");
    }

    return result;
}


// ==========================================
// TOAST NOTIFICATION
// ==========================================

let toastTimer;

function showToast(message, type = "success") {

    toastMessage.textContent = message;

    const icon = toast.querySelector("i");

    icon.className = type === "error"
        ? "fa-solid fa-circle-exclamation"
        : "fa-solid fa-circle-check";

    icon.style.color = type === "error"
        ? "#ff6570"
        : "#35d69a";

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}


// ==========================================
// HTML ESCAPING
// ==========================================

function escapeHTML(value = "") {

    return String(value).replace(/[&<>"']/g, character => {

        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return entities[character];
    });
}


// ==========================================
// DATE FORMATTER
// ==========================================

function formatDate(date) {

    if (!date) return "Recently added";

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
        return "Recently added";
    }

    return parsedDate.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}


// ==========================================
// LOAD ALL TODOS
// GET /todos
// ==========================================

async function loadTodos() {

    todoList.innerHTML = `
        <div class="loading-state">
            <i class="fa-solid fa-circle-notch fa-spin"></i>
            <p>Loading your tasks...</p>
        </div>
    `;

    try {

        const result = await apiRequest();

        todos = result.data || [];

        // Update API Connection Status
        connectionStatus.textContent = "API Connected";
        statusContainer.classList.add("connected");
        statusContainer.classList.remove("disconnected");

        renderTodos();

    } catch (error) {

        connectionStatus.textContent = "API Offline";
        statusContainer.classList.remove("connected");
        statusContainer.classList.add("disconnected");

        todoList.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-cloud-slash"></i>
                <h3>Connection Failed</h3>
                <p>${escapeHTML(error.message)}</p>
                <button onclick="loadTodos()">
                    Try Again
                </button>
            </div>
        `;

        updateStats([]);
        document.getElementById("taskCount").textContent = "(0)";
    }
}


// ==========================================
// UPDATE STATISTICS
// ==========================================

function updateStats(data) {

    const total = data.length;

    const completed = data.filter(todo => todo.completed).length;

    const remaining = total - completed;

    const percentage = total > 0
        ? Math.round((completed / total) * 100)
        : 0;

    document.getElementById("totalTasks").textContent = total;

    document.getElementById("completedTasks").textContent = completed;

    document.getElementById("remainingTasks").textContent = remaining;

    document.getElementById("progressPercentage").textContent =
        `${percentage}%`;

    document.getElementById("progressBar").style.width =
        `${percentage}%`;

    // Filter Counters
    document.getElementById("allCount").textContent = total;

    document.getElementById("activeCount").textContent = remaining;

    document.getElementById("doneCount").textContent = completed;
}


// ==========================================
// RENDER TODOS
// ==========================================

function renderTodos() {

    updateStats(todos);

    const searchTerm = searchInput.value.toLowerCase().trim();

    let filteredTodos = [...todos];

    // Apply Filter
    if (currentFilter === "active") {

        filteredTodos = filteredTodos.filter(
            todo => !todo.completed
        );

    } else if (currentFilter === "completed") {

        filteredTodos = filteredTodos.filter(
            todo => todo.completed
        );
    }

    // Apply Search
    if (searchTerm) {

        filteredTodos = filteredTodos.filter(todo => {

            const title = (todo.title || "").toLowerCase();

            const description = (todo.description || "").toLowerCase();

            return title.includes(searchTerm) ||
                   description.includes(searchTerm);
        });
    }

    document.getElementById("taskCount").textContent =
        `(${filteredTodos.length})`;

    const footerText = document.getElementById("listFooterText");

    footerText.textContent = todos.length
        ? `${todos.length} task(s) in your workspace`
        : "Your tasks are waiting.";

    // Empty State
    if (filteredTodos.length === 0) {

        let heading = "No tasks yet";
        let message = "Start by creating your first task.";

        if (searchTerm) {
            heading = "No matching tasks";
            message = "Try another search keyword.";
        } else if (currentFilter === "active") {
            heading = "All caught up!";
            message = "You have no remaining tasks.";
        } else if (currentFilter === "completed") {
            heading = "Nothing completed yet";
            message = "Complete a task to see it here.";
        }

        todoList.innerHTML = `
            <div class="empty-state">

                <i class="fa-solid fa-clipboard-check"></i>

                <h3>${heading}</h3>

                <p>${message}</p>

                ${currentFilter !== "all" || searchTerm
                    ? `<button onclick="resetFilters()">View All Tasks</button>`
                    : ""
                }

            </div>
        `;

        return;
    }

    // Generate Task Cards
    todoList.innerHTML = filteredTodos.map(todo => {

        const id = escapeHTML(todo._id);

        const title = escapeHTML(todo.title);

        const description = escapeHTML(todo.description || "");

        const date = formatDate(todo.createdAt);

        return `

            <article class="todo-card ${todo.completed ? "completed" : ""}"
                data-id="${id}">

                <input
                    type="checkbox"
                    class="todo-check"
                    ${todo.completed ? "checked" : ""}
                    aria-label="Mark ${title} as completed"
                >

                <div class="todo-content">

                    <h3>${title}</h3>

                    ${description
                        ? `<p>${description}</p>`
                        : ""
                    }

                    <div class="todo-meta">
                        <i class="fa-regular fa-clock"></i>
                        ${date}

                        ${todo.completed
                            ? " · Completed"
                            : " · In Progress"
                        }
                    </div>

                </div>

                <div class="task-actions">

                    <button
                        class="action-btn edit-btn"
                        data-action="edit"
                        title="Edit Task"
                        aria-label="Edit task"
                    >
                        <i class="fa-solid fa-pen"></i>
                    </button>

                    <button
                        class="action-btn delete-btn"
                        data-action="delete"
                        title="Delete Task"
                        aria-label="Delete task"
                    >
                        <i class="fa-solid fa-trash"></i>
                    </button>

                </div>

            </article>

        `;

    }).join("");

}


// ==========================================
// CREATE / UPDATE TODO
// POST /todos
// PUT /todos/:id
// ==========================================

todoForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const title = titleInput.value.trim();

    const description = descriptionInput.value.trim();

    if (!title) {
        showToast("Please enter a task title!", "error");
        return;
    }

    const todoData = {
        title,
        description
    };

    const isEditing = Boolean(editingTodoId);

    const endpoint = isEditing
        ? `/${editingTodoId}`
        : "";

    const method = isEditing ? "PUT" : "POST";

    submitBtn.disabled = true;

    submitBtn.innerHTML = `
        <i class="fa-solid fa-circle-notch fa-spin"></i>
        <span>Please wait...</span>
    `;

    try {

        const result = await apiRequest(endpoint, {
            method,
            body: JSON.stringify(todoData)
        });

        showToast(
            isEditing
                ? "Task updated successfully!"
                : "New task created successfully!"
        );

        resetForm();

        await loadTodos();

    } catch (error) {

        showToast(error.message, "error");

    } finally {

        submitBtn.disabled = false;

        submitBtn.innerHTML = `
            <i class="fa-solid fa-plus"></i>
            <span>${editingTodoId ? "Update Task" : "Add Task"}</span>
        `;
    }

});


// ==========================================
// EDIT TODO
// ==========================================

function editTodo(id) {

    const todo = todos.find(item => item._id === id);

    if (!todo) return;

    editingTodoId = id;

    titleInput.value = todo.title;

    descriptionInput.value = todo.description || "";

    formHeading.textContent = "Edit your task";

    submitBtn.innerHTML = `
        <i class="fa-solid fa-floppy-disk"></i>
        <span>Update Task</span>
    `;

    cancelEditBtn.hidden = false;

    document.querySelector(".form-card").scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

    titleInput.focus();
}


// ==========================================
// DELETE TODO
// DELETE /todos/:id
// ==========================================

async function deleteTodo(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    try {

        await apiRequest(`/${id}`, {
            method: "DELETE"
        });

        showToast("Task deleted successfully!");

        if (editingTodoId === id) {
            resetForm();
        }

        await loadTodos();

    } catch (error) {

        showToast(error.message, "error");
    }
}


// ==========================================
// TOGGLE TODO COMPLETION
// PUT /todos/:id
// ==========================================

async function toggleTodo(id, checkbox) {

    const todo = todos.find(item => item._id === id);

    if (!todo) return;

    const previousValue = todo.completed;

    checkbox.disabled = true;

    try {

        await apiRequest(`/${id}`, {
            method: "PUT",

            body: JSON.stringify({
                title: todo.title,
                description: todo.description || "",
                completed: checkbox.checked
            })
        });

        showToast(
            checkbox.checked
                ? "Task completed! Great job!"
                : "Task marked as active."
        );

        await loadTodos();

    } catch (error) {

        checkbox.checked = previousValue;

        checkbox.disabled = false;

        showToast(error.message, "error");
    }
}


// ==========================================
// TASK LIST EVENTS
// ==========================================

todoList.addEventListener("click", (event) => {

    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const card = button.closest(".todo-card");

    if (!card) return;

    const id = card.dataset.id;

    const action = button.dataset.action;

    if (action === "edit") {

        editTodo(id);

    } else if (action === "delete") {

        deleteTodo(id);
    }
});


todoList.addEventListener("change", (event) => {

    if (!event.target.matches(".todo-check")) return;

    const card = event.target.closest(".todo-card");

    if (!card) return;

    toggleTodo(card.dataset.id, event.target);
});


// ==========================================
// FILTERS
// ==========================================

document.querySelectorAll(".filter-btn").forEach(button => {

    button.addEventListener("click", () => {

        document.querySelector(".filter-btn.active")
            ?.classList.remove("active");

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderTodos();
    });

});


// ==========================================
// SEARCH
// ==========================================

searchInput.addEventListener("input", renderTodos);


// ==========================================
// RESET FILTERS
// ==========================================

function resetFilters() {

    currentFilter = "all";

    searchInput.value = "";

    document.querySelectorAll(".filter-btn").forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.filter === "all"
        );

    });

    renderTodos();
}


// ==========================================
// RESET FORM
// ==========================================

function resetForm() {

    todoForm.reset();

    editingTodoId = null;

    formHeading.textContent = "Create a task";

    submitBtn.innerHTML = `
        <i class="fa-solid fa-plus"></i>
        <span>Add Task</span>
    `;

    cancelEditBtn.hidden = true;
}


// ==========================================
// CANCEL EDITING
// ==========================================

cancelEditBtn.addEventListener("click", () => {

    resetForm();

    showToast("Editing cancelled.");

});


// ==========================================
// REFRESH TASKS
// ==========================================

refreshBtn.addEventListener("click", loadTodos);


// ==========================================
// CURRENT DATE
// ==========================================

document.getElementById("currentDate").textContent =
    new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric"
    });


// ==========================================
// KEYBOARD SHORTCUT
// Ctrl + K / Cmd + K = Search
// ==========================================

document.addEventListener("keydown", (event) => {

    if ((event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k") {

        event.preventDefault();

        searchInput.focus();
    }

});


// ==========================================
// INITIALIZE APPLICATION
// ==========================================

loadTodos();
