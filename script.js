/**
 * Saptarshi Ghosh — Portfolio Interactive Script
 * Handles navigation tab switching, portfolio filtering, modals,
 * contact form submission, mobile sidebar toggles, and toast alerts.
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
    initNavigationTabs();
    initSidebarToggle();
    initPortfolioFilters();
    initProjectModals();
    initBlogModals();
    initContactForm();
    initCopyToClipboard();
    initSkillBars();
    initButtonRipples();
});

/* ==========================================================================
   1. NAVIGATION TAB SWITCHING & URL HASH HANDLING
   ========================================================================== */
function initNavigationTabs() {
    const navLinks = document.querySelectorAll('.navbar-link');
    const tabSections = document.querySelectorAll('.tab-content');

    if (!navLinks.length || !tabSections.length) return;

    function switchTab(targetId) {
        if (!targetId) targetId = 'about';
        // Clean hash if provided with '#'
        const cleanId = targetId.replace('#', '');
        const targetSection = document.getElementById(cleanId);

        if (!targetSection) return;

        // Update nav links active state
        navLinks.forEach(link => {
            const linkTarget = link.getAttribute('href')?.replace('#', '');
            if (linkTarget === cleanId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Switch tab content
        tabSections.forEach(section => {
            if (section.id === cleanId) {
                section.classList.add('active');
                // Scroll main content into view smoothly on smaller screens
                if (window.innerWidth <= 992) {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            } else {
                section.classList.remove('active');
            }
        });

        // Trigger skill progress animations if about or resume tab is opened
        if (cleanId === 'about' || cleanId === 'resume') {
            animateSkillBars();
        }
    }

    // Attach click event to all navbar links
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId) {
                switchTab(targetId);
                history.pushState(null, '', targetId);
            }
        });
    });

    // Handle deep-linking on initial page load (e.g. #portfolio, #resume)
    if (window.location.hash) {
        switchTab(window.location.hash);
    } else {
        switchTab('about');
    }

    // Support browser back/forward buttons
    window.addEventListener('popstate', () => {
        const hash = window.location.hash || '#about';
        switchTab(hash);
    });

    // Expose global helper for in-page buttons that switch tabs (e.g. "View Projects" or "Contact Me")
    window.navigateToTab = function (tabId) {
        switchTab(tabId);
        history.pushState(null, '', '#' + tabId);
    };
}

/* ==========================================================================
   2. MOBILE SIDEBAR TOGGLE
   ========================================================================== */
function initSidebarToggle() {
    const sidebarToggleBtn = document.querySelector('[data-sidebar-btn]');
    const sidebar = document.querySelector('.sidebar');
    const toggleIcon = sidebarToggleBtn ? sidebarToggleBtn.querySelector('i') : null;
    const toggleText = sidebarToggleBtn ? sidebarToggleBtn.querySelector('span') : null;

    if (!sidebarToggleBtn || !sidebar) return;

    sidebarToggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('expanded');
        const isExpanded = sidebar.classList.contains('expanded');

        if (toggleText) {
            toggleText.textContent = isExpanded ? 'Hide Contacts' : 'Show Contacts';
        }
        if (toggleIcon) {
            toggleIcon.className = isExpanded ? 'fas fa-chevron-up' : 'fas fa-chevron-down';
        }
    });
}

/* ==========================================================================
   3. PORTFOLIO CATEGORY FILTERING
   ========================================================================== */
function initPortfolioFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');

    if (!filterButtons.length || !projectItems.length) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Update active state on buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const selectedCategory = this.getAttribute('data-filter') || 'all';

            projectItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (selectedCategory === 'all' || itemCategory === selectedCategory) {
                    item.classList.remove('hidden');
                    item.style.display = 'flex';
                    // Trigger fade in animation
                    item.style.animation = 'none';
                    item.offsetHeight; // trigger reflow
                    item.style.animation = 'cardFadeIn 0.4s ease forwards';
                } else {
                    item.classList.add('hidden');
                    item.style.display = 'none';
                }
            });
        });
    });
}

/* ==========================================================================
   4. PROJECT DETAILS MODAL POPUP
   ========================================================================== */
