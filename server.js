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

// Secure authentication setup
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const session = require('express-session');

// JWT secret - CHANGE THIS TO A SECURE RANDOM STRING IN PRODUCTION
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-session-secret-change-this-too',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true in production with HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// User management with hashed passwords
const users = {};

// Initialize with admin user credentials (admin/admin123)
const initializeAdminUser = async () => {
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (!users[adminUsername]) {
        const hashedPassword = await bcrypt.hash(adminPassword, 12);
        users[adminUsername] = {
            password: hashedPassword,
            isAdmin: true,
            temp: false,
            createdAt: new Date()
        };
        console.log(`Admin user '${adminUsername}' initialized with password '${adminPassword}'`);
    }
};

// Initialize admin user on startup
initializeAdminUser();

// Secure login endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required'
            });
        }

        // Check if user exists
        const user = users[username];
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }

        // Check if password reset is required
        if (user.temp) {
            return res.json({
                success: false,
                resetRequired: true,
                message: 'Password reset required'
            });
        }

        // Create JWT token
        const token = jwt.sign(
            {
                username: username,
                isAdmin: user.isAdmin,
                exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
            },
            JWT_SECRET
        );

        // Set session
        req.session.user = {
            username: username,
            isAdmin: user.isAdmin,
            loginTime: new Date()
        };

        // Set HTTP-only cookie with JWT
        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: false, // Set to true in production with HTTPS
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            sameSite: 'strict'
        });

        console.log(`User ${username} logged in successfully`);
        res.json({
            success: true,
            message: 'Login successful',
            user: {
                username: username,
                isAdmin: user.isAdmin
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const token = req.cookies.auth_token;

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ error: 'Admin privileges required' });
    }
    next();
};

// Secure password reset endpoint
app.post('/api/reset', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and new password are required'
            });
        }

        if (!users[username]) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Validate password strength
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters long'
            });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 12);
        users[username].password = hashedPassword;
        users[username].temp = false;

        console.log(`Password reset successful for user: ${username}`);
        res.json({
            success: true,
            message: 'Password reset successful. Please login with your new password.'
        });

    } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Secure logoff endpoint
app.post('/api/logoff', authenticateToken, (req, res) => {
    // Clear the session
    req.session.destroy((err) => {
        if (err) {
            console.error('Session destruction error:', err);
            return res.status(500).json({
                success: false,
                message: 'Error during logout'
            });
        }

        // Clear the auth cookie
        res.clearCookie('auth_token');
        console.log(`User ${req.user.username} logged out successfully`);
        res.json({
            success: true,
            message: 'Logout successful'
        });
    });
});

// Helper to add a user securely (call this from an admin route)
async function addUser(username, password, temp = true) {
    if (!username || !password) {
        throw new Error('Username and password are required');
    }

    if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    users[username] = {
        password: hashedPassword,
        isAdmin: false,
        temp: temp,
        createdAt: new Date()
    };

    console.log(`User ${username} ${temp ? 'temporarily' : 'permanently'} created`);
    return users[username];
}

// Admin endpoint to add users (protected)
app.post('/api/admin/add-user', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { username, password, temp = true } = req.body;

        if (users[username]) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        await addUser(username, password, temp);
        res.json({
            success: true,
            message: `User ${username} created successfully`
        });

    } catch (error) {
        console.error('Add user error:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
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
