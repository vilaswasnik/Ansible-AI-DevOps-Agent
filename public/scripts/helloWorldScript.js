let isCancelled = false;

function executeHelloWorldScript(addMessage) {
    if (isCancelled) {
        addMessage("Operation cancelled.", 'bot');
        isCancelled = false;
        return;
    }
    addMessage("Executing Hello World script", 'bot');
    const scriptPath = '/workspaces/AARA-AI-Agent/public/scripts/hello.sh';
    
    fetch('http://localhost:3000/run-script', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ scriptPath })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            addMessage(`Error: ${data.error}`, 'bot');
        } else {
            addMessage(`Script executed successfully: ${data.output}`, 'bot');
        }
    })
    .catch(error => {
        console.error(`Error executing script: ${error}`);
        addMessage(`Error: ${error.message}`, 'bot');
    });
}

export { executeHelloWorldScript };