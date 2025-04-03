class HarmonizedCalendar {
    constructor() {
        this.months = [
            "Spring Equinox", "April", "May", "June", "July", "August", "September",
            "October", "November", "December", "January", "February", "March"
        ];
        this.weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        this.currentYear = new Date().getFullYear();
        this.currentMonth = 0;
    }

    isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }

    getSpringEquinox(year) {
        // Approximate date of spring equinox (March 20)
        return new Date(year, 2, 20);
    }

    generateCalendar(year) {
        const calendar = [];
        const springEquinox = this.getSpringEquinox(year);
        const isLeap = this.isLeapYear(year);

        // Add special days
        calendar.push({
            type: 'special',
            name: 'Leap Day',
            date: isLeap ? 'March 18' : null
        });

        calendar.push({
            type: 'special',
            name: 'Day Out of Time',
            date: 'March 19'
        });

        // Generate regular days for each month
        this.months.forEach((month, index) => {
            const monthDays = [];
            for (let day = 1; day <= 28; day++) {
                monthDays.push({
                    type: 'regular',
                    day: day,
                    month: month
                });
            }
            calendar.push({
                month: month,
                days: monthDays
            });
        });

        return calendar;
    }

    displayCalendar(year) {
        const calendar = this.generateCalendar(year);
        const container = document.querySelector('.calendar-container');
        
        // Create year view
        let html = `
            <div class="year-controls">
                <button onclick="calendar.displayCalendar(${year - 1})"><i class="fas fa-chevron-left"></i></button>
                <span>${year}</span>
                <button onclick="calendar.displayCalendar(${year + 1})"><i class="fas fa-chevron-right"></i></button>
            </div>
            <div class="month-grid">
        `;

        // Add each month to the grid
        calendar.forEach((monthData, index) => {
            if (monthData.month) {
                html += `
                    <div class="month-section" data-month="${index}">
                        <h3>${monthData.month}</h3>
                        <div class="month-preview">
                            ${this.generateMonthPreview(monthData.days)}
                        </div>
                    </div>
                `;
            }
        });

        html += '</div>';
        container.innerHTML = html;

        // Add click handlers for month sections
        document.querySelectorAll('.month-section').forEach(section => {
            section.addEventListener('click', () => {
                const monthIndex = parseInt(section.dataset.month);
                this.showMonthModal(monthIndex, year);
            });
        });
    }

    generateMonthPreview(days) {
        let html = '<div class="preview-grid">';
        // Show first week as preview
        for (let i = 0; i < 7; i++) {
            html += `<div class="preview-day">${days[i].day}</div>`;
        }
        html += '</div>';
        return html;
    }

    showMonthModal(monthIndex, year) {
        const modal = document.querySelector('.month-modal');
        const overlay = document.querySelector('.modal-overlay');
        const calendar = this.generateCalendar(year);
        const monthData = calendar[monthIndex + 2]; // +2 to account for special days

        // Update modal title
        modal.querySelector('.modal-title').textContent = monthData.month;

        // Generate month view content
        let html = `
            <div class="month-grid">
                ${this.weekdays.map(day => `<div class="weekday-header">${day}</div>`).join('')}
        `;

        // Add days to the grid
        monthData.days.forEach(day => {
            html += `
                <div class="calendar-day">
                    ${day.day}
                </div>
            `;
        });

        html += '</div>';
        modal.querySelector('.modal-content').innerHTML = html;

        // Show modal and overlay
        modal.classList.add('active');
        overlay.classList.add('active');

        // Add event listeners for navigation
        const prevButton = modal.querySelector('.prev-month');
        const nextButton = modal.querySelector('.next-month');
        const closeButton = modal.querySelector('.close-modal');

        prevButton.onclick = () => {
            monthIndex = (monthIndex - 1 + 13) % 13;
            this.showMonthModal(monthIndex, year);
        };

        nextButton.onclick = () => {
            monthIndex = (monthIndex + 1) % 13;
            this.showMonthModal(monthIndex, year);
        };

        closeButton.onclick = () => {
            modal.classList.remove('active');
            overlay.classList.remove('active');
        };

        overlay.onclick = () => {
            modal.classList.remove('active');
            overlay.classList.remove('active');
        };
    }
} 