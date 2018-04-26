export interface ExporterModel {
  loading: boolean;
  exportIds: string[];
 }

 export class ExporterState implements ExporterModel {
  loading = false;
  exportIds = [];
  constructor() {}
 }
