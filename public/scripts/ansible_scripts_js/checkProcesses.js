// check_processes.js
export async function checkProcesses(addMessageCallback) {
    const apiUrl = '/run-playbook';
    const playbookPath = 'check_processes.yml';
    const inventoryPath = 'inventory';

    try {
        addMessageCallback('🔍 Checking running processes...', 'bot');
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ playbookPath, inventoryPath })
        });

        const data = await response.json();

        if (response.ok) {
            addMessageCallback('✅ Process Check Complete:\n\n' + data.output, 'bot');
        } else {
            addMessageCallback('❌ Error: ' + (data.error || 'Unknown error occurred'), 'bot');
        }
    } catch (error) {
        addMessageCallback('❌ Failed to execute playbook: ' + error.message, 'bot');
    }
}
