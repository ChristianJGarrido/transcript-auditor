export interface PlaylistModel {
  id: string;
  name: string;
  createdBy: string;
  createdAt: Date;
  lastUpdateBy: string;
  lastUpdateAt: Date;
  isPrivate: boolean;
  conversationIds: string[];
}

export class Playlist implements PlaylistModel {
  constructor(
    public id: string,
    public name: string,
    public createdBy: string,
    public lastUpdateBy: string,
    public conversationIds: string[] = [],
    public isPrivate: boolean = false,
    public createdAt: Date = new Date(),
    public lastUpdateAt: Date = new Date(),
  ) {}
}

