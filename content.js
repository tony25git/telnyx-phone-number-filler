// Telnyx Phone Number Filler v1 - Multi-Carrier Support
console.log('Telnyx Phone Number Filler v1 - Content script loaded');

let lastFocusedElement = null;

// Track focused elements
document.addEventListener('focusin', function(event) {
    if (isValidPasteTarget(event.target)) {
        lastFocusedElement = event.target;
    }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Content script received message:', request);
    
    if (request.action === 'paste') {
        try {
            const result = pastePhoneNumbers(request.phoneData, request.carrier || 'level3');
            console.log('Paste operation completed successfully');
            sendResponse({ success: true, result: result });
        } catch (error) {
            console.error('Paste operation failed:', error);
            sendResponse({ success: false, error: error.message });
        }
    } else if (request.action === 'ping') {
        // Simple ping to test if content script is loaded
        console.log('Content script responding to ping');
        sendResponse({ success: true, message: 'Content script is loaded' });
    }
    
    // Return true to indicate we will send a response asynchronously
    return true;
});

function isValidPasteTarget(element) {
    if (!element) return false;
    const tagName = element.tagName.toLowerCase();
    const type = element.type ? element.type.toLowerCase() : '';
    return tagName === 'input' && ['text', 'tel', 'number'].includes(type);
}

