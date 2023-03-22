/**
 * The router is responsible for calling the correct
 * http controller method based on the request url
 */

import { FastifyInstance } from "fastify";
import { ItemsController } from "./items.controller.js";
import { ItemsDao } from "./items.dao.js";
import { ItemsService } from "./items.service.js";
import { QUALITY } from "./items.types.js";

// Instantiate the ItemsController
const itemsController = new ItemsController(new ItemsService(new ItemsDao()));

// ========================================
// Define Schema Objects to Validate Routes
// ========================================
const Item = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    quality: { type: "string" },
    value: { type: "number" },
  },
};

const Items = {
  type: "object",
  properties: {
    items: {
      type: "array",
      properties: {
        item: Item,
      },
    },
  },
};

const addItemOpts = {
  schema: {
    description: "Add new Item",
    body: {
      type: "object",
      required: ["name", "quality", "value"],
      properties: {
        name: { type: "string" },
        quality: { type: "string", enum: QUALITY },
        value: { type: "number", minimum: 0 },
      },
    },
    response: {
      201: Item,
    },
  },
  handler: itemsController.addItemAsync,
};

const getAllItemsOpts = {
  schema: {
    description: "Get all items",
    response: {
      200: Items,
    },
  },
  handler: itemsController.getAllItemsAsync,
};

const getItemsByIdOpts = {
  schema: {
    description: "Get item by id",
    params: {
      id: { type: "string" },
    },
    response: {
      200: Item,
    },
  },
  handler: itemsController.getItemByIdAsync,
};

const updateItemByIdOpts = {
  schema: {
    description: "Update an item with specific id",
    params: {
      id: { type: "string" },
    },
    body: {
      type: "object",
      properties: {
        name: { type: "string" },
        quality: { type: "string", enum: QUALITY },
        value: { type: "number", minimum: 0 },
      },
    },
    response: {
      200: Item,
    },
  },
  handler: itemsController.updateItemByIdAsync,
};

const deleteItemByIdOpts = {
  schema: {
    description: "Delete an item by its id",
    params: {
      id: { type: "string" },
    },
    response: {
      200: Item,
    },
  },
  handler: itemsController.deleteItemByIdAsync,
};

// ================================
// Define routes for items resource
// ================================

/**
 * Item Routes
 * @param server Fastify Instance
 */
export async function itemRoutes(server: FastifyInstance) {
  // Add Item
  server.post("/", addItemOpts);

  // Get all items
  server.get("/", getAllItemsOpts);

  // Get item by id
  server.get("/:id", getItemsByIdOpts);

  // Update item by id
  server.put("/:id", updateItemByIdOpts);

  // Delete item by id
  server.delete("/:id", deleteItemByIdOpts);
}
