export interface AssessmentModel {
  id: string;
  createdBy: string;
  createdAt: Date;
  lastUpdateBy: string;
  lastUpdateAt: Date;
  isPrivate: boolean;
  conversationId: string;
  note: string;
  rating: number;
  personality: AssessmentPersonalityModel[];
}

export interface AssessmentPersonalityModel {
  descriptor: string;
  antonym: string;
  score: number;
}

export class Assessment implements AssessmentModel {
  constructor(
    public id: string,
    public createdBy: string,
    public lastUpdateBy: string,
    public conversationId: string,
    public isPrivate: boolean = false,
    public createdAt: Date = new Date(),
    public lastUpdateAt: Date = new Date(),
    public note: string = '',
    public rating: number = 0,
    public personality: AssessmentPersonalityModel[] = [
      { descriptor: 'Natural', antonym: 'Stiff', score: 0 },
      { descriptor: 'Warm', antonym: 'Cold', score: 0 },
      { descriptor: 'Formal', antonym: 'Casual', score: 0 },
      { descriptor: 'Humorous', antonym: 'Serious', score: 0 },
      { descriptor: 'Succinct', antonym: 'Wordy', score: 0 },
      { descriptor: 'Polite', antonym: 'Blunt', score: 0 },
      { descriptor: 'Energetic', antonym: 'Lethargic', score: 0 },
      { descriptor: 'Younger', antonym: 'Older', score: 0 },
    ]
  ) {}
}
