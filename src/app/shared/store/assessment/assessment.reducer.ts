import * as actions from './assessment.actions';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AssessmentModel } from './assessment.model';

/* tslint:disable:no-empty-interface */
export const assessmentAdapter = createEntityAdapter<AssessmentModel>();
export interface State extends EntityState<AssessmentModel> {
  loading: boolean;
  selectedAssessmentId: string;
}
export const initialState: State = assessmentAdapter.getInitialState({
  loading: false,
  selectedAssessmentId: null,
});

// Reducer
export function AssessmentReducer(
  state: State = initialState,
  action: actions.AssessmentActions
) {
  switch (action.type) {
    case actions.CREATE:
    case actions.DELETE:
      return { ...state, loading: true };
    case actions.SUCCESS:
      return { ...state, loading: false };
    case actions.ADD_ALL:
      return assessmentAdapter.addAll(action.data, state);
    case actions.SELECT:
      return { ...state, selectedAssessmentId: action.id, loading: false };
    default:
      return state;
  }
}

// Create the default selectors
export const getAssessmentState = createFeatureSelector<State>('assessment');
export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = assessmentAdapter.getSelectors(getAssessmentState);

// Create custom selectors
const getSelectedAssessmentId = (state: State) => state.selectedAssessmentId;
const getLoading = (state: State) => state.loading;
export const selectAssessmentId = createSelector(
  getAssessmentState,
  getSelectedAssessmentId
);
export const selectLoading = createSelector(
  getAssessmentState,
  getLoading
);
export const selectAssessment = createSelector(
  selectEntities,
  selectAssessmentId,
  (assessmentEntities, assessmentId) => assessmentEntities[assessmentId]
);
