export interface PlaylistModel {
  id: string;
  createdBy: string;
  createdAt: Date;
  lastUpdateBy: string;
  lastUpdateAt: Date;
  isPrivate: boolean;
  assessments: string[];
}

export class Playlist implements PlaylistModel {
  constructor(
    public id: string,
    public createdBy: string,
    public lastUpdateBy: string,
    public isPrivate: boolean = false,
    public createdAt: Date = new Date(),
    public lastUpdateAt: Date = new Date(),
    public assessments: string[] = []
  ) {}
}

