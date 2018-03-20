import { PlaylistModel } from '../playlist/playlist.model';
import { AssessmentModel, AssessmentQaGroupKey} from '../assessment/assessment.model';

export interface StatsModel {
  playlistSelect: PlaylistModel[];
  assessmentSelect: AssessmentModel[];
  conversationFilter: string[];
  assesmentFilter: string[];
  metrics: StatsMetrics;
}

export interface StatsMetrics {
  playlists: number;
  assessments: number;
  conversations: number;
  rating: number;
  personality: number;
  qaScore?: number;
  reviewers: number;
  qaGroup: AssessmentQaGroupKey;
}

export class StatsState implements StatsModel {
  playlistSelect = [];
  conversationFilter = [];
  assesmentFilter = [];
  assessmentSelect = [];
  metrics = {
    reviewers: 0,
    playlists: 0,
    assessments: 0,
    conversations: 0,
    rating: 0,
    personality: 0,
    qaScore: 0,
    qaGroup: {}
  };
  constructor() {}
}
