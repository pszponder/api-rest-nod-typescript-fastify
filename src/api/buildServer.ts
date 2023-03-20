import Swagger from "@fastify/swagger";
import SwaggerUI from "@fastify/swagger-ui";
import fastify from "fastify";
import { envVars as env } from "../utils/parseEnvVars.js";
import { itemRoutes } from "./resources/items/items.routes.js";

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
export function createServer() {
  // Instantiate Fastify Server and configure logging
  const server = fastify({
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
