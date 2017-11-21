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

export interface ApiConversationHistoryRecords {
  agentParticipants: any[];
  consumerParticipants: any[];
  conversationSurveys: any[];
  info: any;
  interactions: any[];
  messageRecords: any[];
  messageScores: any[];
  messageStatuses: any[];
  sdes: any;
  summary: any;
  transfers: any[];
}

export interface ApiData {
  _metadata: any;
  conversationHistoryRecords: ApiConversationHistoryRecords[];
}
