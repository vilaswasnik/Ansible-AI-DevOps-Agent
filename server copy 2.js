const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');
const path = require('path');
const { askOpenAI } = require('./public/scripts/openai');
const predefinedAnswers = require('./public/trainingData.json').predefinedAnswers;

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Ensure static files are served from 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Serve the aiagent HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'aiagent.html'));
});

// Endpoint to run a shell script present at script folder -need to remove
app.post('/run-script', (req, res) => {
    const { scriptPath } = req.body;
    if (!scriptPath) {
        console.error('Script path is missing in the request.');
        return res.status(400).json({ error: 'Script path is required' });
    }

    // Resolve the full path to the script
    const fullScriptPath = path.join(__dirname, 'public', 'scripts', scriptPath);

    console.log(`Received request to execute script: ${scriptPath}`);
    console.log(`Resolved full script path: ${fullScriptPath}`);

    exec(`sh ${fullScriptPath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing script: ${stderr}`);
            return res.status(500).json({ error: stderr.trim() });
        }
        console.log(`Script executed successfully. Output: ${stdout}`);
        res.json({ output: stdout.trim() });
    });
});


// Endpoint to run a shell script hello2.sh
app.post('/run-shellscript', (req, res) => {
    const { scriptPath } = req.body;

    // Validate scriptPath
    if (!scriptPath) {
        console.error('Script path is missing in the request.');
        return res.status(400).json({ error: 'Script path is required' });
    }
    if (scriptPath.includes('..')) {
        console.error('Invalid script path detected.');
        return res.status(400).json({ error: 'Invalid script path' });
    }
    if (!scriptPath.endsWith('.sh')) {
        console.error('Invalid script type. Only .sh scripts are allowed.');
        return res.status(400).json({ error: 'Invalid script type' });
    }

    // Resolve the full path to the script
    const fullScriptPath = path.join(__dirname, 'public', 'scripts', 'shell_scripts', scriptPath);

    // Check if the script exists
    const fs = require('fs');
    if (!fs.existsSync(fullScriptPath)) {
        console.error(`Script not found: ${fullScriptPath}`);
        return res.status(404).json({ error: 'Script not found' });
    }

    console.log(`Received request to execute script: ${scriptPath}`);
    console.log(`Resolved full script path: ${fullScriptPath}`);

    // Execute the script with a timeout
    exec(`sh ${fullScriptPath}`, { timeout: 5000 }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing script: ${stderr}`);
            return res.status(500).json({ error: stderr.trim() });
        }
        console.log(`Script executed successfully. Output: ${stdout}`);
        res.json({ output: stdout.trim() });
    });
});



// Endpoint to run a installansible
app.post('/run-script-installansible', (req, res) => {
    const { scriptPath } = req.body;
    if (!scriptPath) {
        console.error('Script path is missing in the request.');
        return res.status(400).json({ error: 'Script path is required' });
    }

    // Resolve the full path to the script
    const fullScriptPath = path.join(__dirname, 'ansible', scriptPath);

    console.log(`Received request to execute script: ${scriptPath}`);
    console.log(`Resolved full script path: ${fullScriptPath}`);

    exec(`sh ${fullScriptPath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing script: ${stderr}`);
            return res.status(500).json({ error: stderr.trim() });
        }
        console.log(`Script executed successfully. Output: ${stdout}`);
        res.json({ output: stdout.trim() });
    });
});

// Endpoint to execute the Ansible Hello World playbook
app.post('/run-ansible-helloworld', (req, res) => {
    const playbookPath = path.join(__dirname, 'public', 'scripts', 'ansiblehelloworld.yml');
    const inventoryPath = path.join(__dirname, 'ansible', 'inventory'); // Ensure inventory path is correct

    console.log(`Executing Ansible playbook: ${playbookPath}`);
    exec(`ansible-playbook -i ${inventoryPath} ${playbookPath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing playbook: ${stderr}`);
            return res.status(500).json({ error: stderr.trim() });
        }
        console.log(`Playbook executed successfully. Output: ${stdout}`);
        res.json({ output: stdout.trim() });
    });
});

// Endpoint to execute an Ansible playbook
app.post('/run-playbook', (req, res) => {
    const { playbookPath, inventoryPath } = req.body;
    if (!playbookPath || !inventoryPath) {
        console.error('Playbook path or inventory path is missing in the request.');
        return res.status(400).json({ error: 'Playbook path and inventory path are required' });
    }

    const playbookFullPath = path.join(__dirname, 'ansible', playbookPath);
    const inventoryFullPath = path.join(__dirname, 'ansible', inventoryPath);

    console.log(`Executing Ansible playbook: ${playbookFullPath} with inventory: ${inventoryFullPath}`);
    exec(`ansible-playbook -i ${inventoryFullPath} ${playbookFullPath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing playbook: ${stderr}`);
            return res.status(500).json({ error: stderr.trim() });
        }
        console.log(`Playbook executed successfully. Output: ${stdout}`);
        res.json({ output: stdout.trim() });
    });
});

// Endpoint to handle specific commands
app.post('/run-command', (req, res) => {
    const { command } = req.body;
    if (command === 'RestartAzureAgent_Linux') {
        res.json({ output: 'Azure agent restarted successfully.' });
    } else {
        res.status(400).json({ error: 'Unknown command' });
    }
});

// Endpoint to handle chatbot messages
app.post('/chatbot', async (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    // Build the prompt for OpenAI
    const predefinedKeys = Object.keys(predefinedAnswers);
    const prompt = `
You are a helpful assistant. Here are the commands I understand:
${predefinedKeys.map(key => `- ${key}`).join('\n')}

User asked: "${message}"

Which command matches best? Reply with the command key only.
`;

    try {
        const aiResponse = await askOpenAI(prompt);
        const matchedKey = aiResponse.trim().toLowerCase();
        if (predefinedAnswers[matchedKey]) {
            res.json({ response: predefinedAnswers[matchedKey] });
        } else {
            res.json({ response: "Sorry, I couldn't understand your request." });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
