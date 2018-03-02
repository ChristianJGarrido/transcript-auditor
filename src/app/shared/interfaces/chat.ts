export interface ApiChatHistoryRecord {
  campaign: ApiChatCampaign;
  info: ApiChatInfo;
  lineScores: ApiChatLineScores[];
  sdes: {
    events: any[];
  };
  surveys: {
    operator: any[];
    postChat: any[];
    preChat: any[];
  };
  transcript: {
    lines: ApiChatTranscript[]
  };
  visitorInfo: ApiChatVisitorInfo;
}

export interface ApiChatLineScores {
  lineSeq: string;
  lineRawScore: number;
  mcs: number;
}

export interface ApiChatVisitorInfo {
  browser: string;
  city: string;
  country: string;
  countryCode: string;
  device: string;
  ipAddress: string;
  isp: string;
  operatingSystem: string;
  org: string;
  state: string;
}

export interface ApiChatTranscript {
  agentId: number;
  by: string;
  cannedAnswerType: number;
  controlType: number;
  lineSeq: string;
  source: string;
  subType: string;
  text: string;
  textType: string;
  time: string;
  timeL: number;
}

export interface ApiChatCampaign {
  campaignEngagementId: string;
  campaignEngagementName: string;
  campaignId: string;
  campaignName: string;
  goalId: string;
  goalName: string;
  lobId: number;
  lobName: string;
  visitorBehaviorId: string;
  visitorBehaviorName: string;
  visitorProfileId: string;
  visitorProfileName: string;
}

export interface ApiChatInfo {
  accountId: string;
  agentDeleted: boolean;
  agentFullName: string;
  agentGroupId: number;
  agentGroupName: string;
  agentId: string;
  agentLoginName: string;
  agentNickName: string;
  alertedMCS: number;
  channel: number;
  chatDataEnriched: boolean;
  chatMCS: number;
  chatRequestedTime: string;
  chatRequestedTimeL: number;
  chatStartPage: string;
  chatStartUrl: string;
  duration: number;
  endReason: string;
  endReasonDesc: string;
  endTime: string;
  endTimeL: number;
  ended: boolean;
  engagementId: string;
  engagementSequence: number;
  engagementSet: number;
  interactive: boolean;
  isAgentSurvey: boolean;
  isInteractive: boolean;
  isPartial: boolean;
  isPostChatSurvey: boolean;
  isPreChatSurvey: boolean;
  mcs: number;
  sharkEngagementId: string;
  skillId: number;
  skillName: string;
  startReason: string;
  startReasonDesc: string;
  startTime: string;
  startTimeL: number;
  visitorId: string;
  visitorName: string;
}
