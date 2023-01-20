// @shared tag
import { test } from 'vue-unit-test-library';
import { DataTable } from '@sandbox-monorepo-pseudocode/shared-component-library';

test('mounting component initializes default data correctly', () => {
    const component = new SharedDataTableComponent();
    const expected = { title: "Data Table" };

    component.mount();

    const result = component.data.title;

    result.shouldEqual(expected.title);
});