/* ====================================================
   PORTFOLIO SCRIPT - Vanilla JavaScript
   ====================================================
   
   Функциональность:
   - Навигация между секциями
   - Мобильное меню (hamburger)
   - Модальное окно для галереи
   - Scroll animations (fade-in)
   - Smooth scrolling
   - Активные ссылки навигации
   
   ==================================================== */

// ====================================================
// 1. INITIALIZATION
// ====================================================

document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initMobileMenu();
    initModal();
    initScrollAnimations();
    initSectionNavigation();
    initFormValidation();
});

// ====================================================
// 2. NAVIGATION & SCROLLING
// ====================================================

/**
 * Инициализирует навигацию между секциями
 */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetSection = this.getAttribute('data-section');
            if (targetSection) {
                e.preventDefault();
                navigateToSection(targetSection);
            }
        });
    });

    // Обновление активного статуса ссылок при скролле
    window.addEventListener('scroll', updateActiveNavLink);
}

/**
 * Переходит к выбранной секции с анимацией
 * @param {string} sectionId - ID секции для перехода
 */
function navigateToSection(sectionId) {
    const section = document.getElementById(sectionId);
    
    if (section) {
        // Плавный скролл
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Обновление активной ссылки
        updateActiveNavLink();
        
        // Закрытие мобильного меню если оно открыто
        closeMobileMenu();
    }
}

/**
 * Обновляет активную ссылку в навигации в зависимости от текущей секции
 */
function updateActiveNavLink() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop - 100) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === currentSection) {
            link.classList.add('active');
        }
    });
}

// ====================================================
// 3. MOBILE MENU
// ====================================================

/**
 * Инициализирует мобильное меню (hamburger)
 */
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            if (navMenu) {
                navMenu.classList.toggle('active');
            }
        });
    }
    
    // Закрытие меню при клике вне его
    document.addEventListener('click', function(event) {
        if (hamburger && navMenu && !event.target.closest('.nav-container')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

/**
 * Закрывает мобильное меню
 */
function closeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
}

// ====================================================
// 4. SCROLL ANIMATIONS
// ====================================================

/**
 * Инициализирует анимации при скролле (fade-in effect)
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Наблюдение за элементами с классом fade-in-on-scroll
    document.querySelectorAll('.fade-in-on-scroll').forEach(element => {
        observer.observe(element);
    });
    
    // Наблюдение за секциями
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
}

// ====================================================
// 5. MODAL FOR ACHIEVEMENTS GALLERY
// ====================================================

/**
 * Инициализирует модальное окно для галереи достижений
 */
function initModal() {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const closeBtn = document.querySelector('.modal-close');
    
    if (!modal) return;
    
    // Добавляем обработчик клика на элементы галереи
    document.querySelectorAll('.achievement-item').forEach(item => {
        item.addEventListener('click', function() {
            const image = this.querySelector('.achievement-image');
            const caption = this.querySelector('.achievement-caption');
            
            if (image && caption) {
                // Создаем временный canvas для сохранения SVG
                const svg = image.querySelector('svg');
                if (svg) {
                    // Используем SVG напрямую
                    const svgString = new XMLSerializer().serializeToString(svg);
                    const blob = new Blob([svgString], { type: 'image/svg+xml' });
                    const url = URL.createObjectURL(blob);
                    
                    modalImage.src = url;
                    modalCaption.textContent = caption.textContent;
                    modal.classList.add('show');
                    document.body.style.overflow = 'hidden';
                }
            }
        });
    });
    
    // Закрытие модального окна
    closeBtn.addEventListener('click', closeModal);
    
    // Закрытие при клике вне модального окна
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Закрытие при нажатии ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
    
    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        if (modalImage.src.startsWith('blob:')) {
            URL.revokeObjectURL(modalImage.src);
        }
        modalImage.src = '';
        modalCaption.textContent = '';
    }
}

// ====================================================
// 6. SECTION NAVIGATION (CTA BUTTONS)
// ====================================================

/**
 * Инициализирует кнопки навигации (data-navigate атрибут)
 */
function initSectionNavigation() {
    document.querySelectorAll('[data-navigate]').forEach(button => {
        button.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-navigate');
            if (targetSection) {
                navigateToSection(targetSection);
            }
        });
    });
}

// ====================================================
// 7. FORM VALIDATION & SUBMISSION
// ====================================================

/**
 * Инициализирует валидацию и обработку формы контактов
 */
function initFormValidation() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: this.querySelector('input[type="text"]').value,
                email: this.querySelector('input[type="email"]').value,
                message: this.querySelector('textarea').value
            };
            
            // Валидация
            if (!formData.name || !formData.email || !formData.message) {
                showNotification('Пожалуйста, заполните все поля!', 'error');
                return;
            }
            
            // Проверка email
            if (!isValidEmail(formData.email)) {
                showNotification('Пожалуйста, введите корректный email!', 'error');
                return;
            }
            
            // Показываем успешное сообщение
            showNotification('Спасибо за сообщение! Я скоро свяжусь с вами.', 'success');
            
            // Очищаем форму
            this.reset();
            
            // Примечание: Для полной функциональности требуется бэкенд сервис
            console.log('Form Data:', formData);
        });
    }
}

