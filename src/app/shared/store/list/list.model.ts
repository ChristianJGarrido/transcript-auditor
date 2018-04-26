export interface ListModel {
  agents: Entity<ListAgent>;
  skills: Entity<ListSkill>;
  groups: Entity<ListGroup>;
}

export interface Entity<T> {
  entities: { [id: string]: T };
  ids: string[];
  collection: T[];
}

export class ListState implements ListModel {
  agents = {
    entities: null,
    ids: [],
    collection: [],
  };
  skills = {
    entities: null,
    ids: [],
    collection: [],
  };
  groups = {
    entities: null,
    ids: [],
    collection: [],
  };
  constructor() {}
}

export interface ListAgent {
  changePwdNextLogin: boolean;
  dateCreated: string;
  dateUpdated: string;
  deleted: boolean;
  email: string;
  employeeId: string;
  fullName: string;
  id: number;
  isApiUser: boolean;
  isEnabled: boolean;
  lastPwdChangeDate: string;
  loginName: string;
  lpaCreatedUser: boolean;
  managerOf: any[];
  maxChats: number;
  memberOf: {
    agentGroupId: number;
    assignmentDate: string;
  };
  nickname: string;
  permissionGroups: number[];
  pid: string;
  profileIds: number[];
  skillIds: number[];
  userTypeId: number;
}

export interface ListGroup {
  dateUpdated: string;
  deleted: boolean;
  id: number;
  isEnabled: boolean;
  name: string;
}

export interface ListSkill {
  canTransfer: boolean;
  dateUpdated: string;
  deleted: boolean;
  description: string;
  id: number;
  maxWaitTime: number;
  name: string;
  skillOrder: number;
  skillRoutingConfiguration: any[];
  skillTransferList: number[];
}
