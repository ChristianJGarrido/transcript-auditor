import { ApiConversationMessageRecord } from '../../interfaces/conversation';
import { ApiChatHistoryRecord } from '../../interfaces/chat';

export interface ConversationModel {
  id: string;
  type: string;
}

export interface ConversationChatModel extends ApiChatHistoryRecord {
  id: string;
  type: string;
}

export interface ConversationMessageModel extends ApiConversationMessageRecord {
  id: string;
  type: string;
}

export interface MsgHistResponse {
  _metadata: any;
  conversationHistoryRecords: ApiConversationMessageRecord[];
}

export interface EngHistResponse {
  _metadata: any;
  interactionHistoryRecords: ApiChatHistoryRecord[];
}
