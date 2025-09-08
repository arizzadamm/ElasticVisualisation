# 🎯 Features Overview

## 🌍 Norse Attack Map - Real-time Cyber Attack Visualization

### Core Features

#### 1. **Interactive World Map**
- Peta dunia dengan tema gelap yang menyerupai Norse Attack Map
- Visualisasi negara-negara dengan warna biru gelap
- Background gradient hitam-biru untuk efek dramatis
- Responsive design untuk berbagai ukuran layar

#### 2. **Real-time Attack Visualization**
- Garis merah animasi yang menunjukkan jalur serangan
- Animasi garis digambar secara bertahap dari sumber ke target
- Efek glow dan drop-shadow untuk garis serangan
- Titik merah yang menandai lokasi sumber dan target
- Auto-fade out setelah 5 detik untuk performa optimal

#### 3. **Live Statistics Panel**
- Panel statistik real-time di kanan atas
- Status koneksi WebSocket dengan indikator visual
- Total serangan dan serangan per menit
- Top 5 negara sumber serangan
- Top 5 negara target serangan
- Jenis serangan yang terdeteksi

#### 4. **WebSocket Communication**
- Koneksi real-time dengan backend
- Auto-reconnect jika koneksi terputus
- Error handling dan status monitoring
- Efficient data streaming

#### 5. **Demo Mode**
- Mode simulasi tanpa perlu Elasticsearch
- Data serangan yang di-generate secara random
- Perfect untuk testing dan demo
- Mudah diaktifkan dengan environment variable

### Technical Features

#### Backend
- **Express.js** server dengan WebSocket support
- **Elasticsearch** integration untuk data real
- **Real-time polling** setiap 2 detik
- **Data normalization** dan filtering
- **Error handling** dan fallback ke demo mode
- **Logging** dengan Pino

#### Frontend
- **React** dengan TypeScript
- **D3.js** untuk visualisasi peta
- **Styled Components** untuk styling
- **Custom hooks** untuk WebSocket management
- **Responsive design** dengan CSS Grid/Flexbox
- **Performance optimization** dengan data limiting

### UI/UX Features

#### Visual Design
- **Dark theme** yang menyerupai Norse Attack Map
- **Gradient backgrounds** untuk efek depth
- **Semi-transparent panels** dengan blur effect
- **Color scheme**: Hitam, biru gelap, merah untuk serangan
- **Typography**: Modern sans-serif fonts

#### Animations
- **Smooth line drawing** animation
- **Pulse effects** untuk status indicators
- **Fade in/out** transitions
- **Hover effects** pada interactive elements

#### Responsive Design
- **Mobile-friendly** layout
- **Adaptive sizing** untuk berbagai screen sizes
- **Touch-friendly** controls
- **Optimized performance** untuk mobile devices

### Data Features

#### Attack Data Structure
```typescript
interface Attack {
  id: string;
  timestamp: string;
  src_ip: string;
  dst_ip: string;
  src_geo: {
    lat: number;
    lon: number;
    country?: string;
    city?: string;
  };
  dst_geo: {
    lat: number;
    lon: number;
    country?: string;
    city?: string;
  };
  type: string;
}
```

#### Statistics Calculation
- **Real-time aggregation** dari data serangan
- **Country-based grouping** untuk top countries
- **Attack type analysis** untuk threat classification
- **Time-based metrics** untuk rate calculation

### Performance Features

#### Optimization
- **Data limiting**: Maksimal 1000 serangan di memory
- **Animation cleanup**: Auto-remove setelah 5 detik
- **Efficient rendering**: Hanya render serangan baru
- **Memory management**: Clear old data secara berkala

#### Scalability
- **Configurable polling interval**
- **Adjustable data limits**
- **Modular architecture** untuk easy extension
- **Environment-based configuration**

### Security Features

#### Data Protection
- **No sensitive data** exposure di frontend
- **Secure WebSocket** connections
- **Input validation** dan sanitization
- **Error handling** tanpa information leakage

#### Network Security
- **CORS configuration** untuk cross-origin requests
- **Rate limiting** untuk prevent abuse
- **Connection monitoring** untuk detect anomalies

### Monitoring Features

#### Health Checks
- **Backend health endpoint** (`/health`)
- **WebSocket connection status**
- **Elasticsearch connectivity** monitoring
- **Performance metrics** logging

#### Debugging
- **Console logging** untuk development
- **WebSocket test page** untuk debugging
- **Error reporting** dan handling
- **Performance profiling** tools

### Deployment Features

#### Easy Setup
- **One-click scripts** untuk Windows/Linux/Mac
- **Docker support** untuk containerized deployment
- **Environment configuration** via .env files
- **Automated dependency** installation

#### Production Ready
- **PM2 support** untuk process management
- **Build optimization** untuk frontend
- **Static file serving** untuk production
- **Health monitoring** endpoints

## 🚀 Getting Started

### Quick Start (Demo Mode)
```bash
# Windows
run.bat

# Linux/Mac
./run.sh
```

### Production Setup
```bash
# Install dependencies
npm install
cd frontend && npm install && cd ..

# Configure environment
cp env.example .env
# Edit .env file

# Start application
npm run dev:full
```

## 📊 Metrics & Analytics

### Real-time Metrics
- Total attacks detected
- Attacks per minute rate
- Geographic distribution
- Attack type classification
- Source/target country analysis

### Performance Metrics
- WebSocket connection stability
- Data processing latency
- Memory usage optimization
- Rendering performance

## 🔧 Customization

### Styling
- Modify `styled-components` di frontend
- Adjust color scheme di theme files
- Customize animations dan transitions

### Data Sources
- Connect ke Elasticsearch index yang berbeda
- Modify data structure sesuai kebutuhan
- Add custom attack types

### Visualization
- Adjust map projection dan styling
- Modify attack line animations
- Add custom markers atau overlays

---

**Norse Attack Map** memberikan pengalaman visualisasi serangan cyber yang immersive dan real-time, dengan performa optimal dan kemudahan deployment! 🎉
