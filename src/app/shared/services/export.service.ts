import { Injectable } from '@angular/core';
import { AfUser, AfConversationData } from '../interfaces/interfaces';

// 3rd party
import * as papaparse from 'papaparse';
import * as _ from 'lodash';
import * as FileSaver from 'file-saver';

@Injectable()
export class ExportService {
  constructor() {}

  downloadNotes(data: AfUser) {
    if (!data || !data.conversations) {
      return;
    }
    const keys: string[] = Object.keys(data.conversations);
    const notes: AfConversationData[] = keys.map(key => data.conversations[key]);
    this.downloadCsvFile(notes, 'Notes');
  }


  /**
   * export data to csv
   * @param {any[]} data
   */
  downloadCsvFile(data: any[], prefix: string = 'Data'): void {
    const csv = papaparse.unparse({
      data: data
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const date = new Date().toISOString().slice(0, 19);
    FileSaver.saveAs(blob, prefix + '-' + date + '.csv');
  }
}
