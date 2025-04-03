document.addEventListener('DOMContentLoaded', () => {
    // Initialize calendar
    const calendar = new HarmonizedCalendar();
    calendar.displayCalendar(calendar.currentYear);

    // Add smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80; // Account for fixed header
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add scroll-based animations
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.feature-card, .comparison-card, .faq-item');
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            // Check if element is in viewport
            if (elementTop < window.innerHeight && elementBottom > 0) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Initialize animation styles
    document.querySelectorAll('.feature-card, .comparison-card, .faq-item').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.5s ease-out';
    });

    // Add scroll event listener for animations
    window.addEventListener('scroll', animateOnScroll);
    // Trigger initial animation check
    animateOnScroll();

    // Add active state to navigation links based on scroll position
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector(`.nav-links a[href="#${sectionId}"]`)?.classList.add('active');
            } else {
                document.querySelector(`.nav-links a[href="#${sectionId}"]`)?.classList.remove('active');
            }
        });
    });
}); 