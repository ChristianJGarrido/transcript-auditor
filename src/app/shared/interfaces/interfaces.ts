export interface AfUsers {
  [key: string]: AfConversations;
}

export interface AfConversations {
  conversations: AfConversation;
}

export interface AfConversation {
  [key: string]: AfConversationData;
}

export interface AfConversationData {
  note?: string;
  select?: string;
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

export interface ApiMessageRecord {
  device: string;
  dialogId: string;
  messageData: {
    msg: {
      text: string;
    }
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

export interface ApiConversationHistoryRecord {
  agentParticipants: any[];
  consumerParticipants: any[];
  conversationSurveys: any[];
  info: any;
  interactions: any[];
  messageRecords: ApiMessageRecord[];
  messageScores: any[];
  messageStatuses: any[];
  sdes: any;
  summary: any;
  transfers: any[];
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