function getTargetField(carrier = 'level3') {
    console.log('getTargetField called with carrier:', carrier);
    
    // Check carrier-specific sites (alphabetical order)
    if (carrier === 'att' && (window.location.hostname.includes('corp.att.com') || 
        window.location.href.includes('local-service-request'))) {
        
        const allFields = document.querySelectorAll('input[type="text"], input[type="tel"], input[type="number"]');
        console.log(`AT&T site detected: Found ${allFields.length} input fields`);
        
        // AT&T specific field targeting logic - target field 42 (moved 3 back from original)
        const targetPositions = [42, 43, 41, 44, 40, 45, 39];
        
        for (let position of targetPositions) {
            if (allFields.length >= position) {
                const field = allFields[position - 1];
                if (field && field.offsetParent !== null && !field.disabled && !field.readOnly) {
                    console.log(`AT&T: Selected field ${position} as target`);
                    console.log('AT&T Field details:', {
                        id: field.id || 'no-id',
                        name: field.name || 'no-name',
                        placeholder: field.placeholder || 'no-placeholder'
                    });
                    return field;
                }
            }
        }
        
        console.log('AT&T: No suitable field found in preferred positions');
        
    } else if (carrier === 'comcast' && (window.location.hostname.includes('tradingpartners.comcast.com') || 
        window.location.href.includes('PortOut/CreateLSR'))) {
        
        // First, try to find mat-input-26 directly by ID (regardless of type)
        const targetField = document.getElementById('mat-input-26');
        
        if (targetField) {
            console.log(`Comcast: Found target field mat-input-26 directly by ID`);
            console.log('Comcast Target Field details:', {
                id: targetField.id || 'no-id',
                name: targetField.name || 'no-name',
                placeholder: targetField.placeholder || 'no-placeholder',
                type: targetField.type,
                tagName: targetField.tagName,
                visible: targetField.offsetParent !== null,
                disabled: targetField.disabled,
                readOnly: targetField.readOnly
            });
            
            if (targetField.offsetParent !== null && !targetField.disabled && !targetField.readOnly) {
                console.log(`Comcast: Selected mat-input-26 as target field`);
                return targetField;
            } else {
                console.log(`Comcast: mat-input-26 found but not fillable (hidden/disabled/readonly)`);
            }
        } else {
            console.log(`Comcast: mat-input-26 not found by ID, searching in all input fields`);
        }
        
        // Fallback: search through ALL input fields on the page (including hidden ones)
        const allInputs = document.querySelectorAll('input');
        console.log(`Comcast site detected: Found ${allInputs.length} total input fields`);
        
        // Debug: Log ALL input fields with their details
        console.log('Comcast: ALL input fields on page:');
        Array.from(allInputs).forEach((field, index) => {
            console.log(`Input ${index + 1}:`, {
                id: field.id || 'no-id',
                name: field.name || 'no-name',
                placeholder: field.placeholder || 'no-placeholder',
                type: field.type,
                visible: field.offsetParent !== null,
                disabled: field.disabled,
                readOnly: field.readOnly,
                value: field.value || 'empty'
            });
        });
        
        // Search for mat-input-26 in ALL inputs
        for (let i = 0; i < allInputs.length; i++) {
            const field = allInputs[i];
            if (field.id === 'mat-input-26') {
                console.log(`Comcast: Found mat-input-26 in ALL inputs search at position ${i + 1}`);
                console.log('Comcast mat-input-26 details:', {
                    id: field.id,
                    type: field.type,
                    visible: field.offsetParent !== null,
                    disabled: field.disabled,
                    readOnly: field.readOnly,
                    style: field.style.cssText
                });
                
                // Return it even if not currently visible (might become visible later)
                return field;
            }
        }
        
        // Since mat-input-26 not found, try mat-input-23 (last visible field)
        for (let i = 0; i < allInputs.length; i++) {
            const field = allInputs[i];
            if (field.id === 'mat-input-23') {
                console.log(`Comcast: mat-input-26 not found, using mat-input-23 as target`);
                console.log('Comcast mat-input-23 details:', {
                    id: field.id,
                    type: field.type,
                    visible: field.offsetParent !== null,
                    disabled: field.disabled,
                    readOnly: field.readOnly
                });
                
                if (field.offsetParent !== null && !field.disabled && !field.readOnly) {
                    return field;
                }
            }
        }
        
        // Now search through fillable fields only
        const allFields = document.querySelectorAll('input[type="text"], input[type="tel"], input[type="number"]');
        console.log(`Comcast: Found ${allFields.length} fillable input fields`);
        
        // Search for mat-input-26 in the field list
        for (let i = 0; i < allFields.length; i++) {
            const field = allFields[i];
            if (field.id === 'mat-input-26') {
                if (field && field.offsetParent !== null && !field.disabled && !field.readOnly) {
                    console.log(`Comcast: Found and selected target field mat-input-26 at position ${i + 1}`);
                    return field;
                } else {
                    console.log(`Comcast: Found mat-input-26 but field is not fillable`);
                }
            }
        }
        
        console.log(`Comcast: Target field mat-input-26 not found in any search method`);
        
        // Fallback to any fillable field if field 11+ not available
        for (let i = 0; i < allFields.length; i++) {
            const field = allFields[i];
            if (field && field.offsetParent !== null && !field.disabled && !field.readOnly) {
                console.log(`Comcast: Selected field ${i + 1} as fallback target`);
                console.log('Comcast Selected Field details:', {
                    id: field.id || 'no-id',
                    name: field.name || 'no-name',
                    placeholder: field.placeholder || 'no-placeholder',
                    type: field.type
                });
                return field;
            }
        }
        
        console.log('Comcast: No fillable fields found on page');
        
    } else if (carrier === 'level3' && (window.location.hostname.includes('portout.level3.com') || 
        window.location.href.includes('LsrSubmit.aspx'))) {
        
        const allFields = document.querySelectorAll('input[type="text"], input[type="tel"], input[type="number"]');
        console.log(`Level3 site detected: Found ${allFields.length} input fields`);
        
        // Try different field positions to find the right one (moved forward 1 field)
        const targetPositions = [26, 27, 25, 28, 24, 29, 23];
        
        for (let position of targetPositions) {
            if (allFields.length >= position) {
                const field = allFields[position - 1];
                if (field && field.offsetParent !== null && !field.disabled && !field.readOnly) {
                    console.log(`Level3: Selected field ${position} as target`);
                    console.log('Level3 Field details:', {
                        id: field.id || 'no-id',
                        name: field.name || 'no-name',
                        placeholder: field.placeholder || 'no-placeholder'
                    });
                    return field;
                }
            }
        }
        
        console.log('Level3: No suitable field found in preferred positions');
        
    } else if (carrier === 'verizon' && (window.location.hostname.includes('portout.verizonbusiness.com') || 
        window.location.href.includes('lsr_request.asp'))) {
        
        const allFields = document.querySelectorAll('input[type="text"], input[type="tel"], input[type="number"]');
        console.log(`Verizon site detected: Found ${allFields.length} input fields`);
        
        // Verizon specific field targeting logic - final position (now at 31)  
        const targetPositions = [31, 32, 30, 33, 29, 34, 28];
        
        for (let position of targetPositions) {
            if (allFields.length >= position) {
                const field = allFields[position - 1];
                if (field && field.offsetParent !== null && !field.disabled && !field.readOnly) {
                    console.log(`Verizon: Selected field ${position} as target`);
                    console.log('Verizon Field details:', {
                        id: field.id || 'no-id',
                        name: field.name || 'no-name',
                        placeholder: field.placeholder || 'no-placeholder'
                    });
                    return field;
                }
            }
        }
        
        console.log('Verizon: No suitable field found in preferred positions');
        
    } else if (carrier === 'verizon-east') {
        
        const allFields = document.querySelectorAll('input[type="text"], input[type="tel"], input[type="number"]');
        console.log(`Verizon East site detected: Found ${allFields.length} input fields`);
        
        // Verizon East specific field targeting logic - target field 1 (first field)
        const targetPositions = [1, 2, 3, 4, 5];
        
        for (let position of targetPositions) {
            if (allFields.length >= position) {
                const field = allFields[position - 1];
                if (field && field.offsetParent !== null && !field.disabled && !field.readOnly) {
                    console.log(`Verizon East: Selected field ${position} as target`);
                    console.log('Verizon East Field details:', {
                        id: field.id || 'no-id',
                        name: field.name || 'no-name',
                        placeholder: field.placeholder || 'no-placeholder'
                    });
                    return field;
                }
            }
        }
        
        console.log('Verizon East: No suitable field found in preferred positions');
        
    }
    
    // General fallback logging for debugging
    console.log('No carrier-specific target found. Falling back to focused element.');
    if (document.querySelectorAll('input[type="text"], input[type="tel"], input[type="number"]').length > 0) {
        const allFields = document.querySelectorAll('input[type="text"], input[type="tel"], input[type="number"]');
        console.log('All fields on page:', Array.from(allFields).map((f, i) => ({
            index: i + 1,
            id: f.id || 'no-id',
            name: f.name || 'no-name',
            type: f.type,
            visible: f.offsetParent !== null,
            disabled: f.disabled,
            readOnly: f.readOnly
        })));
    }
    
    // Fallback to focused element
    return lastFocusedElement || document.activeElement;
}

