import { by, element } from 'protractor';
import { SmartTable } from '../../../elements/smartTable.element';
import { ResultSearcher } from '../../../elements/searcher';
import { ResolutionPieChart } from '../../../elements/charts/resolution.Pie.element';
import { ResultPieChart } from '../../../elements/charts/resultPie.element';

export const baseUrl = function (projectId, testRunId) {
    return `#/project/${projectId}/testrun/${testRunId}`;
};

export const names = {
    pageName: 'Test Run View Page',
    buildNameLabel: 'Build Name:',
    milestoneLabel: 'Milestone:',
    testSuiteLabel: 'Test Suite:',
    startTimeLabel: 'Start Time:'
};

export const elements = {
    uniqueElement: element(by.id('test-run-view')),
    buildNameLink: element(by.xpath(`//li[.//label[contains(text(), '${names.buildNameLabel}')]]//a`)),
    milestoneField: element(by.xpath(`//li[.//label[contains(text(), '${names.milestoneLabel}')]]//input`)),
    testSuiteLink: element(by.xpath(`//li[.//label[contains(text(), '${names.testSuiteLabel}')]]//a`)),
    startTimeLabel: element(by.xpath(`//li[.//label[contains(text(), '${names.startTimeLabel}')]]//p`)),
    resultsTable: new SmartTable(by.css('#testRunViewResultsGrid #resultsGridMain')),
    resultSearcher: new ResultSearcher(by.id('resultSearcher')),
    resultsChart: new ResultPieChart(by.id('finalResultsChart')),
    resolutionsChart: new ResolutionPieChart(by.id('resultResolutionsChart')),
};

export const regexps = {
    // tslint:disable-next-line: max-line-length
    startDateRegexp: '(?<day>(\\d{2}))\\/(?<month>(\\d{2}))\\/(?<year>(\\d{2}))\\s(?<hours>(\\d{2})):(?<minutes>(\\d{2})):(?<seconds>(\\d{2}))\\s(?<period>(\\w{2}))'
};

export const columns = {
    testName: 'Test Name',
    failReason: 'Fail Reason',
    result: 'Result',
    resolution: 'Resolution',
    assignee: 'Assignee',
    comment: 'Comment',
};
