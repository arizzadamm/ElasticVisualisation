// Contoh penggunaan parameter Elasticsearch
import { 
  fetchAttacksSince, 
  createSearchOptions, 
  getClusterHealth, 
  getIndexStats,
  analyzeHitsResult,
  getAttackSummary
} from './elasticsearch.js';

// Contoh 1: Query dengan timeout yang lebih lama
async function fetchWithLongTimeout() {
  const options = createSearchOptions({
    timeout: '60s', // 60 detik
    size: 1000
  });
  
  const attacks = await fetchAttacksSince('2024-01-01', 1000, options);
  console.log('Attacks with long timeout:', attacks.length);
}

// Contoh 2: Query dengan field selection yang spesifik
async function fetchWithSpecificFields() {
  const options = createSearchOptions({
    _source: {
      includes: ['@timestamp', 'source.ip', 'destination.ip'] // Hanya field yang dibutuhkan
    }
  });
  
  const attacks = await fetchAttacksSince('2024-01-01', 100, options);
  console.log('Attacks with specific fields:', attacks.length);
}

// Contoh 3: Monitoring performa
async function monitorPerformance() {
  console.log('=== Monitoring Elasticsearch Performance ===');
  
  // Cek kesehatan cluster
  await getClusterHealth();
  
  // Cek statistik index
  await getIndexStats();
  
  // Test query dengan monitoring
  const startTime = Date.now();
  const attacks = await fetchAttacksSince('2024-01-01', 100);
  const endTime = Date.now();
  
  console.log(`Total execution time: ${endTime - startTime}ms`);
}

// Contoh 4: Query dengan pagination
async function fetchWithPagination() {
  const pageSize = 50;
  let from = 0;
  let allAttacks = [];
  
  while (true) {
    const options = createSearchOptions({
      size: pageSize,
      from: from
    });
    
    const attacks = await fetchAttacksSince('2024-01-01', pageSize, options);
    
    if (attacks.length === 0) break;
    
    allAttacks = allAttacks.concat(attacks);
    from += pageSize;
    
    console.log(`Fetched ${attacks.length} attacks, total: ${allAttacks.length}`);
  }
  
  return allAttacks;
}

// Contoh 5: Analisis total hits untuk alert/serangan
async function analyzeAttackHits() {
  console.log('=== Analisis Total Hits untuk Alert/Serangan ===');
  
  // Ambil data serangan
  const attacks = await fetchAttacksSince('2024-01-01', 100);
  
  // Simulasi response untuk analisis (dalam real app, ini dari response asli)
  const mockResponse = {
    hits: {
      total: { value: 150 }, // Total 150 serangan ditemukan
      hits: attacks, // Hanya 100 yang dikembalikan
      max_score: 1.0
    },
    _shards: {
      total: 5,
      successful: 5,
      failed: 0
    },
    timed_out: false
  };
  
  // Analisis hasil
  const analysis = analyzeHitsResult(mockResponse, 'serangan');
  
  console.log('📊 Analisis Hasil:');
  console.log(`Total Hits: ${analysis.totalHits}`);
  console.log(`Returned Hits: ${analysis.returnedHits}`);
  console.log(`Interpretasi: ${analysis.interpretation}`);
  console.log(`Status: ${analysis.hasResults ? 'Ada serangan' : 'Tidak ada serangan'}`);
  console.log(`Partial: ${analysis.isPartial ? 'Ya' : 'Tidak'}`);
  
  return analysis;
}

// Contoh 6: Ringkasan serangan berdasarkan total hits
async function getAttackSummaryExample() {
  console.log('=== Ringkasan Serangan ===');
  
  const summary = await getAttackSummary('2024-01-01', '2024-01-02');
  
  if (summary) {
    console.log('📈 Ringkasan Serangan:');
    console.log(`Total Serangan: ${summary.totalHits}`);
    console.log(`Interpretasi: ${summary.interpretation}`);
    
    console.log('\n🎯 Jenis Serangan:');
    summary.aggregations.attackTypes.forEach(type => {
      console.log(`- ${type.key}: ${type.doc_count} serangan`);
    });
    
    console.log('\n⏰ Distribusi Per Jam:');
    summary.aggregations.hourlyDistribution.slice(0, 5).forEach(hour => {
      const date = new Date(hour.key_as_string);
      console.log(`- ${date.toLocaleTimeString()}: ${hour.doc_count} serangan`);
    });
  }
  
  return summary;
}

// Contoh 7: Monitoring real-time dengan interpretasi total hits
async function realTimeAttackMonitoring() {
  console.log('=== Monitoring Real-time Serangan ===');
  
  const startTime = new Date();
  startTime.setHours(startTime.getHours() - 1); // 1 jam terakhir
  
  const attacks = await fetchAttacksSince(startTime.toISOString(), 50);
  
  // Simulasi response untuk monitoring
  const mockResponse = {
    hits: {
      total: { value: attacks.length },
      hits: attacks,
      max_score: 1.0
    },
    _shards: { total: 5, successful: 5, failed: 0 },
    timed_out: false
  };
  
  const analysis = analyzeHitsResult(mockResponse, 'serangan');
  
  // Alert berdasarkan total hits
  if (analysis.totalHits > 50) {
    console.log('🚨 ALERT: Tingkat serangan tinggi terdeteksi!');
    console.log('📞 Segera hubungi tim keamanan');
  } else if (analysis.totalHits > 10) {
    console.log('⚠️  WARNING: Tingkat serangan sedang terdeteksi');
    console.log('👀 Perlu monitoring lebih ketat');
  } else if (analysis.totalHits > 0) {
    console.log('🟡 INFO: Beberapa serangan terdeteksi');
    console.log('📝 Catat untuk analisis lebih lanjut');
  } else {
    console.log('✅ Tidak ada serangan terdeteksi dalam 1 jam terakhir');
  }
  
  return analysis;
}

export {
  fetchWithLongTimeout,
  fetchWithSpecificFields,
  monitorPerformance,
  fetchWithPagination,
  analyzeAttackHits,
  getAttackSummaryExample,
  realTimeAttackMonitoring
};

