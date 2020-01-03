import { projectList } from '../../../pages/project/list.po';
import { userAdministration } from '../../../pages/administration/users.po';
import { notFound } from '../../../pages/notFound.po';
import { ProjectHelper } from '../../../helpers/project.helper';
import using from 'jasmine-data-provider';
import usersTestData from '../../../data/users.json';
import { projectSettingsAdministration } from '../../../pages/administration/projectSettings.po';
import { logIn } from '../../../pages/login.po';

const editorExamples = {
    admin: usersTestData.admin,
    localAdmin: usersTestData.localAdmin,
    localManager: usersTestData.localManager,
    manager: usersTestData.manager
};

const notEditorExamples = {
    localEngineer: usersTestData.localEngineer,
};

describe('Administartion:', () => {
    const projectHelper: ProjectHelper = new ProjectHelper();

    beforeAll(async () => {
        await projectHelper.init({
            admin: usersTestData.admin,
            localAdmin: usersTestData.localAdmin,
            localManager: usersTestData.localManager,
            localEngineer: usersTestData.localEngineer,
            manager: usersTestData.manager
        });
    });

    afterAll(async () => {
        await projectHelper.dispose();
    });

    using(editorExamples, (user, description) => {
        describe(`Permissions: ${description} role:`, () => {
            beforeAll(async () => {
                await logIn.logInAs(user.user_name, user.password);
                await projectHelper.openProject();
            });

            it('I can open Project Settings page', async () => {
                await (await projectList.menuBar.user()).administration();
                await userAdministration.sidebar.projectSettings();
                return expect(projectSettingsAdministration.isOpened())
                    .toBe(true, `Project Settings page is not opened for ${description}`);
            });

            it('I can enable Steps', async () => {
                await projectSettingsAdministration.selectProject(projectHelper.project.name);
                await projectSettingsAdministration.setSteps(true);
                await projectSettingsAdministration.clickSave();
                await expect(projectSettingsAdministration.notification.isSuccess())
                    .toBe(true, 'Success meessage is not shown on save settings!');
                await expect(projectSettingsAdministration.notification.getContent())
                    .toBe(`'${projectHelper.project.name}' project was updated!`, 'Success meessage is wrong!');
                await projectSettingsAdministration.notification.close();
            });

            it('The confirmation dialog shown when trying to disable steps', async () => {
                await projectSettingsAdministration.setSteps(false);
                await projectSettingsAdministration.clickSave();
                await expect(projectSettingsAdministration.modal.isVisible())
                    .toBe(true, 'Confirmation was not shown!');
            });

            it('Can decline confirmation', async () => {
                await projectSettingsAdministration.modal.clickNo();
                await expect(projectSettingsAdministration.notification.isVisible())
                    .toBe(false, 'Mesaage is shown after declining the Save action!');
            });

            it('Can disable steps', async () => {
                await projectSettingsAdministration.setSteps(false);
                await projectSettingsAdministration.clickSave();
                await projectSettingsAdministration.modal.clickYes();
                await expect(projectSettingsAdministration.notification.isSuccess())
                    .toBe(true, 'Success meessage is not shown on save settings!');
                await expect(projectSettingsAdministration.notification.getContent())
                    .toBe(`'${projectHelper.project.name}' project was updated!`, 'Success meessage is wrong!');
                await projectSettingsAdministration.notification.close();
            });
        });
    });

    using(notEditorExamples, (user, description) => {
        describe(`Permissions: ${description} role:`, () => {
            beforeAll(async () => {
                await logIn.logInAs(user.user_name, user.password);
                await projectHelper.openProject();
            });

            it('I can not Open Project Settings page using Menu Bar', async () => {
                return expect((await projectList.menuBar.user()).isAdministrationExists())
                    .toBe(false, `Administartion should not be visible for ${description}`);
            });

            it('I can not Open Project Settings page using url', async () => {
                await projectSettingsAdministration.navigateTo();
                await expect(projectSettingsAdministration.isOpened()).toBe(false, `Project Settings page is opened for ${description}`);
                return expect(notFound.isOpened()).toBe(true, `404 page is not opened for ${description}`);
            });
        });
    });
});

