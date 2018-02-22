import { Injectable } from '@angular/core';

@Injectable()
export class UtilityService {
  constructor() {}

  /**
   * returns index of item in an array
   * @param {string} id
   * @param {any[]} items
   */
  findIndex(id: string, items: any[]): number {
    const index = items.findIndex(item => item.id === id);
    return index ? index : 0;
  }

}
