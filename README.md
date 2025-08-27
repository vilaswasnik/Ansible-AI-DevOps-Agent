# Ansible-AI-DevOps-Agent

[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-b### Method 3: Using Docker Image

```bash
# Pull and run the pre-built image
docker run -p 3000:3000 \
  -e OPENAI_API_KEY=your_api_key_here \
  -e ADMIN_USERNAME=admin \
  -e ADMIN_PASSWORD=admin123 \
  vilaswasnik/ansible-ai-devops-agent:latest
```

## 📖 Usage

Once the application is running, access the web interface at **http://localhost:3000**

### 🔐 Authentication

The application requires user authentication. Use the default credentials to log in:

- **Username:** `admin`
- **Password:** `admin123`

After successful login, you'll be redirected to the main Ansible-AI-DevOps-Agent interface.cker&logoColor=white)](https://docker.com)
[![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Ansible](https://img.shields.io/badge/ansible-%231A1918.svg?style=for-the-badge&logo=ansible&logoColor=white)](https://ansible.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> An intelligent DevOps automation agent that combines the power of Ansible with AI-driven capabilities for streamlined infrastructure management and deployment automation.

## 📋 Table of Contents

- [🚀 Overview](#-overview)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📋 Prerequisites](#-prerequisites)
- [🚀 Installation](#-installation)
- [📖 Usage](#-usage)
- [🔧 Configuration](#-configuration)
- [📁 Project Structure](#-project-structure)
- [🤝 Contributing](#-contributing)
- [📝 License](#-license)
- [🙋 Support](#-support)
- [🔮 Roadmap](#-roadmap)

## 🚀 Overview

The Ansible-AI-DevOps-Agent is a comprehensive automation platform that bridges the gap between AI-powered DevOps assistance and infrastructure automation. It provides a user-friendly web interface for executing shell scripts, Ansible playbooks, and AI-driven DevOps operations, making complex infrastructure tasks accessible and efficient.

## ✨ Features

### ✅ Completed Features
- **OpenAI API Integration** - AI-powered DevOps assistance
- **Web Chat Interface** - User-friendly web interface for interactions
- **Docker Containerization** - Ready-to-deploy containerized solution
- **Shell Script Execution** - Execute custom shell scripts securely
- **Ansible Playbook Integration** - Run Ansible automation playbooks
- **Environment Management** - Secure environment variable handling

### 🔄 In Development
- Kubernetes cluster deployment and hosting
- Code optimization and automation enhancements
- Ansible API integration with AWX environment
- Custom LLM model integration
- Website data retrieval capabilities
- Enhanced login/logout functionality

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **AI**: OpenAI API integration
- **Automation**: Ansible
- **Containerization**: Docker & Docker Compose
- **Frontend**: HTML, CSS, JavaScript
- **Version Control**: Git

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Docker & Docker Compose** (recommended)
- **Node.js 20+** (for local development)
- **Ansible** (for local playbook execution)
- **OpenAI API Key** (for AI features)

## 🚀 Installation

### Method 1: Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/vilaswasnik/Ansible-AI-DevOps-Agent.git
cd Ansible-AI-DevOps-Agent

# Build and run with Docker Compose
docker-compose up --build
```

### Method 2: Local Development

```bash
# Clone the repository
git clone https://github.com/vilaswasnik/Ansible-AI-DevOps-Agent.git
cd Ansible-AI-DevOps-Agent

# Install Node.js dependencies
npm install

# Install Ansible (Ubuntu/Debian)
sudo apt-get update
sudo apt-get install ansible

# Set up environment variables
cp .env.example .env
# Edit .env file with your OpenAI API key

# Start the development server
npm start
# or for development with auto-reload
npm run dev
```

### Method 3: Using Docker Image

```bash
# Pull and run the pre-built image
docker run -p 3000:3000 \
  -e OPENAI_API_KEY=your_api_key_here \
  vilaswasnik/ansible-ai-devops-agent:latest
```

## 📖 Usage

Once the application is running, Access the web interface at: http://localhost:3000

### Default Login Credentials

**Username:** `admin`  
**Password:** `admin123`

> **⚠️ Security Note:** These are default credentials for testing. In production, always change the default password and use environment variables for better security.

### Custom Login Credentials

You can set custom admin credentials using environment variables:

```bash
export ADMIN_USERNAME=your_admin_username
export ADMIN_PASSWORD=your_secure_password
```

Or create a `.env` file:

```env
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_secure_password
```

### Web Interface Features

1. **AI Chat Interface**
   - Interact with the AI agent for DevOps assistance
   - Get recommendations for infrastructure automation
   - Execute natural language commands

2. **Script Execution**
   - Run shell scripts securely through the web interface
   - Execute Ansible playbooks with real-time output
   - Monitor execution logs and results

3. **Ansible Integration**
   - Browse and execute pre-configured playbooks
   - Create custom automation workflows
   - Manage inventory and variables

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Main web interface |
| `POST` | `/api/chat` | AI chat endpoint |
| `POST` | `/api/execute` | Execute scripts/playbooks |
| `GET` | `/api/playbooks` | List available playbooks |
| `GET` | `/api/health` | Health check endpoint |

### Example Usage

```bash
# Execute a playbook via API
curl -X POST http://localhost:3000/api/execute \
  -H "Content-Type: application/json" \
  -d '{"type": "ansible", "playbook": "ansiblehelloworld.yml"}'
```

### Ansible Integration

The project includes several pre-configured Ansible playbooks:
- `ansible/ansiblehelloworld.yml` - Basic hello world playbook
- `ansible/getosdetails.yml` - System information gathering
- `ansible/ansibletest.yml` - Test automation scenarios

## � Development Guide

This section provides guidance on extending the Ansible-AI-DevOps-Agent with custom automation scripts.

### Creating Ansible Playbooks

Ansible playbooks are stored in the `ansible/` directory. To create a new playbook:

1. **Create a new YAML file** in the `ansible/` folder:
   ```bash
   touch ansible/your-playbook-name.yml
   ```

2. **Follow Ansible best practices** for playbook structure:
   ```yaml
   ---
   - name: Your Playbook Description
     hosts: all
     become: yes  # Use sudo if needed
     vars:
       your_variable: "value"
     
     tasks:
       - name: Task description
         ansible.builtin.command: echo "Hello World"
         register: command_output
         
       - name: Display output
         ansible.builtin.debug:
           msg: "{{ command_output.stdout }}"
   ```

3. **Test your playbook** before deployment:
   ```bash
   ansible-playbook ansible/your-playbook-name.yml -i ansible/inventory
   ```

4. **Update the web interface** by adding your playbook to the execution options in `public/aiagent.html` if needed.

### Shell Script Storage and Creation

Shell scripts are stored in the `public/scripts/shell_scripts/` directory. To add a new shell script:

1. **Create your script** in the appropriate location:
   ```bash
   touch public/scripts/shell_scripts/your-script.sh
   ```

2. **Make it executable**:
   ```bash
   chmod +x public/scripts/shell_scripts/your-script.sh
   ```

3. **Follow shell script best practices**:
   ```bash
   #!/bin/bash
   
   # Script header with description
   # Description: Brief description of what this script does
   # Usage: ./your-script.sh [parameters]
   
   set -e  # Exit on any error
   
   # Your script logic here
   echo "Starting script execution..."
   
   # Example task
   mkdir -p /tmp/example
   echo "Directory created successfully"
   ```

4. **Test your script** thoroughly before deploying:
   ```bash
   ./public/scripts/shell_scripts/your-script.sh
   ```

5. **Update the web interface** by adding your script to the execution options in `public/aiagent.html` if needed.

## 🔧 Configuration

### Environment Variables

## �🔧 Configuration

### Environment Variables
Create a `.env` file with the following variables:

```env
OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=production
PORT=3000
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

### Docker Configuration
The project includes optimized Docker configuration:
- Multi-stage builds for smaller images
- Ansible pre-installed in containers
- Volume mounting for development
- Environment variable support for secure credential management

## 📁 Project Structure

```
Ansible-AI-DevOps-Agent/
├── .github/               # GitHub configuration
│   ├── ISSUE_TEMPLATE/    # Issue templates
│   ├── workflows/         # CI/CD workflows
│   ├── FUNDING.yml        # Sponsorship information
│   └── PULL_REQUEST_TEMPLATE.md
├── public/                # Web interface files
│   ├── scripts/          # Client-side JavaScript
│   ├── styles/           # CSS stylesheets
│   └── *.html            # HTML templates
├── ansible/              # Ansible playbooks and inventory
├── scripts/              # Utility scripts
├── .env.example          # Environment variables template
├── .gitignore           # Git ignore rules
├── CODE_OF_CONDUCT.md   # Community guidelines
├── CONTRIBUTING.md      # Contribution guidelines
├── Dockerfile           # Docker configuration
├── docker-compose.yml   # Docker Compose setup
├── LICENSE              # MIT License
├── README.md            # This file
├── SECURITY.md          # Security policy
├── server.js            # Main application server
└── package.json         # Node.js dependencies and scripts
```

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Ways to Contribute

- 🐛 **Report Bugs**: Use [GitHub Issues](https://github.com/vilaswasnik/Ansible-AI-DevOps-Agent/issues) to report bugs
- 💡 **Suggest Features**: Share your ideas for new features
- 📝 **Improve Documentation**: Help make our docs better
- 🧪 **Write Tests**: Add test cases to improve reliability
- 🔧 **Code Contributions**: Submit pull requests with fixes or enhancements

### Development Process

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/your-username/Ansible-AI-DevOps-Agent.git`
3. **Create** a feature branch: `git checkout -b feature/amazing-feature`
4. **Make** your changes and **test** thoroughly
5. **Commit** your changes: `git commit -m 'Add amazing feature'`
6. **Push** to your branch: `git push origin feature/amazing-feature`
7. **Open** a Pull Request

### Guidelines

- Follow the existing code style and conventions
- Write clear, concise commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting
- Be respectful and inclusive in all interactions

### Development Setup

```bash
# Install development dependencies
npm install

# Run tests
npm test

# Run linting
npm run lint

# Start development server with hot reload
npm run dev
```

## � Security

We take security seriously. If you discover a security vulnerability, please:

- **DO NOT** create a public GitHub issue
- **DO** email us directly at: security@example.com
- Include detailed information about the vulnerability
- Allow reasonable time for us to respond and fix the issue

See our [Security Policy](SECURITY.md) for more details.

## 🔐 Security Best Practices

### ⚠️ Important Security Notes

1. **Change Default Credentials**: The default login credentials (`admin`/`admin123`) are for testing only. **Always change them before production deployment.**

2. **Environment Variables**: Use environment variables instead of hardcoding credentials:
   ```bash
   export ADMIN_USERNAME=your_secure_username
   export ADMIN_PASSWORD=your_strong_password
   ```

3. **HTTPS in Production**: Enable HTTPS and set `secure: true` for cookies in production.

4. **Strong Passwords**: Use complex passwords with a mix of uppercase, lowercase, numbers, and special characters.

5. **Regular Updates**: Keep dependencies updated and monitor for security vulnerabilities.

### Production Deployment Checklist
- [ ] Change default admin credentials
- [ ] Enable HTTPS/SSL
- [ ] Set secure cookie options
- [ ] Configure firewall rules
- [ ] Set up monitoring and logging
- [ ] Regular security audits

## 🚀 CI/CD

This project uses GitHub Actions for continuous integration and deployment:

- **Automated Testing**: Runs on every push and pull request
- **Security Scanning**: Uses Trivy to scan for vulnerabilities
- **Code Quality**: Ensures code standards are maintained
- **Docker Builds**: Validates container builds

See [.github/workflows/ci.yml](.github/workflows/ci.yml) for the complete CI/CD pipeline.

## �📊 GitHub Stats

![GitHub stars](https://img.shields.io/github/stars/vilaswasnik/Ansible-AI-DevOps-Agent?style=social)
![GitHub forks](https://img.shields.io/github/forks/vilaswasnik/Ansible-AI-DevOps-Agent?style=social)
![GitHub issues](https://img.shields.io/github/issues/vilaswasnik/Ansible-AI-DevOps-Agent)
![GitHub PRs](https://img.shields.io/github/issues-pr/vilaswasnik/Ansible-AI-DevOps-Agent)

## 🙏 Acknowledgments

- **OpenAI** for providing the AI capabilities
- **Ansible Community** for the automation framework
- **Docker** for containerization technology
- **Node.js Community** for the runtime environment
- All our [contributors](https://github.com/vilaswasnik/Ansible-AI-DevOps-Agent/graphs/contributors) who help make this project better

---

<div align="center">

**Made with ❤️ by [Vilas Wasnik](https://github.com/vilaswasnik)**

⭐ **Star this repository if you find it useful!**

[📧 Contact](mailto:contact@example.com) • [🐛 Issues](https://github.com/vilaswasnik/Ansible-AI-DevOps-Agent/issues) • [📖 Wiki](https://github.com/vilaswasnik/Ansible-AI-DevOps-Agent/wiki)

</div>
