#!/bin/bash

# Build and Push Docker Image Script for Ansible-AI-DevOps-Agent
# Author: Vilas Wasnik

set -e

# Configuration
DOCKER_USERNAME="vilaswasnik"
IMAGE_NAME="ansible-ai-devops-agent"
VERSION=$(date +"%Y%m%d-%H%M%S")  # Timestamp-based version
LATEST_TAG="latest"

echo "🐳 Building Docker image for Ansible-AI-DevOps-Agent"
echo "=================================================="

# Build the Docker image
echo "📦 Building Docker image..."
docker build -t ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION} .
docker build -t ${DOCKER_USERNAME}/${IMAGE_NAME}:${LATEST_TAG} .

echo "✅ Docker image built successfully!"
echo "   - ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}"
echo "   - ${DOCKER_USERNAME}/${IMAGE_NAME}:${LATEST_TAG}"

# Check if user is logged in to Docker Hub
echo ""
echo "🔐 Checking Docker Hub login status..."
if ! docker info | grep -q "Username"; then
    echo "⚠️  You are not logged in to Docker Hub."
    echo "   Please run: docker login"
    echo "   Then re-run this script."
    exit 1
fi

echo "✅ Docker Hub login confirmed!"

# Push both tags
echo ""
echo "🚀 Pushing to Docker Hub..."
echo "   Pushing version: ${VERSION}"
docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}

echo "   Pushing latest tag..."
docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:${LATEST_TAG}

echo ""
echo "🎉 SUCCESS! Docker image pushed to Docker Hub!"
echo "=================================================="
echo "📋 Image Details:"
echo "   Repository: ${DOCKER_USERNAME}/${IMAGE_NAME}"
echo "   Tags: ${VERSION}, ${LATEST_TAG}"
echo ""
echo "🔗 Docker Hub URL: https://hub.docker.com/r/${DOCKER_USERNAME}/${IMAGE_NAME}"
echo ""
echo "🏃 To run the image:"
echo "   docker run -p 3000:3000 -e OPENAI_API_KEY=your_api_key ${DOCKER_USERNAME}/${IMAGE_NAME}:${LATEST_TAG}"
echo ""
echo "✅ Build and push completed successfully!"