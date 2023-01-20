// @apps tag
// @form-folders tag
import { test } from 'vue-unit-test-library';
import { FormFolderTableView } from '@sandbox-monorepo-pseudocode/form-folders';
import { mutateIntoVueTableRow } from './helpers';
import * as fakeFormFolders from './helpers/fake-form-folders-fetch.json';

test('mounting component initializes default data correctly', () => {
    const component = new FormFolderTableView();
    const expected = mutateIntoVueTableRow(fakeFormFolders);

    component.mount();

    const result = component.data.tableRows;

    result.shouldEqual(expected.title);
});