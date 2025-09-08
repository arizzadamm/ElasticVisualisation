# 📦 Installation Guide

## Prerequisites

- Node.js (v16 atau lebih baru)
- npm atau yarn
- Git

## Quick Installation

### 1. Clone Repository
```bash
git clone <repository-url>
cd ElasticVisualisation
```

### 2. Install Dependencies

**Backend:**
```bash
npm install
```

**Frontend:**
```bash
cd frontend
npm install
cd ..
```

### 3. Run Application

**Windows:**
```bash
# Double-click run.bat atau jalankan di command prompt
run.bat
```

**Linux/Mac:**
```bash
# Berikan permission dan jalankan
chmod +x run.sh
./run.sh
```

## Manual Installation

### Backend Setup
```bash
# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Edit .env file sesuai konfigurasi Anda
# Jalankan backend
npm run dev
```

### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Jalankan frontend
npm start
```

## Environment Configuration

Buat file `.env` di root directory:

```env
# Elasticsearch Configuration
ELASTIC_NODE=http://localhost:9200
ELASTIC_USER=elastic
ELASTIC_PASS=changeme
ES_INDEX=attack-logs

# Server Configuration
PORT=3001
POLL_INTERVAL_MS=2000

# Demo Mode (set to 'true' to use simulated data)
DEMO_MODE=false
```

## Verification

### 1. Test Backend
```bash
curl http://localhost:3001/health
# Should return: {"ok":true}
```

### 2. Test Frontend
- Buka http://localhost:3000
- Anda harus melihat peta dunia dengan tema gelap

### 3. Test WebSocket
- Buka `test-websocket-demo.html` di browser
- Klik "Connect" untuk test koneksi

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3001
npx kill-port 3001

# Kill process on port 3000
npx kill-port 3000
```

### Dependencies Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# For frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Permission Issues (Linux/Mac)
```bash
# Give execute permission to scripts
chmod +x *.sh
chmod +x start*.sh
chmod +x run.sh
```

## Production Deployment

### Build Frontend
```bash
cd frontend
npm run build
```

### Deploy Backend
```bash
# Install PM2 for process management
npm install -g pm2

# Start with PM2
pm2 start src/server.js --name "attack-map"
```

## Docker Deployment (Optional)

### Dockerfile
```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  attack-map:
    build: .
    ports:
      - "3001:3001"
    environment:
      - ELASTIC_NODE=http://elasticsearch:9200
      - DEMO_MODE=false
```

## Support

Jika mengalami masalah:
1. Cek log di console
2. Pastikan semua dependencies terinstall
3. Test dengan mode demo terlebih dahulu
4. Cek koneksi network dan firewall
