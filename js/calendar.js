class HarmonizedCalendar {
    constructor() {
        this.months = [
            'March', 'April', 'May', 'June', 'July', 'August', 'September',
            'October', 'November', 'December', 'January', 'February', 'Thirteenth'
        ];
        this.weekdays = ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday'];
        this.currentYear = new Date().getFullYear();
    }

    isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }

    getSpringEquinox(year) {
        // Approximate spring equinox (March 20)
        return new Date(year, 2, 20);
    }

    generateCalendar(year) {
        const calendar = [];
        const startDate = this.getSpringEquinox(year);
        const isLeap = this.isLeapYear(year);
        
        // Add special days
        if (isLeap) {
            calendar.push({
                date: new Date(year, 2, 18),
                day: 'Leap Day',
                isSpecial: true
            });
        }
        calendar.push({
            date: new Date(year, 2, 19),
            day: 'Day Out of Time',
            isSpecial: true
        });

        // Generate regular days
        let currentDate = new Date(startDate);
        for (let month = 0; month < 13; month++) {
            for (let day = 1; day <= 28; day++) {
                const weekday = this.weekdays[(day - 1) % 7];
                calendar.push({
                    date: new Date(currentDate),
                    day: day,
                    weekday: weekday,
                    month: this.months[month],
                    isSpecial: false
                });
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }

        return calendar;
    }

    displayCalendar(year) {
        const calendar = this.generateCalendar(year);
        const container = document.getElementById('yearly-calendar');
        container.innerHTML = '';

        // Add year controls if they don't exist
        if (!document.querySelector('.year-controls')) {
            const yearControls = document.createElement('div');
            yearControls.className = 'year-controls';
            yearControls.innerHTML = `
                <button id="prevYear">&lt;</button>
                <span id="currentYear">${year}</span>
                <button id="nextYear">&gt;</button>
            `;
            container.appendChild(yearControls);

            // Add event listeners for year navigation
            document.getElementById('prevYear').addEventListener('click', () => {
                this.currentYear--;
                this.displayCalendar(this.currentYear);
            });

            document.getElementById('nextYear').addEventListener('click', () => {
                this.currentYear++;
                this.displayCalendar(this.currentYear);
            });
        } else {
            document.getElementById('currentYear').textContent = year;
        }

        // Add special days section
        const specialDays = calendar.filter(day => day.isSpecial);
        if (specialDays.length > 0) {
            const specialSection = document.createElement('div');
            specialSection.className = 'special-days-section';
            specialSection.innerHTML = `
                <h3>Special Days</h3>
                <div class="special-days-grid">
                    ${specialDays.map(day => `
                        <div class="special-day">
                            <div class="date">${day.date.getMonth() + 1}/${day.date.getDate()}</div>
                            <div class="name">${day.day}</div>
                        </div>
                    `).join('')}
                </div>
            `;
            container.appendChild(specialSection);
        }

        // Create month sections
        this.months.forEach(month => {
            const monthSection = document.createElement('div');
            monthSection.className = 'month-section';
            monthSection.innerHTML = `
                <h3>${month}</h3>
                <div class="month-grid">
                    ${this.weekdays.map(day => `<div class="weekday-header">${day}</div>`).join('')}
                </div>
            `;

            const monthDays = calendar.filter(day => day.month === month && !day.isSpecial);
            const grid = monthSection.querySelector('.month-grid');
            
            monthDays.forEach(day => {
                const dayElement = document.createElement('div');
                dayElement.className = 'calendar-day';
                dayElement.textContent = day.day;
                dayElement.title = `${day.weekday}, ${day.month} ${day.day}`;
                grid.appendChild(dayElement);
            });

            container.appendChild(monthSection);
        });
    }
} 