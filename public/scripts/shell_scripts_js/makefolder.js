let isCancelled = false;

function executemakefolderscript(addMessage) {
    if (isCancelled) {
        addMessage("Operation cancelled.", 'bot');
        isCancelled = false;
        return;
    }
    // Removed duplicate message - predefined answer already shows "Executing makefolder.sh script..."
    fetch('/run-shellscript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scriptPath: 'makefolder.sh' })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.error) {
            addMessage(`Error executing script: ${data.error}`, 'bot');
        } else {
            addMessage(`Script executed successfully: ${data.output}`, 'bot');
        }
    })
    .catch(error => {
        console.error('Error executing script:', error);
        addMessage(`Error: ${error.message}`, 'bot');
    });
}
export { executemakefolderscript };
