# 🚀 Quick Start Guide

## Langkah Cepat untuk Menjalankan Norse Attack Map

### 1. Mode Demo (Paling Mudah)
```bash
# Windows
start-demo.bat

# Linux/Mac
chmod +x start-demo.sh
./start-demo.sh
```

### 2. Buka Browser
- Frontend: http://localhost:3000
- Backend: http://localhost:3001/health

### 3. Test WebSocket
- Buka file `test-websocket-demo.html` di browser
- Klik "Connect" untuk test koneksi

## 🎯 Yang Akan Anda Lihat

1. **Peta Dunia Gelap** dengan negara-negara berwarna biru gelap
2. **Garis Merah Animasi** yang menunjukkan serangan cyber
3. **Panel Statistik** di kanan atas dengan informasi real-time
4. **Titik Merah** yang menandai sumber dan target serangan

## 🔧 Jika Ada Masalah

### Backend tidak start
```bash
# Install dependencies
npm install

# Jalankan manual
npm run dev:demo
```

### Frontend tidak start
```bash
cd frontend
npm install
npm start
```

### WebSocket tidak connect
- Pastikan backend berjalan di port 3001
- Buka `test-websocket-demo.html` untuk test
- Cek console browser untuk error

## 📱 Fitur Utama

- ✅ **Real-time Attack Visualization**
- ✅ **Interactive World Map**
- ✅ **Live Statistics Panel**
- ✅ **Dark Theme UI**
- ✅ **WebSocket Communication**
- ✅ **Demo Mode (No Elasticsearch needed)**

## 🎨 Tampilan

- **Background**: Gradient hitam-biru gelap
- **Peta**: Negara-negara berwarna biru gelap
- **Serangan**: Garis merah dengan efek glow
- **Animasi**: Garis digambar secara bertahap
- **Panel**: Semi-transparan dengan blur effect

## 🚀 Next Steps

1. **Setup Elasticsearch** untuk data real
2. **Customize styling** sesuai kebutuhan
3. **Add more attack types** dan visualisasi
4. **Deploy** ke production server

---

**Selamat! Aplikasi Norse Attack Map Anda sudah siap digunakan! 🎉**
