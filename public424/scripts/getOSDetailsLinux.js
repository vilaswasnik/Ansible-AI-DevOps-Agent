let isCancelled = false;

function executeGetOSDetailsLinux(addMessage) {
    if (isCancelled) {
        addMessage("Operation cancelled.", 'bot');
        isCancelled = false;
        return;
    }
    addMessage("Executing Ansible playbook to get OS details for Linux", 'bot');
    // Simulate Ansible API call
    setTimeout(() => {
        if (isCancelled) {
            addMessage("Operation cancelled.", 'bot');
            isCancelled = false;
            return;
        }
        const success = Math.random() > 50; // Simulate success or failure
        if (success) {
            addMessage("OS details retrieved successfully.", 'bot');
        } else {
            addMessage("Failed to retrieve OS details.", 'bot');
        }
    }, 2000);
}

export { executeGetOSDetailsLinux };