function pastePhoneNumbers(phoneData, carrier = 'level3') {
    const startField = getTargetField(carrier);
    
    if (!startField) {
        throw new Error('No target field found');
    }
    
    console.log('Starting paste from field:', startField, 'for carrier:', carrier);
    console.log('DEBUGGING: Carrier value received:', JSON.stringify(carrier));
    console.log('DEBUGGING: Carrier type:', typeof carrier);
    
    if (carrier === 'att') {
        console.log('DEBUGGING: Using AT&T format');
        pasteATTFormat(phoneData, startField);
    } else if (carrier === 'comcast') {
        console.log('DEBUGGING: Using Comcast format');
        pasteComcastFormat(phoneData, startField);
    } else if (carrier === 'level3') {
        console.log('DEBUGGING: Using Level3 format');
        pasteLevel3Format(phoneData, startField);
    } else if (carrier === 'verizon') {
        console.log('DEBUGGING: Using Verizon format');
        pasteVerizonFormat(phoneData, startField);
    } else {
        console.log('DEBUGGING: Using default/standard format for carrier:', carrier);
        pasteStandardFormat(phoneData, startField);
    }
}

function pasteATTFormat(phoneData, startField) {
    // First, count total rows needed and add the required port/range sets
    const totalRows = phoneData.length; // Each entry (individual or range) = 1 row
    console.log(`AT&T: Need ${totalRows} total rows for ${phoneData.length} entries`);
    
    // Click "Add another port/range" button (totalRows - 1) times
    // (subtract 1 because the first row usually exists by default)
    const addButtonClicks = Math.max(0, totalRows - 1);
    if (addButtonClicks > 0) {
        clickAddPortRangeButton(addButtonClicks);
        
        // Wait a moment for the DOM to update after clicking buttons
        setTimeout(() => {
            proceedWithATTPasting(phoneData, startField);
        }, 500);
    } else {
        proceedWithATTPasting(phoneData, startField);
    }
}

