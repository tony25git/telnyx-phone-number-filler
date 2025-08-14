// Telnyx Phone Number Filler v1 - Multi-Carrier Support
console.log('Telnyx Phone Number Filler v1 - Popup loaded');

document.addEventListener('DOMContentLoaded', function() {
    const elements = {
        numbers: document.getElementById('numbers'),
        pasteBtn: document.getElementById('pasteBtn'),
        status: document.getElementById('status'),
        carrierSelect: document.getElementById('carrierSelect'),
        clearBtn: document.getElementById('clearBtn')
    };
    
    let currentCarrier = 'att';

    // Auto-update button state when text changes
    elements.numbers.addEventListener('input', updateButtonState);
    elements.pasteBtn.addEventListener('click', pasteToPage);
    elements.carrierSelect.addEventListener('change', handleCarrierChange);
    elements.clearBtn.addEventListener('click', clearAll);
    
    function handleCarrierChange(event) {
        currentCarrier = event.target.value;
        console.log('Carrier changed to:', currentCarrier);
    }

    function updateButtonState() {
        const phoneNumbers = parsePhoneNumbers(elements.numbers.value);
        elements.pasteBtn.disabled = phoneNumbers.length === 0;
    }

    function parsePhoneNumbers(input) {
        if (!input.trim()) return [];
        
        const lines = input.split('\n');
        const phoneNumbers = [];
        
        lines.forEach(line => {
            const cleaned = line.trim().replace(/\D/g, '');
            if (cleaned.length === 10) {
                phoneNumbers.push(cleaned);
            }
        });
        
        return phoneNumbers;
    }

    function detectConsecutiveRanges(phoneNumbers) {
        if (phoneNumbers.length < 2) {
            return phoneNumbers.map(num => ({
                areaCode: num.slice(0, 3),
                exchange: num.slice(3, 6),
                subscriber: num.slice(6, 10),
                isRange: false,
                rangeEnd: null
            }));
        }

        const entries = [];
        let i = 0;
        
        while (i < phoneNumbers.length) {
            const current = phoneNumbers[i];
            const currentNum = parseInt(current);
            
            // Look for consecutive sequence
            let rangeEnd = i;
            while (rangeEnd + 1 < phoneNumbers.length) {
                const next = phoneNumbers[rangeEnd + 1];
                const nextNum = parseInt(next);
                if (nextNum === currentNum + (rangeEnd - i) + 1) {
                    rangeEnd++;
                } else {
                    break;
                }
            }
            
            if (rangeEnd > i) {
                // Found a range
                const lastNumber = phoneNumbers[rangeEnd];
                entries.push({
                    areaCode: current.slice(0, 3),
                    exchange: current.slice(3, 6),
                    subscriber: current.slice(6, 10),
                    isRange: true,
                    rangeEnd: lastNumber.slice(6, 10)
                });
                i = rangeEnd + 1;
            } else {
                // Single number
                entries.push({
                    areaCode: current.slice(0, 3),
                    exchange: current.slice(3, 6),
                    subscriber: current.slice(6, 10),
                    isRange: false,
                    rangeEnd: null
                });
                i++;
            }
        }
        
        return entries;
    }

    async function pasteToPage() {
        const phoneNumbers = parsePhoneNumbers(elements.numbers.value);
        
        if (phoneNumbers.length === 0) {
            showStatus('Please enter valid phone numbers', 'error');
            return;
        }

        const phoneData = detectConsecutiveRanges(phoneNumbers);
        
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (!tab) {
                showStatus('No active tab found', 'error');
                return;
            }

            // Test if content script is already loaded
            let contentScriptLoaded = false;
            try {
                const pingResponse = await chrome.tabs.sendMessage(tab.id, { action: 'ping' });
                if (pingResponse && pingResponse.success) {
                    contentScriptLoaded = true;
                    console.log('Content script is already loaded');
                }
            } catch (pingError) {
                console.log('Content script not loaded, will inject it');
            }

            // Inject content script if not already loaded
            if (!contentScriptLoaded) {
                try {
                    await chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        files: ['content.js']
                    });
                    console.log('Content script injected successfully');
                    
                    // Give it a moment to initialize
                    await new Promise(resolve => setTimeout(resolve, 100));
                } catch (injectError) {
                    console.error('Failed to inject content script:', injectError);
                    showStatus('Failed to load extension on this page. Try refreshing and try again.', 'error');
                    return;
                }
            }

            // Send the paste message
            const response = await chrome.tabs.sendMessage(tab.id, {
                action: 'paste',
                phoneData: phoneData,
                carrier: currentCarrier
            });

            if (response && response.success) {
                showStatus(`Successfully pasted ${phoneData.length} phone number entries!`, 'success');
                setTimeout(() => window.close(), 1500);
            } else {
                showStatus('Failed to paste: ' + (response?.error || 'Unknown error'), 'error');
            }

        } catch (error) {
            console.error('Paste error:', error);
            if (error.message.includes('Could not establish connection')) {
                showStatus('Please refresh the page and try again', 'error');
            } else if (error.message.includes('Cannot access')) {
                showStatus('Cannot access this page. Try a different page or refresh.', 'error');
            } else {
                showStatus('Error: ' + error.message, 'error');
            }
        }
    }

    function showStatus(message, type) {
        elements.status.textContent = message;
        elements.status.className = `status ${type}`;
        elements.status.style.display = 'block';
        
        setTimeout(() => {
            elements.status.style.display = 'none';
        }, 3000);
    }

    function clearAll() {
        console.log('Clearing all numbers');
        elements.numbers.value = '';
        elements.pasteBtn.disabled = true;
        elements.status.style.display = 'none';
        console.log('Numbers cleared successfully');
    }
    
    // Initial button state
    updateButtonState();
});