const projectData = {
    'tic-tac-toe': {
        title: 'Tic Tac Toe Game',
        category: 'Interactive Web Game',
        image: 'tic-tac-toe.png',
        tags: ['HTML5', 'CSS3', 'JavaScript', 'Game Logic', 'Responsive Design'],
        description: 'An interactive and visually responsive Tic-Tac-Toe browser game with smooth win detection algorithms, turn indicators, custom sound/visual feedback, score tracking, and restart capabilities.',
        features: [
            'Dynamic 3x3 interactive matrix with real-time win condition evaluation',
            'Sleek neon UI with hover glows and victory highlight animations',
            'Scorekeeper for tracking Player X and Player O wins',
            'Mobile touch friendly and responsive across all devices'
        ],
        liveUrl: 'https://tic-tac-toe-fawn-xi-15.vercel.app/',
        githubUrl: 'https://github.com/sapghosh55-lab/tic-tac-toe'
    },
    'rock-paper-scissor': {
        title: 'Rock Paper Scissor Game',
        category: 'Interactive Web Game',
        image: 'rock-paper-scissor.png',
        tags: ['HTML5', 'CSS3', 'JavaScript', 'DOM Manipulation', 'Vercel'],
        description: 'A vibrant, animated Rock Paper Scissors game featuring random computer move generation, real-time score calculation, animated win/loss feedback, and celebratory effects.',
        features: [
            'Randomized AI decision generator with fair probability distribution',
            'Real-time animated score counter & round outcome badges',
            'Cyberpunk glowing visual effects and celebratory animations',
            'Instant reset and streak tracking'
        ],
        liveUrl: 'https://rock-paper-scissor-drab-nine.vercel.app/',
        githubUrl: 'https://github.com/sapghosh55-lab/rock-paper-scissor'
    },
    'currency-exchanger': {
        title: 'Currency Exchanger',
        category: 'Web Application / API',
        image: 'currency-exchanger.png',
        tags: ['JavaScript', 'REST API', 'Async/Await', 'CSS3', 'Currency API'],
        description: 'A fast real-time currency exchange converter application that fetches live global exchange rates via REST APIs, featuring country flag indicators and instant bi-directional conversion calculations.',
        features: [
            'Live global exchange rates fetched via asynchronous REST API',
            'Dynamic country flag updates matching selected currencies',
            'Interactive swap button for swift bi-directional exchange rate queries',
            'Error handling and fallback rates for offline/interrupted connectivity'
        ],
        liveUrl: 'https://currency-exchanger-six-psi.vercel.app/',
        githubUrl: 'https://github.com/sapghosh55-lab/Currency-exchanger.git'
    },
    'weather-app': {
        title: 'Weather App',
        category: 'Web Application / API',
        image: 'weather-app.png',
        tags: ['JavaScript', 'Weather API', 'Geolocation', 'CSS3', 'Async Fetch'],
        description: 'A comprehensive real-time weather application delivering live meteorology metrics, humidity, wind speeds, dynamic atmospheric background changes, and global city search.',
        features: [
            'Real-time temperature, humidity, wind velocity, and condition data',
            'Global search functionality for cities and regions worldwide',
            'Dynamic weather condition icons and visual atmosphere styling',
            'Fast response times with cached API responses and robust input validation'
        ],
        liveUrl: 'https://weather-app-pearl-rho-86.vercel.app/',
        githubUrl: 'https://github.com/sapghosh55-lab/Weather-app'
    }
};

function initProjectModals() {
    const modal = document.getElementById('project-modal');
    if (!modal) return;

    const modalCloseBtn = modal.querySelector('.modal-close-btn');
    const modalOverlay = modal.querySelector('.modal-backdrop');
    const detailButtons = document.querySelectorAll('[data-project-details]');

    function openProjectModal(projectId) {
        const data = projectData[projectId];
        if (!data) return;

        // Populate modal data
        modal.querySelector('#modal-project-img').src = data.image;
        modal.querySelector('#modal-project-img').alt = data.title;
        modal.querySelector('#modal-project-title').textContent = data.title;
        modal.querySelector('#modal-project-category').textContent = data.category;
        modal.querySelector('#modal-project-desc').textContent = data.description;
        
        // Tags
        const tagsContainer = modal.querySelector('#modal-project-tags');
        tagsContainer.innerHTML = '';
        data.tags.forEach(tag => {
            const span = document.createElement('span');
            span.className = 'tech-tag';
            span.textContent = tag;
            tagsContainer.appendChild(span);
        });

        // Features
        const featuresList = modal.querySelector('#modal-project-features');
        featuresList.innerHTML = '';
        data.features.forEach(feat => {
            const li = document.createElement('li');
            li.textContent = feat;
            featuresList.appendChild(li);
        });

        // Action links
        const liveBtn = modal.querySelector('#modal-live-link');
        const githubBtn = modal.querySelector('#modal-github-link');
        
        liveBtn.href = data.liveUrl;
        githubBtn.href = data.githubUrl;

        // Show modal with animation
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeProjectModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    detailButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const projectId = btn.getAttribute('data-project-details');
            openProjectModal(projectId);
        });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeProjectModal);

    // Keyboard ESC key close
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeProjectModal();
        }
    });
}

