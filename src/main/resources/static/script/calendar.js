document.addEventListener('DOMContentLoaded', () => {
    const currentMonthYearDisplay = document.getElementById('currentMonthYear');
    const calendarGrid = document.getElementById('calendarDays');
    const prevMonthButton = document.getElementById('prevMonthBtn');
    const nextMonthButton = document.getElementById('nextMonthBtn');

    let displayedDate = new Date();

    // api url
    const API_BASE_URL = "http://localhost:8080/api/v1";

    // wczytanie zadań na dany miesiąc
    async function fetchTasksForMonth(year, monthZeroIndexed) {
        if (!API_BASE_URL) {
            console.error("API_BASE_URL nie jest skonfigurowany.");
            return {};
        }
        
        const monthOneIndexed = monthZeroIndexed + 1;
        // format daty
        const apiDateParam = `${year}-${String(monthOneIndexed).padStart(2, '0')}-01`;
        const apiUrl = `${API_BASE_URL}/task/month/${apiDateParam}`;

        try {
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                console.error(`Błąd API (${apiUrl}): Status ${response.status}`);
                calendarGrid.innerHTML = `<div style="text-align:center; grid-column: 1 / -1; padding: 20px;">Błąd ładowania danych.</div>`;
                return {};
            }

            const tasks = await response.json();

            //
            const tasksGroupedByDate = {};
            if (Array.isArray(tasks)) {
                tasks.forEach(task => {
                    const taskDateString = task.date; 

                    if (!taskDateString || !/^\d{4}-\d{2}-\d{2}$/.test(taskDateString)) {
                        console.warn("Pominięto zadanie z nieprawidłową datą:", task);
                        return; 
                    }

                    if (!tasksGroupedByDate[taskDateString]) {
                        tasksGroupedByDate[taskDateString] = { completedTasks: 0, totalTasks: 0 };
                    }
                    tasksGroupedByDate[taskDateString].totalTasks++;
                    if (task.completed === true) {
                        tasksGroupedByDate[taskDateString].completedTasks++;
                    }
                });
            } else {
                console.error("Odpowiedź z API nie jest tablicą:", tasks);
            }
            return tasksGroupedByDate;
        } catch (error) {
            console.error(`Błąd sieci lub przetwarzania JSON z ${apiUrl}:`, error);
            calendarGrid.innerHTML = `<div style="text-align:center; grid-column: 1 / -1; padding: 20px;">Błąd połączenia.</div>`;
            return {};
        }
    }

    // renderowanie kalendarza
    async function renderCalendar() {
        const year = displayedDate.getFullYear();
        const month = displayedDate.getMonth(); 

        // format daty
        currentMonthYearDisplay.textContent = `${new Intl.DateTimeFormat('pl-PL', { month: 'long' }).format(displayedDate)} ${year}`;
        calendarGrid.innerHTML = '<div style="text-align:center; grid-column: 1 / -1; padding: 20px;">Ładowanie...</div>';

        // wczytanie zadań
        const monthlyTasksData = await fetchTasksForMonth(year, month);
        calendarGrid.innerHTML = '';

        // ustawienie dni miesiąca
        const firstDayOfMonthObject = new Date(year, month, 1);
        const lastDayOfMonthObject = new Date(year, month + 1, 0);
        const totalDaysInMonth = lastDayOfMonthObject.getDate();

        // Ustalanie pierwszego dnia miesiąca
        let dayOfWeekForFirstDay = firstDayOfMonthObject.getDay(); 
        dayOfWeekForFirstDay = (dayOfWeekForFirstDay === 0) ? 6 : dayOfWeekForFirstDay - 1; 

        for (let i = 0; i < dayOfWeekForFirstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('empty');
            calendarGrid.appendChild(emptyCell);
        }

        // tworzenie dni miesiąca
        for (let dayNumber = 1; dayNumber <= totalDaysInMonth; dayNumber++) {
            const dayCell = document.createElement('div');
            dayCell.textContent = dayNumber;

            const cellDateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
            const tasksForThisDay = monthlyTasksData[cellDateString];

            if (tasksForThisDay && tasksForThisDay.totalTasks > 0) {
                const taskCountSpan = document.createElement('span');
                taskCountSpan.textContent = tasksForThisDay.totalTasks;
                taskCountSpan.classList.add('task-count');
                dayCell.appendChild(taskCountSpan);

                if (tasksForThisDay.completedTasks < tasksForThisDay.totalTasks) {
                    dayCell.classList.add('tasks-pending');
                } else {
                    dayCell.classList.add('tasks-completed-all');
                }
            }

            const today = new Date();
            if (dayNumber === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayCell.classList.remove('tasks-pending', 'tasks-completed-all');
                dayCell.classList.add('today');
            }
            calendarGrid.appendChild(dayCell);
        }
    }

    // przyciski do zmiany miesiąca
    prevMonthButton.addEventListener('click', () => {
        displayedDate.setMonth(displayedDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthButton.addEventListener('click', () => {
        displayedDate.setMonth(displayedDate.getMonth() + 1);
        renderCalendar();
    });

    if (API_BASE_URL) {
        renderCalendar();
    } else {
        console.error("API_BASE_URL nie jest ustawiony. Kalendarz nie zostanie zainicjowany.");
        currentMonthYearDisplay.textContent = "Błąd konfiguracji";
        calendarGrid.innerHTML = '<div style="text-align:center; grid-column: 1 / -1; padding: 20px;">Błąd konfiguracji API.</div>';
    }
});