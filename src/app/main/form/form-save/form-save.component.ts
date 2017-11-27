import { Component, OnInit, Input } from '@angular/core';
import { AfDataService } from '../../../shared/services/af-data.service';
import { Observable } from 'rxjs/Observable';
import { AfConversationData } from '../../../shared/interfaces/interfaces';

@Component({
  selector: 'app-form-save',
  templateUrl: './form-save.component.html',
  styleUrls: ['./form-save.component.css']
})
export class FormSaveComponent implements OnInit {
  @Input() afConversationData: AfConversationData;
  afSave$: Observable<string|null>;

  constructor(private afDataService: AfDataService) { }

  ngOnInit() {
    this.afSave$ = this.afDataService.afSave$;
  }

}
