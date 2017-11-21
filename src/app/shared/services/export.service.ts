import { Injectable } from '@angular/core';

// 3rd party
import * as papaparse from 'papaparse';
import * as _ from 'lodash';
import * as FileSaver from 'file-saver';

@Injectable()
export class ExportService {
  constructor() {}

  /**
   * export data to csv
   * @param {any[]} data
   */
  downloadCsvFile(data: any[]): void {
    const csv = papaparse.unparse({
      data: data
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const date = new Date().toISOString().slice(0, 19);
    const prefix = 'Data';
    FileSaver.saveAs(blob, prefix + '-' + date + '.csv');
  }
}
