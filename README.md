
# Ansible-AI-DevOps-Agent

🤖 AI-powered DevOps automation - Run Ansible playbooks and shell scripts through a simple chat interface.

## Quick Start

**Local Setup:**
```bash
# 1. Install Node.js 20+ and Ansible (see Prerequisites below)

# 2. Clone and setup project
git clone https://github.com/vilaswasnik/Ansible-AI-DevOps-Agent.git
cd Ansible-AI-DevOps-Agent

# 3. Install dependencies
npm install

# 4. Create environment file with your OpenAI API key
echo "OPENAI_API_KEY=your_actual_api_key_here" > .env

# 5. Start the application
npm start
```

Then visit **http://localhost:3000** (Login: `admin` / `admin123`)

## What It Does

- 💬 **Chat with AI** to run DevOps tasks in natural language
- 📜 **Execute Ansible playbooks** with real-time output  
- 🔧 **Run shell scripts** securely through web interface
- 📋 **List and manage** available automation scripts

## Prerequisites

- **Node.js 20+** - [Download here](https://nodejs.org/)
- **Ansible** - Install via:
  ```bash
  # Ubuntu/Debian
  sudo apt-get update && sudo apt-get install ansible
  
  # macOS
  brew install ansible
  
  # Other systems
  pip install ansible
  ```
- **OpenAI API Key** - Get from [OpenAI Platform](https://platform.openai.com/api-keys)

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
Node.js • Express • Ansible • OpenAI API

---

⭐ **Star this repo if you find it useful!**

**Issues?** [Report here](https://github.com/vilaswasnik/Ansible-AI-DevOps-Agent/issues) • Made by [Vilas Wasnik](https://github.com/vilaswasnik)
