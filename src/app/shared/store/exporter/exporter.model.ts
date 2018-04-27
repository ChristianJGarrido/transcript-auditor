export interface ExporterModel {
  loading: boolean;
  assessmentIds: string[];
}

export class ExporterState implements ExporterModel {
  loading = false;
  assessmentIds = [];
  constructor() {}
}

export class ExportGrids {
  conversations: any[] = [];
  assessments: any[] = [];
  constructor() {}
}

export class ExportFields {
  conversation: string[] = [
    'assessmentId',
    'createdBy',
    'conversationId',
    'isChat',
    'eventKey',
    'sequence',
    'text',
    'mcsRawScore',
    'sentBy',
    'userType',
    'sentName',
    'time',
    'note',
  ];
  assessment: string[] = [
    'assessmentId',
    'createdBy',
    'conversationId',
    'isChat',
    'rating',
    'note',
    'recommend',
    'suraScore',
    'sScore',
    'uScore',
    'rScore',
    'aScore',
  ];
}
