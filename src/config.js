import dotenv from 'dotenv';

dotenv.config({path: '.env'});

export default {
  PORT: process.env.PORT|| 3001,
  ELASTIC_NODE: process.env.ELASTIC_NODE,
  ES_INDEX: process.env.ES_INDEX,
  POLL_INTERVAL_MS: parseInt(process.env.POLL_INTERVAL_MS || "5000"),

  // API Key mode
  ELASTIC_USER: process.env.ELASTIC_USER,
  ELASTIC_PASS: process.env.ELASTIC_PASS
};

console.log("ENV LOADED:", process.env.ELASTIC_NODE);

