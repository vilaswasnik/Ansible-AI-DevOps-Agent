# Docker Installation and Build Guide

## Docker Installation Status ✅

Docker has been successfully installed in this environment with version **28.4.0**.

## Current Limitations in Codespaces

GitHub Codespaces has some container runtime limitations that prevent building images directly. However, the Docker installation and build scripts are ready for use on:

- **Local development machines**
- **CI/CD pipelines** 
- **Cloud instances** with full Docker support
- **Docker Desktop** environments

## Ready-to-Use Build Scripts

### 1. Automated Build Script (`build-and-push.sh`)
```bash
#!/bin/bash
# Full automation for Docker Hub deployment
./build-and-push.sh
```

### 2. Manual Build Commands
```bash
# Login to Docker Hub
docker login

# Build the image
docker build -t vilaswasnik/ansible-ai-devops-agent:latest .

# Push to Docker Hub
docker push vilaswasnik/ansible-ai-devops-agent:latest
```

## Next Steps for Local Machine

1. **Clone the repository** on your local machine
2. **Install Docker Desktop** if not already installed
3. **Run the build script**:
   ```bash
   git clone https://github.com/vilaswasnik/Ansible-AI-DevOps-Agent.git
   cd Ansible-AI-DevOps-Agent
   ./build-and-push.sh
   ```

## Docker Hub Repository
Once built, your image will be available at:
**https://hub.docker.com/r/vilaswasnik/ansible-ai-devops-agent**

## Testing the Published Image
```bash
docker run -p 3000:3000 -e OPENAI_API_KEY=your_api_key vilaswasnik/ansible-ai-devops-agent:latest
```

---
✅ **Docker is installed and ready**  
🚀 **Build scripts are prepared**  
📋 **All files are committed to the repository**