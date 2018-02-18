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
    case actions.ADD_ALL:
      return assessmentAdapter.addAll(action.data, state);
    case actions.SELECT:
      return {...state, selectedAssessmentId: action.id };
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
const getSelectedAssessmentId = (state: State) =>
  state.selectedAssessmentId;
export const selectAssessmentId = createSelector(
  getAssessmentState,
  getSelectedAssessmentId
);
export const selectAssessment = createSelector(
  selectEntities,
  selectAssessmentId,
  (assessmentEntities, assessmentId) => assessmentEntities[assessmentId]
);
