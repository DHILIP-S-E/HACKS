// Working text highlighter
let selectedText = '';
let selectedRange = null;

document.addEventListener('mouseup', () => {
    const selection = window.getSelection();
    selectedText = selection.toString().trim();
    
    if (selectedText.length > 0) {
        selectedRange = selection.getRangeAt(0).cloneRange();
        showHighlightButton();
    } else {
        hideHighlightButton();
    }
});

function showHighlightButton() {
    hideHighlightButton();
    
    const btn = document.createElement('div');
    btn.id = 'highlight-btn';
    btn.innerHTML = '📝 Highlight';
    btn.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: #007bff;
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        cursor: pointer;
        z-index: 999999;
        font-size: 14px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    `;
    
    btn.onclick = highlightSelectedText;
    document.body.appendChild(btn);
    
    setTimeout(() => {
        if (document.getElementById('highlight-btn')) {
            hideHighlightButton();
        }
    }, 3000);
}

function hideHighlightButton() {
    const btn = document.getElementById('highlight-btn');
    if (btn) btn.remove();
}

function highlightSelectedText() {
    if (!selectedRange || !selectedText) return;
    
    const span = document.createElement('span');
    span.style.cssText = 'background-color: #ffeb3b !important; padding: 1px 2px; border-radius: 2px;';
    span.className = 'assistive-highlight';
    span.title = 'Click to add note';
    
    try {
        selectedRange.surroundContents(span);
        
        // Add click listener for notes
        span.onclick = () => {
            const note = prompt('Add your note:');
            if (note) {
                span.title = `Note: ${note}`;
                span.style.backgroundColor = '#4caf50';
                saveHighlight(selectedText, note);
            }
        };
        
        saveHighlight(selectedText, '');
        hideHighlightButton();
        
        // Clear selection
        window.getSelection().removeAllRanges();
        
    } catch (e) {
        console.log('Highlight failed');
    }
}

async function saveHighlight(text, note) {
    // Save to extension storage
    const data = await chrome.storage.local.get(['highlights']);
    const highlights = data.highlights || [];
    
    const highlight = {
        id: Date.now(),
        text: text,
        note: note,
        url: window.location.href,
        timestamp: new Date().toISOString()
    };
    
    highlights.push(highlight);
    await chrome.storage.local.set({ highlights });
    
    // Sync with portal localStorage
    try {
        const portalData = JSON.parse(localStorage.getItem('assistive_learning_data') || '{}');
        if (!portalData.progress) portalData.progress = [];
        
        portalData.progress.push({
            id: 'progress_' + Date.now(),
            userId: 'user_1',
            type: note ? 'note' : 'highlight',
            content: text,
            notes: note,
            timestamp: new Date().toISOString()
        });
        
        localStorage.setItem('assistive_learning_data', JSON.stringify(portalData));
        
        // Broadcast to portal if open
        if (typeof BroadcastChannel !== 'undefined') {
            const channel = new BroadcastChannel('learning_portal');
            channel.postMessage({ type: 'highlight_added', data: highlight });
        }
    } catch (e) {
        console.log('Portal sync failed');
    }
}

// Keyboard shortcut
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'h') {
        e.preventDefault();
        if (selectedText) {
            highlightSelectedText();
        }
    }
});