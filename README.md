# Lendsqr Frontend Assessment

This is my implementation of the Lendsqr frontend assessment. I built it as a
small production-style dashboard instead of a one-page mockup, so the project
has reusable UI primitives, a typed data layer, protected routing, responsive
layout behavior, and realistic loading, empty, error, and action states.

## What I Built

The core experience includes:

- A responsive login page based on the supplied Figma design.
- Demo authentication with a persisted local session.
- An authenticated dashboard shell with top navigation, sidebar, command search,
  organization switching, notification dropdown, and user menu.
- A users list page with stat cards, filters, pagination, row actions, and
  responsive table behavior.
- A user details page with query-param driven tabs.
- Activate and blacklist user flows with a shared confirmation modal.
- Shared empty, error, loading, retry, toast, dropdown, button, form, and table
  components.

I also kept the project aligned with Feature-Sliced Design so reusable code does
not live inside page-specific folders.

## Demo Login

Use these credentials to enter the dashboard:

```text
Email: demo@lendsqr.com
Password: password123
```

On login, I store a demo session in localStorage. That lets protected pages work
without needing `?mockAuth=1` in the URL. Logging out clears localStorage.

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- TanStack Query
- React Hook Form
- Zod
- SCSS Modules
- Vitest
- React Testing Library
- ESLint
- Prettier

