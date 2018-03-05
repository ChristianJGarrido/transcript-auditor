
export interface ApiLoginUser {
  account: string;
  username: string;
  password?: string;
}

export interface ApiLoginModel extends ApiLoginUser {
  bearer: string;
  isLPA: boolean;
  domains: ApiDomains;
  error?: boolean;
  loading?: boolean;
}

export interface ApiDomains {
  engHistDomain: string;
  msgHist: string;
  agentVep: string;
  accountConfigReadWrite: string;
}

export class ApiLoginState implements ApiLoginModel {
  constructor(
    public bearer: string,
    public account: string,
    public username: string,
    public isLPA: boolean,
    public domains: ApiDomains
  ) {}
}
