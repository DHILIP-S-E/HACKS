// Local data adapter for JSON/localStorage operations
class LocalAdapter {
    constructor() {
        this.storageKey = 'assistive_learning_data';
        this.initializeData();
    }

    // Initialize default data structure
    initializeData() {
        const defaultData = {
            users: [],
            progress: [],
            badges: [],
            levels: [],
            settings: {}
        };

        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify(defaultData));
        }
    }

    // Get all data
    getData() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKey)) || {};
        } catch (error) {
            console.error('Error reading data:', error);
            return {};
        }
    }

    // Save all data
    saveData(data) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            this.broadcastUpdate('dataUpdated', data);
            return true;
        } catch (error) {
            console.error('Error saving data:', error);
            return false;
        }
    }

    // User operations
    createUser(username, password) {
        const data = this.getData();
        const userId = 'user_' + Date.now();
        
        const user = {
            id: userId,
            username,
            password: btoa(password), // Simple encoding (not secure for production)
            createdAt: new Date().toISOString(),
            isAdmin: username === 'admin'
        };

        data.users.push(user);
        
        // Initialize user level
        data.levels.push({
            userId,
            level: 1,
            points: 0,
            lastUpdated: new Date().toISOString()
        });

        this.saveData(data);
        return user;
    }

    authenticateUser(username, password) {
        const data = this.getData();
        return data.users.find(user => 
            user.username === username && user.password === btoa(password)
        );
    }

    // Progress operations
    addProgress(userId, type, content, notes = '', lessonId = '') {
        const data = this.getData();
        const progressId = 'progress_' + Date.now();
        
        const progressItem = {
            id: progressId,
            userId,
            lessonId,
            type,
            content,
            notes,
            timestamp: new Date().toISOString()
        };

        data.progress.push(progressItem);
        
        // Award points and check for badges
        this.awardPoints(userId, this.getPointsForAction(type));
        this.checkAndAwardBadges(userId, type);
        
        this.saveData(data);
        return progressItem;
    }

    getUserProgress(userId) {
        const data = this.getData();
        return data.progress.filter(item => item.userId === userId);
    }

    // Points and levels
    awardPoints(userId, points) {
        const data = this.getData();
        const userLevel = data.levels.find(level => level.userId === userId);
        
        if (userLevel) {
            userLevel.points += points;
            userLevel.level = Math.floor(userLevel.points / 100) + 1;
            userLevel.lastUpdated = new Date().toISOString();
        }
        
        this.saveData(data);
    }

    getPointsForAction(type) {
        const pointsMap = {
            'highlight': 10,
            'note': 15,
            'completion': 25,
            'quiz': 20
        };
        return pointsMap[type] || 5;
    }

    getUserLevel(userId) {
        const data = this.getData();
        return data.levels.find(level => level.userId === userId) || { level: 1, points: 0 };
    }

    // Badge operations
    checkAndAwardBadges(userId, actionType) {
        const data = this.getData();
        const userProgress = this.getUserProgress(userId);
        const userBadges = data.badges.filter(badge => badge.userId === userId);
        
        const badgeRules = [
            {
                id: 'first_highlight',
                name: 'First Highlight',
                condition: () => userProgress.filter(p => p.type === 'highlight').length >= 1,
                awarded: userBadges.some(b => b.badge === 'First Highlight')
            },
            {
                id: 'note_taker',
                name: 'Note Taker',
                condition: () => userProgress.filter(p => p.type === 'note').length >= 5,
                awarded: userBadges.some(b => b.badge === 'Note Taker')
            },
            {
                id: 'dedicated_learner',
                name: 'Dedicated Learner',
                condition: () => userProgress.length >= 10,
                awarded: userBadges.some(b => b.badge === 'Dedicated Learner')
            }
        ];

        badgeRules.forEach(rule => {
            if (!rule.awarded && rule.condition()) {
                data.badges.push({
                    userId,
                    badge: rule.name,
                    awardedAt: new Date().toISOString()
                });
            }
        });

        this.saveData(data);
    }

    getUserBadges(userId) {
        const data = this.getData();
        return data.badges.filter(badge => badge.userId === userId);
    }

    // Settings operations
    saveUserSettings(userId, settings) {
        const data = this.getData();
        data.settings[userId] = { ...data.settings[userId], ...settings };
        this.saveData(data);
    }

    getUserSettings(userId) {
        const data = this.getData();
        return data.settings[userId] || {};
    }

    // Scoreboard
    getScoreboard() {
        const data = this.getData();
        return data.levels
            .map(level => {
                const user = data.users.find(u => u.id === level.userId);
                return {
                    userId: level.userId,
                    username: user ? user.username : 'Unknown',
                    level: level.level,
                    points: level.points
                };
            })
            .sort((a, b) => b.points - a.points);
    }

    // Export data for admin
    exportData() {
        const data = this.getData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `learning_data_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // BroadcastChannel for extension communication
    broadcastUpdate(type, data) {
        if (typeof BroadcastChannel !== 'undefined') {
            const channel = new BroadcastChannel('learning_portal');
            channel.postMessage({ type, data });
        }
    }

    // Listen for extension updates
    listenForUpdates(callback) {
        if (typeof BroadcastChannel !== 'undefined') {
            const channel = new BroadcastChannel('learning_portal');
            channel.onmessage = (event) => {
                callback(event.data);
            };
        }
    }
}

// Global instance
window.localAdapter = new LocalAdapter();