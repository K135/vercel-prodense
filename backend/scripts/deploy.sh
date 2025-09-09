#!/bin/bash

# Deployment script for Ubuntu VPS
# This script sets up the application on a fresh Ubuntu server

set -e

echo "🚀 Starting Prodance Backend Deployment..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Docker if not present
if ! command -v docker &> /dev/null; then
    echo "🐳 Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
fi

# Install Docker Compose if not present
if ! command -v docker-compose &> /dev/null; then
    echo "🐳 Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Create application directory
echo "📁 Setting up application directory..."
sudo mkdir -p /opt/prodance
sudo chown $USER:$USER /opt/prodance
cd /opt/prodance

# Copy application files (assuming they're already uploaded)
echo "📋 Application files should be in the current directory"

# Create environment file for production
echo "⚙️ Creating production environment file..."
cat > .env.production << EOF
NODE_ENV=production
MONGODB_URI=mongodb://prodance_user:prodance_pass_2024@mongodb:27017/prodance
JWT_SECRET=$(openssl rand -base64 64)
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
PORT=5001
FRONTEND_URL=https://your-domain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOF

# Create systemd service for auto-start
echo "🔧 Creating systemd service..."
sudo tee /etc/systemd/system/prodance.service > /dev/null << EOF
[Unit]
Description=Prodance Backend Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/prodance
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

# Enable and start the service
echo "🚀 Starting services..."
sudo systemctl daemon-reload
sudo systemctl enable prodance.service
sudo systemctl start prodance.service

# Setup nginx reverse proxy (optional)
if command -v nginx &> /dev/null; then
    echo "🌐 Setting up Nginx reverse proxy..."
    sudo tee /etc/nginx/sites-available/prodance > /dev/null << EOF
server {
    listen 80;
    server_name your-domain.com;

    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

    sudo ln -sf /etc/nginx/sites-available/prodance /etc/nginx/sites-enabled/
    sudo nginx -t && sudo systemctl reload nginx
fi

# Setup firewall
echo "🔥 Configuring firewall..."
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 5001/tcp
sudo ufw --force enable

echo "✅ Deployment completed successfully!"
echo "🌐 Backend API should be available at: http://your-server-ip:5001"
echo "📊 Check status with: sudo systemctl status prodance"
echo "📋 View logs with: docker-compose logs -f"