import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { SimpleRequester } from './simple-requester';
import { Test, LastResulColors } from '../shared/models/test';
import { TestSuite } from '../shared/models/testSuite';


@Injectable()
export class TestService extends SimpleRequester {

  getTest(test: Test, numberOfResults: number = 10000): Promise<Test[]> {
    const params: { [key: string]: any | any[]; } = {
      id: test.id,
      project_id: test.project_id,
      test_suite_id: test.test_suite_id,
      name: test.name,
      developer_id: test.developer_id,
      numberOfResults
    };
    return this.doGet('/test', params).map(res => res.json()).toPromise();
  }

  createTest(test: Test): Promise<Test> {
    return this.doPost('/test', test).map(res => {
      this.handleSuccess(`Test '${test.name}' was updated.`);
      return res.json();
    }).toPromise();
  }

  bulkUpdate(tests: Test[]) {
    return this.doPut('/test', tests).map(() => {
      this.handleSuccess(`Tests were updated.`);
    });
  }

  addTestToTestSuite(test: Test, suite: TestSuite) {
    return this.doPost(`/testToSuite?testId=${test.id}&suiteId=${suite.id}&projectId=${suite.project_id}`).map(() => {
      this.handleSuccess(`Test '${test.name}' was added to '${suite.name}' suite.`);
    });
  }

  removeTestFromTestSuite(test: Test, suite: TestSuite) {
    return this.doDelete(`/testToSuite?testId=${test.id}&suiteId=${suite.id}&projectId=${suite.project_id}`).map(() => {
      this.handleSuccess(`Test '${test.name}' was removed from '${suite.name}' suite.`);
    });
  }

  moveTest(from: Test, to: Test, remove: boolean, project_id: number) {
    return this.doGet(`/test/move?from=${from.id}&to=${to.id}&remove=${remove}&projectId=${project_id}`).map(() => { });
  }

  removeTest(test: Test) {
    return this.doDelete(`/test?id=${test.id}&projectId=${test.project_id}`)
      .map(() => this.handleSuccess(`Test '${test.name}' was deleted.`));
  }

  public getResultWeights(): { value: number, weight: number}[] {
    return [
      { value: 5, weight: 0 },
      { value: 1, weight: 2 },
      { value: 2, weight: 4 },
      { value: 3, weight: 4 },
      { value: 4, weight: 1 },
    ]
  }

  public combineLastResults(entity: LastResulColors): number[] {
    const combinedColors: number[] = [];
    if (entity.resolution_colors && entity.result_colors) {
      const resolutionColors = entity.resolution_colors.split(',');
      const resultColors = entity.result_colors.split(',');
      for (let i = 0; i < resultColors.length; i++) {
        const resultColor = resultColors[i];
        if (+resultColor === 5) {
          combinedColors.push(+resultColor);
        } else {
          combinedColors.push(+resolutionColors[i]);
        }
      }
    }

    return combinedColors;
  }
}
