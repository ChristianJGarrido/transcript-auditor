export interface FilterModel {
  types: string[];
  idTypes: string[];
  searchById: boolean;
}

export class FilterState implements FilterModel {
  types = ['conversations', 'chats'];
  idTypes = ['conversation'];
  searchById = false;
  constructor() {}
}
