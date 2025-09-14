// Simple background script
chrome.runtime.onInstalled.addListener(() => {
    try {
        chrome.contextMenus.create({
            id: 'highlight-text',
            title: 'Highlight selected text',
            contexts: ['selection']
        });

        chrome.contextMenus.create({
            id: 'add-note',
            title: 'Add note to selection',
            contexts: ['selection']
        });

        chrome.contextMenus.create({
            id: 'speak-text',
            title: 'Speak selected text',
            contexts: ['selection']
        });
    } catch (e) {
        console.log('Context menu creation failed:', e);
    }
});

if (chrome.contextMenus && chrome.contextMenus.onClicked) {
    chrome.contextMenus.onClicked.addListener((info, tab) => {
        chrome.tabs.sendMessage(tab.id, {
            action: info.menuItemId,
            text: info.selectionText
        }).catch(() => {});
    });
}