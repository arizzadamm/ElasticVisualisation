# 🚀 Deployment Guide - ElasticVisualisation to Ubuntu Server

## 📋 Prerequisites

### Server Requirements
- Ubuntu 20.04+ (LTS recommended)
- Node.js 18+ 
- PM2 (Process Manager)
- Nginx (Reverse Proxy)
- Elasticsearch 8.x+ (if not using external ES)

### Domain & SSL
- Domain name pointing to your server
- SSL certificate (Let's Encrypt recommended)

---

## 🔧 Step 1: Server Setup

### 1.1 Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 1.2 Install Node.js 18+
```bash
# Install NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Install Node.js
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 1.3 Install PM2
```bash
sudo npm install -g pm2
```

### 1.4 Install Nginx
```bash
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

---

## 📁 Step 2: Deploy Application

### 2.1 Clone Repository
```bash
# Create app directory
sudo mkdir -p /var/www/elasticvisualisation
sudo chown $USER:$USER /var/www/elasticvisualisation

# Clone repository
cd /var/www/elasticvisualisation
git clone <your-repo-url> .

# Or upload files via SCP/SFTP
```

### 2.2 Install Dependencies
```bash
# Backend dependencies
cd /var/www/elasticvisualisation
npm install

# Frontend dependencies
cd frontend
npm install
```

### 2.3 Environment Configuration
```bash
# Create .env file
sudo nano /var/www/elasticvisualisation/.env
```

**Add to .env:**
```env
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
```

---

## 🏗️ Step 3: Build Frontend

### 3.1 Build React App
```bash
cd /var/www/elasticvisualisation/frontend
npm run build
```

### 3.2 Test Build
```bash
# Test the build locally
npx serve -s build -l 3000
```

---

## ⚙️ Step 4: PM2 Configuration

### 4.1 Create PM2 Ecosystem File
```bash
sudo nano /var/www/elasticvisualisation/ecosystem.config.js
```

**Add ecosystem.config.js:**
```javascript
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
```

### 4.2 Start Application with PM2
```bash
cd /var/www/elasticvisualisation
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## 🌐 Step 5: Nginx Configuration

### 5.1 Create Nginx Config
```bash
sudo nano /etc/nginx/sites-available/elasticvisualisation
```

**Add Nginx configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;
    
    # SSL Configuration (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
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
```

### 5.2 Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/elasticvisualisation /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔒 Step 6: SSL Certificate (Let's Encrypt)

### 6.1 Install Certbot
```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 6.2 Get SSL Certificate
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### 6.3 Auto-renewal
```bash
sudo crontab -e
# Add this line:
0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 🔧 Step 7: Firewall Configuration

### 7.1 Configure UFW
```bash
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw allow 3001  # Only if needed for direct access
sudo ufw enable
```

---

## 📊 Step 8: Monitoring & Logs

### 8.1 PM2 Monitoring
```bash
# View logs
pm2 logs elasticvisualisation-backend

# Monitor in real-time
pm2 monit

# Restart if needed
pm2 restart elasticvisualisation-backend
```

### 8.2 Nginx Logs
```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

---

## 🚀 Step 9: Production Optimizations

### 9.1 Frontend Optimizations
```bash
# In frontend/package.json, add:
"homepage": "https://your-domain.com"

# Build with optimizations
cd frontend
npm run build
```

### 9.2 Backend Optimizations
```bash
# Install production dependencies only
cd /var/www/elasticvisualisation
npm install --production
```

### 9.3 System Optimizations
```bash
# Increase file limits
echo "* soft nofile 65536" | sudo tee -a /etc/security/limits.conf
echo "* hard nofile 65536" | sudo tee -a /etc/security/limits.conf

# Optimize Node.js
export NODE_OPTIONS="--max-old-space-size=2048"
```

---

## 🔄 Step 10: Deployment Script

### 10.1 Create Deploy Script
```bash
sudo nano /var/www/elasticvisualisation/deploy.sh
```

**Add deploy.sh:**
```bash
#!/bin/bash

echo "🚀 Starting deployment..."

# Pull latest changes
git pull origin main

# Install dependencies
npm install
cd frontend && npm install && npm run build && cd ..

# Restart PM2
pm2 restart elasticvisualisation-backend

# Reload Nginx
sudo nginx -t && sudo systemctl reload nginx

echo "✅ Deployment completed!"
```

### 10.2 Make Script Executable
```bash
chmod +x /var/www/elasticvisualisation/deploy.sh
```

---

## 🧪 Step 11: Testing

### 11.1 Test Backend
```bash
curl https://your-domain.com/health
```

### 11.2 Test Frontend
```bash
curl https://your-domain.com
```

### 11.3 Test WebSocket
```bash
# Install wscat for testing
npm install -g wscat

# Test WebSocket connection
wscat -c wss://your-domain.com/ws
```

---

## 📝 Step 12: Maintenance

### 12.1 Regular Updates
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Update Node.js (if needed)
sudo npm install -g n
sudo n stable
```

### 12.2 Backup Strategy
```bash
# Create backup script
sudo nano /var/www/elasticvisualisation/backup.sh
```

### 12.3 Health Monitoring
```bash
# Create health check script
sudo nano /var/www/elasticvisualisation/health-check.sh
```

---

## 🆘 Troubleshooting

### Common Issues:

1. **Port 3001 not accessible**
   - Check firewall: `sudo ufw status`
   - Check PM2: `pm2 status`

2. **Nginx 502 Bad Gateway**
   - Check backend: `pm2 logs elasticvisualisation-backend`
   - Check port: `netstat -tlnp | grep 3001`

3. **SSL Certificate Issues**
   - Renew certificate: `sudo certbot renew`
   - Check certificate: `sudo certbot certificates`

4. **Memory Issues**
   - Monitor memory: `pm2 monit`
   - Restart if needed: `pm2 restart all`

---

## 📞 Support

For issues or questions:
- Check logs: `pm2 logs`
- Check Nginx: `sudo nginx -t`
- Check system: `htop` or `top`

---

## ✅ Final Checklist

- [ ] Server updated and secured
- [ ] Node.js and PM2 installed
- [ ] Application deployed and running
- [ ] Nginx configured with SSL
- [ ] Domain pointing to server
- [ ] Firewall configured
- [ ] Monitoring set up
- [ ] Backup strategy in place
- [ ] Health checks working
- [ ] Performance optimized

**🎉 Your ElasticVisualisation is now live and production-ready!**
