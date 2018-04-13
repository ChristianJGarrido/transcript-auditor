import { AssessmentModel } from '../store/assessment/assessment.model';

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

export interface ApiIds {
  conversationId: string;
  consumerId: string;
}

export interface StatsWidget {
  value: any;
  name: any;
  format: string;
}

export interface AssessmentStats extends StatsWidget {
  key: string;
}

export interface NoteModalData {
  type: string;
  msgId?: string;
  index?: { groupIdx: number; lineIdx: number };
  assessmentSelect: AssessmentModel;
}
