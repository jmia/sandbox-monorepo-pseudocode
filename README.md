# So you wanna build a monorepo.

You're a cheeky devil, aren't you? Well, here's how we might structure it.

Based around the [`single-spa` docs on cross-microfrontend imports](https://single-spa.js.org/docs/recommended-setup#cross-microfrontend-imports).

## root

There's a `package.json` with test dependencies and scripts that can run all applications at once or all test suites at once or lint/format all repositories with the same rules. There's an `.env` file for global use. This could also be a good place for a global linter configuration if it can be added.

## `/apps`

This would be where we put all microfrontends that clients would interact with. This is the future home of inspections, too.

### `/apps/form-folders`

The proposed first microfrontend that's data-table driven. The source code would include all the front-end client API code to fetch, create, and edit categories, based on environment variables set by the monorepo. The view would be composed of shared presentation components like Data Tables and Action Bars from the `shared-component-library`, but it would implement the logic/business portion of the code. Ideally there will be no additional styling concerns, although there could be if we derived them from the base CSS from `shared-component-library`.

It has its own localization library, but it sources its strings from `shared/locales`, so that we have a reduction in maintenance obligations. This could be split so that each microapp handles its own, or it could be hosted outside the monorepo.

It is set up so that it can be registered with `orchestrator` and loaded at the right route.

It has its own dependencies that are independent from the monorepo, like `vue`, and an `http-client` like `axios`, and a localization library like `polyglot`.

## `/orchestrator`

If we moved `orchestrator` into the monorepo, it makes sense it would live at a higher level in the directory structure than the apps. It will still house `topbar` and `sidebar` inside its source code, because refactoring it is out of scope. If we were to move them, `topbar` and `sidebar` should go to the `apps` folder.

## `/shared`

This would be where we would put all shared utility proprietary packages like a `shared-component-library`, or any other shared behaviour we might want other repos to import. I don't expect any of this code to be able to run independently, unless we were pursuing a locally runnable style guide-like application for the components. This is out of scope.

The purpose would be for them to be exported so they could be imported and tree-shaken by other apps at build time (I think).

### `/shared/common-api-functions`

If we want to write authentication functions for an app, we might want to use the same function for all apps, so it might make sense to make it shared.

### `/shared/locales`

This is a collection of strings only, maybe one day an import/export tool. It will not have a library or wrapper for translation, because we want apps to make that decision in case they have special requirements that aren't covered by the chosen library.

### `/shared/shared-component-library`

Ahh, the magic stuff. This library has its own implementation-agnostic components. They will be designed for use with Vue 3 applications, but in theory they could be rewritten in multiple languages and exported under different aliases. These components are extensible enough to have slots and props for all the fun and interesting things you might want them to do. If an application wants a component that's exceptionally pattern-breaking, we would design a new component in the same directory, or host it in the application that will use it. We do not want to do a crap-ton of gymnastics to get the base components to do what we want for 100% of cases. 80% or bust.

## `/tests`

This is a shared test suite, that can use more than one test runner or testing library to support multiple frameworks. For now, it will support Vue 3 and vanilla JS. 

Alternatively, these tests can also be broken out into their respective directories with their respective test frameworks set as a dev dependency of that app, but the root `package.json` should still have a script that can run all of them together in one shot.
