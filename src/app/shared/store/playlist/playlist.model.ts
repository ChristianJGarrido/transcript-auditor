export interface PlaylistModel {
  id: string;
  name: string;
  createdBy: string;
  createdAt: any;
  lastUpdateBy: string;
  lastUpdateAt: any;
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
    public createdAt: any = new Date(),
    public lastUpdateAt: any = new Date(),
  ) {}
}

