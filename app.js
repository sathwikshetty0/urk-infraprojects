// URK Infraprojects Website JavaScript - Fixed Version

// Theme Management with proper CSS variable switching
class ThemeManager {
    constructor() {
        this.currentTheme = 'light';
        this.themeToggle = document.getElementById('theme-toggle');
        this.init();
    }

    init() {
        // Check for saved theme preference or default to light
        const savedTheme = sessionStorage.getItem('urk-theme') || 'light';
        this.setTheme(savedTheme);
        
        // Add event listener to theme toggle button
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleTheme();
                console.log('Theme toggle clicked!'); // Debug log
            });
        }
    }

    setTheme(theme) {
        this.currentTheme = theme;
        
        // Apply theme to document element with force
        document.documentElement.setAttribute('data-theme', theme);
        document.body.setAttribute('data-theme', theme);
        
        // Force style recalculation
        document.documentElement.style.colorScheme = theme;
        
        // Update theme toggle icon
        const icon = this.themeToggle?.querySelector('i');
        if (icon) {
            if (theme === 'dark') {
                icon.className = 'fas fa-moon';
            } else {
                icon.className = 'fas fa-sun';
            }
        }
        
        // Save theme preference
        sessionStorage.setItem('urk-theme', theme);
        
        console.log(`Theme set to: ${theme}`); // Debug log
        
        // Apply theme colors immediately
        this.applyThemeColors(theme);
    }

    applyThemeColors(theme) {
        const root = document.documentElement;
        
        if (theme === 'dark') {
            root.style.setProperty('--bg-primary', '#1a1a1a');
            root.style.setProperty('--bg-secondary', '#2d2d2d');
            root.style.setProperty('--bg-accent', '#2a1f1a');
            root.style.setProperty('--text-primary', '#ffffff');
            root.style.setProperty('--text-secondary', '#cccccc');
            root.style.setProperty('--text-muted', '#999999');
            root.style.setProperty('--border-color', '#404040');
        } else {
            root.style.setProperty('--bg-primary', '#ffffff');
            root.style.setProperty('--bg-secondary', '#f8f9fa');
            root.style.setProperty('--bg-accent', '#fff5f0');
            root.style.setProperty('--text-primary', '#333333');
            root.style.setProperty('--text-secondary', '#666666');
            root.style.setProperty('--text-muted', '#888888');
            root.style.setProperty('--border-color', '#e0e0e0');
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        console.log(`Theme toggled to: ${newTheme}`); // Debug log
    }
}

// Mobile Menu Management
class MobileMenuManager {
    constructor() {
        this.menuToggle = document.getElementById('mobile-menu-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.isOpen = false;
        this.init();
    }

    init() {
        if (!this.menuToggle || !this.navMenu) return;

        this.menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });

        // Close menu when clicking on nav links
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && 
                !this.menuToggle.contains(e.target) && 
                !this.navMenu.contains(e.target)) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        this.isOpen = true;
        this.navMenu.classList.add('show');
        this.menuToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeMenu() {
        this.isOpen = false;
        this.navMenu.classList.remove('show');
        this.menuToggle.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Contact Form Management
class ContactFormManager {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.successMessage = document.getElementById('formSuccess');
        this.init();
    }

    init() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    handleSubmit() {
            const formData = new FormData(this.form);
            const service = formData.get('service');
            const phone = formData.get('phone');
            const message = formData.get('message');
            const recaptcha = document.getElementById('recaptcha').checked;

            // Basic validation
            if (!service) {
                alert('Please select a service');
                return;
            }

            if (!phone || !/^\d{10}$/.test(phone)) {
                alert('Please enter a valid 10-digit phone number');
                return;
            }

            if (!message || message.trim().length < 10) {
                alert('Please enter a message (at least 10 characters)');
                return;
            }

            if (!recaptcha) {
                alert('Please complete the reCAPTCHA verification');
                return;
            }

            // Show loading
            const submitButton = this.form.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

            // SheetDB API integration
            const SHEETDB_URL = 'https://sheetdb.io/api/v1/08jemap0cji2o';
            const payload = {
                data: [
                    {
                        service: service,
                        phone: phone,
                        message: message
                    }
                ]
            };

            fetch(SHEETDB_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            .then(response => {
                if (response.ok) {
                    this.showSuccess();
                    this.resetForm();
                } else {
                    return response.json().then(data => {
                        throw new Error(data.error || 'Submission failed');
                    });
                }
            })
            .catch(error => {
                alert('Error submitting form: ' + error.message);
                submitButton.disabled = false;
                submitButton.innerHTML = 'Request A Call Back';
            });
    }

    showSuccess() {
        const submitButton = this.form.querySelector('button[type="submit"]');
        submitButton.disabled = false;
        submitButton.innerHTML = 'Request A Call Back';
        
        this.successMessage.classList.add('show');
        
        setTimeout(() => {
            this.successMessage.classList.remove('show');
        }, 5000);

        this.successMessage.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }

    resetForm() {
        this.form.reset();
        document.getElementById('recaptcha').checked = false;
    }
}

// Enhanced Smooth Scrolling - Fixed Navigation
class SmoothScrollManager {
    constructor() {
        this.init();
    }

    init() {
        // Handle all navigation links
        const navLinks = document.querySelectorAll('a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                
                console.log('Navigation clicked:', targetId); // Debug log
                
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    this.scrollToElement(targetElement);
                } else {
                    console.log('Target element not found:', targetId);
                }
            });
        });

        // Handle CTA buttons - scroll to contact form
        const ctaButtons = document.querySelectorAll('.btn-quote-small, .btn-primary');
        ctaButtons.forEach(button => {
            const text = button.textContent.toLowerCase();
            if (text.includes('quote') || text.includes('build') || text.includes('free')) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const contactSection = document.getElementById('contact');
                    if (contactSection) {
                        this.scrollToElement(contactSection);
                    }
                });
            }
        });
    }

    scrollToElement(element) {
        const header = document.querySelector('.header');
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = element.offsetTop - headerHeight - 20;
        
        console.log('Scrolling to position:', targetPosition); // Debug log
        
        window.scrollTo({
            top: Math.max(0, targetPosition),
            behavior: 'smooth'
        });
    }
}

