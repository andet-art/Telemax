import "dotenv/config.js";
import 'dotenv/config.js';
import('./src/server.js').catch(err => {
  console.error('Fatal boot error:', err);
  process.exit(1);
});
