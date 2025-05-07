document.addEventListener('DOMContentLoaded', function() {
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const monthDisplay = document.getElementById('current-month');
    const tasksList = document.getElementById('tasks-list');
    const totalTasksEl = document.getElementById('total-tasks');
    const completedTasksEl = document.getElementById('completed-tasks');
    const completionRateEl = document.getElementById('completion-rate');

    let currentDate = new Date();

    // Ustaw początkową datę
    updateMonthDisplay();
    loadData();

    // poprzedni i następny miesiąc
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateMonthDisplay();
        loadData();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateMonthDisplay();
        loadData();
    });

    // Aktualizacja wyświetlania miesiąca
    function updateMonthDisplay() {
        const options = { month: 'long', year: 'numeric' };
        monthDisplay.textContent = currentDate.toLocaleDateString('pl-PL', options);
    }

    // Załaduj dane
    async function loadData() {
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const apiUrl = `http://localhost:8080/api/v1/task/month/${year}-${month}-01`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('Failed to fetch data');

            const tasks = await response.json();
            renderTasks(tasks);
            updateStats(tasks);
        } catch (error) {
            console.error('Error:', error);
            tasksList.innerHTML = '<p class="error-message">Nic nie znaleziono</p>';
        }
    }

    // Renderowanie zadań
    function renderTasks(tasks) {
        tasksList.innerHTML = '';

        if (!tasks || tasks.length === 0) {
            tasksList.innerHTML = '<p class="no-tasks">No tasks found for this month</p>';
            return;
        }

        // Sortowanie
        tasks.sort((a, b) => new Date(a.date) - new Date(b.date));

        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = 'task-item';
            taskElement.innerHTML = `
                <div class="task-name">${task.name}</div>
                <div class="task-date">${formatDate(task.date)}</div>
                <div class="task-status ${task.completed ? '' : 'pending'}">
                    ${task.completed ? '✓ Ukończono' : '✗ W trakcie'}
                </div>
            `;
            tasksList.appendChild(taskElement);
        });
    }

    // Aktualizacja statystyk
    function updateStats(tasks) {
        const total = tasks.length;
        const completed = tasks.filter(task => task.completed).length;
        const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

        totalTasksEl.textContent = total;
        completedTasksEl.textContent = completed;
        completionRateEl.textContent = `${rate}%`;

        // Kolorowanie
        completionRateEl.style.color = rate >= 75 ? '#28a745' :
            rate >= 50 ? '#ffc107' :
                '#dc3545';
    }

    // Formatowanie daty
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pl-PL', {
            day: 'numeric',
            month: 'short'
        });
    }
});