/* ==========================================================================
   5. BLOG READER MODAL
   ========================================================================== */
const blogPostsData = {
    'portfolio-site': {
        title: 'Building My Neon Cyber Portfolio Website',
        date: 'February 2026',
        category: 'Web Development',
        readTime: '4 min read',
        content: `
            <p>Creating a developer portfolio is more than simply listing projects — it is about crafting an interactive experience that demonstrates attention to design, clean architecture, and technical execution.</p>
            <br>
            <h4>Key Architectural Decisions</h4>
            <p>I opted for a modern, glassmorphic neon aesthetic with CSS custom properties (variables) for theme consistency. By structuring components into independent tabs and building an efficient JavaScript-driven single page application (SPA), page transitions remain instantaneous without unnecessary framework overhead.</p>
            <br>
            <h4>Interactive Features Built</h4>
            <ul>
                <li>Modular tab navigation with full browser history support.</li>
                <li>Dynamic category filtering for project showcases.</li>
                <li>Interactive quick-view modals for deep project inspection.</li>
                <li>Client-validated contact form with simulated real-time response toast alerts.</li>
            </ul>
        `
    },
    'stack-c-language': {
        title: 'Understanding Stack Data Structures in C',
        date: 'January 2026',
        category: 'Data Structures & C',
        readTime: '6 min read',
        content: `
            <p>The Stack is one of the foundational Linear Data Structures adhering strictly to the <strong>Last In, First Out (LIFO)</strong> principle. In C, understanding stacks is critical for mastering pointer manipulation and dynamic memory allocation.</p>
            <br>
            <h4>Core Stack Operations</h4>
            <ul>
                <li><strong>Push:</strong> Inserts an element on top of the stack, verifying overflow conditions.</li>
                <li><strong>Pop:</strong> Removes and returns the top element, handling underflow checks.</li>
                <li><strong>Peek:</strong> Inspects the top item without modifying the pointer.</li>
                <li><strong>isEmpty / isFull:</strong> Helper checks to ensure memory safety.</li>
            </ul>
            <br>
            <h4>Real-World Applications</h4>
            <p>Stacks are indispensable in compiler syntax parsing, undo/redo buffers, depth-first graph traversal, and function call execution stacks in computer architectures.</p>
        `
    },
    'web-dev-journey': {
        title: 'My Journey into Full-Stack Web Development',
        date: 'December 2025',
        category: 'Career & Learning',
        readTime: '5 min read',
        content: `
            <p>Stepping into computer science and web development has been a transformative experience. Transitioning from foundational C programming to the dynamic web ecosystem opened up endless opportunities for creative engineering.</p>
            <br>
            <h4>Milestones & Learnings</h4>
            <ul>
                <li><strong>Semantic HTML & Modern CSS:</strong> Mastering Flexbox, Grid, CSS custom properties, and responsive design for every device.</li>
                <li><strong>Modern JavaScript (ES6+):</strong> Async/await, REST API consumption, closures, and modular programming.</li>
                <li><strong>Open Source & Hackathons:</strong> Collaborating with other developers and building rapid prototypes under tight deadlines.</li>
            </ul>
            <br>
            <p>Every line of code is an opportunity to solve a real-world problem. Looking forward to expanding deeper into React, Next.js, and backend cloud architecture!</p>
        `
    }
};

function initBlogModals() {
    const modal = document.getElementById('blog-modal');
    if (!modal) return;

    const modalCloseBtn = modal.querySelector('.modal-close-btn');
    const modalOverlay = modal.querySelector('.modal-backdrop');
    const blogButtons = document.querySelectorAll('[data-blog-id]');

    function openBlogModal(blogId) {
        const post = blogPostsData[blogId];
        if (!post) return;

        modal.querySelector('#modal-blog-title').textContent = post.title;
        modal.querySelector('#modal-blog-date').textContent = post.date;
        modal.querySelector('#modal-blog-category').textContent = post.category;
        modal.querySelector('#modal-blog-readtime').textContent = post.readTime;
        modal.querySelector('#modal-blog-body').innerHTML = post.content;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeBlogModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    blogButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const blogId = btn.getAttribute('data-blog-id');
            openBlogModal(blogId);
        });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeBlogModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeBlogModal);

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeBlogModal();
        }
    });
}