/**
 * Проверяет валидность email адреса
 * @param {string} email - Email для проверки
 * @returns {boolean} - true если email валидна
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Показывает уведомление пользователю
 * @param {string} message - Текст уведомления
 * @param {string} type - Тип уведомления ('success', 'error', 'info')
 */
function showNotification(message, type = 'info') {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Стили для уведомления (если их еще нет)
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 16px 24px;
                border-radius: 8px;
                font-weight: 600;
                z-index: 3000;
                animation: slideInRight 0.3s ease forwards;
                max-width: 400px;
            }
            
            .notification-success {
                background: #4ade80;
                color: white;
            }
            
            .notification-error {
                background: #ef4444;
                color: white;
            }
            
            .notification-info {
                background: #00d4ff;
                color: #0f0f1e;
            }
            
            @media (max-width: 480px) {
                .notification {
                    right: 10px;
                    left: 10px;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Удаляем уведомление через 4 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// ====================================================
// 8. UTILITY FUNCTIONS
// ====================================================

/**
 * Получает элемент по селектору с проверкой существования
 * @param {string} selector - CSS селектор
 * @returns {HTMLElement|null} - Найденный элемент или null
 */
function getElement(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        console.warn(`Element not found: ${selector}`);
        return null;
    }
    return element;
}

/**
 * Добавляет класс к элементу
 * @param {HTMLElement} element - Элемент
 * @param {string} className - Имя класса
 */
function addClass(element, className) {
    if (element) {
        element.classList.add(className);
    }
}

/**
 * Удаляет класс с элемента
 * @param {HTMLElement} element - Элемент
 * @param {string} className - Имя класса
 */
function removeClass(element, className) {
    if (element) {
        element.classList.remove(className);
    }
}

/**
 * Переключает класс на элементе
 * @param {HTMLElement} element - Элемент
 * @param {string} className - Имя класса
 */
function toggleClass(element, className) {
    if (element) {
        element.classList.toggle(className);
    }
}

// ====================================================
// 9. ACCESSIBILITY & PERFORMANCE
// ====================================================

/**
 * Добавляет поддержку клавиатурной навигации
 */
function initKeyboardNavigation() {
    document.addEventListener('keydown', function(event) {
        // Alt + стрелка вверх/вниз для навигации между секциями
        if (event.altKey && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
            event.preventDefault();
            
            const sections = Array.from(document.querySelectorAll('.section'));
            let currentIndex = 0;
            
            // Находим текущую секцию
            sections.forEach((section, index) => {
                if (section.getBoundingClientRect().top < window.innerHeight / 2) {
                    currentIndex = index;
                }
            });
            
            // Переходим к следующей или предыдущей секции
            if (event.key === 'ArrowDown' && currentIndex < sections.length - 1) {
                sections[currentIndex + 1].scrollIntoView({ behavior: 'smooth' });
            } else if (event.key === 'ArrowUp' && currentIndex > 0) {
                sections[currentIndex - 1].scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
}

// Инициализируем клавиатурную навигацию
initKeyboardNavigation();

// ====================================================
// 10. DEBOUNCE FUNCTION (для оптимизации)
// ====================================================

/**
 * Функция debounce для оптимизации обработчиков событий
 * @param {Function} func - Функция для выполнения
 * @param {number} wait - Время ожидания в миллисекундах
 * @returns {Function} - Debounced функция
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Применяем debounce к resize событию для оптимизации
window.addEventListener('resize', debounce(function() {
    updateActiveNavLink();
}, 250));

// ====================================================
// 11. PROGRESS BAR ANIMATION
// ====================================================

/**
 * Инициализирует анимацию progress bars
 */
function initProgressBars() {
    const progressFills = document.querySelectorAll('.progress-fill');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Получаем значение ширины из inline стиля
                const width = entry.target.style.width;
                // Перезапускаем анимацию
                entry.target.style.width = '0';
                setTimeout(() => {
                    entry.target.style.width = width;
                }, 50);
                // Останавливаем наблюдение
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    progressFills.forEach(fill => {
        observer.observe(fill);
    });
}

// Инициализируем progress bars при загрузке
initProgressBars();

// ====================================================
// 12. CONSOLE MESSAGE
// ====================================================

console.log('%c👋 Welcome to My Portfolio!', 'color: #00d4ff; font-size: 20px; font-weight: bold;');
console.log('%cDesigned and built with HTML5, CSS3, and Vanilla JavaScript', 'color: #9d4edd; font-size: 14px;');
console.log('%cEnjoy exploring my projects! 🚀', 'color: #3a0ca3; font-size: 14px;');
