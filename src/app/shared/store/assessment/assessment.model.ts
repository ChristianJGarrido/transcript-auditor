export interface AssessmentModel {
  id: string;
  createdBy: string;
  createdAt: Date;
  lastUpdateAt: Date;
  isPrivate: boolean;
  summary: AssessmentSummaryModel;
}

export interface AssessmentSummaryModel {
  notes: string;
  stars: number;
  personality: AssessmentSummaryPersonalityModel[];
}

export interface AssessmentSummaryPersonalityModel {
  descriptor: string;
  antonym: string;
  score: number;
}

const newSummary: AssessmentSummaryModel = {
  notes: '',
  stars: 0,
  personality: [
    { descriptor: 'Natural', antonym: 'Stiff', score: 0 },
    { descriptor: 'Warm', antonym: 'Cold', score: 0 },
    { descriptor: 'Formal', antonym: 'Casual', score: 0 },
    { descriptor: 'Humorous', antonym: 'Serious', score: 0 },
    { descriptor: 'Succinct', antonym: 'Wordy', score: 0 },
    { descriptor: 'Polite', antonym: 'Blunt', score: 0 },
    { descriptor: 'Energetic', antonym: 'Lethargic', score: 0 },
    { descriptor: 'Younger', antonym: 'Older', score: 0 },
  ],
};

export class Assessment implements AssessmentModel {
  constructor(
    public createdBy: string,
    public id: string,
    public createdAt: Date = new Date(),
    public lastUpdateAt: Date = new Date(),
    public isPrivate: boolean = false,
    public summary: AssessmentSummaryModel = newSummary
  ) {}
}

