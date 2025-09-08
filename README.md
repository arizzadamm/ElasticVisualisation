# Norse Attack Map - Real-time Cyber Attack Visualization

Aplikasi visualisasi serangan cyber real-time yang menampilkan data dari Elasticsearch dengan tampilan peta dunia interaktif seperti Norse Attack Map.

## 🚀 Fitur

- **Peta Dunia Interaktif**: Visualisasi serangan cyber dengan animasi garis merah
- **Real-time Updates**: Data serangan terbaru melalui WebSocket
- **Statistik Live**: Panel statistik yang menampilkan informasi serangan real-time
- **Tema Dark**: UI dengan tema gelap yang menyerupai Norse Attack Map
- **Responsive Design**: Tampilan yang responsif untuk berbagai ukuran layar

## 🛠️ Teknologi

### Backend
- Node.js dengan Express
- Elasticsearch untuk data serangan
- WebSocket untuk real-time communication
- Pino untuk logging

### Frontend
- React dengan TypeScript
- D3.js untuk visualisasi peta
- Styled Components untuk styling
- WebSocket client untuk real-time data

## 📋 Prerequisites

- Node.js (v16 atau lebih baru)
- Elasticsearch server
- Data serangan cyber di Elasticsearch

## 🔧 Instalasi

1. **Clone repository**
```bash
git clone <repository-url>
cd ElasticVisualisation
```

2. **Install dependencies backend**
```bash
npm install
```

3. **Install dependencies frontend**
```bash
cd frontend
npm install
cd ..
```

4. **Setup environment variables**
Buat file `.env` di root directory:
```env
ELASTIC_NODE=http://localhost:9200
ELASTIC_USER=your_username
ELASTIC_PASS=your_password
ES_INDEX=your_attack_index
PORT=3001
POLL_INTERVAL_MS=2000
```

## 🚀 Menjalankan Aplikasi

### Opsi 1: Mode Demo (Tanpa Elasticsearch)
Untuk testing tanpa setup Elasticsearch:
```bash
# Windows
start-demo.bat

# Linux/Mac
chmod +x start-demo.sh
./start-demo.sh

# Atau manual
npm run dev:demo:full
```

### Opsi 2: Mode Normal (Dengan Elasticsearch)
```bash
# Windows
start.bat

# Linux/Mac
chmod +x start.sh
./start.sh

# Atau manual
npm run dev:full
```

### Opsi 3: Menjalankan Secara Terpisah

**Backend:**
```bash
npm run dev
```

**Frontend (terminal baru):**
```bash
npm run frontend
```

## 📊 Struktur Data

Aplikasi mengharapkan data serangan dalam format berikut di Elasticsearch:

```json
{
  "@timestamp": "2024-01-01T12:00:00Z",
  "source": {
    "ip": "192.168.1.1",
    "geo": {
      "location": {
        "lat": 40.7128,
        "lon": -74.0060
      },
      "country_name": "United States",
      "city_name": "New York"
    }
  },
  "destination": {
    "ip": "10.0.0.1",
    "geo": {
      "location": {
        "lat": 51.5074,
        "lon": -0.1278
      },
      "country_name": "United Kingdom",
      "city_name": "London"
    }
  },
  "event": {
    "type": "attack"
  }
}
```

## 🎯 Cara Kerja

1. **Backend** mempolling data dari Elasticsearch setiap 2 detik
2. **WebSocket** mengirim data serangan baru ke frontend
3. **Frontend** menampilkan serangan sebagai garis animasi di peta dunia
4. **Statistik** dihitung real-time dan ditampilkan di panel kanan

## 🎨 Visualisasi

- **Garis Merah**: Menunjukkan jalur serangan dari sumber ke target
- **Animasi**: Garis digambar secara bertahap dengan efek fade out
- **Titik Merah**: Menandai lokasi sumber dan target serangan
- **Peta Dunia**: Background gelap dengan negara-negara berwarna biru gelap

## 📱 Panel Statistik

Panel statistik menampilkan:
- Status koneksi WebSocket
- Total serangan
- Serangan per menit
- Negara sumber teratas
- Negara target teratas
- Jenis serangan

## 🔧 Konfigurasi

### Backend Configuration (`src/config.js`)
- `ELASTIC_NODE`: URL Elasticsearch server
- `ELASTIC_USER`: Username Elasticsearch
- `ELASTIC_PASS`: Password Elasticsearch
- `ES_INDEX`: Nama index yang berisi data serangan
- `PORT`: Port untuk server backend
- `POLL_INTERVAL_MS`: Interval polling data (ms)

### Frontend Configuration
- WebSocket URL: `ws://localhost:3001` (default)
- Map dimensions: 1200x600 (dapat disesuaikan)

## 🧪 Testing

### Test WebSocket Connection
Buka file `test-websocket-demo.html` di browser untuk test koneksi WebSocket:
```bash
# Jalankan backend dalam mode demo
npm run dev:demo

# Buka test-websocket-demo.html di browser
```

### Test Frontend
```bash
# Jalankan frontend
npm run frontend

# Buka http://localhost:3000
```

## 🐛 Troubleshooting

### Backend tidak bisa connect ke Elasticsearch
- Pastikan Elasticsearch server berjalan
- Periksa credentials di file `.env`
- Pastikan index yang digunakan ada
- **Solusi**: Gunakan mode demo dengan `npm run dev:demo`

### Frontend tidak menerima data
- Pastikan backend berjalan di port 3001
- Periksa koneksi WebSocket di browser developer tools
- Pastikan ada data serangan di Elasticsearch
- **Solusi**: Test dengan mode demo terlebih dahulu

### Peta tidak muncul
- Periksa koneksi internet untuk loading data GeoJSON
- Pastikan D3.js terinstall dengan benar
- Cek console browser untuk error

### Mode Demo tidak berfungsi
- Pastikan backend berjalan dengan `DEMO_MODE=true`
- Periksa console backend untuk log demo attacks
- Test WebSocket dengan file `test-websocket-demo.html`

### TypeScript Error dengan D3.js
- Error: `GeoPath<any, GeoPermissibleObjects>` tidak assignable
- **Solusi**: Lihat file `frontend/TROUBLESHOOTING.md`
- Atau gunakan komponen `AttackMapSimple.tsx`
- Atau ubah `tsconfig.json` dengan `"strict": false`

### Frontend tidak compile
- Pastikan semua dependencies terinstall: `cd frontend && npm install`
- Cek versi Node.js (minimal v16)
- Gunakan `--legacy-peer-deps` untuk install dependencies

## 📈 Performance

- Backend memproses maksimal 200 serangan per polling
- Frontend menampilkan maksimal 1000 serangan terbaru
- Animasi serangan otomatis dihapus setelah 5 detik
- WebSocket auto-reconnect setiap 3 detik jika terputus

## 🤝 Contributing

1. Fork repository
2. Buat feature branch
3. Commit perubahan
4. Push ke branch
5. Buat Pull Request

## 📄 License

MIT License - lihat file LICENSE untuk detail.

## 🙏 Acknowledgments

- Terinspirasi oleh Norse Attack Map
- Menggunakan D3.js untuk visualisasi
- Data GeoJSON dari Natural Earth