function clickAddPortRangeButton(clickCount) {
    console.log(`AT&T: Clicking 'Add another port/range' button ${clickCount} times`);
    
    // Common button selectors for "Add another port/range" button
    const buttonSelectors = [
        'button[title*="Add another port"]',
        'button[title*="Add another range"]',
        'button:contains("Add another port")',
        'button:contains("Add another range")',
        'input[value*="Add another port"]',
        'input[value*="Add another range"]',
        'a[title*="Add another port"]',
        'a[title*="Add another range"]',
        'button[aria-label*="Add another port"]',
        'button[aria-label*="Add another range"]'
    ];
    
    let button = null;
    
    // Try to find the button using different selectors
    for (const selector of buttonSelectors) {
        try {
            button = document.querySelector(selector);
            if (button && button.offsetParent !== null && !button.disabled) {
                console.log(`AT&T: Found button using selector: ${selector}`);
                break;
            }
        } catch (e) {
            // Ignore selector errors and try next one
        }
    }
    
    // Fallback: search for button by text content
    if (!button) {
        const allButtons = document.querySelectorAll('button, input[type="button"], input[type="submit"], a');
        for (const btn of allButtons) {
            const text = btn.textContent || btn.value || btn.title || btn.getAttribute('aria-label') || '';
            if (text.toLowerCase().includes('add another port') || 
                text.toLowerCase().includes('add another range') ||
                text.toLowerCase().includes('add port') ||
                text.toLowerCase().includes('add range')) {
                button = btn;
                console.log(`AT&T: Found button by text content: "${text}"`);
                break;
            }
        }
    }
    
    if (button) {
        // Click the button the required number of times
        for (let i = 0; i < clickCount; i++) {
            console.log(`AT&T: Clicking button (${i + 1}/${clickCount})`);
            button.click();
            
            // Small delay between clicks
            if (i < clickCount - 1) {
                setTimeout(() => {}, 100);
            }
        }
        console.log(`AT&T: Successfully clicked button ${clickCount} times`);
    } else {
        console.warn('AT&T: Could not find "Add another port/range" button');
        console.log('AT&T: Available buttons on page:', 
            Array.from(document.querySelectorAll('button, input[type="button"], input[type="submit"]'))
                .map(b => b.textContent || b.value || b.title).filter(t => t));
    }
}

function proceedWithATTPasting(phoneData, startField) {
    const allFields = document.querySelectorAll('input[type="text"], input[type="tel"], input[type="number"]');
    let currentFieldIndex = Array.from(allFields).indexOf(startField);
    
    if (currentFieldIndex === -1) {
        throw new Error('Start field not found in field list');
    }
    
    phoneData.forEach((entry, entryIndex) => {
        if (entryIndex > 0) {
            // Move to next row for AT&T (2 fields per row)
            currentFieldIndex += 2;
        }
        
        if (currentFieldIndex >= allFields.length) {
            console.log('AT&T: Reached end of available fields');
            return;
        }
        
        // Reconstruct full 10-digit number
        const fullNumber = entry.areaCode + entry.exchange + entry.subscriber;
        
        if (entry.isRange && entry.rangeEnd) {
            // Range: paste full first number, then last 4 digits of range end
            console.log(`AT&T Range: ${fullNumber} to ${entry.areaCode}${entry.exchange}${entry.rangeEnd}`);
            
            // Paste first number (10 digits)
            fillField(allFields[currentFieldIndex], fullNumber);
            
            // Move to next field and paste last 4 digits of range end
            if (currentFieldIndex + 1 < allFields.length) {
                fillField(allFields[currentFieldIndex + 1], entry.rangeEnd);
            }
        } else {
            // Individual number: paste full 10 digits, skip next field
            console.log(`AT&T Individual: ${fullNumber}`);
            fillField(allFields[currentFieldIndex], fullNumber);
            // Next field stays empty for individual numbers
        }
    });
}

