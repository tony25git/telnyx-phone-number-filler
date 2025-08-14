class TelnyxBackground {
    constructor() {
        this.formattedNumber = '';
        this.setupMessageHandlers();
        this.setupInstallHandler();
    }

    setupMessageHandlers() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            switch (request.action) {
                case 'getFormattedNumber':
                    this.handleGetFormattedNumber(sendResponse);
                    return true;
                
                case 'setFormattedNumber':
                    this.handleSetFormattedNumber(request.formattedNumber);
                    sendResponse({ success: true });
                    break;
                
                case 'pasteToActiveTab':
                    this.handlePasteToActiveTab(request.formattedNumber);
                    sendResponse({ success: true });
                    return true;
                
                default:
                    sendResponse({ error: 'Unknown action' });
            }
        });
    }

    setupInstallHandler() {
        chrome.runtime.onInstalled.addListener((details) => {
            if (details.reason === 'install') {
                console.log('Telnyx Phone Number Filler 6.6 installed');
                this.setDefaultSettings();
            } else if (details.reason === 'update') {
                console.log('Telnyx Phone Number Filler 6.6 updated');
            }
        });
    }

    setDefaultSettings() {
        chrome.storage.local.set({
            carrier: 'verizon-ny',
            version: '6.6',
            installDate: new Date().toISOString()
        });
    }

    async handleGetFormattedNumber(sendResponse) {
        try {
            const result = await chrome.storage.local.get(['formattedNumber']);
            sendResponse({
                formattedNumber: result.formattedNumber || null
            });
        } catch (error) {
            console.error('Error getting formatted number:', error);
            sendResponse({ error: 'Failed to get formatted number' });
        }
    }

    handleSetFormattedNumber(formattedNumber) {
        this.formattedNumber = formattedNumber;
        chrome.storage.local.set({ formattedNumber });
    }

    async handlePasteToActiveTab(formattedNumber) {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (tab) {
                await chrome.tabs.sendMessage(tab.id, {
                    action: 'pasteNumber',
                    formattedNumber: formattedNumber
                });
            }
        } catch (error) {
            console.error('Error pasting to active tab:', error);
        }
    }

    async getCurrentTab() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            return tab;
        } catch (error) {
            console.error('Error getting current tab:', error);
            return null;
        }
    }

    async injectContentScript(tabId) {
        try {
            await chrome.scripting.executeScript({
                target: { tabId },
                files: ['content.js']
            });
        } catch (error) {
            console.error('Error injecting content script:', error);
        }
    }
}

chrome.action.onClicked.addListener(async (tab) => {
    chrome.action.openPopup();
});

chrome.commands.onCommand.addListener(async (command) => {
    if (command === 'paste-formatted-number') {
        try {
            const result = await chrome.storage.local.get(['formattedNumber']);
            if (result.formattedNumber) {
                const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
                if (tab) {
                    await chrome.tabs.sendMessage(tab.id, {
                        action: 'pasteNumber',
                        formattedNumber: result.formattedNumber
                    });
                }
            }
        } catch (error) {
            console.error('Error handling keyboard shortcut:', error);
        }
    }
});

const telnyxBackground = new TelnyxBackground();