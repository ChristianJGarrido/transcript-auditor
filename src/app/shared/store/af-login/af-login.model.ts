export interface AfLoginModel {
  uid: string;
  displayName: string;
  email: string;
  loading?: boolean;
}

export interface AfUser {
  uid: string;
  displayName: string;
  email: string;
  createdAt: Date;
}

export class AfLoginState implements AfLoginModel {
  constructor(public uid: string, public displayName: string, public email: string) {}
}
