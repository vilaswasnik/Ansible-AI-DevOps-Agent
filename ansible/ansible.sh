#!/bin/bash

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Update the system
echo "Updating the system..."
sudo dnf update -y
echo "System update completed."
sleep 5

# Install Python3 and pip if not already installed
if ! command_exists python3 || ! command_exists pip3; then
    echo "Installing Python3 and pip..."
    sudo dnf install python3 python3-pip -y
    echo "Python3 and pip installation completed."
    sleep 5
else
    echo "Python3 and pip are already installed."
fi

# Verify pip3 installation
echo "Verifying pip3 installation..."
sudo pip3 --version
sleep 5

# Install Ansible using pip if not already installed
if ! command_exists ansible; then
    echo "Installing Ansible..."
    sudo pip3 install ansible
    echo "Ansible installation completed."
    sleep 5
else
    echo "Ansible is already installed."
fi

# Verify Ansible installation
echo "Verifying Ansible installation..."
sudo ansible --version
sleep 5

# Set hostname to 'controller' if not already set
current_hostname=$(hostname)
if [ "$current_hostname" != "controller" ]; then
    echo "Setting hostname to 'controller'..."
    sudo hostnamectl set-hostname controller
    echo "Hostname set to 'controller'."
    sleep 5
else
    echo "Hostname is already set to 'controller'."
fi

# Create the inventory file if not already created
if [ ! -f inventory ]; then
    echo "Creating the inventory file..."
    echo "[controller]
controller ansible_connection=local" > inventory
    echo "Inventory file created."
    sleep 5
else
    echo "Inventory file already exists."
fi

# Create the Ansible playbook if not already created
if [ ! -f ansibletest.yml ]; then
    echo "Creating the Ansible playbook..."
    echo "--- 
 - name: Test Ansible Installation 
   hosts: controller 
   tasks: 
     - name: Ping controller 
       ping: " > ansibletest.yml
    echo "Ansible playbook created."
    sleep 5
else
    echo "Ansible playbook already exists."
fi

# Run the Ansible playbook
echo "Running the Ansible playbook..."
ansible-playbook -i inventory ansibletest.yml
echo "Ansible playbook execution completed."
sleep 5

# Ping the 'controller' host using Ansible
echo "Pinging the 'controller' host using Ansible..."
sudo ansible -i inventory controller -m ping
echo "Ping completed."