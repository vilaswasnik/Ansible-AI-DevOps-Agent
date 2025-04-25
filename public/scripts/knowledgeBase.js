export const knowledgeBase = {
    "project_overview": {
        "purpose": "The UCD AI Agent project is a chatbot-based automation tool designed to execute various system-level scripts and commands.",
        "key_features": [
            "Execute shell scripts like hello.sh and ansible.sh.",
            "Run Ansible playbooks for system automation.",
            "Fetch OS details and restart services.",
            "Interactive chatbot interface with predefined responses and spell correction.",
            "Speech synthesis for bot responses."
        ]
    },
    "software_requirements": {
        "installed_software": [
            "Node.js: Backend server for handling requests and executing scripts.",
            "Ansible: For running playbooks and automating system tasks.",
            "Web Browser: For accessing the chatbot interface.",
            "Linux Shell: For executing shell scripts."
        ],
        "dependencies": [
            "Frontend: HTML, CSS, JavaScript.",
            "Backend: Node.js with Express.js.",
            "Other Tools: Speech synthesis API for voice responses."
        ]
    },
    "execution_flow": {
        "example": "Executing hello.sh",
        "steps": [
            "User types 'execute hello.sh' in the chat.",
            "Frontend sends a POST request to the /run-script endpoint.",
            "Backend executes hello.sh using a child process.",
            "Output or error is returned as a JSON response.",
            "Frontend displays the response in the chat interface."
        ]
    },
    "future_scope": [
        "Add support for more scripts and playbooks.",
        "Implement user authentication for secure access.",
        "Enhance the chatbot with AI-based natural language processing.",
        "Add logging and monitoring for executed commands.",
        "Support multi-platform compatibility (Windows, macOS)."
    ]
};