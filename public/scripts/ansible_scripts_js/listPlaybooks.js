let isCancelled = false;

function listAvailablePlaybooks(addMessage) {
    if (isCancelled) {
        addMessage("Operation cancelled.", 'bot');
        isCancelled = false;
        return;
    }

    // Fetch the list of available Ansible playbooks from the backend
    fetch('/list-playbooks', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.error) {
            addMessage(`Error: ${data.error}`, 'bot');
        } else {
            // Format the playbook list for display
            let playbookList = `${data.message}\n\n`;
            
            if (data.playbooks && data.playbooks.length > 0) {
                data.playbooks.forEach((playbook, index) => {
                    playbookList += `${index + 1}. ${playbook}\n`;
                });
                
                playbookList += `\nYou can run any of these playbooks by asking me to execute them. For example:`;
                playbookList += `\n- "Run ${data.playbooks[0]} playbook"`;
                if (data.playbooks.length > 1) {
                    playbookList += `\n- "Execute ${data.playbooks[1]} playbook"`;
                }
            } else {
                playbookList += "No playbooks found in the ansible directory.";
            }
            
            addMessage(playbookList, 'bot');
        }
    })
    .catch(error => {
        console.error(`Error listing playbooks: ${error}`);
        addMessage(`Error: ${error.message}`, 'bot');
    });
}

function cancelListPlaybooks() {
    isCancelled = true;
}

export { listAvailablePlaybooks, cancelListPlaybooks };