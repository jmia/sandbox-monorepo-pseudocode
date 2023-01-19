// @orchestrator tag
import { test } from 'vanilla-js-unit-test-library';
import * as fakeMenuItems from './helpers/fake-menu-item-fetch.json';
import { renderMenuItems } from '@sandbox-monorepo-pseudocode/orchestrator';

test('sidebar renders correct menu items', () => {
    const expected = {};
    const result = renderMenuItems(fakeMenuItems);

    result.shouldEqual(expected);
});