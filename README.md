# Lendsqr Frontend Assessment

## Project purpose

This repository contains the scaffold for a Lendsqr frontend assessment built with
React, TypeScript, Vite, React Router, TanStack Query, and SCSS Modules.

## Current phase

This is the scaffolding phase only.

Included now:

- Project configuration
- Feature-Sliced Design boundaries
- Tokenized SCSS architecture
- Provider setup
- Routing placeholders
- Minimal smoke tests

Not included yet:

- Final page designs
- Real authentication
- API integration
- Dashboard data
- Users table behavior
- User details data flow

## Technology stack

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- SCSS Modules
- Vitest
- React Testing Library
- ESLint
- Prettier

## Installation

```bash
npm install
npm run dev
```

## Mockaroo API configuration

The Users table and statistics cards use Mockaroo endpoints. Create a local `.env`
file from `.env.example` and provide the required API key:

```bash
cp .env.example .env
```

```env
VITE_MOCKAROO_BASE_URL=https://my.api.mockaroo.com
VITE_MOCKAROO_API_KEY=
```

The application sends the key in the `X-API-Key` request header. It is never added
to an endpoint URL, logged, or included in this README. `.env` is ignored by Git.

The integration uses:

- `GET /users.json` for paginated users
- `GET /stats.json` for Users statistic cards

The UI keeps `pageSize` in the browser URL and maps it to Mockaroo's `limit`
request parameter. Supported page sizes are `10`, `25`, `50`, and `100`.

Supported URL-backed filters are `organization`, `username`, `email`,
`phoneNumber`, `status`, and `dateJoined`. Applying or resetting filters resets
the URL page to `1` while preserving `pageSize`.

### Client-side key limitation

Vite variables prefixed with `VITE_` are embedded in the browser bundle. The local
environment file prevents accidental source-control commits but does not make this
API key private. A production application should proxy authenticated data-service
requests through a backend or serverless function when the key must remain secret.

## Available scripts

- `npm run dev` starts the Vite dev server.
- `npm run build` runs TypeScript project checks and builds the app.
- `npm run preview` previews the production build.
- `npm run typecheck` runs strict TypeScript validation.
- `npm run lint` runs ESLint.
- `npm run lint:fix` applies safe lint fixes.
- `npm run test` starts Vitest in watch mode.
- `npm run test:run` runs the test suite once.

## Routes

- `/login`
- `/dashboard`
- `/users`
- `/users/:userId`
- `*` not-found fallback

Temporary scaffold auth:

- Public routes render normally.
- Protected routes currently use the `?mockAuth=1` query parameter.
- Example: `/dashboard?mockAuth=1`

This is a deliberate placeholder so we can verify routing and layout composition
without introducing persistence or business logic yet.

## Folder structure

```text
src/
├── app/
│   ├── providers/
│   ├── router/
│   └── styles/
├── pages/
├── widgets/
├── features/
├── entities/
└── shared/
```

## FSD layer responsibilities

- `app`: global composition, routing, providers, and application-wide styles.
- `pages`: route-level screens composed from lower layers.
- `widgets`: larger interface compositions such as the authenticated layout.
- `features`: user-facing business interactions.
- `entities`: business domain building blocks.
- `shared`: reusable infrastructure, configuration, and non-business UI primitives.

## FSD dependency rules

- `app` may import from all lower layers.
- `pages` may import from widgets, features, entities, and shared.
- `widgets` may import from features, entities, and shared.
- `features` may import from entities and shared.
- `entities` may import from shared.
- `shared` must not import from higher layers.
- External consumers should prefer slice public APIs over deep imports.

## Public API conventions

- Export from a slice `index.ts` when the slice has a meaningful boundary.
- Keep private implementation details inside the slice.
- Avoid exporting internal helpers or UI subparts before they are intentionally reusable.

## Authenticated layout

The protected application frame is represented by one
`authenticated-layout` widget.

`Sidebar` and `TopNavigation` are private UI components inside that
widget because they form part of the same authenticated-page
composition and are not currently reused independently.

Only `AuthenticatedLayout` is exposed through the widget's public API.
This keeps the public boundary small while allowing the internal
components to maintain their own files and SCSS Modules.

## Why Sidebar and TopNavigation are internal

- They belong to one composition boundary.
- They share layout concerns with the protected shell.
- Exporting only `AuthenticatedLayout` prevents premature public APIs.
- Future mobile navigation behavior can evolve inside the widget without breaking consumers.

## SCSS architecture

The style system follows this progression:

```text
Primitive tokens → Semantic tokens → Themes → Component styles
```

- `tokens/primitives`: raw scales such as colors, spacing, radii, motion, and z-index.
- `tokens/semantic`: CSS custom properties named by purpose.
- `themes`: emitted theme variable mappings.
- `base`: reset, document defaults, focus styles, and typography.
- `utilities`: a very small global utility layer.
- `abstracts`: Sass-only tools such as functions, mixins, and placeholders.

## Primitive versus semantic tokens

- Primitive tokens describe what a value is.
  Example: a raw blue or a raw spacing step.
- Semantic tokens describe why a value exists.
  Example: `--color-bg-surface-secondary` or `--space-card`.

Component styles should prefer semantic custom properties instead of reaching for
raw primitive values directly.

## SCSS functions and mixins

Implemented Sass helpers include:

- `rem()`
- `fluid-size()`
- `get-breakpoint()`
- `z-index()`
- `respond-to`
- `focus-ring`
- `visually-hidden`
- `truncate`
- `line-clamp`
- `flex-center`
- `container`
- `minimum-touch-target`
- `reduced-motion`

Vite injects only the abstract Sass tools into SCSS files:

```scss
@use "@styles/abstracts" as *;
```

CSS-producing files are not injected globally, so resets, themes, and utilities are
emitted only once from `src/app/styles/index.scss`.

## Adding a new page

1. Create a new slice under `src/pages/<page-name>/`.
2. Add the route component in `ui/`.
3. Add a local SCSS Module.
4. Export the page from the slice `index.ts`.
5. Register it in `src/app/router/AppRouter.tsx`.

## Adding a new feature

1. Create a slice under `src/features/<feature-name>/`.
2. Keep business interaction logic inside that slice.
3. Import only from `entities` and `shared`.
4. Add a public API only when the feature has something meaningful to expose.

## Adding a new entity

1. Create or extend the entity slice under `src/entities/`.
2. Keep domain types, helpers, and UI close to the entity.
3. Import only from `shared`.

## Adding a new widget

1. Create the widget slice under `src/widgets/`.
2. Compose lower-layer pieces there.
3. Export only the widget boundary from its `index.ts`.

## Adding a new SCSS token

1. Add the raw value to the appropriate primitive scale if needed.
2. Map it to a semantic token in `tokens/semantic`.
3. Emit it through the theme layer.
4. Consume the semantic custom property in component styles.

## What remains to be implemented

- Final Figma-based UI
- Real login flow
- Validation and form behavior
- API client implementation
- Mock or live datasets
- Dashboard statistics
- Users table
- Filtering, searching, sorting, and pagination
- User details feature logic
- Persistence layers
- Production-ready loading, empty, and error states
- Final responsive mobile navigation behavior