function pasteVerizonFormat(phoneData, startField) {
    const allFields = document.querySelectorAll('input[type="text"], input[type="tel"], input[type="number"]');
    let currentFieldIndex = Array.from(allFields).indexOf(startField);
    
    if (currentFieldIndex === -1) {
        throw new Error('Start field not found in field list');
    }
    
    phoneData.forEach((entry, entryIndex) => {
        if (currentFieldIndex >= allFields.length) {
            console.log('Verizon: Reached end of available fields');
            return;
        }
        
        // Reconstruct full 10-digit number
        const fullNumber = entry.areaCode + entry.exchange + entry.subscriber;
        
        if (entry.isRange && entry.rangeEnd) {
            // Range: paste first number, TAB 1 time, paste last number, TAB 2 times
            const lastFullNumber = entry.areaCode + entry.exchange + entry.rangeEnd;
            console.log(`Verizon Range: ${fullNumber} to ${lastFullNumber}`);
            
            // Paste first number (10 digits)
            fillField(allFields[currentFieldIndex], fullNumber);
            
            // TAB 1 time: move to next field and paste last number (10 digits)
            if (currentFieldIndex + 1 < allFields.length) {
                fillField(allFields[currentFieldIndex + 1], lastFullNumber);
            }
            
            // TAB 2 times: move 2 more fields ahead for next entry
            currentFieldIndex += 3; // 1 for field we used + 2 for TAB twice
        } else {
            // Individual: paste number, TAB 3 times
            console.log(`Verizon Individual: ${fullNumber}`);
            fillField(allFields[currentFieldIndex], fullNumber);
            
            // TAB 3 times: move 3 fields ahead for next entry
            currentFieldIndex += 3;
        }
    });
}

function pasteComcastFormat(phoneData, startField) {
    console.log('Comcast pasteFormat: Starting with target field');
    console.log('Start field details:', {
        id: startField.id || 'no-id',
        name: startField.name || 'no-name',
        placeholder: startField.placeholder || 'no-placeholder',
        type: startField.type
    });
    
    // Count total rows needed (both individual numbers and ranges count as 1 row each)
    const totalRows = phoneData.length;
    console.log(`Comcast: Need ${totalRows} total rows for ${phoneData.length} entries`);
    
    // Click the "+" button to add the necessary rows
    if (totalRows > 1) {
        // Click (totalRows - 1) times since first row usually exists
        const clicksNeeded = totalRows - 1;
        clickAddRowButton(clicksNeeded);
        
        // Wait a moment for the DOM to update after clicking buttons
        setTimeout(() => {
            proceedWithComcastPasting(phoneData, startField);
        }, 500);
    } else {
        proceedWithComcastPasting(phoneData, startField);
    }
}

