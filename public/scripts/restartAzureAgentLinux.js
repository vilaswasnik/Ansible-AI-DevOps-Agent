let isCancelled = false;

function executeRestartAzureAgentLinux(addMessage) {
    if (isCancelled) {
        addMessage("Operation cancelled.", 'bot');
        isCancelled = false;
        return;
    }
    addMessage("Executing Ansible playbook to restart Azure Agent on Linux", 'bot');
    // Simulate Ansible API call
    setTimeout(() => {
        if (isCancelled) {
            addMessage("Operation cancelled.", 'bot');
            isCancelled = false;
            return;
        }
        const success = Math.random() > 0.5; // Simulate success or failure
        if (success) {
            addMessage("Azure Agent on Linux restarted successfully.", 'bot');
        } else {
            addMessage("Failed to restart Azure Agent on Linux.", 'bot');
        }
    }, 2000);
}

export { executeRestartAzureAgentLinux };