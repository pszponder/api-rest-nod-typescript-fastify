/**
 * This interface will be used to implement the Repository Design Pattern for the Items Resource
 *
 * IItemsRepository defines the methods for CRUD operations on an Items Collection stored in a Database
 *
 * We can have different classes implement this repository interface
 * - In-Memory Database  => ItemsRepositoryInMem
 * - MongoDB Database    => ItemsRepositoryMongoDB
 * - PostgreSQL Database => ItemsRepositoryPostgreSQL
 */

import { Item, ItemQuality, ItemWithId } from "./items.types.js";

export interface IItemsRepository {
  // Create a new item in the DB (Add passed in item to the DB)
  saveItemAsync(item: Item): Promise<ItemWithId>;

  // Read in all items from the DB as an array
  readAllItemsAsync(): Promise<ItemWithId[]>;

  // Read in item from DB with specified id
  readItemByIdAsync(id: string): Promise<ItemWithId>;

  // Update an item in the DB
  updateItemByIdAsync(
    id: string,
    name?: string,
    quality?: ItemQuality,
    value?: number,
  ): Promise<ItemWithId>;

  // Remove an item from the DB with specified id
  deleteItemByIdAsync(id: string): Promise<ItemWithId>;
}
