// Simple popup script
document.addEventListener('DOMContentLoaded', () => {
    // Load stats from storage
    chrome.storage.local.get(['highlights']).then(result => {
        const highlights = result.highlights || [];
        document.getElementById('highlight-count').textContent = highlights.length;
        document.getElementById('note-count').textContent = highlights.filter(h => h.notes).length;
        
        // Display recent highlights
        const container = document.getElementById('highlights-list');
        if (highlights.length === 0) {
            container.innerHTML = '<div class="empty-state">No highlights yet. Select text on any webpage!</div>';
        } else {
            const recent = highlights.slice(-3).reverse();
            container.innerHTML = recent.map(h => `
                <div class="highlight-item">
                    <div class="highlight-text">${h.text.substring(0, 50)}...</div>
                    <div class="highlight-meta">${new Date(h.timestamp).toLocaleDateString()}</div>
                </div>
            `).join('');
        }
    });

    // Load settings
    chrome.storage.local.get(['language', 'extensionEnabled']).then(result => {
        document.getElementById('language-select').value = result.language || 'en';
        document.getElementById('extension-toggle').checked = result.extensionEnabled !== false;
    });

    // Event listeners
    document.getElementById('extension-toggle').addEventListener('change', (e) => {
        chrome.storage.local.set({ extensionEnabled: e.target.checked });
    });

    document.getElementById('language-select').addEventListener('change', (e) => {
        chrome.storage.local.set({ language: e.target.value });
    });

    document.getElementById('open-portal').addEventListener('click', () => {
        chrome.tabs.create({ url: chrome.runtime.getURL('../index.html') });
    });

    document.getElementById('export-highlights').addEventListener('click', () => {
        chrome.storage.local.get(['highlights']).then(result => {
            const blob = new Blob([JSON.stringify(result.highlights || [], null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'highlights.json';
            a.click();
            URL.revokeObjectURL(url);
        });
    });
});