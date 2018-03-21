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

export interface ApiDomainsResponse {
  baseURIs: { service: string; account: string; baseURI: string }[];
}

export interface ApiLoginResponse {
  csrf: string;
  wsuk: string;
  config: {
    loginName: string;
    userId: string;
    userPid: string;
    userPrivileges: number[];
    serverCurrentTime: number;
    timeDiff: number;
    serverTimeZoneName: string;
    serverTimeGMTDiff: number;
    isLPA: boolean;
    isAdmin: boolean;
    accountTimeZoneId: string;
  };
  csdsCollectionResponse: ApiDomainsResponse;
  accountData: {
    agentGroupsData: {
      items: {
        id: number;
        deleted: boolean;
        name: string;
      }[];
      revision: number;
    };
  };
  sessionTTl: string;
  bearer: string;
  sessionId: string;
}

export class ApiDomainsState implements ApiDomains {
  constructor(
    public engHistDomain = '',
    public msgHist = '',
    public agentVep = '',
    public accountConfigReadWrite = ''
  ) {}
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
