
# Ansible-AI-DevOps-Agent

🤖 AI-powered DevOps automation - Run Ansible playbooks and shell scripts through a simple chat interface.

## Quick Start

**Docker (Recommended):**
```bash
docker run -p 3000:3000 -e OPENAI_API_KEY=your_api_key vilaswasnik/ansible-ai-devops-agent:latest
```

**Local Setup:**
```bash
git clone https://github.com/vilaswasnik/Ansible-AI-DevOps-Agent.git
cd Ansible-AI-DevOps-Agent
npm install
echo "OPENAI_API_KEY=your_api_key" > .env
npm start
```

Then visit **http://localhost:3000** (Login: `admin` / `admin123`)

## What It Does

- 💬 **Chat with AI** to run DevOps tasks in natural language
- 📜 **Execute Ansible playbooks** with real-time output  
- 🔧 **Run shell scripts** securely through web interface
- 📋 **List and manage** available automation scripts

## Requirements

- OpenAI API Key
- Docker OR Node.js 20+ + Ansible

## Example Commands

Try these natural language commands:
- *"Run the Ansible test playbook"*
- *"Execute hello.sh script"* 
- *"Get OS details using Ansible"*
- *"What playbooks are available?"*

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/run-playbook` | POST | Execute Ansible playbooks |
| `/list-playbooks` | GET | List available playbooks |
| `/api/chat` | POST | AI chat interface |

## Development

**Add Custom Playbooks:**
```bash
# Create new playbook
touch ansible/my-playbook.yml

# Test it
ansible-playbook ansible/my-playbook.yml -i ansible/inventory
```

**Add Custom Scripts:**
```bash
# Create script
touch public/scripts/shell_scripts/my-script.sh
chmod +x public/scripts/shell_scripts/my-script.sh
```

## Tech Stack
Node.js • Express • Ansible • Docker • OpenAI API

---

⭐ **Star this repo if you find it useful!**

**Issues?** [Report here](https://github.com/vilaswasnik/Ansible-AI-DevOps-Agent/issues) • Made by [Vilas Wasnik](https://github.com/vilaswasnik)
