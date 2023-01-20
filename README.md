# So you wanna build a monorepo.

You're a cheeky devil, aren't you? Well, here's how we might structure it. Names given to things are not my suggestions for final names, I wanted to give them bland names.

Based around the [`single-spa` docs on cross-microfrontend imports](https://single-spa.js.org/docs/recommended-setup#cross-microfrontend-imports).

## root

There's a `package.json` with test dependencies and scripts that can run all applications at once or all test suites at once or lint/format all repositories at once (ideally with the same rules). There's an `.env` file for global use. This could also be a good place for a global linter configuration if it can be added.

## `/apps`

This would be where we put all microfrontends that clients would interact with. This is the future home of inspections, too.

### `/apps/form-folders`

The proposed first microfrontend that's data-table driven. The source code would include all the front-end client API code to fetch, create, and edit categories, based on environment variables set by the monorepo. The view would be composed of shared presentation components like Data Tables and Action Bars from the `shared-component-library`, but it would implement the logic/business portion of the code. Ideally there will be no additional styling concerns, although there could be if we derived them from the base CSS from `shared-component-library`.

It has its own localization library, but it sources its strings from `shared/locales`, so that we have a reduction in maintenance obligations. This could be split so that each microapp handles its own, or it could be hosted outside the monorepo.

It is set up so that it can be registered with `orchestrator` and loaded at the right route.

It has its own dependencies that are independent from the monorepo, like `vue`, and an `http-client`, and a localization library. Keeping them separate means that if one microapp has to pin a specific version, it won't prevent other apps from bumping versions. If we want to update a dependency for all apps, it only requires one PR. We will be more likely to keep them in sync this way.

It has its own test suite that can be run separately or together as part of an all-encompassing `package.json` script.

## `/orchestrator`

If we moved `orchestrator` into the monorepo, it makes sense it would live at a higher level in the directory structure than the apps. It will still house `topbar` and `sidebar` inside its source code, because refactoring it is out of scope. If we were to move them, `topbar` and `sidebar` should go to the `apps` folder.

It has its own test suite that can be run separately or together as part of an all-encompassing `package.json` script.

Moving `orchestrator` into this repo is a low priority. We should be able to get this to all work the same with or without `orchestrator` as a roommate.

## `/shared`

This would be where we would put all shared utility proprietary packages like a `shared-component-library`, or any other shared behaviour we might want other repos to import. I don't expect any of this code to be able to run independently, unless we were pursuing a locally runnable style guide-like application for the components. This is out of scope.

The purpose would be for them to be exported so they could be imported and tree-shaken by other apps.

### `/shared/common-api-functions`

Instead of common API functions, we could let each app handle their own functions, but some of them (like auth or feature flags) will likely be exactly the same across all apps. This would be where those would live. See [`single-spa`'s opinion on this](https://single-spa.js.org/docs/recommended-setup/#utility-modules-styleguide-api-etc).

### `/shared/locales`

This is a collection of strings only, maybe one day an import/export tool. It will not have a library or wrapper for translation, because we want apps to make decisions about their own dependencies. This could be discussed again later as a wrapped, exportable library that's shared, but it seems like overkill for most microapps.

### `/shared/shared-component-library`

Ahh, the magic stuff. This library has its own implementation-agnostic components, based off of their initial design in `inspections`. They will be designed for use with Vue 3 applications, but in theory they could be rewritten in multiple languages and exported under different aliases. These components are extensible enough to have slots and props for all the fun and interesting things you might want them to do. 

If an application wants a component that's exceptionally pattern-breaking, we would design a new component in the same directory, or host it in the application that will use it. We do not want to do a crap-ton of gymnastics to get the base components to do what we want for 100% of cases. 80% or bust.

It has its own dependencies that are independent from the monorepo, like `vue`, and a UI framework.

It has its own test suite that can be run separately or together as part of an all-encompassing `package.json` script.

This is so that we do not have to rewrite components over and over, and the design team will have one place to maintain and persist improvements. The reason they should be devoid of business logic (presentation logic is OK) is for a separation of concerns between what it should do for all apps (presentation) and what it should do for _this_ app (business).

## Things that aren't addressed in this mockup
- How many docker containers or `docker compose` files would this need? One or many?
- Can or should each application in `/apps` be run, deployed, or published separately? Is this an anti-pattern for monorepos?
- Where should we store docs? Shared or individual?
- Is our tooling or architecture constrained by anything because we are still chained to `inspections + nuxt` and `wxPortal`? 
- Is our tooling or architecture constrained because of `single-spa`? e.g. Docs mainly assume `webpack`, could we still use `vite`? Does it matter?
- How can we put huge shared dependencies like Vue 3 into one spot instead of multiple? There are suggestions in [the `single-spa` docs](https://single-spa.js.org/docs/recommended-setup/#shared-dependencies) for how to do this.
- How much CSS has to come over? Can it just be some of what's in `inspections` or does it have to be all of it?
- There's more. I'll add them as I think of them.

