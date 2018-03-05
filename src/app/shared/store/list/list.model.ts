export interface ListModel {
  agents: any[];
  skills: any[];
  groups: any[];
}

export class ListState implements ListModel {
  agents = [];
  skills = [];
  groups = [];
  constructor() {}
}
