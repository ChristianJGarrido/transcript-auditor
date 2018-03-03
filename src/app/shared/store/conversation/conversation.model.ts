import { ApiConversationHistoryRecord } from '../../interfaces/conversation';
import { ApiChatHistoryRecord } from '../../interfaces/chat';

export interface ConversationModel {
  id: string;
  isChat: boolean;
}

export interface ConversationChatModel extends ApiChatHistoryRecord {
  id: string;
  isChat: boolean;
}

export interface ConversationMessageModel extends ApiConversationHistoryRecord {
  id: string;
  isChat: boolean;
}

export interface MsgHistResponse {
  _metadata: any;
  conversationHistoryRecords: ApiConversationHistoryRecord[];
}

export interface EngHistResponse {
  _metadata: any;
  interactionHistoryRecords: ApiChatHistoryRecord[];
}
