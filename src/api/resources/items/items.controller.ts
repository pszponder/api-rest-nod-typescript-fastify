/**
 * The controller is responsible for handling incoming HTTP requests
 * and returning HTTP responses
 */

import { FastifyReply, FastifyRequest } from "fastify";
import { ItemDto } from "./item.dto.js";
import { ItemsDto } from "./items.dto.js";
import { ItemsService } from "./items.service.js";
import { Item, ItemQuality } from "./items.types.js";

export class ItemsController {
  // Use Dependency Injection to accept instance of ItemsService
  constructor(private itemsService: ItemsService) {}

  /**
   * @desc   Add an item to the db
   * @route  POST /api/v1/items
   * @access Public
   */
  addItemAsync = async (
    req: FastifyRequest<{ Body: Item }>,
    reply: FastifyReply,
  ) => {
    const { name, quality, value } = req.body;
    const addedItem = await this.itemsService.addItemAsync(
      name,
      quality,
      value,
    );

    // Create a DTO to return to the client
    const itemDto = new ItemDto(
      addedItem.id,
      addedItem.name,
      addedItem.quality,
      addedItem.value,
    );

    reply.code(201).send(itemDto);
  };

  /**
   * @desc   Retrieves a list of all Items
   * @route  GET /api/v1/items
   * @access Public
   */
  getAllItemsAsync = async (req: FastifyRequest, reply: FastifyReply) => {
    const items = await this.itemsService.getAllItemsAsync();

    // Create a DTO to return to the client
    const itemsDto = new ItemsDto(items);

    reply.code(200).send(itemsDto);
  };

  /**
   * @desc   Retrieve an item from DB based on its database
   * @route  GET /api/v1/items/:id
   * @access Public
   */
  getItemByIdAsync = async (
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    const { id } = req.params;
    const foundItem = await this.itemsService.getItemByIdAsync(id);

    // Create a DTO to return to the client
    const itemDto = new ItemDto(
      foundItem.id,
      foundItem.name,
      foundItem.quality,
      foundItem.value,
    );

    reply.code(200).send(itemDto);
  };

  /**
   * @desc   Update an existing item in the DB
   * @route  PUT /api/v1/items/:id
   * @access Public
   */
  updateItemByIdAsync = async (
    req: FastifyRequest<{
      Params: { id: string };
      Body: { name?: string; quality?: ItemQuality; value?: number };
    }>,
    reply: FastifyReply,
  ) => {
    const { id } = req.params;
    const { name, quality, value } = req.body;

    const updatedItem = await this.itemsService.updateItemByIdAsync(
      id,
      name,
      quality,
      value,
    );

    // Create a DTO to return to the client
    const itemDto = new ItemDto(
      updatedItem.id,
      updatedItem.name,
      updatedItem.quality,
      updatedItem.value,
    );

    reply.code(200).send(itemDto);
  };

  /**
   * @desc   Delete item in DB with id
   * @route  DELETE /api/v1/items/:id
   * @access Public
   */
  deleteItemByIdAsync = async (
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    const { id } = req.params;
    const deletedItem = await this.itemsService.deleteItemByIdAsync(id);

    // Create a DTO to return to the client
    const itemDto = new ItemDto(
      deletedItem.id,
      deletedItem.name,
      deletedItem.quality,
      deletedItem.value,
    );

    reply.code(200).send(itemDto);
  };
}
