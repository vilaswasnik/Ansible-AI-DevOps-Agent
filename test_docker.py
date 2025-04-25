import docker

try:
    client = docker.from_env()
    print("Docker is running. Containers:", client.containers.list())
except docker.errors.DockerException as e:
    print("Error connecting to Docker:", e)
