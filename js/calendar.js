class HarmonizedCalendar {
    constructor() {
        this.months = Array.from({length: 13}, (_, i) => `Month ${i + 1}`);
        this.weekdays = ["Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon"];
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
        const isLeap = this.isLeapYear(year);

        // Generate regular months
        this.months.forEach((month, index) => {
            const monthDays = [];
            // Add the regular days (all months start on Tuesday)
            for (let day = 1; day <= 28; day++) {
                monthDays.push({
                    type: 'regular',
                    day: day,
                    weekday: this.weekdays[(day - 1) % 7]
                });
            }
            
            calendar.push({
                month: month,
                days: monthDays
            });
        });

        // Add special days section
        calendar.push({
            month: 'Special Days',
            days: [
                {
                    type: 'special',
                    name: 'Day Out of Time',
                    date: 'Before Month 1'
                },
                {
                    type: 'special',
                    name: 'Leap Day',
                    date: isLeap ? 'Extra Day' : null
                }
            ]
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
            <div class="special-days">
                ${this.generateSpecialDaysSection(calendar[calendar.length - 1])}
            </div>
            <div class="month-grid">
        `;

        // Add each month to the grid
        calendar.slice(0, -1).forEach((monthData, index) => {
            html += `
                <div class="month-section" data-month="${index}">
                    <h3>${monthData.month}</h3>
                    <div class="preview-grid">
                        ${this.weekdays.map(day => `<div class="weekday-header">${day[0]}</div>`).join('')}
                        ${this.generateMonthPreview(monthData.days)}
                    </div>
                </div>
            `;
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

    generateSpecialDaysSection(specialDays) {
        return `
            <div class="special-days-section">
                <h3>Special Days</h3>
                <div class="special-days-grid">
                    ${specialDays.days.map(day => `
                        <div class="special-day${day.date ? '' : ' disabled'}">
                            <div class="special-day-name">${day.name}</div>
                            <div class="special-day-date">${day.date || 'Not this year'}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    generateMonthPreview(days) {
        return days.map(day => 
            `<div class="preview-day">${day.day}</div>`
        ).join('');
    }

    showMonthModal(monthIndex, year) {
        const modal = document.querySelector('.month-modal');
        const overlay = document.querySelector('.modal-overlay');
        const calendar = this.generateCalendar(year);
        const monthData = calendar[monthIndex];

        // Update modal title
        modal.querySelector('.modal-title').textContent = monthData.month;

        // Generate month view content
        let html = `
            <div class="month-grid">
                ${this.weekdays.map(day => `<div class="weekday-header">${day}</div>`).join('')}
                ${monthData.days.map(day => `
                    <div class="calendar-day">
                        ${day.day}
                    </div>
                `).join('')}
            </div>
        `;

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