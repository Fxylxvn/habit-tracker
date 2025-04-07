document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const datePicker = document.getElementById('date-picker');
    const tasksList = document.querySelector('.tasks-list');
    const addTaskForm = document.querySelector('.add-task-form');
    const taskInput = document.querySelector('.task-input');
    const taskDateInput = document.querySelector('.task-date-input');
    const prevDayBtn = document.getElementById('prev-day');
    const nextDayBtn = document.getElementById('next-day');

    // Base API URL (adjust if needed)
    const API_URL = 'http://localhost:8080/api/v1/task';

    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    datePicker.value = today;
    taskDateInput.value = today;

    // Event Listeners
    datePicker.addEventListener('change', loadTasksForDate);
    addTaskForm.addEventListener('submit', handleAddTask);
    prevDayBtn.addEventListener('click', navigateToPreviousDay);
    nextDayBtn.addEventListener('click', navigateToNextDay);

    // Initial load
    loadTasksForDate();

    // Functions
    async function loadTasksForDate() {
        try {
            const date = datePicker.value;
            const response = await fetch(`${API_URL}/${date}`);

            if (!response.ok) {
                if (response.status === 404) {
                    tasksList.innerHTML = '<p class="no-tasks">Nic nie znaleziono</p>';
                    return;
                }
                throw new Error('Failed to fetch tasks');
            }

            const tasks = await response.json();
            if (!tasks || tasks.length === 0) {
                tasksList.innerHTML = '<p class="no-tasks">Nic nie znaleziono</p>';
                return;
            }
            renderTasks(tasks); // Now passes the full array
        } catch (error) {
            console.error('Error loading tasks:', error);
            tasksList.innerHTML = '<p class="no-tasks">Nic nie znaleziono</p>';
        }
    }

    async function loadAllTasks() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Failed to fetch tasks');
            const tasks = await response.json();
            renderTasks(tasks);
        } catch (error) {
            console.error('Error loading tasks:', error);
        }
    }

    function renderTasks(tasks) {
        tasksList.innerHTML = '';

        if (!tasks || tasks.length === 0) {
            tasksList.innerHTML = '<p>No tasks found</p>';
            return;
        }

        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
            taskElement.innerHTML = `
                <input type="checkbox" id="task-${task.id}" class="task-checkbox" 
                    ${task.completed ? 'checked' : ''}>
                <label for="task-${task.id}" class="task-label">${task.name}</label>
                <span class="task-date">${task.date}</span>
                <button class="delete-btn" data-task-id="${task.id}">×</button>
            `;
            tasksList.appendChild(taskElement);

            // Add event listeners for the new elements
            const checkbox = taskElement.querySelector('.task-checkbox');
            checkbox.addEventListener('change', () => toggleTaskCompletion(task.id));

            const deleteBtn = taskElement.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => deleteTask(task.id));
        });
    }

    async function handleAddTask(e) {
        e.preventDefault();

        const newTask = {
            name: taskInput.value.trim(),
            date: taskDateInput.value
        };

        if (!newTask.name) return;

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTask)
            });

            if (!response.ok) throw new Error('Failed to add task');

            taskInput.value = '';
            loadTasksForDate();
        } catch (error) {
            console.error('Error adding task:', error);
        }
    }

    async function toggleTaskCompletion(taskId) {
        try {
            const response = await fetch(`${API_URL}/${taskId}/complete`, {
                method: 'PUT'
            });

            if (!response.ok) throw new Error('Failed to update task');

            loadTasksForDate();
        } catch (error) {
            console.error('Error completing task:', error);
        }
    }

    async function deleteTask(taskId) {
        try {
            const response = await fetch(`${API_URL}/${taskId}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete task');

            loadTasksForDate();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    }

    function navigateToPreviousDay() {
        const currentDate = new Date(datePicker.value);
        currentDate.setDate(currentDate.getDate() - 1);
        datePicker.value = formatDate(currentDate);
        loadTasksForDate();
    }

    function navigateToNextDay() {
        const currentDate = new Date(datePicker.value);
        currentDate.setDate(currentDate.getDate() + 1);
        datePicker.value = formatDate(currentDate);
        loadTasksForDate();
    }

    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
});