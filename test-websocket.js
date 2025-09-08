import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:3001');

ws.on('open', function open() {
  console.log('✅ Connected to WebSocket server');
  
  // Send a test message
  ws.send(JSON.stringify({ type: 'test', message: 'Hello from client!' }));
});

ws.on('message', function message(data) {
  console.log('📨 Received:', data.toString());
  
  try {
    const parsed = JSON.parse(data.toString());
    console.log('📊 Parsed data:', parsed);
    
    if (parsed.length > 0) {
      console.log('🎯 Attack data received:', parsed.length, 'attacks');
      parsed.forEach((attack, index) => {
        console.log(`  Attack ${index + 1}:`, {
          id: attack.id,
          src_ip: attack.src_ip,
          dst_ip: attack.dst_ip,
          timestamp: attack.timestamp
        });
      });
    }
  } catch (e) {
    console.log('❌ Failed to parse message:', e.message);
  }
});

ws.on('error', function error(err) {
  console.error('❌ WebSocket error:', err.message);
});

ws.on('close', function close() {
  console.log('🔌 Disconnected from WebSocket server');
});

// Keep connection alive for 30 seconds
setTimeout(() => {
  console.log('⏰ Closing connection after 30 seconds...');
  ws.close();
}, 30000);
