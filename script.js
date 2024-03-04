var tasks = [];
var deletedTasks = [];
var currentPage = 1;
var tasksPerPage = 10;

function addTask() {
    var taskInput = document.getElementById("taskInput");
    var dueDateInput = document.getElementById("dueDate");
    var categoryInput = document.getElementById("category");
    var task = taskInput.value;
    var dueDate = dueDateInput.value;
    var category = categoryInput.value;

    if (task.trim() === "") {
        alert("Please enter a task!");
        return;
    }

    tasks.push({ task: task, dueDate: dueDate, category: category, done: false });
    renderTasks();
    taskInput.value = "";
    dueDateInput.value = "";
    categoryInput.value = "";
}

function renderTasks() {
    var taskList = document.getElementById("taskList");
    var deletedTaskList = document.getElementById("deletedTaskList");
    var startIndex = (currentPage - 1) * tasksPerPage;
    var endIndex = startIndex + tasksPerPage;
    var tasksToShow = tasks.slice(startIndex, endIndex);

    taskList.innerHTML = "";
    tasksToShow.forEach(function(task, index) {
        var li = document.createElement("li");
        var taskIndex = startIndex + index + 1; // Task index starts from 1
        li.innerHTML = `<input type="checkbox" id="task-${startIndex + index}" onchange="toggleTaskDone(${startIndex + index})"${task.done ? ' checked' : ''}><label for="task-${startIndex + index}">${taskIndex}. ${task.task}</label> - Due: <span class="dueDate">${task.dueDate}</span> - Category: ${task.category} <button onclick="deleteTask(${startIndex + index})">Delete</button>`;
        if (calculateDaysLeft(task.dueDate) <= 3) {
            li.querySelector('.dueDate').style.color = "red";
        }
        taskList.appendChild(li);
    });

    deletedTaskList.innerHTML = "";
    deletedTasks.forEach(function(task, index) {
        var li = document.createElement("li");
        var taskIndex = index + 1; // Task index starts from 1
        li.innerHTML = `${taskIndex}. ${task.task} - Due: ${task.dueDate} - Category: ${task.category} <button onclick="restoreTask(${index})">Restore</button>`;
        deletedTaskList.appendChild(li);
    });

    updatePagination();
}

function deleteTask(index) {
    deletedTasks.push(tasks[index]);
    tasks.splice(index, 1);
    renderTasks();
}

function toggleTaskDone(index) {
    tasks[index].done = !tasks[index].done;
    renderTasks();
}

function restoreTask(index) {
    tasks.push(deletedTasks[index]);
    deletedTasks.splice(index, 1);
    renderTasks();
}

function calculateDaysLeft(dueDate) {
    var dueDateObj = new Date(dueDate);
    var currentDate = new Date();
    var timeDiff = dueDateObj.getTime() - currentDate.getTime();
    var daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
}

function changePage(direction) {
    currentPage += direction;
    renderTasks();
}

function updatePagination() {
    var prevPageBtn = document.getElementById("prevPage");
    var nextPageBtn = document.getElementById("nextPage");
    if (currentPage === 1) {
        prevPageBtn.disabled = true;
    } else {
        prevPageBtn.disabled = false;
    }
    if (currentPage === Math.ceil(tasks.length / tasksPerPage)) {
        nextPageBtn.disabled = true;
    } else {
        nextPageBtn.disabled = false;
    }
}

function toggleDeletedTasks() {
    var deletedTaskList = document.getElementById("deletedTaskList");
    if (deletedTaskList.style.display === "none") {
        deletedTaskList.style.display = "block";
        document.getElementById("showDeletedBtn").textContent = "Hide Deleted Tasks";
    } else {
        deletedTaskList.style.display = "none";
        document.getElementById("showDeletedBtn").textContent = "Show Deleted Tasks";
    }
}
