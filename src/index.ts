import { FastifyInstance } from "fastify";
import http2 from "node:http2";
import { createServer } from "./api/buildServer.js";
import { envVars as env } from "./utils/parseEnvVars.js";

/**
 * Asynchronously start the server
 */
async function startServer(server: FastifyInstance<http2.Http2SecureServer>) {
  try {
    await server.listen({
      port: parseInt(env.API_PORT, 10),
      host: env.API_HOST,
    });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

const server = await createServer();
await startServer(server);