function clickAddRowButton(clickCount) {
    console.log(`Comcast: Clicking '+' button ${clickCount} times to add rows`);
    
    // Common button selectors for "+" or "Add" button
    const buttonSelectors = [
        'button:contains("+")',
        'button[title*="add"]',
        'button[title*="Add"]',
        'button[aria-label*="add"]',
        'button[aria-label*="Add"]',
        'button.add-button',
        'button.add-row',
        'mat-icon:contains("add")',
        'mat-icon:contains("+")',
        'button mat-icon:contains("add")',
        'button mat-icon:contains("+")'
    ];
    
    let button = null;
    
    // Try to find the button using different selectors
    for (const selector of buttonSelectors) {
        try {
            if (selector.includes(':contains')) {
                // Handle :contains pseudo-selector manually
                const baseSelector = selector.split(':contains')[0];
                const searchText = selector.match(/:contains\("([^"]+)"\)/)[1];
                const candidates = document.querySelectorAll(baseSelector);
                
                for (const candidate of candidates) {
                    if (candidate.textContent.includes(searchText) || 
                        candidate.innerHTML.includes(searchText)) {
                        button = candidate;
                        console.log(`Comcast: Found button using text search: "${searchText}"`);
                        break;
                    }
                }
            } else {
                button = document.querySelector(selector);
            }
            
            if (button && button.offsetParent !== null && !button.disabled) {
                console.log(`Comcast: Found button using selector: ${selector}`);
                break;
            }
        } catch (e) {
            // Ignore selector errors and try next one
        }
    }
    
    // Fallback: search for button by text content or icon
    if (!button) {
        const allButtons = document.querySelectorAll('button, mat-icon, [role="button"]');
        for (const btn of allButtons) {
            const text = btn.textContent || btn.innerHTML || btn.title || btn.getAttribute('aria-label') || '';
            if (text.includes('+') || 
                text.toLowerCase().includes('add') ||
                btn.querySelector('mat-icon[fonticon*="add"]') ||
                btn.querySelector('mat-icon:contains("add")')) {
                button = btn;
                console.log(`Comcast: Found button by content: "${text.substring(0, 50)}"`);
                break;
            }
        }
    }
    
    if (button) {
        // Click the button the required number of times
        for (let i = 0; i < clickCount; i++) {
            console.log(`Comcast: Clicking + button (${i + 1}/${clickCount})`);
            button.click();
            
            // Small delay between clicks
            if (i < clickCount - 1) {
                setTimeout(() => {}, 100);
            }
        }
        console.log(`Comcast: Successfully clicked + button ${clickCount} times`);
    } else {
        console.warn('Comcast: Could not find "+" button');
        console.log('Comcast: Available buttons on page:', 
            Array.from(document.querySelectorAll('button, [role="button"]'))
                .map(b => ({
                    text: (b.textContent || b.innerHTML || '').substring(0, 30),
                    title: b.title,
                    ariaLabel: b.getAttribute('aria-label')
                })).filter(b => b.text || b.title || b.ariaLabel));
    }
}

function proceedWithComcastPasting(phoneData, startField) {
    // Use the startField directly instead of searching through limited field types
    let currentField = startField;
    
    phoneData.forEach((entry, entryIndex) => {
        if (!currentField) {
            console.log('Comcast: No current field available');
            return;
        }
        
        // Reconstruct full 10-digit number
        const fullNumber = entry.areaCode + entry.exchange + entry.subscriber;
        
        if (entry.isRange && entry.rangeEnd) {
            // Range: paste first number + "-" + last 4 digits of range end
            // Example: 9876543210-3212
            const rangeFormat = fullNumber + "-" + entry.rangeEnd;
            console.log(`Comcast Range: ${fullNumber} to ${entry.areaCode}${entry.exchange}${entry.rangeEnd} formatted as: ${rangeFormat}`);
            
            fillField(currentField, rangeFormat);
            
            // TAB once to move to next field for next entry
            simulateTab(currentField);
            
            // Find next available field for subsequent entries
            currentField = getNextFillableField(currentField);
        } else {
            // Individual: paste full 10 digits, then TAB once
            console.log(`Comcast Individual: ${fullNumber}`);
            fillField(currentField, fullNumber);
            
            // TAB once to move to next field for next entry
            simulateTab(currentField);
            
            // Find next available field for subsequent entries
            currentField = getNextFillableField(currentField);
        }
    });
}

function simulateTab(field) {
    // Simulate TAB key press to move to next field
    const tabEvent = new KeyboardEvent('keydown', {
        key: 'Tab',
        code: 'Tab',
        keyCode: 9,
        which: 9,
        bubbles: true
    });
    field.dispatchEvent(tabEvent);
    console.log('Comcast: Simulated TAB key press');
}

function getNextFillableField(currentField) {
    // Get all input fields on the page
    const allInputs = document.querySelectorAll('input');
    const currentIndex = Array.from(allInputs).indexOf(currentField);
    
    if (currentIndex !== -1) {
        // Look for the next fillable field after the current one
        for (let i = currentIndex + 1; i < allInputs.length; i++) {
            const field = allInputs[i];
            const isTextInput = ['text', 'tel', 'number'].includes(field.type);
            if (field && field.offsetParent !== null && !field.disabled && !field.readOnly && isTextInput) {
                console.log(`Comcast: Found next fillable field: ${field.id || 'no-id'} at position ${i + 1}`);
                return field;
            }
        }
    }
    
    console.log('Comcast: No next fillable field found');
    return null;
}

