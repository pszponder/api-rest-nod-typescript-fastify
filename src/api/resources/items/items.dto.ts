/**
 * The Data Transfer Object (DTO)
 * encapsulates & exposes a subset of an object's data to clients of an API
 */

import { ItemDto } from "./item.dto.js";
import { ItemWithId } from "./items.types.js";

// Data Transfer Object for ItemsDto (list of ItemDtos)
export class ItemsDto {
  readonly items: ItemWithId[];

  constructor(items: ItemWithId[]) {
    // Map through the items array input and create a new ItemDto
    this.items = items.map(item => {
      return new ItemDto(item.id, item.name, item.quality, item.value);
    });
  }
}
