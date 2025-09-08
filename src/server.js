import express from "express";
import http from "http";
import config from "./config.js";
import { createWSServer } from "./ws.js";
import { fetchAttacksSince, normalizeHit, getWebsiteHitsToday } from "./elasticsearch.js";
import { generateDemoAttacks } from "./demo-data.js";
import pino from "pino";

const logger = pino({ name: "attack-map-backend" });

const app = express();
app.get("/health", (req, res) => res.json({ ok: true }));

const server = http.createServer(app);
const ws = createWSServer(server);

// simpan timestamp terakhir untuk polling
let lastTimestamp = new Date(Date.now() - 60 * 1000).toISOString();
let seenIds = new Set();
let demoMode = process.env.DEMO_MODE === 'true' || false;

async function pollLoop() {
  try {
    if (demoMode) {
      // Mode demo - generate data serangan simulasi
      const demoAttacks = generateDemoAttacks(Math.floor(Math.random() * 3) + 1);
      if (demoAttacks.length > 0) {
        ws.broadcast(demoAttacks);
        logger.info({ count: demoAttacks.length }, "Broadcasted demo attacks");
      }
    } else {
      // Mode normal - ambil data dari Elasticsearch
      const hits = await fetchAttacksSince(lastTimestamp, new Date().toISOString(), 200);
      console.log('PollLoop received hits:', hits ? hits.length : 'undefined');

      if (hits && hits.length) {
        const attacks = [];
        for (const hit of hits) {
          if (!seenIds.has(hit._id)) {
            const norm = normalizeHit(hit);
            if (norm.src_geo && norm.dst_geo) attacks.push(norm);
            seenIds.add(hit._id);
          }
        }

        // update last timestamp (pakai record terakhir)
        const lastHit = hits[hits.length - 1];
        if (lastHit?._source?.["@timestamp"]) {
          lastTimestamp = lastHit._source["@timestamp"];
        }

        if (attacks.length) {
          ws.broadcast(attacks);
          logger.info({ count: attacks.length }, "Broadcasted attacks");
        }
      }

      // kirim statistik hari ini (total hits dan per negara)
      try {
        const statsToday = await getWebsiteHitsToday();
        ws.broadcastEvent('statsToday', statsToday);
      } catch (e) {
        logger.warn({ err: e }, 'Failed to fetch/broadcast today stats');
      }

      // reset cache kalau sudah terlalu banyak
      if (seenIds.size > 5000) {
        seenIds.clear();
      }
    }
  } catch (err) {
    logger.error(err, "pollLoop error");
    // Jika error dan bukan demo mode, coba switch ke demo mode
    if (!demoMode) {
      logger.info("Switching to demo mode due to Elasticsearch error");
      demoMode = true;
    }
  } finally {
    setTimeout(pollLoop, config.POLL_INTERVAL_MS);
  }
}

pollLoop();

server.listen(config.PORT, () => {
  logger.info(`Server listening on :${config.PORT}`);
});
