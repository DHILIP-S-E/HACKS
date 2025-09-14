// Main application logic
class LearningPortal {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadUserSettings();
        this.checkAuthState();
        this.setupExtensionListener();
    }

    setupEventListeners() {
        // Auth form
        document.getElementById('auth-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('register-btn').addEventListener('click', () => {
            this.handleRegister();
        });

        // Theme controls
        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        document.getElementById('contrast-toggle').addEventListener('click', () => {
            this.toggleContrast();
        });

        document.getElementById('font-toggle').addEventListener('click', () => {
            this.toggleFont();
        });

        // Language selector
        document.getElementById('language-select').addEventListener('change', (e) => {
            this.setLanguage(e.target.value);
        });

        // Admin controls
        document.getElementById('export-data').addEventListener('click', () => {
            localAdapter.exportData();
        });

        document.getElementById('view-all-users').addEventListener('click', () => {
            this.showAllUsers();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModals();
            }
        });
    }

    handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const user = localAdapter.authenticateUser(username, password);
        if (user) {
            this.currentUser = user;
            this.showDashboard();
            this.saveAuthState();
            aiAdapter.announceToScreenReader(`Welcome back, ${username}`);
        } else {
            alert('Invalid credentials');
        }
    }

    handleRegister() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username && password) {
            const user = localAdapter.createUser(username, password);
            this.currentUser = user;
            this.showDashboard();
            this.saveAuthState();
            aiAdapter.announceToScreenReader(`Account created for ${username}`);
        } else {
            alert('Please enter username and password');
        }
    }

    showDashboard() {
        document.getElementById('auth-section').classList.add('hidden');
        document.getElementById('dashboard').classList.remove('hidden');
        
        if (this.currentUser.isAdmin) {
            document.getElementById('admin-section').classList.remove('hidden');
        }

        this.updateDashboard();
    }

    updateDashboard() {
        this.updateProgress();
        this.updateBadges();
        this.updateHighlights();
        this.updateScoreboard();
    }

    updateProgress() {
        const userLevel = localAdapter.getUserLevel(this.currentUser.id);
        document.getElementById('user-level').textContent = userLevel.level;
        document.getElementById('user-points').textContent = userLevel.points;
        
        const progressPercent = (userLevel.points % 100);
        document.getElementById('progress-fill').style.width = `${progressPercent}%`;
        
        const progressBar = document.querySelector('.progress-bar');
        progressBar.setAttribute('aria-valuenow', progressPercent);
    }

    updateBadges() {
        const badges = localAdapter.getUserBadges(this.currentUser.id);
        const badgesGrid = document.getElementById('badges-grid');
        
        badgesGrid.innerHTML = badges.map(badge => `
            <div class="badge" role="img" aria-label="Badge: ${badge.badge}">
                🏆 ${badge.badge}
            </div>
        `).join('');
    }

    updateHighlights() {
        const highlights = localAdapter.getUserProgress(this.currentUser.id);
        const highlightsList = document.getElementById('highlights-list');
        
        if (highlights.length === 0) {
            highlightsList.innerHTML = '<p>No highlights yet. Install the browser extension to start highlighting!</p>';
            return;
        }

        highlightsList.innerHTML = highlights.map(highlight => `
            <div class="highlight-item">
                <div class="highlight-content">"${highlight.content}"</div>
                ${highlight.notes ? `<div class="highlight-note">Note: ${highlight.notes}</div>` : ''}
                <div class="highlight-meta">
                    ${highlight.type} • ${new Date(highlight.timestamp).toLocaleDateString()}
                </div>
            </div>
        `).join('');
    }

    updateScoreboard() {
        const scoreboard = localAdapter.getScoreboard();
        const scoreboardBody = document.getElementById('scoreboard-body');
        
        scoreboardBody.innerHTML = scoreboard.map((entry, index) => `
            <tr ${entry.userId === this.currentUser.id ? 'style="background: rgba(0, 123, 255, 0.1);"' : ''}>
                <td>${index + 1}</td>
                <td>${entry.username}</td>
                <td>${entry.level}</td>
                <td>${entry.points}</td>
            </tr>
        `).join('');
    }

    // Theme management
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        this.saveUserSettings({ theme: newTheme });
        
        const themeButton = document.getElementById('theme-toggle');
        themeButton.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        themeButton.setAttribute('aria-label', `Switch to ${newTheme === 'dark' ? 'light' : 'dark'} mode`);
    }

    toggleContrast() {
        const currentContrast = document.documentElement.getAttribute('data-contrast');
        const newContrast = currentContrast === 'high' ? 'normal' : 'high';
        
        document.documentElement.setAttribute('data-contrast', newContrast);
        this.saveUserSettings({ contrast: newContrast });
        
        aiAdapter.announceToScreenReader(`${newContrast} contrast mode activated`);
    }

    toggleFont() {
        const currentFont = document.documentElement.getAttribute('data-font');
        const newFont = currentFont === 'dyslexia' ? 'normal' : 'dyslexia';
        
        document.documentElement.setAttribute('data-font', newFont);
        this.saveUserSettings({ font: newFont });
        
        aiAdapter.announceToScreenReader(`${newFont} font activated`);
    }

    setLanguage(language) {
        aiAdapter.setLanguage(language);
        this.saveUserSettings({ language });
    }

    // Settings persistence
    saveUserSettings(settings) {
        if (this.currentUser) {
            localAdapter.saveUserSettings(this.currentUser.id, settings);
        } else {
            // Save to localStorage for anonymous users
            const currentSettings = JSON.parse(localStorage.getItem('portal_settings') || '{}');
            localStorage.setItem('portal_settings', JSON.stringify({ ...currentSettings, ...settings }));
        }
    }

    loadUserSettings() {
        let settings = {};
        
        if (this.currentUser) {
            settings = localAdapter.getUserSettings(this.currentUser.id);
        } else {
            settings = JSON.parse(localStorage.getItem('portal_settings') || '{}');
        }

        // Apply settings
        if (settings.theme) {
            document.documentElement.setAttribute('data-theme', settings.theme);
            document.getElementById('theme-toggle').textContent = settings.theme === 'dark' ? '☀️' : '🌙';
        }
        
        if (settings.contrast) {
            document.documentElement.setAttribute('data-contrast', settings.contrast);
        }
        
        if (settings.font) {
            document.documentElement.setAttribute('data-font', settings.font);
        }
        
        if (settings.language) {
            aiAdapter.setLanguage(settings.language);
            document.getElementById('language-select').value = settings.language;
        }
    }

    // Auth state management
    saveAuthState() {
        if (this.currentUser) {
            sessionStorage.setItem('current_user', JSON.stringify(this.currentUser));
        }
    }

    checkAuthState() {
        const savedUser = sessionStorage.getItem('current_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.showDashboard();
        }
        
        // Auto-refresh dashboard every 2 seconds to show new highlights
        setInterval(() => {
            if (this.currentUser && !document.getElementById('dashboard').classList.contains('hidden')) {
                this.updateDashboard();
            }
        }, 2000);
    }

    logout() {
        this.currentUser = null;
        sessionStorage.removeItem('current_user');
        document.getElementById('dashboard').classList.add('hidden');
        document.getElementById('admin-section').classList.add('hidden');
        document.getElementById('auth-section').classList.remove('hidden');
    }

    // Admin functions
    showAllUsers() {
        const data = localAdapter.getData();
        const adminData = document.getElementById('admin-data');
        
        const usersHtml = data.users.map(user => {
            const userLevel = localAdapter.getUserLevel(user.id);
            const userBadges = localAdapter.getUserBadges(user.id);
            
            return `
                <div class="card">
                    <h4>${user.username} ${user.isAdmin ? '(Admin)' : ''}</h4>
                    <p>Level: ${userLevel.level} | Points: ${userLevel.points}</p>
                    <p>Badges: ${userBadges.length}</p>
                    <p>Joined: ${new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
            `;
        }).join('');
        
        adminData.innerHTML = `<h3>All Users</h3>${usersHtml}`;
    }

    // Extension communication
    setupExtensionListener() {
        localAdapter.listenForUpdates((message) => {
            if (message.type === 'highlight_added' || message.type === 'note_added') {
                this.updateDashboard();
                aiAdapter.announceToScreenReader('New activity recorded');
            }
        });
    }

    closeModals() {
        // Close any open modals or dropdowns
        document.querySelectorAll('.modal, .dropdown').forEach(el => {
            el.classList.add('hidden');
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add demo data first
    if (!localStorage.getItem('assistive_learning_data')) {
        const demoUser = localAdapter.createUser('demo', 'demo123');
        localAdapter.addProgress(demoUser.id, 'highlight', 'This is a sample highlight for testing purposes.', 'Important concept to remember');
        localAdapter.addProgress(demoUser.id, 'note', 'Personal note about the learning material.', '');
    }
    
    window.learningPortal = new LearningPortal();
});