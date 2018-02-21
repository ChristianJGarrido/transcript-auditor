export interface ConversationModel {
  id: string;
  type: string;
}

export interface MsgHistResponse {
  _metadata: any;
  conversationHistoryRecords: any[];
}

export interface EngHistResponse {
  _metadata: any;
  interactionHistoryRecords: any[];
}
