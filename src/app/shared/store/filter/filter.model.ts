export interface FilterModel {
  types: any[];
}

export class FilterState implements FilterModel {
  types = ['conversations', 'chats'];
  constructor() {}
}
