document.addEventListener('DOMContentLoaded', function() {
    const datePicker = document.getElementById('date-picker');
    const tasksList = document.querySelector('.tasks-list');
    const addTaskForm = document.querySelector('.add-task-form');
    const taskInput = document.querySelector('.task-input');
    const taskDateInput = document.querySelector('.task-date-input');
    const prevDayBtn = document.getElementById('prev-day');
    const nextDayBtn = document.getElementById('next-day');

    // API URL
    const API_URL = 'http://localhost:8080/api/v1/task';

    // Ustaw początkową datę na dzisiaj
    const today = new Date().toISOString().split('T')[0];
    datePicker.value = today;
    taskDateInput.value = today;

    // Dodaj nasłuchiwanie zdarzeń
    datePicker.addEventListener('change', loadTasksForDate);
    addTaskForm.addEventListener('submit', handleAddTask);
    prevDayBtn.addEventListener('click', navigateToPreviousDay);
    nextDayBtn.addEventListener('click', navigateToNextDay);

    // Początkowe załadowanie zadań
    loadTasksForDate();

    // Załadowanie zadań dla wybranej daty
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
            renderTasks(tasks);
        } catch (error) {
            console.error('Error loading tasks:', error);
            tasksList.innerHTML = '<p class="no-tasks">Nic nie znaleziono</p>';
        }
    }

    // Renderowanie zadań
    function renderTasks(tasks) {
        tasksList.innerHTML = '';

        if (!tasks || tasks.length === 0) {
            tasksList.innerHTML = '<p>Nie znaleziono</p>';
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

            const checkbox = taskElement.querySelector('.task-checkbox');
            checkbox.addEventListener('change', () => toggleTaskCompletion(task.id));

            const deleteBtn = taskElement.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => deleteTask(task.id));
        });
    }

    // Dodanie nowego zadania
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

    // Zmiana statusu zadania na ukończone/nieukończone
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

    // Usunięcie zadania
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

    // Nawigacja do poprzedniego/następnego dnia
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

    // Formatowanie daty
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
});