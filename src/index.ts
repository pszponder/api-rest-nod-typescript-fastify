import { buildServerAsync, startServerAsync } from "./api/server.js";

// Instantiate and start the server
const server = await buildServerAsync();
await startServerAsync(server);
