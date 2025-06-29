const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');
const path = require('path');
const { askOpenAI } = require('./public/scripts/openai');
const predefinedAnswers = require('./public/trainingData.json').predefinedAnswers;
const fs = require('fs');
const OpenAI = require('openai');
require('dotenv').config();

// Optional: Levenshtein distance for fuzzy matching
function levenshteinDistance(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
                );
            }
        }
    }
    return matrix[b.length][a.length];
}

function findClosestKey(input, keys) {
    let minDistance = Infinity;
    let closestKey = null;
    for (const key of keys) {
        const distance = levenshteinDistance(input, key);
        if (distance < minDistance) {
            minDistance = distance;
            closestKey = key;
        }
    }
    // Only return if it's reasonably close (tune threshold as needed)
    return minDistance <= 2 ? closestKey : null;
}

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Ensure static files are served from 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Serve the aiagent HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Endpoint to run a shell script present at script folder -need to remove
app.post('/run-script', (req, res) => {
    const { scriptPath } = req.body;
    if (!scriptPath) {
        console.error('Script path is missing in the request.');
        return res.status(400).json({ error: 'Script path is required' });
    }
    // Block getOSDetailsLinux
    if (scriptPath.includes('getOSDetailsLinux')) {
        return res.status(403).json({ error: 'This script is disabled.' });
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


// Endpoint to run a shell script hello2.sh. and for all .sh scripts in the shell_scripts folder
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

// Endpoint to handle chatbot messages
app.post('/chatbot', async (req, res) => {
    const { message } = req.body;
    const predefinedKeys = Object.keys(predefinedAnswers);

    const prompt = `
You are a helpful assistant. Here are the commands I understand:
${predefinedKeys.map(key => `- ${key}`).join('\n')}

User asked: "${message}"

Reply with the exact command key from the list above that best matches the user's request. If none match, reply with "none".
`;

    try {
        const aiResponse = await askOpenAI(prompt);
        let matchedKey = aiResponse.trim().toLowerCase();
        if (matchedKey === "none") matchedKey = null;
        // Fuzzy match if OpenAI's response is close but not exact
        if (matchedKey && !predefinedAnswers[matchedKey]) {
            matchedKey = findClosestKey(matchedKey, predefinedKeys);
        }
        res.json({ matchedKey });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// User management (for admin use)
const users = {
    admin: { password: 'admin123', isAdmin: true, temp: false }
    // Add more users as needed
};

// Helper to add a user (call this from an admin route)
function addUser(username, password, temp = true) {
    users[username] = { password, isAdmin: false, temp };
}

// Login endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users[username];
    if (!user) return res.json({ success: false, message: 'User not found' });
    if (user.password !== password) return res.json({ success: false, message: 'Incorrect password' });
    if (user.temp) return res.json({ success: false, resetRequired: true, message: 'Password reset required' });
    // Set session/cookie here for real security
    res.json({ success: true });
});

// Password reset endpoint
app.post('/api/reset', (req, res) => {
    const { username, password } = req.body;
    if (!users[username]) return res.json({ success: false, message: 'User not found' });
    users[username].password = password;
    users[username].temp = false;
    res.json({ success: true, message: 'Password reset successful. Please login.' });
});

// Logoff endpoint
app.post('/api/logoff', (req, res) => {
    // Clear session/cookie logic here
    res.json({ success: true });
});

// RAG Knowledge Base endpoint
const embeddingsPath = path.join(__dirname, 'public/scripts/documents/knowledgeBase_embeddings.json');
let embeddings = [];
if (fs.existsSync(embeddingsPath)) {
    embeddings = JSON.parse(fs.readFileSync(embeddingsPath, 'utf8'));
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/rag-knowledgebase', async (req, res) => {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: 'Missing question' });

    // Embed the question
    const embedResponse = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: question
    });
    const questionEmbedding = embedResponse.data[0].embedding;

    // Find the most similar chunk (cosine similarity)
    function cosineSimilarity(a, b) {
        let dot = 0, normA = 0, normB = 0;
        for (let i = 0; i < a.length; i++) {
            dot += a[i] * b[i];
            normA += a[i] * a[i];
            normB += b[i] * b[i];
        }
        return dot / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    let best = { score: -1, text: '' };
    for (const chunk of embeddings) {
        const score = cosineSimilarity(questionEmbedding, chunk.embedding);
        if (score > best.score) best = { score, text: chunk.text };
    }

    // After calculating cosine similarities for all chunks:
    const topChunks = embeddings
      .map(chunk => ({
        text: chunk.text,
        score: cosineSimilarity(questionEmbedding, chunk.embedding)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    const context = topChunks.map(c => c.text).join('\n---\n');
    // Use this context in your OpenAI completion call

    // Use OpenAI to answer based on the best chunk
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            { role: "system", content: "You are an assistant that answers questions using the provided context." },
            { role: "user", content: `Context: ${context}\n\nQuestion: ${question}` }
        ]
    });

    res.json({ answer: completion.choices[0].message.content, context: best.text });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
