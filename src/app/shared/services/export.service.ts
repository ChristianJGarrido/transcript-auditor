import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators/switchMap';
import { AssessmentModel } from '../store/assessment/assessment.model';
import { PlaylistModel } from '../store/playlist/playlist.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import * as papaparse from 'papaparse';
import * as _ from 'lodash';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

@Injectable()
export class ExportService {
  constructor(private http: HttpClient) {}

  /**
   * take collection of assessments or playlists
   * convert to xlsx and save
   * @param {string} type
   * @param {AssessmentModel[]|PlaylistModel[]}
   */
  downloadXlsxFile(type: string, rows: AssessmentModel[] | PlaylistModel[]): void {
    if (!rows.length) {
      return;
    }
    // constants
    const name = type === 'assessments' ? 'Assessments' : 'Playlists';
    // create worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(rows);
    // create workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, name);
    // current timestamp
    const date = new Date().toISOString().slice(0, 19);
    // save to file
    XLSX.writeFile(wb, `${name}-${date}.xlsx`);
  }

  // test adding data to existing worksheet
  getTemplate(rows) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.http.get('/assets/template.xlsx', { headers, responseType: 'arraybuffer' }).subscribe(res => {
      const wb: XLSX.WorkBook = XLSX.read(res, { type: 'array' });
      const ws: XLSX.WorkSheet = wb.Sheets['Data'];
      XLSX.utils.sheet_add_json(ws, rows);
      XLSX.writeFile(wb, `Test.xlsx`);
    }, error => console.log(error));
  }

  /**
   * export data to csv
   * @param {any[]} data
   */
  downloadCsvFile(data: any[], prefix: string = 'Data'): void {
    const csv = papaparse.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const date = new Date().toISOString().slice(0, 19);
    FileSaver.saveAs(blob, prefix + '-' + date + '.csv');
  }
}
