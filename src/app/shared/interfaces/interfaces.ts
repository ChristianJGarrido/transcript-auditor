export interface AfAccount {
  [key: string]: {
    conversations: AfConversation[];
  };
}

export interface AfUser {
  createdAt: Date;
  email: string;
  displayName: string;
  accounts: string[];
  admin: boolean;
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
  lastUpdateBy?: string;
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

export interface ApiConversationMessageScore {
  mcs: number;
  messageId: string;
  messageRawScore: number;
  time: string;
  timeL: number;
}

export interface ApiConversationMessageRecord {
  device: string;
  dialogId: string;
  messageData: {
    msg?: {
      text: string;
    };
    link?: {
      externalFileLink: string;
      fileType: string;
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

export interface ApiConversationTransfers {
  assignedAgentId: string;
  by: string;
  reason: string;
  sourceAgentFullName: string;
  sourceAgentId: string;
  sourceAgentLoginName: string;
  sourceAgentNickname: string;
  sourceSkillId: number;
  sourceSkillName: string;
  targetSkillId: number;
  targetSkillName: string;
  time: string;
  timeL: number;
}

export interface ApiConversationStatuses {
  messageDeliveryStatus: string;
  messageId: string;
  participantId: string;
  participantType: string;
  seq: number;
  time: string;
  timeL: number;
}

export interface ApiConversationInteractions {
  assignedAgentFullName: string;
  assignedAgentId: string;
  assignedAgentLoginName: string;
  assignedAgentNickname: string;
  interactionTime: string;
  interactionTimeL: number;
  interactiveSequence: number;
}

export interface ApiConversationConsumerParticipants {
  avatarURL: string;
  consumerName: string;
  email: string;
  firstName: string;
  lastName: string;
  participantId: string;
  phone: string;
  time: string;
  timeL: number;
  token: string;
}

export interface ApiConversationAgentParticipants {
  agentFullName: string;
  agentGroupId: number;
  agentGroupName: string;
  agentId: string;
  agentLoginName: string;
  agentNickname: string;
  agentPid: string;
  permission: string;
  role: string;
  time: string;
  timeL: number;
  userType: string;
  userTypeName: string;
}

export interface ApiConversationHistoryRecord {
  agentParticipants: ApiConversationAgentParticipants[];
  consumerParticipants: ApiConversationConsumerParticipants[];
  conversationSurveys: {
    surveyData: {
      question: string;
      answer: string;
    }[];
    surveyStatus: string;
    surveyType: string;
  }[];
  info: ApiConversationInfo;
  interactions: ApiConversationInteractions[];
  messageRecords: ApiConversationMessageRecord[];
  messageScores: ApiConversationMessageScore[];
  messageStatuses: ApiConversationStatuses[];
  sdes: {
    events: any[]
  };
  summary: {
    lastUpdatedTime: number;
    text: string;
  };
  transfers: ApiConversationTransfers[];
}

export interface MessageEvent {
  type: string;
  participant?: ApiConversationAgentParticipants;
  consumer?: ApiConversationConsumerParticipants;
  message?: ApiConversationMessageRecord;
  transfer?: ApiConversationTransfers;
  interaction?: ApiConversationInteractions;
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
  source?: string[];
  device?: string[];
  status?: string[];
}

export interface ApiData {
  _metadata: any;
  conversationHistoryRecords: ApiConversationHistoryRecord[];
}
