import fetch from 'node-fetch';

const serverUrl = 'http://localhost:3000/run-script';
//const scriptPath = '/workspace/AARA-AI-Agent/hello.sh';
const scriptPath = './hello.sh'; // Ensure this path is correct

const testConnection = async () => {
    try {
        const response = await fetch(serverUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ scriptPath })
        });
        const data = await response.json();
        if (data.error) {
            console.error(`Error from server: ${data.error}`);
        } else {
            console.log(`Script executed successfully: ${data.output}`);
        }
    } catch (error) {
        console.error(`Error testing connection: ${error.message}`);
    }
};

testConnection();

