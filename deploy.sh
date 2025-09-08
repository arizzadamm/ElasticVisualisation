#!/bin/bash

# 🚀 Quick Deployment Script for ElasticVisualisation
# Run this script on your Ubuntu server

set -e  # Exit on any error

echo "🚀 Starting ElasticVisualisation deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    print_error "Please don't run this script as root. Run as a regular user with sudo privileges."
    exit 1
fi

# Check if Ubuntu
if ! command -v apt &> /dev/null; then
    print_error "This script is designed for Ubuntu/Debian systems."
    exit 1
fi

print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

print_status "Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

print_status "Installing PM2..."
sudo npm install -g pm2

print_status "Installing Nginx..."
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx

print_status "Installing Certbot for SSL..."
sudo apt install certbot python3-certbot-nginx -y

print_status "Creating application directory..."
sudo mkdir -p /var/www/elasticvisualisation
sudo chown $USER:$USER /var/www/elasticvisualisation

print_status "Setting up firewall..."
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

print_status "Creating PM2 ecosystem file..."
cat > /var/www/elasticvisualisation/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'elasticvisualisation-backend',
      script: 'src/server.js',
      cwd: '/var/www/elasticvisualisation',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      error_file: '/var/log/pm2/elasticvisualisation-backend-error.log',
      out_file: '/var/log/pm2/elasticvisualisation-backend-out.log',
      log_file: '/var/log/pm2/elasticvisualisation-backend.log',
      time: true
    }
  ]
};
EOF

print_status "Creating Nginx configuration template..."
cat > /var/www/elasticvisualisation/nginx-template.conf << 'EOF'
server {
    listen 80;
    server_name YOUR_DOMAIN_HERE;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name YOUR_DOMAIN_HERE;
    
    # SSL Configuration (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/YOUR_DOMAIN_HERE/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/YOUR_DOMAIN_HERE/privkey.pem;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Frontend (React App)
    location / {
        root /var/www/elasticvisualisation/frontend/build;
        index index.html;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Backend API (WebSocket & REST)
    location /ws {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Health check
    location /health {
        proxy_pass http://localhost:3001/health;
        proxy_set_header Host $host;
    }
}
EOF

print_status "Creating deployment script..."
cat > /var/www/elasticvisualisation/deploy.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting deployment..."

# Pull latest changes (if using git)
# git pull origin main

# Install dependencies
npm install
cd frontend && npm install && npm run build && cd ..

# Restart PM2
pm2 restart elasticvisualisation-backend

# Reload Nginx
sudo nginx -t && sudo systemctl reload nginx

echo "✅ Deployment completed!"
EOF

chmod +x /var/www/elasticvisualisation/deploy.sh

print_status "Creating environment template..."
cat > /var/www/elasticvisualisation/.env.template << 'EOF'
# Server Configuration
PORT=3001
NODE_ENV=production

# Elasticsearch Configuration
ELASTIC_NODE=https://your-elasticsearch-server:9200
ES_INDEX=your-index-name
ELASTIC_USER=your-username
ELASTIC_PASS=your-password

# Polling Configuration
POLL_INTERVAL_MS=5000
EOF

print_status "Setting up PM2 startup..."
pm2 startup
pm2 save

print_status "Creating log directories..."
sudo mkdir -p /var/log/pm2
sudo chown $USER:$USER /var/log/pm2

echo ""
echo "🎉 Basic server setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Copy your application files to /var/www/elasticvisualisation/"
echo "2. Copy .env.template to .env and configure your Elasticsearch settings"
echo "3. Run: cd /var/www/elasticvisualisation && npm install"
echo "4. Run: cd frontend && npm install && npm run build"
echo "5. Configure Nginx with your domain:"
echo "   - Copy nginx-template.conf to /etc/nginx/sites-available/elasticvisualisation"
echo "   - Replace YOUR_DOMAIN_HERE with your actual domain"
echo "   - Run: sudo ln -s /etc/nginx/sites-available/elasticvisualisation /etc/nginx/sites-enabled/"
echo "   - Run: sudo nginx -t && sudo systemctl reload nginx"
echo "6. Get SSL certificate: sudo certbot --nginx -d your-domain.com"
echo "7. Start the application: pm2 start ecosystem.config.js"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT_GUIDE.md"
echo ""
print_status "Setup completed! 🚀"

