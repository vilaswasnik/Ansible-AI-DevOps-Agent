import { cancelOperation } from './ansiblePlaybooks.js';
import { executeGetOSDetailsLinux } from './getOSDetailsLinux.js';
import { executeAnsibleTestPlaybook } from './ansibleTestPlaybook.js';
import { executeRestartAzureAgentLinux } from './restartAzureAgentLinux.js';
import { executeHelloWorldScript } from './helloWorldScript.js';
import { executegetosdetailsPlaybook } from './getosdetails.js';

const chatContainer = document.getElementById('chat-container');
const chatBox = document.getElementById('chat-box');
const chatInput = document.getElementById('chat-input');
const chatSendButton = document.querySelector('.chat-send-button');
const botMouth = document.getElementById('bot-mouth');
const muteToggleButton = document.querySelector('.mute-toggle-button');
let isMuted = false;

let predefinedAnswers = {};
let spellCorrections = {};

fetch('/trainingData.json') // Correct path for the file in the public folder
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        predefinedAnswers = data.predefinedAnswers;
        spellCorrections = data.spellCorrections;
        console.log('Training data loaded:', data); // Debug log
        enableChatInput();
    })
    .catch(error => {
        console.error('Error loading training data:', error);
        chatInput.placeholder = "Failed to load data";
    });

let lastSuggestion = null;
let awaitingServiceName = false;

function enableChatInput() {
    console.log('Enabling chat input'); // Debug log
    chatInput.disabled = false;
    chatSendButton.disabled = false;
    chatInput.placeholder = "Type a message...";
    chatInput.addEventListener('keypress', handleKeyPress);
    chatSendButton.addEventListener('click', sendMessage); // Ensure the send button calls sendMessage
    muteToggleButton.addEventListener('click', toggleMute); // Ensure the mute button calls toggleMute
}

function toggleMute() {
    isMuted = !isMuted;
    muteToggleButton.textContent = isMuted ? 'Unmute' : 'Mute'; // Change button text based on mute state
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function sendMessage() {
    console.log('Send message called'); // Debug log
    let userMessage = chatInput.value.trim().toLowerCase();
    if (userMessage) {
        console.log('User message:', userMessage); // Debug log
        if (userMessage === 'cancel') {
            cancelOperation(addMessage);
            resetState();
            chatInput.value = '';
            return;
        }

        if (awaitingServiceName) {
            const serviceName = userMessage;
            awaitingServiceName = false;
            executeRestartService(serviceName, addMessage);
            chatInput.value = '';
            return;
        }

        if (lastSuggestion && userMessage === "yes") {
            userMessage = lastSuggestion;
            lastSuggestion = null;
        } else {
            userMessage = correctSpelling(userMessage);
        }
        addMessage(userMessage, 'user');
        chatInput.value = '';
        respondToUser(userMessage); // Ensure this function is called to generate a response
    }
}

function resetState() {
    awaitingServiceName = false;
}

function correctSpelling(message) {
    const words = message.split(' ');
    for (let i = 0; i < words.length; i++) {
        if (spellCorrections[words[i]]) {
            words[i] = spellCorrections[words[i]];
        }
    }
    return words.join(' ');
}

function addMessage(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}`;
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.innerHTML = message;
    messageElement.appendChild(messageContent);
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function respondToUser(userMessage) {
    console.log('Responding to user message:', userMessage); // Debug log
    const greetings = ["hey", "hi", "hello"];
    if (greetings.includes(userMessage)) {
        const botResponse = predefinedAnswers[userMessage] || "Hello! How can I assist you today?";
        setTimeout(() => {
            addMessage(botResponse, 'bot');
            if (!isMuted) {
                speak(botResponse);
            }
        }, 500);
    } else if (predefinedAnswers[userMessage]) {
        const botResponse = predefinedAnswers[userMessage];
        if (userMessage === "getosdetails_linux") {
            executeGetOSDetailsLinux(addMessage);
            addMessage(botResponse, 'bot');
        } else if (userMessage === "restart service") {
            awaitingServiceName = true;
            addMessage("Please provide the service name.", 'bot');
        } else if (userMessage === "run hello world script") {
            executeHelloWorldScript(addMessage);
        } else if (userMessage === "run ansible test playbook") {
            executeAnsibleTestPlaybook(addMessage);
        } else if (userMessage === "run getosdetails playbook") { // Handle the new playbook command
            executegetosdetailsPlaybook(addMessage); // Call the function to execute the new playboo
        } else if (userMessage === "install ansible") { // Handle the new playbook command
            executeinstallansible(addMessage); // Call the function to execute the new playbook    // k
        } else if (userMessage === "restartazureagent_linux") {
            executeRestartAzureAgentLinux(addMessage);
        } else if (userMessage === "execute hello.sh") {
            executeHelloScript(addMessage);
        } else {
            addMessage(botResponse, 'bot');
            if (!isMuted) {
                speak(botResponse);
            }
        }
    } else {
        const suggestion = getSuggestion(userMessage);
        if (suggestion) {
            lastSuggestion = suggestion;
            const botResponse = `Did you mean "${suggestion}"?`;
            setTimeout(() => {
                addMessage(botResponse, 'bot');
                if (!isMuted) {
                    speak(botResponse);
                }
            }, 500);
        } else {
            const botResponse = "I'm sorry, I don't understand that.";
            setTimeout(() => {
                addMessage(botResponse, 'bot');
                if (!isMuted) {
                    speak(botResponse);
                }
            }, 500);
        }
    }
}

function getSuggestion(message) {
    const words = Object.keys(predefinedAnswers);
    for (let i = 0; i < words.length; i++) {
        if (isSimilar(message, words[i])) {
            return words[i];
        }
    }
    return null;
}

function isSimilar(word1, word2) {
    const distance = levenshteinDistance(word1, word2);
    return distance <= 2; // Allow up to 2 character differences
}

function levenshteinDistance(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
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

function speak(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(stripHtml(text));
        speechSynthesis.speak(utterance);
        animateMouth();
    } else {
        console.error('Speech Synthesis not supported in this browser.');
    }
}

function stripHtml(html) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
}

function animateMouth() {
    botMouth.style.display = 'block';
    botMouth.style.animation = 'talk 0.5s infinite';
    setTimeout(() => {
        botMouth.style.animation = 'none';
        botMouth.style.display = 'none';
    }, 2000); // Remove mouth animation after 2 seconds
}

function executeHelloScript(addMessage) {
    addMessage("Executing hello.sh script...", 'bot'); // Inform the user about script execution
    fetch('/run-script', { // Use the correct backend endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scriptPath: 'hello.sh' }) // Pass only the script name
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Expect JSON response from the backend
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

function executeinstallansible(addMessage) {
    addMessage("installing ansible...", 'bot'); // Inform the user about script execution
    fetch('/run-script-installansible', { // Use the correct backend endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scriptPath: 'ansible.sh' }) // Pass only the script name
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Expect JSON response from the backend
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