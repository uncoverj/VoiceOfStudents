import app from "./app";
import { logger } from "./lib/logger";
import { pool } from "@workspace/db";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

async function runMigrations() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS posts (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      category TEXT NOT NULL,
      like_count INTEGER NOT NULL DEFAULT 0,
      comment_count INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS comments (
      id SERIAL PRIMARY KEY,
      post_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS post_likes (
      post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
      device_id TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      PRIMARY KEY (post_id, device_id)
    );
  `);
  logger.info("Database migrations applied");
}

runMigrations()
  .then(() => {
    app.listen(port, (err) => {
      if (err) {
        logger.error({ err }, "Error listening on port");
        process.exit(1);
      }

      logger.info({ port }, "Server listening");
    });
  })
  .catch((err) => {
    logger.error({ err }, "Failed to run migrations");
    process.exit(1);
  });