## Getting Started

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env
```

Add the Mockaroo values:

```env
VITE_MOCKAROO_BASE_URL=https://my.api.mockaroo.com
VITE_MOCKAROO_API_KEY=your_mockaroo_key
```

Start the app:

```bash
npm run dev
```

## API Integration

I used Mockaroo endpoints for the assessment data and kept the API key in a
local `.env` file. The key is sent with the `X-API-Key` header.

The app currently calls:

- `GET /users.json` for the paginated users table.
- `GET /users/:userId.json` for the user details page.
- `GET /stats.json` for users summary cards.
- `GET /user/organizations.json` for the organization switcher.

The users table supports URL-backed state for pagination and filters. This makes
the table easier to refresh, share, and reason about.

Supported filters:

- `organization`
- `username`
- `email`
- `phoneNumber`
- `status`
- `dateJoined`

Supported page sizes:

- `10`
- `25`
- `50`
- `100`

## Important Note About Client API Keys

Vite exposes variables prefixed with `VITE_` to the browser bundle. I kept the
Mockaroo key out of source control, but this is still a client-side key. In a
real production app, I would proxy these requests through a backend or serverless
function so the key is never shipped to the browser.

## Routes

Public routes:

- `/login`

Protected routes:

- `/dashboard`
- `/users`
- `/users/:userId`
- `/guarantors`
- `/loans`
- `/decision-models`
- `/savings`
- `/loan-requests`
- `/whitelist`
- `/karma`
- `/organization`
- `/loan-products`
- `/savings-products`
- `/fees-charges`
- `/transactions`
- `/services`
- `/service-account`
- `/settlements`
- `/reports`
- `/preferences`
- `/fees-pricing`
- `/audit-logs`
- `/system-messages`

The non-users dashboard routes intentionally render placeholder pages for this
assessment phase, but they still live behind the authenticated layout.

## Architecture

I followed Feature-Sliced Design:

```text
src/
├── app/
├── pages/
├── widgets/
├── features/
├── entities/
└── shared/
```

Layer responsibilities:

- `app`: routing, providers, global styles, and app-level composition.
- `pages`: route-level screens.
- `widgets`: larger layout compositions, such as the authenticated dashboard
  shell and users table.
- `features`: user-facing interactions, such as user status actions.
- `entities`: user domain types, API methods, schemas, and model logic.
- `shared`: reusable UI, assets, config, storage, API client, and utilities.

I tried to keep imports flowing downward through the layers. For example, the
users page can compose widgets and features, but shared UI components do not
know anything about the users page.

## Notable Implementation Details

### Authentication

The login form validates with Zod and React Hook Form. A successful demo login
creates a local session with the default organization set to `Lendsqr`.

### Organization Gating

The authenticated dashboard fetches organizations before rendering the main
dashboard content. If organizations fail to load, the UI shows a retry state
instead of rendering users data without organization context.

### Users Table

The table is record-agnostic. The users page owns the user-specific columns and
filter configuration, while the shared data table handles:

- horizontal scrolling
- pagination
- filter trigger state
- loading skeletons
- empty states
- search-empty states
- error states
- retry actions
- row actions

The table keeps empty and error states centered in the visible scroll viewport
even when the table has a larger `min-width`.

### User Actions

Activate and blacklist actions are centralized in an app provider. This keeps the
users list and user details page in sync and allows both places to reuse the
same confirmation dialog, loading behavior, toast messages, and localStorage
status updates.

### User Details Tabs

The user details page uses a query parameter for tabs, so the selected tab is
shareable and survives refreshes.

Example:

```text
/users/user-0004?tab=documents
```

Inactive tabs currently show reusable empty states.

### Design System

The project uses local fonts, SCSS modules, primitive tokens, semantic CSS custom
properties, and reusable components. I kept Figma-specific values tokenized where
they were reusable and avoided hardcoding component styles where a shared token
made more sense.

Shared UI includes:

- `Button`
- `FormField`
- `DynamicForm`
- `DataTable`
- `DropdownMenu`
- `DialogPortal`
- `ConfirmationDialog`
- `EmptyState`
- `StatusBadge`
- `StatCard`
- `Toast`
- `SearchCommandDialog`

## Styling

The SCSS architecture is:

```text
Primitive tokens -> Semantic tokens -> Theme variables -> Component modules
```

Primitive tokens hold raw scales like colors, spacing, radii, shadows, sizes, and
motion. Semantic tokens describe how those values are used in the UI.

I used SCSS Modules for component styling and kept global styles limited to
reset, typography, theme variables, and small utilities.

## Accessibility

I added accessibility behavior across the main interactive surfaces:

- form labels and accessible names
- field-level validation messages
- `aria-invalid` and error associations
- keyboard-operable password toggle
- semantic buttons for icon actions
- focus-visible states
- alert/status regions for empty and error states
- accessible dropdowns and dialogs
- body scroll lock for mobile sidebar/dialog states
- reduced-motion handling for motion-heavy components

## Responsive Behavior

The dashboard adapts across mobile, tablet, laptop, and desktop widths:

- The top navigation simplifies below desktop sizes.
- The sidebar becomes an overlay navigation below the desktop breakpoint.
- The login layout stacks cleanly on smaller screens.
- The command palette uses a constrained, scrollable dialog.
- The data table keeps its horizontal scroll without breaking the page layout.
- Pagination stacks and centers on smaller screens.
- User details content reflows so long values have room to breathe.

## Available Scripts

```bash
npm run dev
```

Starts the Vite dev server.

```bash
npm run build
```

Runs TypeScript project checks and creates the production build.

```bash
npm run preview
```

Previews the production build locally.

```bash
npm run typecheck
```

Runs TypeScript validation without emitting files.

```bash
npm run lint
```

Runs ESLint.

```bash
npm run lint:fix
```

Runs ESLint with safe automatic fixes.

```bash
npm run test
```

Starts Vitest in watch mode.

```bash
npm run test:run
```

Runs the test suite once.

## Verification

These are the commands I use to check the project before handing it off:

```bash
npm run lint
npm run typecheck
npm run test:run
npm run build
```

## What I Would Improve Next

If I were continuing beyond this assessment, I would:

- Replace the client-side Mockaroo key with a backend proxy.
- Add real authentication and refresh-token handling.
- Add server-backed activate/blacklist mutations.
- Add real content for the placeholder dashboard sections.
- Add sorting support to the reusable data table.
- Add end-to-end tests for the login, users list, and user details flows.
