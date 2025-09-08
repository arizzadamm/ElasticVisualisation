import { Client } from "@elastic/elasticsearch";
import config from "./config.js";
import { parseGeo } from "./utils.js";

const client = new Client({
  node: config.ELASTIC_NODE,
  auth: { 
    username: config.ELASTIC_USER,
    password: config.ELASTIC_PASS
  },
  tls: {
    rejectUnauthorized: false // Allow self-signed certificates
  }
});

// Fungsi untuk mengatur parameter query secara dinamis
export function createSearchOptions(options = {}) {
  const defaults = {
    timeout: '30s',
    size: 100,
    sort: [{ "@timestamp": "asc" }],
    _source: {
      includes: [
        "@timestamp",
        "source.ip",
        "source.geo.location", 
        "destination.ip",
        "destination.geo.location",
        "event.type"
      ]
    }
  };
  
  return {
    ...defaults,
    ...options
  };
}

// ambil data serangan sejak timestamp tertentu
export async function fetchAttacksSince(since,until, size = 100, customOptions = {}) {
  try {
    const searchOptions = createSearchOptions({
      size,
      ...customOptions
    });
    
    // Convert ISO strings to epoch_millis if needed
    const sinceEpoch = typeof since === 'string' ? new Date(since).getTime() : since;
    const untilEpoch = typeof until === 'string' ? new Date(until).getTime() : until;
    
    const response = await client.search({
      index: config.ES_INDEX,
      ...searchOptions,
      body: {
        query: {
          range: {
            "@timestamp": {
              gte: sinceEpoch,
              lte: untilEpoch
            },
          },
        },
        _source: searchOptions._source
      },
    });

    // Log informasi performa query
    console.log('📊 Query Performance:');
    console.log(`⏱️  Took: ${response.took}ms`);
    console.log(`🔄 Timed out: ${response.timed_out}`);
    console.log(`📦 Shards: ${response._shards?.successful}/${response._shards?.total} successful`);
    
    // Analisis total hits untuk alert/serangan
    const totalHits = response.hits?.total?.value || response.hits?.total || 0;
    const returnedHits = response.hits?.hits?.length || 0;
    
    console.log(`📄 Total hits: ${totalHits}`);
    console.log(`📋 Returned hits: ${returnedHits}`);
    
    // Interpretasi hasil untuk alert/serangan
    if (totalHits > 0) {
      console.log(`🚨 Ditemukan ${totalHits} alert/serangan yang sesuai kriteria`);
      if (totalHits > returnedHits) {
        console.log(`⚠️  Hanya menampilkan ${returnedHits} dari ${totalHits} total alert/serangan`);
        console.log(`💡 Gunakan pagination untuk melihat semua data`);
      }
    } else {
      console.log(`✅ Tidak ada alert/serangan yang ditemukan dalam rentang waktu tersebut`);
    }
    
    // Check for timeout errors
    if (response.timed_out) {
      console.warn('⚠️ Elasticsearch query timed out');
      console.log('Timed out shards:', response._shards);
    }
    
    // Check for failed shards
    if (response._shards?.failed > 0) {
      console.warn(`⚠️ ${response._shards.failed} shards failed`);
    }
    
    const hits = response.hits?.hits || response.body?.hits?.hits || [];
    console.log(`✅ Found ${hits.length} hits`);
    return hits;
  } catch (error) {
    console.error('Elasticsearch search error:', error.message);
    return [];
  }
}

// normalisasi 1 record ES ke bentuk serangan
export function normalizeHit(hit) {
  const srcGeo = parseGeo(hit._source?.source?.geo?.location);
  const dstGeo = parseGeo(hit._source?.destination?.geo?.location);

  return {
    id: hit._id,
    timestamp: hit._source?.["@timestamp"],
    src_ip: hit._source?.source?.ip,
    dst_ip: hit._source?.destination?.ip,
    src_geo: srcGeo,
    dst_geo: dstGeo,
    type: hit._source?.event?.type || "attack",
  };
}

// Fungsi untuk monitoring performa cluster
export async function getClusterHealth() {
  try {
    const health = await client.cluster.health();
    console.log('🏥 Cluster Health:', {
      status: health.status,
      number_of_nodes: health.number_of_nodes,
      active_shards: health.active_shards,
      relocating_shards: health.relocating_shards,
      initializing_shards: health.initializing_shards,
      unassigned_shards: health.unassigned_shards
    });
    return health;
  } catch (error) {
    console.error('Error getting cluster health:', error.message);
    return null;
  }
}

// Fungsi untuk mendapatkan statistik index
export async function getIndexStats() {
  try {
    const stats = await client.indices.stats({
      index: config.ES_INDEX
    });
    
    const indexStats = stats.indices[config.ES_INDEX];
    console.log('📈 Index Stats:', {
      total_docs: indexStats.total.docs.count,
      total_size: indexStats.total.store.size_in_bytes,
      shards: Object.keys(indexStats.shards).length
    });
    
    return indexStats;
  } catch (error) {
    console.error('Error getting index stats:', error.message);
    return null;
  }
}

