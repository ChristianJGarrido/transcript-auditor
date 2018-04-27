import { Injectable } from '@angular/core';
import {
  AssessmentPersonalityModel,
  AssessmentQaModel,
  AssessmentQaGroupScore,
  AssessmentQaTotalScore,
  AssessmentQaGroupKey,
} from '../store/assessment/assessment.model';

@Injectable()
export class QaService {
  constructor() {}

  /**
   * Calculates the weighted personality score
   * @return {string}
   */
  calculatePersonality(descriptors: AssessmentPersonalityModel[]): string {
    const score =
      (descriptors &&
        descriptors.reduce((prev, curr) => {
          return prev + curr.score;
        }, 0)) ||
      0;
    const personality = score / (descriptors.length * 5);
    return personality > 0 ? `+${personality}` : `${personality}`;
  }

  /**
   * calculates the percent score for each qa group/section
   * @param {AssessmentQaModel} group
   * @return {AssessmentQaGroupScore}
   */
  calculateQaGroupScore(group: AssessmentQaModel): AssessmentQaGroupScore {
    const { title, section, key } = group;
    const { sum, count } = section.reduce(
      (prev, curr) => {
        return {
          sum: prev.sum + curr.score,
          count: prev.count + (curr.score > 0 ? 1 : 0),
        };
      },
      {
        sum: 0,
        count: 0,
      }
    );
    return {
      title,
      key,
      score: sum / (count * 5),
    };
  }

  /**
   * calculates the total qa score
   * @param {AssessmentQaModel[]} qa
   * @return {AssessmentQaTotalScore}
   */
  calculateQaTotalScore(qa: AssessmentQaModel[]): AssessmentQaTotalScore {
    const { sum, count, group } = qa.reduce(
      (prev, curr) => {
        // get result for current group/section
        const { score, title, key } = this.calculateQaGroupScore(curr);
        // ignore 0 scores
        if (score) {
          return {
            // collect scores by group key
            group: {
              ...prev.group,
              [key]: { title, score },
            },
            sum: prev.sum + score,
            count: prev.count + 1,
          };
        }
        return prev;
      },
      { group: {}, sum: 0, count: 0 }
    );
    return {
      group,
      sum,
      count,
      score: sum / count || 0,
    };
  }

  /**
   * aggregates the group scores to previous assessment group scores
   * @param {AssessmentQaGroupKey} prev
   * @param {AssessmentQaGroupKey} group
   * @return {AssessmentQaTotalScore}
   */
  aggregateQaGroupScore(
    prev: AssessmentQaGroupKey,
    group: AssessmentQaGroupKey
  ): AssessmentQaGroupKey {
    // get keys of each assessment group/section
    const groupKeys = Object.keys(group);
    return groupKeys.reduce((p, key) => {
      const { score, title } = group[key];
      // ignore 0 scores
      if (score) {
        const sum = p[key] ? p[key].sum + score : score;
        const count = p[key] ? p[key].count + 1 : 1;
        return {
          ...p,
          [key]: {
            title,
            sum,
            count,
            score: sum / count || 0,
          },
        };
      }
      return p;
    }, prev);
  }

  /**
   * aggregate a series of qa asessments
   * @param {AssessmentQaTotalScore} prev
   * @param {AssessmentQaModel[]} qa
   * @return {AssessmentQaTotalScore}
   */
  aggregateQaTotal(
    prev: AssessmentQaTotalScore,
    qa: AssessmentQaModel[]
  ): AssessmentQaTotalScore {
    const qaTotal = this.calculateQaTotalScore(qa);
    const { score, group } = qaTotal;
    // ignore 0 scores
    if (score) {
      const sum = prev.sum + score;
      const count = prev.count + 1;
      return {
        group: this.aggregateQaGroupScore(prev.group, group),
        sum,
        count,
        score: sum / count || 0,
      };
    }
    return prev;
  }
}
