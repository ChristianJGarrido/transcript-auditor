import { Injectable } from '@angular/core';
import { AssessmentPersonalityModel } from '../store/assessment/assessment.model';

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

}