function findAssociatedInputField(labelElement) {
    // Method 1: Check if label has 'for' attribute pointing to an input
    const forAttribute = labelElement.getAttribute('for');
    if (forAttribute) {
        const associatedField = document.getElementById(forAttribute);
        if (associatedField && ['text', 'tel', 'number'].includes(associatedField.type)) {
            return associatedField;
        }
    }
    
    // Method 2: Look for input field as next sibling or child
    let nextElement = labelElement.nextElementSibling;
    while (nextElement && nextElement.tagName !== 'TR') { // Stop at table row boundary
        if (nextElement.tagName === 'INPUT' && ['text', 'tel', 'number'].includes(nextElement.type)) {
            return nextElement;
        }
        // Also check children of the next element
        const childInput = nextElement.querySelector('input[type="text"], input[type="tel"], input[type="number"]');
        if (childInput) {
            return childInput;
        }
        nextElement = nextElement.nextElementSibling;
    }
    
    // Method 3: Look for input field in same table cell (TD)
    const parentTd = labelElement.closest('td');
    if (parentTd) {
        const tdInput = parentTd.querySelector('input[type="text"], input[type="tel"], input[type="number"]');
        if (tdInput) {
            return tdInput;
        }
        
        // Check next TD in same row
        const nextTd = parentTd.nextElementSibling;
        if (nextTd) {
            const nextTdInput = nextTd.querySelector('input[type="text"], input[type="tel"], input[type="number"]');
            if (nextTdInput) {
                return nextTdInput;
            }
        }
    }
    
    return null;
}









function pasteLevel3Format(phoneData, startField) {
    console.log('Level3: Starting fresh paste operation');
    
    // Get all input fields for navigation
    const allFields = document.querySelectorAll('input[type="text"], input[type="tel"], input[type="number"]');
    let currentFieldIndex = Array.from(allFields).indexOf(startField);
    
    if (currentFieldIndex === -1) {
        throw new Error('Level3: Start field not found in field list');
    }
    
    console.log(`Level3: Starting from field index ${currentFieldIndex + 1} of ${allFields.length} total fields`);
    
    phoneData.forEach((entry, entryIndex) => {
        console.log(`Level3: Processing entry ${entryIndex + 1}`);
        
        // Build full 10-digit number from components
        const fullNumber = entry.areaCode + entry.exchange + entry.subscriber;
        console.log(`Level3: Full number: ${fullNumber}`);
        
        // Parse 10-digit number: 9875643210 becomes 987-564-3210
        const part1 = fullNumber.substring(0, 3);   // First 3 digits: 987
        const part2 = fullNumber.substring(3, 6);   // Next 3 digits: 564  
        const part3 = fullNumber.substring(6, 10);  // Last 4 digits: 3210
        
        console.log(`Level3: Parsed as ${part1}-${part2}-${part3}`);
        
        // Check if we have enough fields
        if (currentFieldIndex >= allFields.length) {
            console.log('Level3: No more fields available');
            return;
        }
        
        if (entry.isRange && entry.rangeEnd) {
            // RANGE LOGIC: 987 TAB 654 TAB 3210 TAB 3212 TAB (next number)
            console.log(`Level3: Range from ${fullNumber} to ${entry.areaCode}${entry.exchange}${entry.rangeEnd}`);
            
            // Field 1: First 3 digits (987)
            if (currentFieldIndex < allFields.length) {
                console.log(`Level3: Filling field ${currentFieldIndex + 1} with: ${part1}`);
                fillField(allFields[currentFieldIndex], part1);
                currentFieldIndex++; // TAB to next field
            }
            
            // Field 2: Next 3 digits (654) 
            if (currentFieldIndex < allFields.length) {
                console.log(`Level3: Filling field ${currentFieldIndex + 1} with: ${part2}`);
                fillField(allFields[currentFieldIndex], part2);
                currentFieldIndex++; // TAB to next field
            }
            
            // Field 3: Last 4 digits of start number (3210)
            if (currentFieldIndex < allFields.length) {
                console.log(`Level3: Filling field ${currentFieldIndex + 1} with: ${part3}`);
                fillField(allFields[currentFieldIndex], part3);
                currentFieldIndex++; // TAB to next field
            }
            
            // Field 4: Last 4 digits of end number (3212)
            if (currentFieldIndex < allFields.length) {
                console.log(`Level3: Filling field ${currentFieldIndex + 1} with range end: ${entry.rangeEnd}`);
                fillField(allFields[currentFieldIndex], entry.rangeEnd);
                currentFieldIndex++; // TAB to next field (ready for next number)
            }
            
        } else {
            // INDIVIDUAL LOGIC: 987 TAB 564 TAB 3210 TAB TAB (next number)  
            console.log(`Level3: Individual number: ${fullNumber}`);
            
            // Field 1: First 3 digits (987)
            if (currentFieldIndex < allFields.length) {
                console.log(`Level3: Filling field ${currentFieldIndex + 1} with: ${part1}`);
                fillField(allFields[currentFieldIndex], part1);
                currentFieldIndex++; // TAB once
            }
            
            // Field 2: Next 3 digits (564)
            if (currentFieldIndex < allFields.length) {
                console.log(`Level3: Filling field ${currentFieldIndex + 1} with: ${part2}`);
                fillField(allFields[currentFieldIndex], part2);
                currentFieldIndex++; // TAB once  
            }
            
            // Field 3: Last 4 digits (3210)
            if (currentFieldIndex < allFields.length) {
                console.log(`Level3: Filling field ${currentFieldIndex + 1} with: ${part3}`);
                fillField(allFields[currentFieldIndex], part3);
                currentFieldIndex++; // TAB once
            }
            
            // TAB twice total = skip one more field for next number
            currentFieldIndex++; // TAB twice (skip empty field)
        }
        
        console.log(`Level3: Entry ${entryIndex + 1} complete. Next starts at field ${currentFieldIndex + 1}`);
    });
    
    console.log('Level3: All entries processed');
}

