import Swagger from "@fastify/swagger";
import SwaggerUI from "@fastify/swagger-ui";
import fastify, { FastifyInstance } from "fastify";
import { readFile } from "node:fs/promises";
import http2 from "node:http2";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { envVars as env } from "../utils/parseEnvVars.js";
import { itemRoutes } from "./resources/items/items.routes.js";

// Get the directory path of this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Create a configuration object to configure the logger based on the NODE_ENV
 * - When in development, use pino-pretty
 * - When in production, use standard (non pino-pretty) logger
 * - When in test, don't log
 */
const configLogger = {
  development: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
  production: true,
  test: false,
};

/**
 * Instantiates and returns a configured Fastify server instance
 * @returns Fastify Server Instance
 */
export async function buildServerAsync() {
  // Instantiate Fastify Server and configure logging
  const server = fastify({
    http2: true,
    https: {
      allowHTTP1: true, // fallback support for HTTP1
      key: await readFile(`${__dirname}/../certs/key.pem`),
      cert: await readFile(`${__dirname}/../certs/cert.pem`),
    },
    logger: configLogger[env.NODE_ENV as keyof typeof configLogger] ?? true,
  });

  // Setup Swagger / SwaggerUI
  // NOTE: Access Swagger page through <root-route>/documentation endpoint
  server.register(Swagger);
  server.register(SwaggerUI);

  // Register routes for items resource
  server.register(itemRoutes, { prefix: "api/v1/items" });

  // Setup Test Route
  server.get("/", async (req, res) => {
    res.send({ hello: "world" });
  });

  // Return configured server instance
  return server;
}

/**
 * Asynchronously start the server
 */
export async function startServerAsync(
  server: FastifyInstance<http2.Http2SecureServer>,
) {
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
