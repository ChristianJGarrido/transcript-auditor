export interface ApiDataModel {
  msgHist: ApiMsgHist;
  engHist: ApiEngHist;
  total: any[];
  select: any;
  loading: boolean;
  error: boolean;
}

export interface ApiMsgHist {
  _metadata: any;
  conversationHistoryRecords: any[];
}

export interface ApiEngHist {
  _metadata: any;
  interactionHistoryRecords: any[];
}
