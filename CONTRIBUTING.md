# Contributing to Ansible-AI-DevOps-Agent

Thank you for your interest in contributing to the Ansible-AI-DevOps-Agent! We welcome contributions from everyone. This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Submitting Changes](#submitting-changes)
- [Community](#community)

## 🤝 Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to contact@example.com.

## 🚀 How to Contribute

### Types of Contributions

- **🐛 Bug Reports**: Use [GitHub Issues](https://github.com/vilaswasnik/Ansible-AI-DevOps-Agent/issues) with the bug report template
- **💡 Feature Requests**: Use [GitHub Issues](https://github.com/vilaswasnik/Ansible-AI-DevOps-Agent/issues) with the feature request template
- **📝 Documentation**: Help improve documentation
- **🧪 Testing**: Add or improve tests
- **🔧 Code**: Submit pull requests with fixes or enhancements

### Quick Start

1. **Fork** the repository on GitHub
2. **Clone** your fork locally
3. **Create** a feature branch
4. **Make** your changes
5. **Test** your changes
6. **Submit** a pull request

## 🛠️ Development Setup

### Prerequisites

- Node.js 20+ and npm 8+
- Docker & Docker Compose
- Ansible
- Git

### Local Development

```bash
# Clone your fork
git clone https://github.com/your-username/Ansible-AI-DevOps-Agent.git
cd Ansible-AI-DevOps-Agent

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

### Docker Development

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or build and run manually
docker build -t ansible-ai-devops-agent .
docker run -p 3000:3000 ansible-ai-devops-agent
```

## 🔄 Development Workflow

### 1. Choose an Issue
- Check [GitHub Issues](https://github.com/vilaswasnik/Ansible-AI-DevOps-Agent/issues) for open tasks
- Comment on the issue to indicate you're working on it
- Wait for maintainer approval if required

### 2. Create a Branch
```bash
# Create and switch to a new branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-number-description
```

### 3. Make Changes
- Write clear, concise commit messages
- Follow the coding standards below
- Test your changes thoroughly
- Update documentation if needed

### 4. Test Your Changes
```bash
# Run tests
npm test

# Run linting
npm run lint

# Manual testing
npm run dev
# Visit http://localhost:3000 and test your changes
```

### 5. Submit Pull Request
- Push your branch to your fork
- Create a pull request using the PR template
- Wait for review and address feedback

## 📝 Coding Standards

### JavaScript/Node.js
- Use ES6+ syntax
- Follow [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Use meaningful variable and function names
- Add comments for complex logic
- Use async/await for asynchronous operations

### Commit Messages
Follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance

### File Structure
```
├── public/                 # Static web files
│   ├── scripts/           # Client-side JavaScript
│   ├── styles/            # CSS stylesheets
│   └── *.html             # HTML templates
├── ansible/               # Ansible playbooks
├── scripts/               # Utility scripts
├── .github/               # GitHub configuration
├── Dockerfile            # Docker configuration
├── docker-compose.yml    # Docker Compose setup
├── server.js             # Main application
└── package.json          # Dependencies and scripts
```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run specific test file
npm test -- test/file.test.js

# Run tests with coverage
npm run test:coverage
```

### Writing Tests
- Write tests for new features
- Use descriptive test names
- Test both positive and negative scenarios
- Mock external dependencies
- Aim for good test coverage

### Manual Testing Checklist
- [ ] Application starts without errors
- [ ] Web interface loads correctly
- [ ] AI chat functionality works
- [ ] Ansible playbook execution works
- [ ] Docker build succeeds
- [ ] No console errors in browser
- [ ] Responsive design works on mobile

## 📚 Documentation

### README Updates
- Update README.md for new features
- Add screenshots for UI changes
- Update installation instructions if needed
- Update API documentation

### Code Documentation
- Add JSDoc comments for functions
- Document complex algorithms
- Update inline comments
- Document configuration options

## 🔍 Submitting Changes

### Pull Request Process
1. **Update** the README.md with details of changes if needed
2. **Update** the version numbers in package.json following [SemVer](https://semver.org/)
3. **Ensure** all tests pass
4. **Ensure** code follows the style guidelines
5. **Submit** your pull request with the PR template

### Review Process
- Maintainers will review your PR
- Address any feedback or requested changes
- Once approved, your PR will be merged
- Your contribution will be acknowledged

## 🌐 Community

### Getting Help
- 📧 **Email**: contact@example.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/vilaswasnik/Ansible-AI-DevOps-Agent/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/vilaswasnik/Ansible-AI-DevOps-Agent/discussions)

### Recognition
Contributors are recognized in:
- GitHub repository contributors list
- Release notes
- Special mentions in documentation

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You

Your contributions help make this project better for everyone! We appreciate your time and effort.

**Happy Contributing!** 🎉