function pasteStandardFormat(phoneData, startField) {
    // Get all input fields for navigation
    const allFields = document.querySelectorAll('input[type="text"], input[type="tel"], input[type="number"]');
    let currentFieldIndex = Array.from(allFields).indexOf(startField);
    
    if (currentFieldIndex === -1) {
        throw new Error('Start field not found in field list');
    }
    
    // Paste each phone number entry
    phoneData.forEach((entry, entryIndex) => {
        if (entryIndex > 0) {
            // Move to next row (assuming 4 fields per row: NPA, NXX, Start, End)
            currentFieldIndex += 4;
        }
        
        // Paste NPA (area code)
        if (currentFieldIndex < allFields.length) {
            fillField(allFields[currentFieldIndex], entry.areaCode);
        }
        
        // Paste NXX (exchange)
        if (currentFieldIndex + 1 < allFields.length) {
            fillField(allFields[currentFieldIndex + 1], entry.exchange);
        }
        
        // Paste Start (subscriber)
        if (currentFieldIndex + 2 < allFields.length) {
            fillField(allFields[currentFieldIndex + 2], entry.subscriber);
        }
        
        // Paste End (range end or skip if individual number)
        if (currentFieldIndex + 3 < allFields.length) {
            if (entry.isRange && entry.rangeEnd) {
                fillField(allFields[currentFieldIndex + 3], entry.rangeEnd);
            }
            // Skip field if individual number (don't fill End field)
        }
    });
}

function fillField(field, value) {
    if (!field || !value) return;
    
    field.focus();
    field.value = value;
    field.dispatchEvent(new Event('input', { bubbles: true }));
    field.dispatchEvent(new Event('change', { bubbles: true }));
    
    // Visual feedback
    const originalBorder = field.style.border;
    field.style.border = '2px solid #28a745';
    setTimeout(() => {
        field.style.border = originalBorder;
    }, 500);
    
    console.log(`Filled field with value: ${value}`);
}