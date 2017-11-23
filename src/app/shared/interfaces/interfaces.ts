export interface AfUsers {
  [key: string]: AfUser;
}

export interface AfUser {
  conversations?: AfConversation;
  user?: {
    createdAt: Date;
    email: string;
    displayName: string;
  };
}

export interface AfConversation {
  [key: string]: AfConversationData;
}

export interface AfConversationForm {
  note?: string;
  select?: string;
  check?: { key: string; value: boolean }[];
}

export interface AfConversationData {
  conversationId?: string;
  lastUpdateTime?: Date;
  createdBy?: string;
  data?: AfConversationForm;
}

export interface LeUser {
  account: string;
  username: string;
  password: string;
}

export interface LoginEvents {
  isLoggedIn: boolean;
  loggingIn: boolean;
}

export interface ApiMessageScore {
  mcs: number;
  messageId: string;
  messageRawScore: number;
  time: string;
  timeL: number;
}

export interface ApiMessageRecord {
  device: string;
  dialogId: string;
  messageData: {
    msg: {
      text: string;
    };
  };
  messageId: string;
  participantId: string;
  sentBy: string;
  seq: number;
  source: string;
  time: string;
  timeL: number;
  type: string;
}

export interface ApiConversationInfo {
  alertedMCS: number;
  brandId: string;
  closeReason: string;
  closeReasonDescription: string;
  conversationId: string;
  csatRate?: number;
  device: string;
  duration: number;
  endTime: string;
  endTimeL: number;
  firstConversation: boolean;
  isPartial: boolean;
  latestAgentFullName: string;
  latestAgentGroupId: number;
  latestAgentGroupName: string;
  latestAgentId: string;
  latestAgentLoginName: string;
  latestAgentNickname: string;
  latestQueueState: string;
  latestSkillId: number;
  latestSkillName: string;
  mcs: number;
  source: string;
  startTime: string;
  startTimeL: number;
  status: string;
}

export interface ApiConversationHistoryRecord {
  agentParticipants: any[];
  consumerParticipants: any[];
  conversationSurveys: any[];
  info: ApiConversationInfo;
  interactions: any[];
  messageRecords: ApiMessageRecord[];
  messageScores: ApiMessageScore[];
  messageStatuses: any[];
  sdes: any;
  summary: any;
  transfers: any[];
}

export interface ApiIds {
  conversationId: string;
  consumerId: string;
}

export interface ApiSearchSdes {
  personalInfo: string;
  customerInfo: string;
  userUpdate: string;
}

export interface ApiOptions {
  start?: {
    from: number;
    to: number;
  };
  summary?: string;
  keyword?: string;
  sdeSearch?: {
    personalInfo?: string;
    customerInfo?: string;
    userUpdate?: string;
  };
}

export interface ApiData {
  _metadata: any;
  conversationHistoryRecords: ApiConversationHistoryRecord[];
}
