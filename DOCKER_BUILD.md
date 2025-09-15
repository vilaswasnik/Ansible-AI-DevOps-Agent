# Docker Build Instructions

## Quick Build and Push

Run the automated script:
```bash
./build-and-push.sh
```

## Manual Steps

### 1. Login to Docker Hub
```bash
docker login
# Enter your username: vilaswasnik
# Enter your password: [your-password]
```

### 2. Build the Image
```bash
# Build with version tag
docker build -t vilaswasnik/ansible-ai-devops-agent:$(date +%Y%m%d) .

# Build with latest tag
docker build -t vilaswasnik/ansible-ai-devops-agent:latest .
```

### 3. Push to Docker Hub
```bash
# Push version tag
docker push vilaswasnik/ansible-ai-devops-agent:$(date +%Y%m%d)

# Push latest tag
docker push vilaswasnik/ansible-ai-devops-agent:latest
```

### 4. Verify
Your image will be available at:
https://hub.docker.com/r/vilaswasnik/ansible-ai-devops-agent

### 5. Test the Published Image
```bash
docker run -p 3000:3000 -e OPENAI_API_KEY=your_api_key vilaswasnik/ansible-ai-devops-agent:latest
```

## Docker Hub Repository
- **Repository**: `vilaswasnik/ansible-ai-devops-agent`
- **Registry URL**: https://hub.docker.com/r/vilaswasnik/ansible-ai-devops-agent
- **Pull Command**: `docker pull vilaswasnik/ansible-ai-devops-agent:latest`