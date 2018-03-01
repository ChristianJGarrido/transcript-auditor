import { Injectable } from '@angular/core';
import { AssessmentPersonalityModel, AssessmentQaModel, AssessmentQaGroupModel } from '../store/assessment/assessment.model';

@Injectable()
export class UtilityService {
  constructor() {}

  /**
   * returns index of item in an array
   * @param {string} id
   * @param {any[]} items
   */
  findIndex(id: string, items: any[]): number {
    const index = items.indexOf(id);
    return index ? index : 0;
  }

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
   * calculates the percent score for each qa section
   * @param {any[]} section
   * @return {number}
   */
  calculateGroupScore(section: AssessmentQaGroupModel[]): number {
    const { score, count } = section.reduce(
      (prev, curr) => {
        return {
          score: prev.score + curr.score,
          count: prev.count + (curr.score > 0 ? 1 : 0),
        };
      },
      {
        score: 0,
        count: 0,
      }
    );
    return score / (count * 5);
  }

  /**
   * calculates the total qa score
   * @param {AssessmentQaModel[]} qa
   * @return {number}
   */
  calculateTotalScore(qa: AssessmentQaModel[]): number {
    const { score, count } = qa.reduce(
      (prev, curr) => {
        const result = this.calculateGroupScore(curr.section) || 0;
        return {
          score: prev.score + result,
          count: prev.count + (result > 0 ? 1 : 0),
        };
      },
      { score: 0, count: 0 }
    );
    return score / count;
  }

}
