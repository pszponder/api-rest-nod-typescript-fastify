/**
 * This is the Data Access Layer
 * It is responsible for interacting with the DB and other data sources
 */

// NOTE: In this example, we are only mocking a database connection and the below class actually serves as the database

import { randomUUID } from "node:crypto";
import { Item, ItemQuality, ItemWithId } from "./items.types.js";

/**
 * The ItemsData represents a class which directly
 * interfaces w/ the DB and performs CRUD operations on it
 * This is the Data Access Layer
 *
 * Since we aren't actually connecting to a DB in this module,
 * the DB and the CRUD methods use an array to simulate the
 * DB data and CRUD operations
 */
export class ItemsData {
  // Represents simulated DB data (initial state)
  #items: ItemWithId[] = [
    {
      id: "615a0e18-415c-41ba-9c51-3b403deec651",
      name: "bronze sword",
      quality: "common",
      value: 10,
    },
    {
      id: "bebaf5f9-2cbe-4c84-a472-4bd11dadec79",
      name: "Poseidon's Trident",
      quality: "legendary",
      value: 1000,
    },
    {
      id: "eb425a54-9966-4b70-a64b-8020e3ce5995",
      name: "greater health potion",
      quality: "uncommon",
      value: 100,
    },
  ];

  /**
   * Add the passed in item to the items array
   * Simulates calling a creation operation on the db
   * @param item object to add to the items array
   * @returns newly created item
   */
  saveItemAsync = (item: Item) => {
    return new Promise<ItemWithId>(resolve => {
      const uuid = randomUUID();
      const newItem: ItemWithId = {
        id: uuid,
        ...item,
      };
      this.#items.push(newItem);
      resolve(newItem);
    });
  };

  /**
   * Read in all items from the items array
   * Simulates calling a read all operation on the db
   * @returns Promise with items array
   */
  readAllItemsAsync = () => {
    return new Promise<ItemWithId[]>((resolve, reject) => {
      if (this.#items.length > 0) {
        resolve(this.#items);
      } else {
        reject(new Error("Unable to get retrieve items"));
      }
    });
  };

  /**
   * Return an item with specified id
   * Simulates calling a read by id operation on the DB
   * @param id UUID of the requested item
   * @returns item with specified id
   */
  readItemByIdAsync = (id: string) => {
    return new Promise<ItemWithId>((resolve, reject) => {
      const item = this.#items.find(itm => itm.id === id);
      if (item) {
        resolve(item);
      } else {
        reject(new Error(`Unable to retrieve item with id ${id}`));
      }
    });
  };

  /**
   * Update the name, quality, or value of an item
   * Simulates calling an update operation on the DB
   * @param id UUID of the specified item to update
   * @param name optional: new item name
   * @param quality optional: new item value (common OR uncommon OR rare OR legendary)
   * @param value optional: new item value
   * @returns updated item
   */
  updateItemByIdAsync = (
    id: string,
    name?: string,
    quality?: ItemQuality,
    value?: number,
  ) => {
    return new Promise<ItemWithId>((resolve, reject) => {
      const itemToUpdateIdx = this.#items.findIndex(item => item.id === id);

      if (itemToUpdateIdx !== -1) {
        if (name) {
          this.#items[itemToUpdateIdx]!.name = name;
        }

        if (quality) {
          this.#items[itemToUpdateIdx]!.quality = quality;
        }

        if (value !== undefined && value >= 0) {
          this.#items[itemToUpdateIdx]!.value = value;
        }

        resolve(this.#items[itemToUpdateIdx]!);
      } else {
        reject(new Error(`Error updating item with id ${id}`));
      }
    });
  };

  /**
   * Remove an item of specified id
   * Simulates calling a delete operation on the DB
   * @param id UUID of item to remove
   * @returns removed item
   */
  deleteItemByIdAsync = (id: string) => {
    return new Promise<ItemWithId>((resolve, reject) => {
      const itemToRemove = this.#items.find(item => item.id === id);

      if (itemToRemove) {
        const filtered = this.#items.filter(item => item.id !== id);
        this.#items = [...filtered];
        resolve(itemToRemove);
      } else {
        reject(new Error(`Unable to find item with id ${id}`));
      }
    });
  };
}
