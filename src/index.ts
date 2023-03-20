import { FastifyInstance } from "fastify";
import { createServer } from "./api/buildServer.js";
import { envVars as env } from "./utils/parseEnvVars.js";

/**
 * Asynchronously start the server
 */
async function startServer(server: FastifyInstance) {
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