// Fungsi untuk menganalisis total hits dan memberikan interpretasi
export function analyzeHitsResult(response, queryType = 'serangan') {
  const totalHits = response.hits?.total?.value || response.hits?.total || 0;
  const returnedHits = response.hits?.hits?.length || 0;
  const maxScore = response.hits?.max_score || 0;
  
  const analysis = {
    totalHits,
    returnedHits,
    maxScore,
    hasResults: totalHits > 0,
    isPartial: totalHits > returnedHits,
    success: response._shards?.successful === response._shards?.total,
    timedOut: response.timed_out
  };
  
  // Interpretasi berdasarkan jenis query
  let interpretation = '';
  if (queryType === 'serangan' || queryType === 'alert') {
    if (totalHits === 0) {
      interpretation = '✅ Tidak ada serangan/alert yang terdeteksi dalam rentang waktu tersebut';
    } else if (totalHits <= 10) {
      interpretation = `🟡 Ditemukan ${totalHits} serangan/alert - tingkat ancaman rendah`;
    } else if (totalHits <= 100) {
      interpretation = `🟠 Ditemukan ${totalHits} serangan/alert - tingkat ancaman sedang`;
    } else {
      interpretation = `🔴 Ditemukan ${totalHits} serangan/alert - tingkat ancaman tinggi!`;
    }
  } else {
    interpretation = `📊 Ditemukan ${totalHits} dokumen yang sesuai kriteria`;
  }
  
  // Tambahan informasi jika ada masalah
  if (analysis.isPartial) {
    interpretation += `\n⚠️  Hanya menampilkan ${returnedHits} dari ${totalHits} total hasil`;
  }
  
  if (analysis.timedOut) {
    interpretation += `\n⏰ Query timeout - hasil mungkin tidak lengkap`;
  }
  
  if (!analysis.success) {
    interpretation += `\n❌ Beberapa shard gagal - hasil mungkin tidak akurat`;
  }
  
  return {
    ...analysis,
    interpretation
  };
}

// Fungsi untuk mendapatkan ringkasan serangan berdasarkan total hits
export async function getAttackSummary(since, until = null) {
  try {
    // Convert ISO strings to epoch_millis if needed
    const sinceEpoch = typeof since === 'string' ? new Date(since).getTime() : since;
    const untilEpoch = until ? (typeof until === 'string' ? new Date(until).getTime() : until) : null;
    
    const query = {
      range: {
        "@timestamp": {
          gte: sinceEpoch,
          ...(untilEpoch && { lte: untilEpoch })
        }
      }
    };
    
    const response = await client.search({
      index: config.ES_INDEX,
      size: 0, // Hanya hitung total, tidak ambil data
      body: {
        query,
        aggs: {
          attack_types: {
            terms: {
              //field: "event.type.keyword",
              field: "event.type.keyword",
              size: 10
            }
          },
          hourly_attacks: {
            date_histogram: {
              field: "@timestamp",
              calendar_interval: "hour"
            }
          }
        }
      }
    });
    
    const analysis = analyzeHitsResult(response, 'serangan');
    
    return {
      ...analysis,
      aggregations: {
        attackTypes: response.aggregations?.attack_types?.buckets || [],
        hourlyDistribution: response.aggregations?.hourly_attacks?.buckets || []
      }
    };
  } catch (error) {
    console.error('Error getting attack summary:', error.message);
    return null;
  }
}

// Statistik total hit website hari ini (00:00-23:59) + per negara sumber
export async function getWebsiteHitsToday() {
  try {
    const now = new Date();
    const startOfDay = new Date(now); 
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now); 
    endOfDay.setHours(23, 59, 59, 999);
    const since = startOfDay.getTime(); // epoch_millis format
    const until = endOfDay.getTime();   // epoch_millis format
    
    //const since = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

    const response = await client.search({
      index: config.ES_INDEX,
      size: 0,
      body: {
        query: {
          range: {
            "@timestamp": { 
              gte: since, 
              lte: until }
          }
        },
        aggs: {
          by_country: {
            terms: {
              // ECS: source.geo.country_name OR source.geo.country_iso_code
              // Prefer name; fallback handled in UI if missing
              field: "source.geo.country_name",
              size: 20,
              missing: "Unknown"
            }
          }
        }
      }
    });

    const total = response.hits?.total?.value || response.hits?.total || 0;
    const buckets = response.aggregations?.by_country?.buckets || [];
    const countries = buckets.map(b => ({ country: b.key, count: b.doc_count }));

    return { total, countries };
  } catch (error) {
    console.error('Error getting today website hits:', error.message);
    return { total: 0, countries: [] };
  }
}