/* ==========================================================================
   6. CONTACT FORM VALIDATION & SUBMISSION
   ========================================================================== */
function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const inputs = form.querySelectorAll('input, textarea');

    // Live validation check
    function checkFormValidity() {
        let allValid = true;
        inputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                allValid = false;
            }
            if (input.type === 'email' && input.value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value.trim())) {
                    allValid = false;
                }
            }
        });
        return allValid;
    }

    // Attach input listeners for responsive button state
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            if (submitBtn) {
                if (checkFormValidity()) {
                    submitBtn.removeAttribute('disabled');
                    submitBtn.classList.add('ready');
                } else {
                    submitBtn.classList.remove('ready');
                }
            }
        });
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const nameInput = form.querySelector('[name="fullname"]');
        const emailInput = form.querySelector('[name="email"]');
        const subjectInput = form.querySelector('[name="subject"]');
        const messageInput = form.querySelector('[name="message"]');

        const name = nameInput ? nameInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';
        const subject = subjectInput ? subjectInput.value.trim() : 'Portfolio Inquiry';
        const message = messageInput ? messageInput.value.trim() : '';

        if (!name || !email || !message) {
            showToast('Please fill out all required fields.', 'warning');
            return;
        }

        // Show loading state on button
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';
        }

        // Simulate async sending with instant feedback
        setTimeout(() => {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> <span>Send Message</span>';
                submitBtn.classList.remove('ready');
            }

            form.reset();
            showToast(`Thank you, ${name}! Your message has been sent successfully.`, 'success');
        }, 1200);
    });
}

/* ==========================================================================
   7. COPY TO CLIPBOARD & TOAST SYSTEM
   ========================================================================== */
function initCopyToClipboard() {
    const copyElements = document.querySelectorAll('[data-copy]');

    copyElements.forEach(el => {
        el.addEventListener('click', (e) => {
            const textToCopy = el.getAttribute('data-copy');
            if (!textToCopy) return;

            navigator.clipboard.writeText(textToCopy).then(() => {
                showToast(`Copied "${textToCopy}" to clipboard!`, 'info');
            }).catch(() => {
                showToast(`Copied to clipboard!`, 'info');
            });
        });
    });
}

let toastTimeout;
function showToast(message, type = 'info') {
    let toast = document.getElementById('toast-notification');

    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-notification';
        toast.className = 'toast-notification';
        document.body.appendChild(toast);
    }

    // Set icon based on type
    let icon = 'fas fa-info-circle';
    if (type === 'success') icon = 'fas fa-check-circle';
    if (type === 'warning') icon = 'fas fa-exclamation-triangle';
    if (type === 'error') icon = 'fas fa-times-circle';

    toast.innerHTML = `
        <div class="toast-content ${type}">
            <i class="${icon}"></i>
            <span>${message}</span>
        </div>
    `;

    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3800);
}

/* ==========================================================================
   8. SKILL BARS ANIMATION
   ========================================================================== */
function initSkillBars() {
    animateSkillBars();
}

function animateSkillBars() {
    const skillFills = document.querySelectorAll('.skill-progress-fill');
    skillFills.forEach(fill => {
        const targetWidth = fill.getAttribute('data-width') || fill.style.width;
        fill.style.width = '0%';
        setTimeout(() => {
            fill.style.width = targetWidth;
        }, 150);
    });
}

/* ==========================================================================
   9. BUTTON RIPPLE / ACTIVE GLOW EFFECT
   ========================================================================== */
function initButtonRipples() {
    const interactiveButtons = document.querySelectorAll('.btn, .navbar-link, .filter-btn, .project-btn, .sidebar-socials a, .contact-link');

    interactiveButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            const circle = document.createElement('span');
            circle.classList.add('ripple-effect');

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            circle.style.width = circle.style.height = `${size}px`;
            circle.style.left = `${e.clientX - rect.left - size / 2}px`;
            circle.style.top = `${e.clientY - rect.top - size / 2}px`;

            const existingRipple = this.querySelector('.ripple-effect');
            if (existingRipple) existingRipple.remove();

            this.appendChild(circle);
            setTimeout(() => circle.remove(), 600);
        });
    });
}
