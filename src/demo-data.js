// Demo data untuk testing jika tidak ada data di Elasticsearch
export const generateDemoAttacks = (count = 10) => {
  const countries = [
    { name: 'United States', lat: 39.8283, lon: -98.5795 },
    { name: 'China', lat: 35.8617, lon: 104.1954 },
    { name: 'Russia', lat: 61.5240, lon: 105.3188 },
    { name: 'Germany', lat: 51.1657, lon: 10.4515 },
    { name: 'United Kingdom', lat: 55.3781, lon: -3.4360 },
    { name: 'Japan', lat: 36.2048, lon: 138.2529 },
    { name: 'India', lat: 20.5937, lon: 78.9629 },
    { name: 'Brazil', lat: -14.2350, lon: -51.9253 },
    { name: 'Australia', lat: -25.2744, lon: 133.7751 },
    { name: 'Canada', lat: 56.1304, lon: -106.3468 },
    { name: 'France', lat: 46.2276, lon: 2.2137 },
    { name: 'South Korea', lat: 35.9078, lon: 127.7669 },
    { name: 'Italy', lat: 41.8719, lon: 12.5674 },
    { name: 'Spain', lat: 40.4637, lon: -3.7492 },
    { name: 'Netherlands', lat: 52.1326, lon: 5.2913 }
  ];

  const attackTypes = ['malware', 'phishing', 'ddos', 'brute_force', 'sql_injection', 'xss'];

  const attacks = [];
  
  for (let i = 0; i < count; i++) {
    const srcCountry = countries[Math.floor(Math.random() * countries.length)];
    const dstCountry = countries[Math.floor(Math.random() * countries.length)];
    
    // Tambahkan sedikit variasi pada koordinat
    const srcLat = srcCountry.lat + (Math.random() - 0.5) * 10;
    const srcLon = srcCountry.lon + (Math.random() - 0.5) * 10;
    const dstLat = dstCountry.lat + (Math.random() - 0.5) * 10;
    const dstLon = dstCountry.lon + (Math.random() - 0.5) * 10;

    attacks.push({
      id: `demo_${Date.now()}_${i}`,
      timestamp: new Date(Date.now() - Math.random() * 60000).toISOString(),
      src_ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      dst_ip: `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      src_geo: {
        lat: srcLat,
        lon: srcLon,
        country: srcCountry.name,
        city: `${srcCountry.name} City`
      },
      dst_geo: {
        lat: dstLat,
        lon: dstLon,
        country: dstCountry.name,
        city: `${dstCountry.name} City`
      },
      type: attackTypes[Math.floor(Math.random() * attackTypes.length)]
    });
  }

  return attacks;
};

// Fungsi untuk mengirim demo data melalui WebSocket
export const startDemoMode = (ws) => {
  console.log('🎭 Starting demo mode with simulated attacks...');
  
  const sendDemoAttack = () => {
    const attacks = generateDemoAttacks(Math.floor(Math.random() * 3) + 1);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(attacks));
    }
  };

  // Kirim demo attack setiap 2-5 detik
  const interval = setInterval(() => {
    sendDemoAttack();
  }, Math.random() * 3000 + 2000);

  return () => clearInterval(interval);
};
