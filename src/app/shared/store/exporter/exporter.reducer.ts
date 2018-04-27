import * as exporterActions from './exporter.actions';
import { ExporterModel, ExporterState } from './exporter.model';

export type Action = exporterActions.All;

const initialExporterState = new ExporterState();

export function ExporterReducer(
  state: ExporterModel = initialExporterState,
  action: Action
): ExporterModel {
  switch (action.type) {
    case exporterActions.START:
      return {
        ...state,
        loading: true,
      };
    case exporterActions.EXPORT_IDS:
      return {
        ...state,
        assessmentIds: action.ids
      };
    case exporterActions.COMPLETE:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}
