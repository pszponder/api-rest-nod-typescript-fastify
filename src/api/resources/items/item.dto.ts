/**
 * The Data Transfer Object (DTO)
 * encapsulates & exposes a subset of an object's data to clients of an API
 */

import { ItemQuality } from "./items.types.js";

// Data Transfer Object for Item
export class ItemDto {
  readonly id: string;

  readonly name: string;

  readonly quality: ItemQuality;

  readonly value: number;

  constructor(id: string, name: string, quality: ItemQuality, value: number) {
    this.id = id;
    this.name = name;
    this.quality = quality;
    this.value = value;
  }
}