// Animation Manager
class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupHoverEffects();
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    
                    // Stagger animation for grid items
                    const gridItems = entry.target.querySelectorAll(
                        '.feature-card, .service-card, .testimonial-card, .pricing-card, .project-item'
                    );
                    gridItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }
            });
        }, observerOptions);

        // Observe sections
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            observer.observe(section);
            
            // Initially hide grid items
            const gridItems = section.querySelectorAll(
                '.feature-card, .service-card, .testimonial-card, .pricing-card, .project-item'
            );
            gridItems.forEach(item => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            });
        });
    }

    setupHoverEffects() {
        // Card hover effects
        const cards = document.querySelectorAll('.feature-card, .service-card, .testimonial-card, .pricing-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
                card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Button hover effects
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
            });
        });
    }
}

// Statistics Counter
class StatsCounterManager {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number');
        this.hasAnimated = new Set();
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.hasAnimated.has(entry.target)) {
                    this.animateCounter(entry.target);
                    this.hasAnimated.add(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    animateCounter(element) {
        const target = element.textContent;
        const isPercentage = target.includes('%');
        const hasPlus = target.includes('+');
        const numericValue = parseInt(target.replace(/[^\d]/g, ''));
        
        let current = 0;
        const increment = numericValue / 60;
        const duration = 2000;
        const stepTime = duration / 60;

        const timer = setInterval(() => {
            current += increment;
            if (current >= numericValue) {
                current = numericValue;
                clearInterval(timer);
            }
            
            let displayValue = Math.floor(current);
            if (isPercentage) {
                displayValue += '%';
            } else if (hasPlus) {
                displayValue += '+';
            }
            
            element.textContent = displayValue;
        }, stepTime);
    }
}

// Header Scroll Manager
class HeaderScrollManager {
    constructor() {
        this.header = document.querySelector('.header');
        this.lastScrollY = window.scrollY;
        this.init();
    }

    init() {
        let ticking = false;
        
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateHeader();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    updateHeader() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 50) {
            this.header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
            this.header.style.backdropFilter = 'blur(10px)';
        } else {
            this.header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            this.header.style.backdropFilter = 'none';
        }
        
        this.lastScrollY = currentScrollY;
    }
}

// Scroll to Top Manager
class ScrollToTopManager {
    constructor() {
        this.createButton();
        this.init();
    }

    createButton() {
        this.button = document.createElement('button');
        this.button.innerHTML = '<i class="fas fa-arrow-up"></i>';
        this.button.className = 'scroll-to-top';
        this.button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--brand-primary);
            color: white;
            border: none;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        `;
        
        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        document.body.appendChild(this.button);
    }

    init() {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                this.button.style.opacity = '1';
                this.button.style.visibility = 'visible';
            } else {
                this.button.style.opacity = '0';
                this.button.style.visibility = 'hidden';
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🏗️ Initializing URK Infraprojects Website...');
    
    try {
        // Initialize all managers
        const themeManager = new ThemeManager();
        const mobileMenuManager = new MobileMenuManager();
        const contactFormManager = new ContactFormManager();
        const smoothScrollManager = new SmoothScrollManager();
        const animationManager = new AnimationManager();
        const statsCounterManager = new StatsCounterManager();
        const headerScrollManager = new HeaderScrollManager();
        const scrollToTopManager = new ScrollToTopManager();

        // Add loading animation
        document.body.classList.add('loaded');

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                mobileMenuManager.closeMenu();
            }
        });

        // Debug: Test theme toggle immediately
        console.log('Theme toggle button found:', !!document.getElementById('theme-toggle'));
        console.log('Initial theme:', themeManager.currentTheme);

        // Export for debugging
        window.URKInfraprojects = {
            themeManager,
            mobileMenuManager,
            contactFormManager,
            smoothScrollManager,
            animationManager,
            statsCounterManager,
            headerScrollManager,
            scrollToTopManager
        };

        console.log('✅ URK Infraprojects Website Initialized Successfully!');
        console.log(`🎨 Current Theme: ${themeManager.currentTheme}`);
        console.log(`📱 Screen: ${window.innerWidth}x${window.innerHeight}`);

    } catch (error) {
        console.error('❌ Initialization Error:', error);
    }
});

// Add required CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .loaded {
        animation: fadeInUp 0.6s ease-out;
    }
`;
document.head.appendChild(style);